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
    <div className="bg-bg-card border-t border-border-steel">
      <nav className="flex justify-around py-1">
        {navItems.map((item) => (
          <NavLink
            key={item.to}
            to={item.to}
            className={({ isActive }) =>
              `flex flex-col items-center gap-0.5 px-2 py-1.5 transition-all duration-200 min-w-0 ${
                isActive
                  ? 'text-accent-red'
                  : 'text-text-gray hover:text-white'
              }`
            }
          >
            <item.icon className="w-5 h-5" strokeWidth={isActive ? 2.5 : 2} />
            <span className="text-[10px] font-semibold">{item.label}</span>
          </NavLink>
        ))}
      </nav>
    </div>
  )
}
