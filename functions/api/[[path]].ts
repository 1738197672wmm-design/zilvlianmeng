// Simple token generation (no external deps)
function generateToken(userId: string, username: string): string {
  const payload = btoa(JSON.stringify({ userId, username, exp: Date.now() + 7 * 24 * 60 * 60 * 1000 }))
  return `fit_${payload}`
}

function verifyToken(token: string): { userId: string; username: string } | null {
  if (!token?.startsWith('fit_')) return null
  try {
    const payload = JSON.parse(atob(token.slice(4)))
    if (payload.exp && payload.exp < Date.now()) return null
    return { userId: payload.userId, username: payload.username }
  } catch {
    return null
  }
}

// Initialize database schema
async function initSchema(env: Env) {
  const tables = [
    `CREATE TABLE IF NOT EXISTS users (id TEXT PRIMARY KEY, username TEXT UNIQUE NOT NULL, email TEXT UNIQUE NOT NULL, password_hash TEXT NOT NULL, avatar TEXT, bio TEXT, created_at TEXT DEFAULT (datetime('now')));`,
    `CREATE TABLE IF NOT EXISTS invite_codes (code TEXT PRIMARY KEY, created_by TEXT NOT NULL, uses INTEGER DEFAULT 0, max_uses INTEGER DEFAULT 10, active INTEGER DEFAULT 1, created_at TEXT DEFAULT (datetime('now')));`,
    `CREATE TABLE IF NOT EXISTS body_data (id TEXT PRIMARY KEY, user_id TEXT NOT NULL, date TEXT NOT NULL, weight REAL, body_fat_percent REAL, muscle_mass REAL, notes TEXT, created_at TEXT DEFAULT (datetime('now')));`,
    `CREATE TABLE IF NOT EXISTS workout_logs (id TEXT PRIMARY KEY, user_id TEXT NOT NULL, date TEXT NOT NULL, type TEXT DEFAULT 'strength', exercise_name TEXT NOT NULL, sets INTEGER, reps INTEGER, weight_kg REAL, notes TEXT, is_custom INTEGER DEFAULT 0, created_at TEXT DEFAULT (datetime('now')));`,
    `CREATE TABLE IF NOT EXISTS cardio_logs (id TEXT PRIMARY KEY, user_id TEXT NOT NULL, date TEXT NOT NULL, type TEXT NOT NULL, duration_minutes REAL NOT NULL, distance_km REAL, calories_burned REAL, notes TEXT, created_at TEXT DEFAULT (datetime('now')));`,
    `CREATE TABLE IF NOT EXISTS diet_logs (id TEXT PRIMARY KEY, user_id TEXT NOT NULL, date TEXT NOT NULL, meal_type TEXT NOT NULL, food_name TEXT NOT NULL, quantity REAL DEFAULT 100, calories REAL, protein_g REAL, carbs_g REAL, fat_g REAL, is_custom INTEGER DEFAULT 0, created_at TEXT DEFAULT (datetime('now')));`,
    `CREATE TABLE IF NOT EXISTS goals (id TEXT PRIMARY KEY, user_id TEXT NOT NULL, type TEXT NOT NULL, target_value REAL NOT NULL, current_value REAL, start_date TEXT NOT NULL, end_date TEXT, created_at TEXT DEFAULT (datetime('now')));`,
    `CREATE TABLE IF NOT EXISTS activity_feed (id TEXT PRIMARY KEY, user_id TEXT NOT NULL, username TEXT NOT NULL, type TEXT NOT NULL, data_ref TEXT, data TEXT, likes INTEGER DEFAULT 0, created_at TEXT DEFAULT (datetime('now')));`,
  ]
  for (const sql of tables) {
    await env.DB.exec(sql)
  }
  const existing = await env.DB.prepare('SELECT COUNT(*) as count FROM users').first()
  if ((existing as any)?.count === 0) {
    const adminId = crypto.randomUUID()
    await env.DB.prepare(
      'INSERT INTO users (id, username, email, password_hash) VALUES (?, ?, ?, ?)'
    ).bind(adminId, 'admin', 'admin@fitcheck.cn', btoa(JSON.stringify({ p: 'admin', s: 'seed' }))).run()
    for (const code of ['FITCHECK', 'GYM2024', 'STRONG']) {
      await env.DB.prepare(
        'INSERT INTO invite_codes (code, created_by, max_uses) VALUES (?, ?, ?)'
      ).bind(code, adminId, 5).run()
    }
  }
}

