import { useState, useEffect } from 'react'
import { Target, Plus, Trash2, TrendingUp } from 'lucide-react'
import { DataCard } from '@/components/DataCard'
import { Modal } from '@/components/Modal'
import { useDataStore } from '@/stores/dataStore'
import { GOAL_TYPES } from '@/utils/constants'
import { getToday, formatDate } from '@/utils/format'

export function Goals() {
  const { goals, fetchGoals, addGoal, bodyData } = useDataStore()
  const [showForm, setShowForm] = useState(false)
  const [loading, setLoading] = useState(false)
  const [selectedType, setSelectedType] = useState('weight-loss')
  const [targetValue, setTargetValue] = useState('')
  const [startDate, setStartDate] = useState(getToday())
  const [endDate, setEndDate] = useState('')

  useEffect(() => { fetchGoals() }, [fetchGoals])

  const handleSubmit = async () => {
    if (!targetValue) return
    setLoading(true)
    try {
      await addGoal({
        type: selectedType,
        targetValue: parseFloat(targetValue),
        startDate,
        endDate: endDate || undefined,
      })
      setTargetValue('')
      setEndDate('')
      setShowForm(false)
    } catch (e) { console.error(e) } finally { setLoading(false) }
  }

  const goalType = GOAL_TYPES.find(g => g.id === selectedType)

  // Calculate current value based on goal type
  const getCurrentValue = (goalTypeStr: string): number | undefined => {
    if (goalTypeStr === 'weight-loss') {
      return bodyData[0]?.weight
    }
    if (goalTypeStr === 'body-fat') {
      return bodyData[0]?.bodyFatPercent
    }
    return undefined
  }

  return (
    <div className="animate-fade-in pt-6 pb-8">
      <div className="flex items-center justify-between mb-4">
        <h1 className="text-xl font-bold text-text-primary">目标追踪</h1>
        <button onClick={() => setShowForm(true)} className="px-4 py-2 bg-accent-primary hover:bg-indigo-500 rounded-lg text-sm font-medium transition-colors flex items-center gap-1.5">
          <Plus className="w-4 h-4" /> 设目标
        </button>
      </div>

      {goals.length === 0 ? (
        <DataCard>
          <div className="text-center py-12">
            <Target className="w-12 h-12 text-text-muted mx-auto mb-3 opacity-50" />
            <p className="text-text-muted text-sm">还没有设定目标</p>
            <p className="text-text-muted text-xs mt-1">设定目标，让每一次训练都有方向</p>
          </div>
        </DataCard>
      ) : (
        <div className="space-y-4">
          {goals.map(goal => {
            const gt = GOAL_TYPES.find(g => g.id === goal.type)
            const current = getCurrentValue(goal.type) ?? goal.currentValue ?? 0
            const progress = goal.targetValue > 0 ? Math.min((current / goal.targetValue) * 100, 100) : 0
            const isWeightLoss = goal.type === 'weight-loss'
            const progressPercent = isWeightLoss ? goal.targetValue > 0 ? Math.min(((goal.targetValue - current + 100) / 100) * 100, 100) : 0 : progress

            return (
              <DataCard key={goal.id} className="!p-4">
                <div className="flex items-start justify-between mb-3">
                  <div className="flex items-center gap-3">
                    <span className="text-2xl">{gt?.icon}</span>
                    <div>
                      <h3 className="text-sm font-semibold text-text-primary">{gt?.name}</h3>
                      <p className="text-xs text-text-muted">
                        {formatDate(goal.startDate)} {goal.endDate ? `~ ${formatDate(goal.endDate)}` : '至今'}
                      </p>
                    </div>
                  </div>
                  <span className="text-xs px-2 py-1 rounded-full bg-accent-primary/10 text-accent-primary font-medium">
                    {Math.round(progressPercent)}%
                  </span>
                </div>

                <div className="h-2.5 bg-bg-input rounded-full overflow-hidden mb-2">
                  <div
                    className="h-full bg-gradient-to-r from-accent-primary to-accent-secondary rounded-full transition-all duration-500"
                    style={{ width: `${progressPercent}%` }}
                  />
                </div>

                <div className="flex justify-between text-xs text-text-muted">
                  <span>当前: {current} {gt?.unit}</span>
                  <span>目标: {goal.targetValue} {gt?.unit}</span>
                </div>
              </DataCard>
            )
          })}
        </div>
      )}
    </div>
  )
}
