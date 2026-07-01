import { ReactNode } from 'react'

interface DataCardProps {
  title?: string
  subtitle?: string
  icon?: ReactNode
  action?: ReactNode
  children: ReactNode
  className?: string
  gradient?: boolean
}

export function DataCard({ title, subtitle, icon, action, children, className = '', gradient = false }: DataCardProps) {
  return (
    <div className={`rounded-xl border border-border overflow-hidden transition-all duration-200 hover:border-border-light ${gradient ? 'bg-gradient-to-br from-accent-primary/5 to-accent-secondary/5' : 'bg-bg-card'} ${className}`}>
      {(title || icon || action) && (
        <div className="flex items-center justify-between px-4 py-3 border-b border-border">
          <div className="flex items-center gap-2.5">
            {icon && <span className="text-accent-primary">{icon}</span>}
            <div>
              {title && <h3 className="text-sm font-semibold text-text-primary">{title}</h3>}
              {subtitle && <p className="text-xs text-text-muted">{subtitle}</p>}
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