function readJSON(event: { request: Request }): Promise<any> {
  return event.request.text().then(t => t ? JSON.parse(t) : {})
}

function json(body: any, status = 200) {
  return new Response(JSON.stringify(body), { status, headers: { 'Content-Type': 'application/json' } })
}

async function handleRegister(event: { request: Request }, env: Env) {
  try {
    const { username, email, password, inviteCode } = await readJSON(event)
    const invite = await env.DB.prepare(
      'SELECT * FROM invite_codes WHERE code = ? AND active = 1'
    ).bind(inviteCode?.toUpperCase()).first()
    if (!invite) return json({ success: false, error: '邀请码无效或已过期' }, 400)
    const existing = await env.DB.prepare('SELECT id FROM users WHERE email = ?').bind(email).first()
    if (existing) return json({ success: false, error: '该邮箱已注册' }, 400)
    const userId = crypto.randomUUID()
    const passwordHash = btoa(JSON.stringify({ p: password, s: crypto.randomUUID().slice(0, 8) }))
    await env.DB.prepare(
      'INSERT INTO users (id, username, email, password_hash) VALUES (?, ?, ?, ?)'
    ).bind(userId, username, email, passwordHash).run()
    await env.DB.prepare('UPDATE invite_codes SET uses = uses + 1 WHERE code = ?').bind(inviteCode.toUpperCase()).run()
    const token = generateToken(userId, username)
    return json({ success: true, data: { token, user: { id: userId, username, email } } })
  } catch (e: any) {
    return json({ success: false, error: e.message }, 500)
  }
}

async function handleLogin(event: { request: Request }, env: Env) {
  try {
    const { email, password } = await readJSON(event)
    const user = await env.DB.prepare('SELECT * FROM users WHERE email = ?').bind(email).first()
    if (!user) return json({ success: false, error: '用户不存在' }, 404)
    const hashData = JSON.parse(atob(user.password_hash as string))
    if (hashData.p !== password) return json({ success: false, error: '密码错误' }, 401)
    const token = generateToken(user.id as string, user.username as string)
    return json({ success: true, data: { token, user: { id: user.id, username: user.username, email: user.email } } })
  } catch (e: any) {
    return json({ success: false, error: e.message }, 500)
  }
}

async function handlePostBody(env: Env, auth: { userId: string; username: string }, event: { request: Request }) {
  try {
    const body = await readJSON(event)
    const id = crypto.randomUUID()
    await env.DB.prepare(
      'INSERT INTO body_data (id, user_id, date, weight, body_fat_percent, muscle_mass, notes) VALUES (?, ?, ?, ?, ?, ?, ?)'
    ).bind(id, auth.userId, body.date, body.weight, body.bodyFatPercent, body.muscleMass, body.notes).run()
    await env.DB.prepare(
      'INSERT INTO activity_feed (id, user_id, username, type, data) VALUES (?, ?, ?, ?, ?)'
    ).bind(crypto.randomUUID(), auth.userId, auth.username, 'body', JSON.stringify({ weight: body.weight, bodyFatPercent: body.bodyFatPercent })).run()
    return json({ success: true, data: { id, ...body } })
  } catch (e: any) { return json({ success: false, error: e.message }, 500) }
}

async function handleGetBody(env: Env, auth: { userId: string }, url: URL) {
  const days = parseInt(url.searchParams.get('days') || '90')
  const data = await env.DB.prepare(
    'SELECT * FROM body_data WHERE user_id = ? ORDER BY date DESC LIMIT ?'
  ).bind(auth.userId, days).all()
  return json({ success: true, data: data.results })
}

async function handlePostWorkout(env: Env, auth: { userId: string; username: string }, event: { request: Request }) {
  try {
    const body = await readJSON(event)
    const id = crypto.randomUUID()
    await env.DB.prepare(
      'INSERT INTO workout_logs (id, user_id, date, type, exercise_name, sets, reps, weight_kg, notes, is_custom) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)'
    ).bind(id, auth.userId, body.date, body.type || 'strength', body.exerciseName, body.sets, body.reps, body.weightKg, body.notes, body.isCustom ? 1 : 0).run()
    await env.DB.prepare(
      'INSERT INTO activity_feed (id, user_id, username, type, data) VALUES (?, ?, ?, ?, ?)'
    ).bind(crypto.randomUUID(), auth.userId, auth.username, 'workout', JSON.stringify({ exerciseName: body.exerciseName, sets: body.sets, reps: body.reps })).run()
    return json({ success: true, data: { id, ...body } })
  } catch (e: any) { return json({ success: false, error: e.message }, 500) }
}

