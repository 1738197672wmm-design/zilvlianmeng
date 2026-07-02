import { useState } from 'react'
import { Settings, User, Shield, LogOut } from 'lucide-react'
import { DataCard } from '@/components/DataCard'
import { useAuthStore } from '@/stores/authStore'

export function SettingsPage() {
  const { user, clearAuth } = useAuthStore()
  const [bio, setBio] = useState(user?.bio || '')
  const [saved, setSaved] = useState(false)

  const handleSave = () => {
    setSaved(true)
    setTimeout(() => setSaved(false), 2000)
  }

  return (
    <div className="animate-fade-in pt-6 pb-8">
      <h1 className="text-xl font-bold text-text-primary mb-4">设置</h1>

      <div className="space-y-4">
        {/* Profile */}
        <DataCard title="个人资料" icon={<User className="w-4 h-4 text-accent-primary" />}>
          <div className="space-y-3">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 rounded-full bg-accent-primary/10 flex items-center justify-center text-lg font-bold text-accent-primary">
                {user?.username?.[0]?.toUpperCase() || '?'}
              </div>
              <div>
                <p className="text-sm font-semibold text-text-primary">{user?.username}</p>
                <p className="text-xs text-text-muted">{user?.email}</p>
              </div>
            </div>

            <div>
              <label className="block text-xs font-medium text-text-secondary mb-1">个人简介</label>
              <textarea
                value={bio}
                onChange={e => setBio(e.target.value)}
                rows={3}
                className="w-full px-3 py-2 bg-bg-input border border-border rounded-lg text-sm text-text-primary placeholder-text-muted focus:outline-none focus:border-accent-primary/50 resize-none"
                placeholder="说说你的健身目标..."
              />
            </div>

            <button
              onClick={handleSave}
              className="px-4 py-1.5 bg-accent-primary hover:bg-indigo-500 rounded-lg text-sm text-white transition-colors"
            >
              {saved ? '已保存!' : '保存'}
            </button>
          </div>
        </DataCard>

        {/* Account */}
        <DataCard title="账户安全" icon={<Shield className="w-4 h-4 text-accent-primary" />}>
          <div className="space-y-2">
            <div className="flex items-center justify-between py-2">
              <span className="text-sm text-text-secondary">修改密码</span>
              <button className="text-sm text-accent-primary hover:underline">前往修改</button>
            </div>
            <div className="flex items-center justify-between py-2">
              <span className="text-sm text-text-secondary">绑定邮箱</span>
              <span className="text-sm text-text-muted">{user?.email}</span>
            </div>
          </div>
        </DataCard>

        {/* Danger Zone */}
        <DataCard title="退出登录" icon={<LogOut className="w-4 h-4 text-accent-danger" />}>
          <button
            onClick={() => {
              clearAuth()
              window.location.href = '/login'
            }}
            className="w-full py-2 bg-accent-danger/10 hover:bg-accent-danger/20 text-accent-danger rounded-lg text-sm font-medium transition-colors"
          >
            退出登录
          </button>
        </DataCard>
      </div>
    </div>
  )
}
