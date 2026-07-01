interface SimpleChartProps {
  data: { label: string; value: number }[]
  height?: number
  color?: string
  showPoints?: boolean
  showArea?: boolean
}

export function SimpleChart({ data, height = 160, color = '#6366f1', showPoints = true, showArea = true }: SimpleChartProps) {
  if (!data.length) {
    return (
      <div className="flex items-center justify-center" style={{ height }}>
        <p className="text-sm text-text-muted">暂无数据</p>
      </div>
    )
  }

  const values = data.map(d => d.value).filter(v => v != null)
  if (!values.length) return null

  const minVal = Math.min(...values)
  const maxVal = Math.max(...values)
  const range = maxVal - minVal || 1
  const padding = 8

  const chartWidth = 100 // percentage
  const points = data.map((d, i) => {
    const x = data.length === 1 ? 50 : (i / (data.length - 1)) * 100
    const y = d.value != null ? padding + ((maxVal - d.value) / range) * (height - padding * 2) : height
    return { x, y, label: d.label, value: d.value }
  })

  const pathD = points.map((p, i) => `${i === 0 ? 'M' : 'L'} ${p.x} ${p.y}`).join(' ')
  const areaD = pathD + ` L ${points[points.length - 1].x} ${height} L ${points[0].x} ${height} Z`

  return (
    <svg viewBox={`0 0 100 ${height}`} className="w-full" style={{ height }} preserveAspectRatio="none">
      <defs>
        <linearGradient id={`grad-${color.replace('#', '')}`} x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor={color} stopOpacity="0.3" />
          <stop offset="100%" stopColor={color} stopOpacity="0" />
        </linearGradient>
      </defs>
      {showArea && points.length > 1 && (
        <path d={areaD} fill={`url(#grad-${color.replace('#', '')})`} />
      )}
      {points.length > 1 && (
        <path d={pathD} fill="none" stroke={color} strokeWidth="0.8" vectorEffect="non-scaling-stroke" />
      )}
      {showPoints && points.map((p, i) => (
        <g key={i}>
          {p.value != null && (
            <>
              <circle cx={p.x} cy={p.y} r="1.2" fill={color} />
              {data.length <= 14 && (
                <text x={p.x} y={height - 2} textAnchor="middle" fontSize="3" fill="#64748b">
                  {p.label}
                </text>
              )}
            </>
          )}
        </g>
      ))}
    </svg>
  )
}