async function handleGetWorkouts(env: Env, auth: { userId: string }, url: URL) {
  const days = parseInt(url.searchParams.get('days') || '90')
  const data = await env.DB.prepare(
    'SELECT * FROM workout_logs WHERE user_id = ? ORDER BY date DESC LIMIT ?'
  ).bind(auth.userId, days).all()
  return json({ success: true, data: data.results })
}

async function handlePostCardio(env: Env, auth: { userId: string; username: string }, event: { request: Request }) {
  try {
    const body = await readJSON(event)
    const id = crypto.randomUUID()
    await env.DB.prepare(
      'INSERT INTO cardio_logs (id, user_id, date, type, duration_minutes, distance_km, calories_burned, notes) VALUES (?, ?, ?, ?, ?, ?, ?, ?)'
    ).bind(id, auth.userId, body.date, body.type, body.durationMinutes, body.distanceKm, body.caloriesBurned, body.notes).run()
    await env.DB.prepare(
      'INSERT INTO activity_feed (id, user_id, username, type, data) VALUES (?, ?, ?, ?, ?)'
    ).bind(crypto.randomUUID(), auth.userId, auth.username, 'cardio', JSON.stringify({ type: body.type, durationMinutes: body.durationMinutes })).run()
    return json({ success: true, data: { id, ...body } })
  } catch (e: any) { return json({ success: false, error: e.message }, 500) }
}

async function handleGetCardio(env: Env, auth: { userId: string }, url: URL) {
  const days = parseInt(url.searchParams.get('days') || '90')
  const data = await env.DB.prepare(
    'SELECT * FROM cardio_logs WHERE user_id = ? ORDER BY date DESC LIMIT ?'
  ).bind(auth.userId, days).all()
  return json({ success: true, data: data.results })
}

async function handlePostDiet(env: Env, auth: { userId: string; username: string }, event: { request: Request }) {
  try {
    const body = await readJSON(event)
    const id = crypto.randomUUID()
    await env.DB.prepare(
      'INSERT INTO diet_logs (id, user_id, date, meal_type, food_name, quantity, calories, protein_g, carbs_g, fat_g, is_custom) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)'
    ).bind(id, auth.userId, body.date, body.mealType, body.foodName, body.quantity, body.calories, body.proteinG, body.carbsG, body.fatG, body.isCustom ? 1 : 0).run()
    await env.DB.prepare(
      'INSERT INTO activity_feed (id, user_id, username, type, data) VALUES (?, ?, ?, ?, ?)'
    ).bind(crypto.randomUUID(), auth.userId, auth.username, 'diet', JSON.stringify({ foodName: body.foodName, calories: body.calories })).run()
    return json({ success: true, data: { id, ...body } })
  } catch (e: any) { return json({ success: false, error: e.message }, 500) }
}

async function handleGetDiet(env: Env, auth: { userId: string }, url: URL) {
  const days = parseInt(url.searchParams.get('days') || '90')
  const data = await env.DB.prepare(
    'SELECT * FROM diet_logs WHERE user_id = ? ORDER BY date DESC LIMIT ?'
  ).bind(auth.userId, days).all()
  return json({ success: true, data: data.results })
}

async function handleGetGoals(env: Env, auth: { userId: string }) {
  const data = await env.DB.prepare(
    'SELECT * FROM goals WHERE user_id = ? ORDER BY created_at DESC'
  ).bind(auth.userId).all()
  return json({ success: true, data: data.results })
}

async function handlePostGoal(env: Env, auth: { userId: string; username: string }, event: { request: Request }) {
  try {
    const body = await readJSON(event)
    const id = crypto.randomUUID()
    await env.DB.prepare(
      'INSERT INTO goals (id, user_id, type, target_value, current_value, start_date, end_date) VALUES (?, ?, ?, ?, ?, ?, ?)'
    ).bind(id, auth.userId, body.type, body.targetValue, body.currentValue, body.startDate, body.endDate).run()
    await env.DB.prepare(
      'INSERT INTO activity_feed (id, user_id, username, type, data) VALUES (?, ?, ?, ?, ?)'
    ).bind(crypto.randomUUID(), auth.userId, auth.username, 'goal', JSON.stringify({ type: body.type, targetValue: body.targetValue })).run()
    return json({ success: true, data: { id, ...body } })
  } catch (e: any) { return json({ success: false, error: e.message }, 500) }
}

