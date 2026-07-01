import { useState } from 'react'
import { useNavigate, Link } from 'react-router'
import { api } from '@/utils/api'
import { useAuthStore } from '@/stores/authStore'
import { Dumbbell, UserPlus } from 'lucide-react'

export function Register() {
  const navigate = useNavigate()
  const { setToken, setUser } = useAuthStore()
  const [username, setUsername] = useState('')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [inviteCode, setInviteCode] = useState('')
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault()
    setError('')
    setLoading(true)
    try {
      const result = await api.register(username, email, password, inviteCode)
      setToken(result.token)
      setUser(result.user)
      localStorage.setItem('fit_username', result.user.username)
      navigate('/')
    } catch (err: any) {
      setError(err.message || '注册失败，请检查邀请码')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center px-4">
      <div className="w-full max-w-sm">
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-accent-primary/10 mb-4">
            <UserPlus className="w-8 h-8 text-accent-primary" />
          </div>
          <h1 className="text-2xl font-bold text-gradient">加入 FITCHECK</h1>
          <p className="text-sm text-text-muted mt-1">输入邀请码，开始记录健身</p>
        </div>

        <form onSubmit={handleRegister} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-text-secondary mb-1.5">用户名</label>
            <input
              type="text"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              required
              minLength={2}
              maxLength={20}
              className="w-full px-4 py-2.5 bg-bg-input border border-border rounded-lg text-text-primary placeholder-text-muted focus:outline-none focus:border-accent-primary/50 focus:ring-1 focus:ring-accent-primary/20 transition-all"
              placeholder="你的昵称"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-text-secondary mb-1.5">邮箱</label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              className="w-full px-4 py-2.5 bg-bg-input border border-border rounded-lg text-text-primary placeholder-text-muted focus:outline-none focus:border-accent-primary/50 focus:ring-1 focus:ring-accent-primary/20 transition-all"
              placeholder="your@email.com"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-text-secondary mb-1.5">密码</label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              minLength={6}
              className="w-full px-4 py-2.5 bg-bg-input border border-border rounded-lg text-text-primary placeholder-text-muted focus:outline-none focus:border-accent-primary/50 focus:ring-1 focus:ring-accent-primary/20 transition-all"
              placeholder="至少6位"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-text-secondary mb-1.5">邀请码</label>
            <input
              type="text"
              value={inviteCode}
              onChange={(e) => setInviteCode(e.target.value.toUpperCase())}
              required
              className="w-full px-4 py-2.5 bg-bg-input border border-border rounded-lg text-text-primary placeholder-text-muted focus:outline-none focus:border-accent-primary/50 focus:ring-1 focus:ring-accent-primary/20 transition-all tracking-widest uppercase"
              placeholder="输入邀请码"
            />
          </div>

          {error && (
            <div className="text-sm text-accent-danger bg-accent-danger/10 rounded-lg px-4 py-2.5">{error}</div>
          )}

          <button
            type="submit"
            disabled={loading}
            className="w-full py-2.5 bg-accent-primary hover:bg-indigo-500 disabled:opacity-50 disabled:cursor-not-allowed rounded-lg font-medium text-white transition-colors flex items-center justify-center gap-2"
          >
            <UserPlus className="w-4 h-4" />
            {loading ? '注册中...' : '注册'}
          </button>
        </form>

        <p className="text-center text-sm text-text-muted mt-6">
          已有账号？{' '}
          <Link to="/login" className="text-accent-primary hover:underline font-medium">
            去登录
          </Link>
        </p>
      </div>
    </div>
  )
}
