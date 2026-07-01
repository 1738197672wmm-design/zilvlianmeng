const API_BASE = '/api'

interface ApiResponse<T = any> {
  success: boolean
  data?: T
  error?: string
}

class ApiClient {
  private getToken(): string | null {
    return localStorage.getItem('fit_token')
  }

  private getUserId(): string | null {
    return localStorage.getItem('fit_user_id')
  }

  private async request<T>(endpoint: string, options: RequestInit = {}): Promise<T> {
    const token = this.getToken()
    const headers: Record<string, string> = {
      'Content-Type': 'application/json',
      ...options.headers,
    }
    if (token) {
      headers['Authorization'] = `Bearer ${token}`
    }

    const res = await fetch(`${API_BASE}${endpoint}`, {
      ...options,
      headers,
      credentials: 'include',
    })

    const result: ApiResponse<T> = await res.json()

    if (!res.ok || !result.success) {
      throw new Error(result.error || `API Error: ${res.status}`)
    }

    return result.data as T
  }

  get<T>(endpoint: string): Promise<T> {
    return this.request<T>(endpoint, { method: 'GET' })
  }

  post<T>(endpoint: string, body: unknown): Promise<T> {
    return this.request<T>(endpoint, {
      method: 'POST',
      body: JSON.stringify(body),
    })
  }

  put<T>(endpoint: string, body: unknown): Promise<T> {
    return this.request<T>(endpoint, {
      method: 'PUT',
      body: JSON.stringify(body),
    })
  }

  delete<T>(endpoint: string): Promise<T> {
    return this.request<T>(endpoint, { method: 'DELETE' })
  }

  // Auth
  login(email: string, password: string) {
    return this.post<{ token: string; user: any }>('/auth/login', { email, password })
  }

  register(username: string, email: string, password: string, inviteCode: string) {
    return this.post<{ token: string; user: any }>('/auth/register', {
      username, email, password, inviteCode,
    })
  }

  logout() {
    localStorage.removeItem('fit_token')
    localStorage.removeItem('fit_user_id')
    localStorage.removeItem('fit_username')
  }

  // Body data
  getBodyData(days = 30) {
    return this.get(`/body?days=${days}`)
  }

  addBodyData(data: { date: string; weight?: number; bodyFatPercent?: number; muscleMass?: number; notes?: string }) {
    return this.post('/body', data)
  }

  updateBodyData(id: string, data: Partial<{ weight: number; bodyFatPercent: number; muscleMass: number; notes: string }>) {
    return this.put(`/body/${id}`, data)
  }

  deleteBodyData(id: string) {
    return this.delete(`/body/${id}`)
  }

  // Workouts
  getWorkouts(days = 30) {
    return this.get(`/workouts?days=${days}`)
  }

  addWorkout(data: {
    date: string; type: string; exerciseName: string; sets?: number; reps?: number; weightKg?: number; notes?: string; isCustom?: boolean
  }) {
    return this.post('/workouts', data)
  }

  updateWorkout(id: string, data: Partial<any>) {
    return this.put(`/workouts/${id}`, data)
  }

  deleteWorkout(id: string) {
    return this.delete(`/workouts/${id}`)
  }

  // Cardio
  getCardio(days = 30) {
    return this.get(`/cardio?days=${days}`)
  }

  addCardio(data: {
    date: string; type: string; durationMinutes: number; distanceKm?: number; caloriesBurned?: number; notes?: string
  }) {
    return this.post('/cardio', data)
  }

  updateCardio(id: string, data: Partial<any>) {
    return this.put(`/cardio/${id}`, data)
  }

  deleteCardio(id: string) {
    return this.delete(`/cardio/${id}`)
  }

  // Diet
  getDiet(days = 30) {
    return this.get(`/diet?days=${days}`)
  }

  addDiet(data: {
    date: string; mealType: string; foodName: string; quantity: number; calories?: number; proteinG?: number; carbsG?: number; fatG?: number; isCustom?: boolean
  }) {
    return this.post('/diet', data)
  }

  updateDiet(id: string, data: Partial<any>) {
    return this.put(`/diet/${id}`, data)
  }

  deleteDiet(id: string) {
    return this.delete(`/diet/${id}`)
  }

  // Goals
  getGoals() {
    return this.get('/goals')
  }

  addGoal(data: { type: string; targetValue: number; currentValue?: number; startDate: string; endDate?: string }) {
    return this.post('/goals', data)
  }

  updateGoal(id: string, data: Partial<any>) {
    return this.put(`/goals/${id}`, data)
  }

  deleteGoal(id: string) {
    return this.delete(`/goals/${id}`)
  }

  // Feed
  getFeed(page = 1, limit = 20) {
    return this.get(`/feed?page=${page}&limit=${limit}`)
  }

  likeActivity(id: string) {
    return this.post(`/feed/${id}/like`, {})
  }

  // Users
  getUserProfile(userId: string) {
    return this.get(`/users/${userId}`)
  }

  getCurrentUser() {
    return this.get('/users/me')
  }

  updateUserProfile(data: { avatar?: string; bio?: string }) {
    return this.put('/users/me', data)
  }

  // Invites
  getInvites() {
    return this.get('/invites')
  }

  createInvite(maxUses: number) {
    return this.post('/invites', { maxUses })
  }

  deleteInvite(code: string) {
    return this.delete(`/invites/${code}`)
  }
}

export const api = new ApiClient()