async function handleGetFeed(env: Env, url: URL) {
  const page = parseInt(url.searchParams.get('page') || '1')
  const limit = parseInt(url.searchParams.get('limit') || '20')
  const offset = (page - 1) * limit
  const data = await env.DB.prepare(
    `SELECT af.*, u.username, u.avatar FROM activity_feed af JOIN users u ON af.user_id = u.id ORDER BY af.created_at DESC LIMIT ? OFFSET ?`
  ).bind(limit, offset).all()
  return json({ success: true, data: data.results })
}

async function handleGetCurrentUser(env: Env, auth: { userId: string }) {
  const user = await env.DB.prepare(
    'SELECT id, username, email, avatar, bio, created_at as joinDate FROM users WHERE id = ?'
  ).bind(auth.userId).first()
  return json({ success: true, data: user })
}

async function handleGetInvites(env: Env, auth: { userId: string }) {
  const data = await env.DB.prepare(
    'SELECT * FROM invite_codes ORDER BY created_at DESC'
  ).bind(auth.userId).all()
  return json({ success: true, data: data.results })
}

async function handlePostInvite(env: Env, auth: { userId: string }, event: { request: Request }) {
  try {
    const { maxUses = 5 } = await readJSON(event)
    const chars = 'ABCDEFGHJKLMNPQRSTUVWXYZ23456789'
    let code = ''
    for (let i = 0; i < 8; i++) code += chars[Math.floor(Math.random() * chars.length)]
    await env.DB.prepare(
      'INSERT INTO invite_codes (code, created_by, max_uses) VALUES (?, ?, ?)'
    ).bind(code, auth.userId, maxUses).run()
    return json({ success: true, data: { code } })
  } catch (e: any) { return json({ success: false, error: e.message }, 500) }
}

async function handleApi(event: { request: Request; env: Env }, url: URL): Promise<Response> {
  const authHeader = event.request.headers.get('authorization')
  const token = authHeader?.startsWith('Bearer ') ? authHeader.slice(7) : null
  const auth = token ? verifyToken(token) : null

  if (event.request.method === 'OPTIONS') {
    return new Response(null, {
      headers: {
        'Access-Control-Allow-Origin': '*',
        'Access-Control-Allow-Methods': 'GET, POST, PUT, DELETE, OPTIONS',
        'Access-Control-Allow-Headers': 'Content-Type, Authorization',
      },
    })
  }

  if (url.pathname === '/api/auth/register' && event.request.method === 'POST') return handleRegister(event, event.env)
  if (url.pathname === '/api/auth/login' && event.request.method === 'POST') return handleLogin(event, event.env)

  if (!auth) return json({ success: false, error: '未授权' }, 401)

  if (url.pathname === '/api/body') {
    if (event.request.method === 'GET') return handleGetBody(event.env, auth, url)
    if (event.request.method === 'POST') return handlePostBody(event.env, auth, event)
  }
  if (url.pathname === '/api/workouts') {
    if (event.request.method === 'GET') return handleGetWorkouts(event.env, auth, url)
    if (event.request.method === 'POST') return handlePostWorkout(event.env, auth, event)
  }
  if (url.pathname === '/api/cardio') {
    if (event.request.method === 'GET') return handleGetCardio(event.env, auth, url)
    if (event.request.method === 'POST') return handlePostCardio(event.env, auth, event)
  }
  if (url.pathname === '/api/diet') {
    if (event.request.method === 'GET') return handleGetDiet(event.env, auth, url)
    if (event.request.method === 'POST') return handlePostDiet(event.env, auth, event)
  }
  if (url.pathname === '/api/goals') {
    if (event.request.method === 'GET') return handleGetGoals(event.env, auth)
    if (event.request.method === 'POST') return handlePostGoal(event.env, auth, event)
  }
  if (url.pathname === '/api/feed') return handleGetFeed(event.env, url)
  if (url.pathname === '/api/users/me' && event.request.method === 'GET') return handleGetCurrentUser(event.env, auth)
  if (url.pathname === '/api/invites') {
    if (event.request.method === 'GET') return handleGetInvites(event.env, auth)
    if (event.request.method === 'POST') return handlePostInvite(event.env, auth, event)
  }

  return json({ success: false, error: 'Not Found' }, 404)
}

export async function onRequest(context: { request: Request; env: Env }): Promise<Response> {
  try {
    const url = new URL(context.request.url)
    await initSchema(context.env)
    return handleApi(context, url)
  } catch (e: any) {
    return json({ success: false, error: e.message || String(e) }, 500)
  }
}
