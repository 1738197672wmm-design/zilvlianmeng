import { useEffect } from 'react'
import { useNavigate } from 'react-router'
import { Scale, Dumbbell, HeartPulse, Utensils, Flame, TrendingUp } from 'lucide-react'
import { DataCard } from '@/components/DataCard'
import { CalendarHeatmap } from '@/components/Calendar'
import { SimpleChart } from '@/components/Chart'
import { useDataStore } from '@/stores/dataStore'
import { formatDateFull, getToday } from '@/utils/format'
import { WORKOUT_CATEGORIES } from '@/utils/constants'

export function Dashboard() {
  const navigate = useNavigate()
  const { bodyData, workouts, cardio, diet, goals, fetchAll, loading } = useDataStore()

  useEffect(() => {
    fetchAll()
  }, [fetchAll])

  // Today's stats
  const today = getToday()
  const todayWorkouts = workouts.filter(w => w.date === today)
  const todayCardio = cardio.filter(c => c.date === today)
  const todayDiet = diet.filter(d => d.date === today)

  const todayCaloriesBurned = todayWorkouts.reduce((sum, w) => sum + (parseFloat(w.notes || '') || 0), 0) + todayCardio.reduce((sum, c) => sum + (c.caloriesBurned || 0), 0)
  const todayMeals = todayDiet.length
  const todayProtein = todayDiet.reduce((sum, d) => sum + (d.proteinG || 0), 0)
  const todayCalories = todayDiet.reduce((sum, d) => sum + (d.calories || 0), 0)

  // Weight trend (last 30 entries)
  const weightTrend = bodyData.slice(0, 30).reverse().map(b => ({
    label: b.date.slice(5),
    value: b.weight || 0,
  }))

  // Streak calculation
  let streak = 0
  const d = new Date()
  while (true) {
    const dateStr = formatDateFull(d)
    const hasWorkout = workouts.some(w => w.date === dateStr)
    const hasCardio = cardio.some(c => c.date === dateStr)
    if (hasWorkout || hasCardio) {
      streak++
      d.setDate(d.getDate() - 1)
    } else {
      break
    }
  }

  // Latest body data
  const latestBody = bodyData[0]

  return (
    <div className="animate-fade-in">
      {/* Header */}
      <div className="flex items-center justify-between pt-6 pb-4">
        <div>
          <h1 className="text-xl font-bold text-text-primary">早安，加油 💪</h1>
          <p className="text-sm text-text-muted mt-0.5">{today} · 记录你的每一步进步</p>
        </div>
        <button
          onClick={() => navigate('/workout')}
          className="px-4 py-2 bg-accent-primary hover:bg-indigo-500 rounded-lg text-sm font-medium transition-colors"
        >
          + 记录
        </button>
      </div>

      {loading ? (
        <div className="flex items-center justify-center py-20">
          <div className="w-6 h-6 border-2 border-accent-primary border-t-transparent rounded-full animate-spin" />
        </div>
      ) : (
        <div className="space-y-4">
          {/* Stats Grid */}
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
            <DataCard className="!p-3" onClick={() => navigate('/body')}>
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-lg bg-blue-500/10 flex items-center justify-center">
                  <Scale className="w-5 h-5 text-blue-400" />
                </div>
                <div>
                  <p className="text-xs text-text-muted">体重</p>
                  <p className="text-lg font-bold">
                    {latestBody?.weight ? `${latestBody.weight}` : '-'}<span className="text-xs text-text-muted font-normal">kg</span>
                  </p>
                </div>
              </div>
            </DataCard>

            <DataCard className="!p-3" onClick={() => navigate('/workout')}>
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-lg bg-accent-primary/10 flex items-center justify-center">
                  <Dumbbell className="w-5 h-5 text-accent-primary" />
                </div>
                <div>
                  <p className="text-xs text-text-muted">今日训练</p>
                  <p className="text-lg font-bold">{todayWorkouts.length}<span className="text-xs text-text-muted font-normal"> 组</span></p>
                </div>
              </div>
            </DataCard>

            <DataCard className="!p-3" onClick={() => navigate('/cardio')}>
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-lg bg-accent-danger/10 flex items-center justify-center">
                  <Flame className="w-5 h-5 text-accent-danger" />
                </div>
                <div>
                  <p className="text-xs text-text-muted">消耗</p>
                  <p className="text-lg font-bold">{todayCaloriesBurned || '-'}<span className="text-xs text-text-muted font-normal">kcal</span></p>
                </div>
              </div>
            </DataCard>

            <DataCard className="!p-3" onClick={() => navigate('/diet')}>
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-lg bg-accent-success/10 flex items-center justify-center">
                  <Utensils className="w-5 h-5 text-accent-success" />
                </div>
                <div>
                  <p className="text-xs text-text-muted">今日饮食</p>
                  <p className="text-lg font-bold">{todayMeals}<span className="text-xs text-text-muted font-normal"> 餐</span></p>
                </div>
              </div>
            </DataCard>
          </div>

          {/* Streak & Chart Row */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
            {/* Training Streak */}
            <DataCard title="连续打卡" subtitle="训练 streak" className="lg:col-span-1">
              <div className="flex items-center gap-4">
                <div className="text-center">
                  <div className="text-4xl font-bold text-gradient">{streak}</div>
                  <div className="text-xs text-text-muted mt-1">天</div>
                </div>
                <div className="flex-1 space-y-2">
                  {goals.slice(0, 2).map(g => (
                    <div key={g.id}>
                      <div className="flex justify-between text-xs">
                        <span className="text-text-secondary">{g.type === 'weight-loss' ? '减重目标' : g.type === 'muscle-gain' ? '增肌目标' : g.type}</span>
                        <span className="text-text-muted">{g.currentValue ?? 0}/{g.targetValue}</span>
                      </div>
                      <div className="h-1.5 bg-bg-input rounded-full overflow-hidden">
                        <div
                          className="h-full bg-accent-primary rounded-full transition-all"
                          style={{ width: `${Math.min(((g.currentValue || 0) / g.targetValue) * 100, 100)}%` }}
                        />
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </DataCard>

            {/* Weight Trend */}
            <DataCard
              title="体重趋势"
              subtitle="最近30天"
              icon={<TrendingUp className="w-4 h-4 text-accent-primary" />}
              className="lg:col-span-2"
            >
              <SimpleChart
                data={weightTrend}
                height={140}
                color="#6366f1"
              />
            </DataCard>
          </div>

          {/* 90-Day Heatmap */}
          <DataCard title="训练热力图" subtitle="过去90天">
            <CalendarHeatmap data={workouts.map(w => ({ date: w.date, count: 1 }))} type="workout" />
          </DataCard>

          {/* Today's Macros */}
          {todayMeals > 0 && (
            <DataCard title="今日饮食概览" subtitle={`${todayCalories.toFixed(0)} kcal 摄入`}>
              <div className="grid grid-cols-3 gap-4">
                <div className="text-center">
                  <div className="text-xl font-bold text-accent-primary">{todayProtein.toFixed(0)}g</div>
                  <div className="text-xs text-text-muted mt-0.5">蛋白质</div>
                </div>
                <div className="text-center">
                  <div className="text-xl font-bold text-accent-secondary">-</div>
                  <div className="text-xs text-text-muted mt-0.5">碳水</div>
                </div>
                <div className="text-center">
                  <div className="text-xl font-bold text-accent-warning">-</div>
                  <div className="text-xs text-text-muted mt-0.5">脂肪</div>
                </div>
              </div>
              {/* Macro bar */}
              <div className="mt-3 h-2 bg-bg-input rounded-full overflow-hidden flex">
                <div className="bg-accent-primary transition-all" style={{ width: `${todayCalories > 0 ? (todayProtein * 4 / todayCalories) * 100 : 0}%` }} />
                <div className="bg-accent-secondary transition-all" style={{ width: `${todayCalories > 0 ? 35 : 0}%` }} />
                <div className="bg-accent-warning transition-all" style={{ width: `${todayCalories > 0 ? 35 : 0}%` }} />
              </div>
            </DataCard>
          )}
        </div>
      )}
    </div>
  )
}
