import { useState, useEffect } from 'react'
import { Dumbbell, Plus, Trash2, Calendar, ChevronDown, ChevronUp } from 'lucide-react'
import { DataCard } from '@/components/DataCard'
import { Modal } from '@/components/Modal'
import { useDataStore } from '@/stores/dataStore'
import { useAuthStore } from '@/stores/authStore'
import { EXERCISE_PRESETS, WORKOUT_CATEGORIES } from '@/utils/constants'
import { getToday, formatDate } from '@/utils/format'

interface ExerciseSet {
  weight: string
  reps: string
  notes: string
}

export function WorkoutLog() {
  const { user } = useAuthStore()
  const { workouts, fetchWorkouts, addWorkout } = useDataStore()
  const [showForm, setShowForm] = useState(false)
  const [showPreset, setShowPreset] = useState(false)
  const [selectedCategory, setSelectedCategory] = useState<string>('全部')
  const [loading, setLoading] = useState(false)
  const [exerciseName, setExerciseName] = useState('')
  const [isCustom, setIsCustom] = useState(false)
  const [setType, setsetType] = useState<'strength' | 'cardio' | 'flexibility'>('strength')
  const [sets, setSets] = useState<ExerciseSet[]>([{ weight: '', reps: '', notes: '' }])
  const [notes, setNotes] = useState('')
  const [date, setDate] = useState(getToday())
  const [expandedWorkout, setExpandedWorkout] = useState<string | null>(null)

  useEffect(() => {
    fetchWorkouts()
  }, [fetchWorkouts])

  const categories = ['全部', ...WORKOUT_CATEGORIES]
  const filteredExercises = selectedCategory === '全部'
    ? EXERCISE_PRESETS
    : EXERCISE_PRESETS.filter(e => e.category === selectedCategory)

  const handleSelectExercise = (ex: typeof EXERCISE_PRESETS[0]) => {
    setExerciseName(ex.name)
    setIsCustom(false)
    setShowPreset(false)
  }

  const handleAddSet = () => {
    setSets([...sets, { weight: '', reps: '', notes: '' }])
  }

  const handleRemoveSet = (idx: number) => {
    setSets(sets.filter((_, i) => i !== idx))
  }

  const handleSetChange = (idx: number, field: keyof ExerciseSet, value: string) => {
    const newSets = [...sets]
    newSets[idx] = { ...newSets[idx], [field]: value }
    setSets(newSets)
  }

  const handleSubmit = async () => {
    if (!exerciseName.trim()) return
    setLoading(true)
    try {
      const totalCalories = sets.reduce((sum, s) => {
        const w = parseFloat(s.weight) || 0
        const r = parseInt(s.reps) || 0
        return sum + (w > 0 ? w * r * 0.01 : 2)
      }, 0)

      await addWorkout({
        date,
        type: setType,
        exerciseName: exerciseName.trim(),
        sets: sets.length,
        notes: notes || `${totalCalories.toFixed(0)}kcal`,
        isCustom,
      })
      // Reset
      setExerciseName('')
      setIsCustom(false)
      setsetType('strength')
      setSets([{ weight: '', reps: '', notes: '' }])
      setNotes('')
      setShowForm(false)
    } catch (e) {
      console.error(e)
    } finally {
      setLoading(false)
    }
  }

  // Group workouts by date
  const grouped = workouts.reduce<Record<string, typeof workouts>>((acc, w) => {
    if (!acc[w.date]) acc[w.date] = []
    acc[w.date].push(w)
    return acc
  }, {})

  const dates = Object.keys(grouped).sort((a, b) => b.localeCompare(a))

  return (
    <div className="animate-fade-in pt-6 pb-8">
      <div className="flex items-center justify-between mb-4">
        <h1 className="text-xl font-bold text-text-primary">训练日志</h1>
        <button
          onClick={() => setShowForm(true)}
          className="px-4 py-2 bg-accent-primary hover:bg-indigo-500 rounded-lg text-sm font-medium transition-colors flex items-center gap-1.5"
        >
          <Plus className="w-4 h-4" />
          记录
        </button>
      </div>

      {dates.length === 0 ? (
        <DataCard>
          <div className="text-center py-12">
            <Dumbbell className="w-12 h-12 text-text-muted mx-auto mb-3 opacity-50" />
            <p className="text-text-muted text-sm">还没有训练记录</p>
            <p className="text-text-muted text-xs mt-1">点击右上角 + 开始记录第一次训练</p>
          </div>
        </DataCard>
      ) : (
        <div className="space-y-3">
          {dates.map(dateStr => (
            <DataCard key={dateStr}>
              <div
                className="flex items-center justify-between cursor-pointer"
                onClick={() => setExpandedWorkout(expandedWorkout === dateStr ? null : dateStr)}
              >
                <div className="flex items-center gap-2">
                  <Calendar className="w-4 h-4 text-text-muted" />
                  <span className="text-sm font-medium">{formatDate(dateStr)}</span>
                  <span className="text-xs text-text-muted">{grouped[dateStr].length} 个动作</span>
                </div>
                {expandedWorkout === dateStr ? <ChevronUp className="w-4 h-4 text-text-muted" /> : <ChevronDown className="w-4 h-4 text-text-muted" />}
              </div>

              {expandedWorkout === dateStr && (
                <div className="mt-3 space-y-2">
                  {grouped[dateStr].map(w => (
                    <div key={w.id} className="flex items-start justify-between py-2 px-3 bg-bg-input rounded-lg">
                      <div>
                        <p className="text-sm font-medium text-text-primary">{w.exerciseName}</p>
                        <p className="text-xs text-text-muted mt-0.5">
                          {w.sets}组 × {w.reps}次 {w.weightKg ? `${w.weightKg}kg` : ''}
                        </p>
                        {w.notes && <p className="text-xs text-text-muted mt-0.5">{w.notes}</p>}
                      </div>
                      <span className={`text-xs px-2 py-0.5 rounded-full ${
                        w.type === 'strength' ? 'bg-accent-primary/10 text-accent-primary' :
                        w.type === 'cardio' ? 'bg-accent-danger/10 text-accent-danger' :
                        'bg-accent-success/10 text-accent-success'
                      }`}>
                        {w.type === 'strength' ? '力量' : w.type === 'cardio' ? '有氧' : '柔韧'}
                      </span>
                    </div>
                  ))}
                </div>
              )}
            </DataCard>
          ))}
        </div>
      )}

      {/* Add Workout Modal */}
      <Modal open={showForm} onClose={() => setShowForm(false)} title="记录训练" size="lg">
        <div className="space-y-4">
          {/* Date */}
          <div>
            <label className="block text-sm font-medium text-text-secondary mb-1.5">日期</label>
            <input type="date" value={date} onChange={e => setDate(e.target.value)} className="w-full px-3 py-2 bg-bg-input border border-border rounded-lg text-text-primary focus:outline-none focus:border-accent-primary/50" />
          </div>

          {/* Type */}
          <div>
            <label className="block text-sm font-medium text-text-secondary mb-1.5">类型</label>
            <div className="flex gap-2">
              {(['strength', 'cardio', 'flexibility'] as const).map(t => (
                <button
                  key={t}
                  onClick={() => setsetType(t)}
                  className={`flex-1 py-2 rounded-lg text-sm font-medium transition-all ${
                    setType === t ? 'bg-accent-primary text-white' : 'bg-bg-input text-text-muted hover:text-text-primary'
                  }`}
                >
                  {t === 'strength' ? '力量' : t === 'cardio' ? '有氧' : '柔韧'}
                </button>
              ))}
            </div>
          </div>

          {/* Exercise Selection */}
          <div>
            <label className="block text-sm font-medium text-text-secondary mb-1.5">动作</label>
            <div className="flex gap-2">
              <button
                onClick={() => setShowPreset(!showPreset)}
                className="flex-1 py-2.5 bg-bg-input border border-border rounded-lg text-sm text-text-primary hover:border-border-light transition-colors"
              >
                {exerciseName || '选择预设动作'}
              </button>
              <label className="flex items-center gap-2 text-sm text-text-secondary cursor-pointer">
                <input type="checkbox" checked={isCustom} onChange={e => { setIsCustom(e.target.checked); if (e.target.checked) setShowPreset(false) }} />
                自定义
              </label>
            </div>

            {/* Preset dropdown */}
            {showPreset && (
              <div className="mt-2 bg-bg-card border border-border rounded-lg overflow-hidden">
                {/* Category tabs */}
                <div className="flex gap-1 p-2 border-b border-border overflow-x-auto">
                  {categories.map(cat => (
                    <button
                      key={cat}
                      onClick={() => setSelectedCategory(cat)}
                      className={`px-2.5 py-1 rounded text-xs font-medium whitespace-nowrap transition-colors ${
                        selectedCategory === cat ? 'bg-accent-primary/10 text-accent-primary' : 'text-text-muted hover:text-text-primary'
                      }`}
                    >
                      {cat}
                    </button>
                  ))}
                </div>
                <div className="max-h-48 overflow-y-auto p-1">
                  {filteredExercises.map(ex => (
                    <button
                      key={ex.id}
                      onClick={() => handleSelectExercise(ex)}
                      className="w-full text-left px-3 py-2 rounded-lg text-sm text-text-secondary hover:text-text-primary hover:bg-bg-card-hover transition-colors flex items-center justify-between"
                    >
                      <span>{ex.name}</span>
                      <span className="text-xs text-text-muted">{ex.muscleGroup}</span>
                    </button>
                  ))}
                </div>
              </div>
            )}

            {isCustom && !exerciseName && (
              <input
                type="text"
                placeholder="输入动作名称..."
                value={exerciseName}
                onChange={e => setExerciseName(e.target.value)}
                className="w-full mt-2 px-3 py-2 bg-bg-input border border-border rounded-lg text-text-primary placeholder-text-muted focus:outline-none focus:border-accent-primary/50"
              />
            )}
          </div>

          {/* Sets */}
          <div>
            <label className="block text-sm font-medium text-text-secondary mb-1.5">组数</label>
            <div className="space-y-2">
              {sets.map((s, idx) => (
                <div key={idx} className="flex items-center gap-2">
                  <span className="text-xs text-text-muted w-6 text-right">{idx + 1}</span>
                  <input
                    type="number"
                    placeholder="kg"
                    value={s.weight}
                    onChange={e => handleSetChange(idx, 'weight', e.target.value)}
                    className="flex-1 px-3 py-1.5 bg-bg-input border border-border rounded-lg text-sm text-text-primary placeholder-text-muted focus:outline-none focus:border-accent-primary/50"
                  />
                  <input
                    type="number"
                    placeholder="次"
                    value={s.reps}
                    onChange={e => handleSetChange(idx, 'reps', e.target.value)}
                    className="flex-1 px-3 py-1.5 bg-bg-input border border-border rounded-lg text-sm text-text-primary placeholder-text-muted focus:outline-none focus:border-accent-primary/50"
                  />
                  {sets.length > 1 && (
                    <button onClick={() => handleRemoveSet(idx)} className="p-1.5 text-text-muted hover:text-accent-danger transition-colors">
                      <Trash2 className="w-4 h-4" />
                    </button>
                  )}
                </div>
              ))}
            </div>
            <button onClick={handleAddSet} className="mt-2 text-xs text-accent-primary hover:underline">+ 添加组</button>
          </div>

          {/* Notes */}
          <div>
            <label className="block text-sm font-medium text-text-secondary mb-1.5">备注</label>
            <textarea
              value={notes}
              onChange={e => setNotes(e.target.value)}
              rows={2}
              className="w-full px-3 py-2 bg-bg-input border border-border rounded-lg text-text-primary placeholder-text-muted focus:outline-none focus:border-accent-primary/50 resize-none"
              placeholder="训练感受、重量提升等..."
            />
          </div>

          <button
            onClick={handleSubmit}
            disabled={loading || !exerciseName.trim()}
            className="w-full py-2.5 bg-accent-primary hover:bg-indigo-500 disabled:opacity-50 disabled:cursor-not-allowed rounded-lg font-medium text-white transition-colors"
          >
            {loading ? '保存中...' : '保存训练记录'}
          </button>
        </div>
      </Modal>
    </div>
  )
}
