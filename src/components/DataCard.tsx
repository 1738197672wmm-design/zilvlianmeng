import { ReactNode } from 'react'

interface DataCardProps {
  title?: string
  subtitle?: string
  icon?: ReactNode
  action?: ReactNode
  children: ReactNode
  className?: string
  onClick?: () => void
  accent?: 'red' | 'orange' | 'green' | 'blue'
}

export function DataCard({ title, subtitle, icon, action, children, className = '', onClick, accent }: DataCardProps) {
  const accentBorder = accent === 'red' ? 'border-accent-red/30' :
    accent === 'orange' ? 'border-accent-orange/30' :
    accent === 'green' ? 'border-accent-green/30' :
    accent === 'blue' ? 'border-accent-blue/30' :
    'border-border-steel'

  return (
    <div
      onClick={onClick}
      className={`rounded-xl border ${accentBorder} bg-bg-card overflow-hidden transition-all duration-200 hover:bg-bg-carbon ${onClick ? 'cursor-pointer' : ''} ${className}`}
    >
      {(title || icon || action) && (
        <div className="flex items-center justify-between px-4 py-3 border-b border-border-steel">
          <div className="flex items-center gap-2.5">
            {icon && <span className={accent === 'red' ? 'text-accent-red' : accent === 'orange' ? 'text-accent-orange' : accent === 'green' ? 'text-accent-green' : accent === 'blue' ? 'text-accent-blue' : 'text-white'}>{icon}</span>}
            <div>
              {title && <h3 className="text-sm font-bold text-white tracking-tight">{title}</h3>}
              {subtitle && <p className="text-[11px] text-text-gray font-mono">{subtitle}</p>}
            </div>
          </div>
          {action && <div>{action}</div>}
        </div>
      )}
      <div className="px-4 py-3">
        {children}
      </div>
    </div>
  )
}
