import { useState, useEffect } from 'react'
import { Scale, Plus, Trash2, TrendingUp } from 'lucide-react'
import { DataCard } from '@/components/DataCard'
import { Modal } from '@/components/Modal'
import { SimpleChart } from '@/components/Chart'
import { useDataStore } from '@/stores/dataStore'
import { getToday } from '@/utils/format'

export function BodyData() {
  const { bodyData, fetchBodyData, addBodyData } = useDataStore()
  const [showForm, setShowForm] = useState(false)
  const [loading, setLoading] = useState(false)
  const [date, setDate] = useState(getToday())
  const [weight, setWeight] = useState('')
  const [bodyFat, setBodyFat] = useState('')
  const [muscleMass, setMuscleMass] = useState('')
  const [notes, setNotes] = useState('')

  useEffect(() => { fetchBodyData() }, [fetchBodyData])

  const handleSubmit = async () => {
    if (!weight) return
    setLoading(true)
    try {
      await addBodyData({
        date,
        weight: parseFloat(weight),
        bodyFatPercent: bodyFat ? parseFloat(bodyFat) : undefined,
        muscleMass: muscleMass ? parseFloat(muscleMass) : undefined,
        notes: notes || undefined,
      })
      setWeight(''); setBodyFat(''); setMuscleMass(''); setNotes('')
      setShowForm(false)
    } catch (e) { console.error(e) } finally { setLoading(false) }
  }

  const chartData = bodyData.slice(0, 30).reverse().map(b => ({
    label: b.date.slice(5),
    value: b.weight || 0,
  }))

  const bfData = bodyData.slice(0, 30).reverse().map(b => ({
    label: b.date.slice(5),
    value: b.bodyFatPercent || 0,
  }))

  const latest = bodyData[0]
  const prev = bodyData[1]
  const weightChange = latest && prev ? (latest.weight || 0) - (prev.weight || 0) : 0

  return (
    <div className="animate-fade-in pt-6 pb-8">
      <div className="flex items-center justify-between mb-4">
        <h1 className="text-xl font-bold text-text-primary">身体数据</h1>
        <button onClick={() => setShowForm(true)} className="px-4 py-2 bg-accent-primary hover:bg-indigo-500 rounded-lg text-sm font-medium transition-colors flex items-center gap-1.5">
          <Plus className="w-4 h-4" /> 记录
        </button>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-3 gap-3 mb-4">
        <DataCard className="!p-3 text-center">
          <Scale className="w-5 h-5 text-blue-400 mx-auto mb-1" />
          <div className="text-lg font-bold">{latest?.weight || '-'}</div>
          <div className="text-xs text-text-muted">体重 kg</div>
          {weightChange !== 0 && (
            <div className={`text-xs font-medium ${weightChange > 0 ? 'text-accent-danger' : 'text-accent-success'}`}>
              {weightChange > 0 ? '+' : ''}{weightChange.toFixed(1)}
            </div>
          )}
        </DataCard>
        <DataCard className="!p-3 text-center">
          <div className="text-lg font-bold text-accent-primary">{latest?.bodyFatPercent || '-'}</div>
          <div className="text-xs text-text-muted">体脂 %</div>
        </DataCard>
        <DataCard className="!p-3 text-center">
          <div className="text-lg font-bold text-accent-secondary">{latest?.muscleMass || '-'}</div>
          <div className="text-xs text-text-muted">肌肉 kg</div>
        </DataCard>
      </div>

      {/* Charts */}
      <div className="space-y-4">
        <DataCard title="体重趋势" subtitle="最近30次记录" icon={<TrendingUp className="w-4 h-4 text-accent-primary" />}>
          <SimpleChart data={chartData} height={140} color="#6366f1" />
        </DataCard>

        {latest?.bodyFatPercent && (
          <DataCard title="体脂趋势" subtitle="最近30次记录" icon={<TrendingUp className="w-4 h-4 text-accent-secondary" />}>
            <SimpleChart data={bfData} height={140} color="#22d3ee" />
          </DataCard>
        )}
      </div>

      {/* History */}
      <DataCard title="历史记录" className="mt-4">
        <div className="space-y-2">
          {bodyData.slice(0, 10).map(b => (
            <div key={b.id} className="flex items-center justify-between py-2 px-3 bg-bg-input rounded-lg">
              <div>
                <span className="text-sm font-medium">{b.date}</span>
                <span className="text-xs text-text-muted ml-2">{b.weight}kg</span>
                {b.bodyFatPercent && <span className="text-xs text-text-muted ml-1">{b.bodyFatPercent}%体脂</span>}
              </div>
              {b.notes && <span className="text-xs text-text-muted max-w-[120px] truncate">{b.notes}</span>}
            </div>
          ))}
        </div>
      </DataCard>

      {/* Add Body Data Modal */}
      <Modal open={showForm} onClose={() => setShowForm(false)} title="记录身体数据">
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-text-secondary mb-1.5">日期</label>
            <input type="date" value={date} onChange={e => setDate(e.target.value)} className="w-full px-3 py-2 bg-bg-input border border-border rounded-lg text-text-primary focus:outline-none focus:border-accent-primary/50" />
          </div>
          <div className="grid grid-cols-3 gap-3">
            <div>
              <label className="block text-sm font-medium text-text-secondary mb-1.5">体重 (kg)</label>
              <input type="number" step="0.1" value={weight} onChange={e => setWeight(e.target.value)} placeholder="70.5" className="w-full px-3 py-2 bg-bg-input border border-border rounded-lg text-text-primary placeholder-text-muted focus:outline-none focus:border-accent-primary/50" />
            </div>
            <div>
              <label className="block text-sm font-medium text-text-secondary mb-1.5">体脂 (%)</label>
              <input type="number" step="0.1" value={bodyFat} onChange={e => setBodyFat(e.target.value)} placeholder="20" className="w-full px-3 py-2 bg-bg-input border border-border rounded-lg text-text-primary placeholder-text-muted focus:outline-none focus:border-accent-primary/50" />
            </div>
            <div>
              <label className="block text-sm font-medium text-text-secondary mb-1.5">肌肉 (kg)</label>
              <input type="number" step="0.1" value={muscleMass} onChange={e => setMuscleMass(e.target.value)} placeholder="55" className="w-full px-3 py-2 bg-bg-input border border-border rounded-lg text-text-primary placeholder-text-muted focus:outline-none focus:border-accent-primary/50" />
            </div>
          </div>
          <div>
            <label className="block text-sm font-medium text-text-secondary mb-1.5">备注</label>
            <textarea value={notes} onChange={e => setNotes(e.target.value)} rows={2} className="w-full px-3 py-2 bg-bg-input border border-border rounded-lg text-text-primary placeholder-text-muted focus:outline-none focus:border-accent-primary/50 resize-none" placeholder="今天的状态..." />
          </div>
          <button onClick={handleSubmit} disabled={loading || !weight} className="w-full py-2.5 bg-accent-primary hover:bg-indigo-500 disabled:opacity-50 disabled:cursor-not-allowed rounded-lg font-medium text-white transition-colors">
            {loading ? '保存中...' : '保存'}
          </button>
        </div>
      </Modal>
    </div>
  )
}
