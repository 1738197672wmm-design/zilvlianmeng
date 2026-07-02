import { useEffect } from 'react'
import { useNavigate } from 'react-router'
import { Scale, Dumbbell, HeartPulse, Utensils, Flame, TrendingUp, ArrowUpRight, ArrowDownRight } from 'lucide-react'
import { DataCard } from '@/components/DataCard'
import { CalendarHeatmap } from '@/components/Calendar'
import { SimpleChart } from '@/components/Chart'
import { useDataStore } from '@/stores/dataStore'
import { formatDateFull, getToday } from '@/utils/format'

export function Dashboard() {
  const navigate = useNavigate()
  const { bodyData, workouts, cardio, diet, goals, fetchAll, loading } = useDataStore()

  useEffect(() => { fetchAll() }, [fetchAll])

  const today = getToday()
  const todayWorkouts = workouts.filter(w => w.date === today)
  const todayCardio = cardio.filter(c => c.date === today)
  const todayDiet = diet.filter(d => d.date === today)

  const todayCaloriesBurned = todayWorkouts.reduce((sum, w) => sum + (parseFloat(w.notes || '') || 0), 0) + todayCardio.reduce((sum, c) => sum + (c.caloriesBurned || 0), 0)
  const todayMeals = todayDiet.length
  const todayProtein = todayDiet.reduce((sum, d) => sum + (d.proteinG || 0), 0)
  const todayCalories = todayDiet.reduce((sum, d) => sum + (d.calories || 0), 0)

  const weightTrend = bodyData.slice(0, 30).reverse().map(b => ({
    label: b.date.slice(5),
    value: b.weight || 0,
  }))

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

  const latestBody = bodyData[0]
  const prevBody = bodyData[1]
  const weightChange = latestBody && prevBody ? (latestBody.weight || 0) - (prevBody.weight || 0) : 0

  return (
    <div className="animate-fade-in">
      {/* Hero Header */}
      <div className="flex items-end justify-between mb-8">
        <div>
          <p className="text-xs text-text-gray font-mono uppercase tracking-widest mb-1">{today}</p>
          <h1 className="text-3xl font-black text-white tracking-tight">
            今日<span className="text-accent-red">训练</span>
          </h1>
        </div>
        <button
          onClick={() => navigate('/workout')}
          className="px-5 py-2.5 bg-accent-red hover:bg-red-600 rounded-lg text-sm font-bold text-white transition-colors shadow-lg shadow-accent-red/20"
        >
          + 记录
        </button>
      </div>

      {loading ? (
        <div className="flex items-center justify-center py-20">
          <div className="w-6 h-6 border-2 border-accent-red border-t-transparent rounded-full animate-spin" />
        </div>
      ) : (
        <div className="space-y-4">
          {/* Top Stats — 4 cards in a row */}
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
            <div onClick={() => navigate('/body')} className="rounded-xl border border-border-steel bg-bg-card p-4 cursor-pointer transition-all hover:border-accent-blue/40 hover:bg-bg-carbon group">
              <div className="flex items-center justify-between mb-3">
                <div className="w-9 h-9 rounded-lg bg-accent-blue/10 flex items-center justify-center">
                  <Scale className="w-4 h-4 text-accent-blue" />
                </div>
                {weightChange !== 0 && (
                  <span className={`text-xs font-bold flex items-center gap-0.5 ${weightChange > 0 ? 'text-accent-red' : 'text-accent-green'}`}>
                    {weightChange > 0 ? <ArrowUpRight className="w-3 h-3" /> : <ArrowDownRight className="w-3 h-3" />}
                    {Math.abs(weightChange).toFixed(1)}
                  </span>
                )}
              </div>
              <p className="text-[11px] text-text-gray font-mono uppercase tracking-wider">体重</p>
              <p className="text-2xl font-black text-white mt-0.5">
                {latestBody?.weight || '-'}
                <span className="text-sm text-text-gray font-medium ml-1">kg</span>
              </p>
            </div>

            <div onClick={() => navigate('/workout')} className="rounded-xl border border-border-steel bg-bg-card p-4 cursor-pointer transition-all hover:border-accent-red/40 hover:bg-bg-carbon group">
              <div className="flex items-center justify-between mb-3">
                <div className="w-9 h-9 rounded-lg bg-accent-red/10 flex items-center justify-center">
                  <Dumbbell className="w-4 h-4 text-accent-red" />
                </div>
              </div>
              <p className="text-[11px] text-text-gray font-mono uppercase tracking-wider">今日训练</p>
              <p className="text-2xl font-black text-white mt-0.5">
                {todayWorkouts.length}
                <span className="text-sm text-text-gray font-medium ml-1">组</span>
              </p>
            </div>

            <div onClick={() => navigate('/cardio')} className="rounded-xl border border-border-steel bg-bg-card p-4 cursor-pointer transition-all hover:border-accent-orange/40 hover:bg-bg-carbon group">
              <div className="flex items-center justify-between mb-3">
                <div className="w-9 h-9 rounded-lg bg-accent-orange/10 flex items-center justify-center">
                  <Flame className="w-4 h-4 text-accent-orange" />
                </div>
              </div>
              <p className="text-[11px] text-text-gray font-mono uppercase tracking-wider">消耗</p>
              <p className="text-2xl font-black text-white mt-0.5">
                {todayCaloriesBurned || '-'}
                <span className="text-sm text-text-gray font-medium ml-1">kcal</span>
              </p>
            </div>

            <div onClick={() => navigate('/diet')} className="rounded-xl border border-border-steel bg-bg-card p-4 cursor-pointer transition-all hover:border-accent-green/40 hover:bg-bg-carbon group">
              <div className="flex items-center justify-between mb-3">
                <div className="w-9 h-9 rounded-lg bg-accent-green/10 flex items-center justify-center">
                  <Utensils className="w-4 h-4 text-accent-green" />
                </div>
              </div>
              <p className="text-[11px] text-text-gray font-mono uppercase tracking-wider">饮食</p>
              <p className="text-2xl font-black text-white mt-0.5">
                {todayMeals}
                <span className="text-sm text-text-gray font-medium ml-1">餐</span>
              </p>
            </div>
          </div>

          {/* Main Row: Streak + Chart */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
            {/* Streak Card */}
            <DataCard accent="red" className="lg:col-span-1 !border-accent-red/30">
              <div className="flex items-center gap-5">
                <div className="relative">
                  <div className="w-20 h-20 rounded-full border-4 border-accent-red flex items-center justify-center neon-glow" style={{ animation: 'pulse-glow 2s infinite' }}>
                    <span className="text-3xl font-black text-accent-red text-neon">{streak}</span>
                  </div>
                </div>
                <div className="flex-1">
                  <p className="text-sm font-bold text-white">连续打卡</p>
                  <p className="text-xs text-text-gray font-mono mt-0.5">{streak} 天 · 保持节奏</p>
                  {goals.length > 0 && (
                    <div className="mt-3 space-y-2">
                      {goals.slice(0, 1).map(g => (
                        <div key={g.id}>
                          <div className="flex justify-between text-[11px]">
                            <span className="text-text-gray">{g.type === 'weight-loss' ? '减重' : g.type === 'muscle-gain' ? '增肌' : g.type}</span>
                            <span className="text-text-dim font-mono">{g.currentValue ?? 0}/{g.targetValue}</span>
                          </div>
                          <div className="h-1 bg-bg-input rounded-full overflow-hidden mt-1">
                            <div
                              className="h-full bg-accent-red rounded-full transition-all duration-500"
                              style={{ width: `${Math.min(((g.currentValue || 0) / g.targetValue) * 100, 100)}%` }}
                            />
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              </div>
            </DataCard>

            {/* Weight Chart */}
            <DataCard
              title="体重趋势"
              subtitle="LAST 30 RECORDS"
              accent="blue"
              icon={<TrendingUp className="w-4 h-4 text-accent-blue" />}
              className="lg:col-span-2"
            >
              <SimpleChart
                data={weightTrend}
                height={140}
                color="#0a84ff"
              />
            </DataCard>
          </div>

          {/* Heatmap */}
          <DataCard title="训练热力图" subtitle="PAST 90 DAYS">
            <CalendarHeatmap data={workouts.map(w => ({ date: w.date, count: 1 }))} type="workout" />
          </DataCard>

          {/* Diet Overview */}
          {todayMeals > 0 && (
            <DataCard title="今日饮食" subtitle={`${todayCalories.toFixed(0)} KCAL TOTAL`}>
              <div className="grid grid-cols-3 gap-4">
                <div className="text-center">
                  <div className="text-xl font-black text-accent-green">{todayProtein.toFixed(0)}g</div>
                  <div className="text-[11px] text-text-gray font-mono mt-0.5">PROTEIN</div>
                </div>
                <div className="text-center">
                  <div className="text-xl font-black text-accent-orange">-</div>
                  <div className="text-[11px] text-text-gray font-mono mt-0.5">CARBS</div>
                </div>
                <div className="text-center">
                  <div className="text-xl font-black text-accent-red">-</div>
                  <div className="text-[11px] text-text-gray font-mono mt-0.5">FAT</div>
                </div>
              </div>
              <div className="mt-3 h-1.5 bg-bg-input rounded-full overflow-hidden flex">
                <div className="bg-accent-green transition-all" style={{ width: `${todayCalories > 0 ? (todayProtein * 4 / todayCalories) * 100 : 0}%` }} />
                <div className="bg-accent-orange transition-all" style={{ width: `${todayCalories > 0 ? 35 : 0}%` }} />
                <div className="bg-accent-red transition-all" style={{ width: `${todayCalories > 0 ? 35 : 0}%` }} />
              </div>
            </DataCard>
          )}
        </div>
      )}
    </div>
  )
}
