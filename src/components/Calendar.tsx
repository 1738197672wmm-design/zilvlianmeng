interface CalendarHeatmapProps {
  data: { date: string; count: number }[]
  type?: 'workout' | 'body' | 'diet'
}

export function CalendarHeatmap({ data, type = 'workout' }: CalendarHeatmapProps) {
  const today = new Date()
  const days: { date: string; dayNum: number; count: number; intensity: number }[] = []

  for (let i = 89; i >= 0; i--) {
    const d = new Date(today)
    d.setDate(d.getDate() - i)
    const dateStr = `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}`
    const record = data.find(r => r.date === dateStr)
    const count = record?.count || 0
    const intensity = count > 0 ? (type === 'workout' ? Math.min(count, 3) : Math.min(count, 2)) : 0

    days.push({ date: dateStr, dayNum: d.getDate(), count, intensity })
  }

  const getColor = (intensity: number) => {
    if (intensity === 0) return '#1a1a1a'
    if (intensity === 1) return '#3d1c1c'
    if (intensity === 2) return '#ff3b30'
    return '#ff6961'
  }

  return (
    <div>
      <div className="flex gap-[3px] overflow-x-auto pb-2">
        {days.map((d, i) => (
          <div
            key={i}
            className="flex-shrink-0 w-3 h-3 sm:w-3.5 sm:h-3.5 rounded-sm cursor-default group relative"
            style={{ backgroundColor: getColor(d.intensity) }}
            title={`${d.date}: ${d.count} 次`}
          >
            <div className="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 px-2 py-1 bg-bg-carbon border border-border-steel rounded text-[10px] text-white whitespace-nowrap opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none z-10 font-mono">
              {d.dayNum}日 · {d.count}次
            </div>
          </div>
        ))}
      </div>
      <div className="flex items-center justify-end gap-1.5 mt-2 text-[10px] text-text-gray font-mono">
        <span>少</span>
        {[0, 1, 2, 3].map(i => (
          <div key={i} className="w-3 h-3 rounded-sm" style={{ backgroundColor: getColor(i) }} />
        ))}
        <span>多</span>
      </div>
    </div>
  )
}
