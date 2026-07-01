import { NavLink } from 'react-router'
import {
  LayoutDashboard,
  Scale,
  Dumbbell,
  HeartPulse,
  Utensils,
  Target,
} from 'lucide-react'

const navItems = [
  { to: '/', label: '总览', icon: LayoutDashboard },
  { to: '/body', label: '身体', icon: Scale },
  { to: '/workout', label: '训练', icon: Dumbbell },
  { to: '/cardio', label: '有氧', icon: HeartPulse },
  { to: '/diet', label: '饮食', icon: Utensils },
  { to: '/goals', label: '目标', icon: Target },
]

export function BottomNav() {
  return (
    <div className="glass border-t border-border">
      <nav className="flex justify-around py-1">
        {navItems.map((item) => (
          <NavLink
            key={item.to}
            to={item.to}
            className={({ isActive }) =>
              `flex flex-col items-center gap-0.5 px-3 py-1.5 rounded-lg transition-all duration-150 min-w-0 ${
                isActive
                  ? 'text-accent-primary'
                  : 'text-text-muted hover:text-text-secondary'
              }`
            }
          >
            <item.icon className="w-5 h-5" />
            <span className="text-[10px] font-medium">{item.label}</span>
          </NavLink>
        ))}
      </nav>
    </div>
  )
}
