import { useState, useEffect } from 'react'
import { HeartPulse, Plus, Trash2, Calendar } from 'lucide-react'
import { DataCard } from '@/components/DataCard'
import { Modal } from '@/components/Modal'
import { useDataStore } from '@/stores/dataStore'
import { CARDIO_TYPES } from '@/utils/constants'
import { getToday, formatDate } from '@/utils/format'

export function CardioLog() {
  const { cardio, fetchCardio, addCardio } = useDataStore()
  const [showForm, setShowForm] = useState(false)
  const [loading, setLoading] = useState(false)
  const [date, setDate] = useState(getToday())
  const [type, setType] = useState('run')
  const [duration, setDuration] = useState('')
  const [distance, setDistance] = useState('')
  const [calories, setCalories] = useState('')
  const [notes, setNotes] = useState('')

  useEffect(() => { fetchCardio() }, [fetchCardio])

  const handleSubmit = async () => {
    if (!duration) return
    setLoading(true)
    try {
      await addCardio({
        date,
        type,
        durationMinutes: parseFloat(duration),
        distanceKm: distance ? parseFloat(distance) : undefined,
        caloriesBurned: calories ? parseFloat(calories) : undefined,
        notes: notes || undefined,
      })
      setDuration(''); setDistance(''); setCalories(''); setNotes('')
      setShowForm(false)
    } catch (e) { console.error(e) } finally { setLoading(false) }
  }

  const cardioType = CARDIO_TYPES.find(c => c.id === type) || CARDIO_TYPES[0]
  const unit = cardioType.unit

  // Group by date
  const grouped = cardio.reduce<Record<string, typeof cardio>>((acc, c) => {
    if (!acc[c.date]) acc[c.date] = []
    acc[c.date].push(c)
    return acc
  }, {})

  const dates = Object.keys(grouped).sort((a, b) => b.localeCompare(a))

  return (
    <div className="animate-fade-in pt-6 pb-8">
      <div className="flex items-center justify-between mb-4">
        <h1 className="text-xl font-bold text-text-primary">有氧运动</h1>
        <button onClick={() => setShowForm(true)} className="px-4 py-2 bg-accent-primary hover:bg-indigo-500 rounded-lg text-sm font-medium transition-colors flex items-center gap-1.5">
          <Plus className="w-4 h-4" /> 记录
        </button>
      </div>

      {dates.length === 0 ? (
        <DataCard>
          <div className="text-center py-12">
            <HeartPulse className="w-12 h-12 text-text-muted mx-auto mb-3 opacity-50" />
            <p className="text-text-muted text-sm">还没有有氧记录</p>
          </div>
        </DataCard>
      ) : (
        <div className="space-y-3">
          {dates.map(dateStr => (
            <DataCard key={dateStr}>
              <div className="flex items-center gap-2 mb-2">
                <Calendar className="w-4 h-4 text-text-muted" />
                <span className="text-sm font-medium">{formatDate(dateStr)}</span>
              </div>
              <div className="space-y-2">
                {grouped[dateStr].map(c => {
                  const ct = CARDIO_TYPES.find(t => t.id === c.type) || CARDIO_TYPES[0]
                  return (
                    <div key={c.id} className="flex items-center justify-between py-2 px-3 bg-bg-input rounded-lg">
                      <div className="flex items-center gap-3">
                        <span className="text-xl">{ct.icon}</span>
                        <div>
                          <p className="text-sm font-medium">{ct.name}</p>
                          <p className="text-xs text-text-muted">{c.durationMinutes} 分钟</p>
                        </div>
                      </div>
                      <div className="text-right">
                        {c.distanceKm && <p className="text-xs text-text-secondary">{c.distanceKm}{unit}</p>}
                        {c.caloriesBurned && <p className="text-xs text-accent-danger">{c.caloriesBurned} kcal</p>}
                      </div>
                    </div>
                  )
                })}
              </div>
            </DataCard>
          ))}
        </div>
      )}

      <Modal open={showForm} onClose={() => setShowForm(false)} title="记录有氧">
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-text-secondary mb-1.5">日期</label>
            <input type="date" value={date} onChange={e => setDate(e.target.value)} className="w-full px-3 py-2 bg-bg-input border border-border rounded-lg text-text-primary focus:outline-none focus:border-accent-primary/50" />
          </div>

          <div>
            <label className="block text-sm font-medium text-text-secondary mb-1.5">类型</label>
            <div className="grid grid-cols-3 gap-2">
              {CARDIO_TYPES.map(ct => (
                <button
                  key={ct.id}
                  onClick={() => setType(ct.id)}
                  className={`py-2 rounded-lg text-sm transition-all flex items-center justify-center gap-1.5 ${
                    type === ct.id ? 'bg-accent-primary text-white' : 'bg-bg-input text-text-muted hover:text-text-primary'
                  }`}
                >
                  <span>{ct.icon}</span>
                  <span className="text-xs">{ct.name}</span>
                </button>
              ))}
            </div>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-sm font-medium text-text-secondary mb-1.5">时长 ({unit})</label>
              <input type="number" value={duration} onChange={e => setDuration(e.target.value)} placeholder="30" className="w-full px-3 py-2 bg-bg-input border border-border rounded-lg text-text-primary placeholder-text-muted focus:outline-none focus:border-accent-primary/50" />
            </div>
            <div>
              <label className="block text-sm font-medium text-text-secondary mb-1.5">距离 (km)</label>
              <input type="number" value={distance} onChange={e => setDistance(e.target.value)} placeholder="5.0" className="w-full px-3 py-2 bg-bg-input border border-border rounded-lg text-text-primary placeholder-text-muted focus:outline-none focus:border-accent-primary/50" />
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-text-secondary mb-1.5">消耗 (kcal)</label>
            <input type="number" value={calories} onChange={e => setCalories(e.target.value)} placeholder="200" className="w-full px-3 py-2 bg-bg-input border border-border rounded-lg text-text-primary placeholder-text-muted focus:outline-none focus:border-accent-primary/50" />
          </div>

          <div>
            <label className="block text-sm font-medium text-text-secondary mb-1.5">备注</label>
            <textarea value={notes} onChange={e => setNotes(e.target.value)} rows={2} className="w-full px-3 py-2 bg-bg-input border border-border rounded-lg text-text-primary placeholder-text-muted focus:outline-none focus:border-accent-primary/50 resize-none" />
          </div>

          <button onClick={handleSubmit} disabled={loading || !duration} className="w-full py-2.5 bg-accent-primary hover:bg-indigo-500 disabled:opacity-50 disabled:cursor-not-allowed rounded-lg font-medium text-white transition-colors">
            {loading ? '保存中...' : '保存'}
          </button>
        </div>
      </Modal>
    </div>
  )
}
