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
  { to: '/body', label: '身体', icon: Scale },
  { to: '/workout', label: '训练', icon: Dumbbell },
  { to: '/cardio', label: '有氧', icon: HeartPulse },
  { to: '/diet', label: '饮食', icon: Utensils },
  { to: '/goals', label: '目标', icon: Target },
  { to: '/feed', label: '动态', icon: Users },
  { to: '/settings', label: '设置', icon: Settings },
]

export function Sidebar() {
  const { user, clearAuth } = useAuthStore()

  return (
    <div className="h-screen bg-bg-card border-r border-border-steel flex flex-col">
      {/* Logo */}
      <div className="p-6 border-b border-border-steel">
        <h1 className="text-2xl font-black tracking-tight text-white">
          FIT<span className="text-accent-red">CHECK</span>
        </h1>
        <p className="text-[11px] text-text-gray mt-1 font-mono tracking-wider uppercase">
          {user?.username} · 健身打卡
        </p>
      </div>

      {/* Nav */}
      <nav className="flex-1 p-3 space-y-0.5 overflow-y-auto">
        <p className="px-3 pt-4 pb-2 text-[10px] font-bold text-text-dim uppercase tracking-widest">菜单</p>
        {navItems.slice(0, 7).map((item) => (
          <NavLink
            key={item.to}
            to={item.to}
            className={({ isActive }) =>
              `flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-all duration-200 group ${
                isActive
                  ? 'bg-accent-red/10 text-accent-red shadow-sm'
                  : 'text-text-gray hover:text-white hover:bg-bg-carbon'
              }`
            }
          >
            <item.icon className={`w-5 h-5 flex-shrink-0 transition-colors ${
              isActive ? 'text-accent-red' : 'group-hover:text-white'
            }`} />
            <span>{item.label}</span>
          </NavLink>
        ))}
      </nav>

      {/* Logout */}
      <div className="p-3 border-t border-border-steel">
        <button
          onClick={() => {
            clearAuth()
            window.location.href = '/login'
          }}
          className="flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium text-text-gray hover:text-accent-red hover:bg-accent-red/5 w-full transition-all duration-200"
        >
          <LogOut className="w-5 h-5 flex-shrink-0" />
          <span>退出登录</span>
        </button>
      </div>
    </div>
  )
}
