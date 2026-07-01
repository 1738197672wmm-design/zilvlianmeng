import { NavLink } from 'react-router'
import {
  LayoutDashboard,
  Scale,
  Dumbbell,
  HeartPulse,
  Utensils,
  Target,
  Users,
  Settings,
  LogOut,
} from 'lucide-react'
import { useAuthStore } from '@/stores/authStore'

const navItems = [
  { to: '/', label: '总览', icon: LayoutDashboard },
  { to: '/body', label: '身体数据', icon: Scale },
  { to: '/workout', label: '训练日志', icon: Dumbbell },
  { to: '/cardio', label: '有氧运动', icon: HeartPulse },
  { to: '/diet', label: '饮食记录', icon: Utensils },
  { to: '/goals', label: '目标追踪', icon: Target },
  { to: '/feed', label: '好友动态', icon: Users },
  { to: '/settings', label: '设置', icon: Settings },
]

export function Sidebar() {
  const { user, clearAuth } = useAuthStore()

  return (
    <div className="h-full bg-bg-card border-r border-border flex flex-col">
      {/* Logo */}
      <div className="p-6 border-b border-border">
        <h1 className="text-xl font-bold text-gradient">FITCHECK</h1>
        <p className="text-xs text-text-muted mt-1">健身打卡 · {user?.username}</p>
      </div>

      {/* Nav */}
      <nav className="flex-1 p-4 space-y-1 overflow-y-auto">
        {navItems.map((item) => (
          <NavLink
            key={item.to}
            to={item.to}
            className={({ isActive }) =>
              `flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-all duration-150 ${
                isActive
                  ? 'bg-accent-primary/10 text-accent-primary'
                  : 'text-text-secondary hover:text-text-primary hover:bg-bg-card-hover'
              }`
            }
          >
            <item.icon className="w-5 h-5 flex-shrink-0" />
            <span>{item.label}</span>
          </NavLink>
        ))}
      </nav>

      {/* Logout */}
      <div className="p-4 border-t border-border">
        <button
          onClick={() => {
            clearAuth()
            window.location.href = '/login'
          }}
          className="flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium text-text-secondary hover:text-accent-danger hover:bg-accent-danger/10 w-full transition-all duration-150"
        >
          <LogOut className="w-5 h-5 flex-shrink-0" />
          <span>退出登录</span>
        </button>
      </div>
    </div>
  )
}
