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
      setError(err.message || '注册失败')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center px-4 py-12">
      <div className="w-full max-w-sm">
        <div className="text-center mb-10">
          <div className="inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-accent-red/10 border border-accent-red/20 mb-5">
            <UserPlus className="w-8 h-8 text-accent-red" strokeWidth={2.5} />
          </div>
          <h1 className="text-3xl font-black tracking-tight text-white">
            加<span className="text-accent-red">入</span> FITCHECK
          </h1>
          <p className="text-xs text-text-gray font-mono mt-2 uppercase tracking-widest">输入邀请码开始记录</p>
        </div>

        <form onSubmit={handleRegister} className="space-y-4">
          <div>
            <label className="block text-xs font-bold text-text-gray uppercase tracking-wider mb-2">用户名</label>
            <input type="text" value={username} onChange={e => setUsername(e.target.value)} required minLength={2} maxLength={20}
              className="w-full px-4 py-3 bg-bg-input border border-border-steel rounded-lg text-white placeholder-text-dim focus:outline-none focus:border-accent-red/50 focus:ring-1 focus:ring-accent-red/20 transition-all font-mono text-sm"
              placeholder="你的昵称" />
          </div>
          <div>
            <label className="block text-xs font-bold text-text-gray uppercase tracking-wider mb-2">邮箱</label>
            <input type="email" value={email} onChange={e => setEmail(e.target.value)} required
              className="w-full px-4 py-3 bg-bg-input border border-border-steel rounded-lg text-white placeholder-text-dim focus:outline-none focus:border-accent-red/50 focus:ring-1 focus:ring-accent-red/20 transition-all font-mono text-sm"
              placeholder="your@email.com" />
          </div>
          <div>
            <label className="block text-xs font-bold text-text-gray uppercase tracking-wider mb-2">密码</label>
            <input type="password" value={password} onChange={e => setPassword(e.target.value)} required minLength={6}
              className="w-full px-4 py-3 bg-bg-input border border-border-steel rounded-lg text-white placeholder-text-dim focus:outline-none focus:border-accent-red/50 focus:ring-1 focus:ring-accent-red/20 transition-all font-mono text-sm"
              placeholder="至少6位" />
          </div>
          <div>
            <label className="block text-xs font-bold text-text-gray uppercase tracking-wider mb-2">邀请码</label>
            <input type="text" value={inviteCode} onChange={e => setInviteCode(e.target.value.toUpperCase())} required
              className="w-full px-4 py-3 bg-bg-input border border-border-steel rounded-lg text-white placeholder-text-dim focus:outline-none focus:border-accent-red/50 focus:ring-1 focus:ring-accent-red/20 transition-all font-mono text-sm tracking-widest uppercase text-center"
              placeholder="输入邀请码" />
          </div>

          {error && (
            <div className="text-xs text-accent-red bg-accent-red/5 border border-accent-red/20 rounded-lg px-4 py-3 font-mono">{error}</div>
          )}

          <button type="submit" disabled={loading}
            className="w-full py-3 bg-accent-red hover:bg-red-600 disabled:opacity-50 disabled:cursor-not-allowed rounded-lg font-bold text-white transition-colors flex items-center justify-center gap-2 text-sm shadow-lg shadow-accent-red/20">
            <UserPlus className="w-4 h-4" strokeWidth={2.5} />
            {loading ? '注册中...' : '注 册'}
          </button>
        </form>

        <p className="text-center text-xs text-text-gray mt-8 font-mono">
          已有账号？{' '}
          <Link to="/login" className="text-accent-red hover:underline font-bold">去登录</Link>
        </p>
      </div>
    </div>
  )
}
