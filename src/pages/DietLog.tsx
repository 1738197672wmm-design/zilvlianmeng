import { useState, useEffect } from 'react'
import { Utensils, Plus, Search, Trash2 } from 'lucide-react'
import { DataCard } from '@/components/DataCard'
import { Modal } from '@/components/Modal'
import { useDataStore } from '@/stores/dataStore'
import { FOOD_PRESETS, MEAL_TYPES } from '@/utils/constants'
import { getToday, formatDate } from '@/utils/format'

export function DietLog() {
  const { diet, fetchDiet, addDiet } = useDataStore()
  const [showForm, setShowForm] = useState(false)
  const [loading, setLoading] = useState(false)
  const [date, setDate] = useState(getToday())
  const [mealType, setMealType] = useState('lunch')
  const [searchTerm, setSearchTerm] = useState('')
  const [showFoodPicker, setShowFoodPicker] = useState(false)
  const [isCustom, setIsCustom] = useState(false)
  const [foodName, setFoodName] = useState('')
  const [quantity, setQuantity] = useState('100')
  const [calories, setCalories] = useState('')
  const [protein, setProtein] = useState('')
  const [carbs, setCarbs] = useState('')
  const [fat, setFat] = useState('')

  useEffect(() => { fetchDiet() }, [fetchDiet])

  const filteredFoods = FOOD_PRESETS.filter(f =>
    f.name.toLowerCase().includes(searchTerm.toLowerCase())
  )

  const handleSelectFood = (food: typeof FOOD_PRESETS[0]) => {
    setFoodName(food.name)
    setCalories(String(Math.round(food.calories * (parseInt(quantity) || 100) / 100)))
    setProtein(String(Math.round(food.protein * (parseInt(quantity) || 100) / 100)))
    setCarbs(String(Math.round(food.carbs * (parseInt(quantity) || 100) / 100)))
    setFat(String(Math.round(food.fat * (parseInt(quantity) || 100) / 100)))
    setShowFoodPicker(false)
    setIsCustom(false)
  }

  const handleSubmit = async () => {
    if (!foodName.trim()) return
    setLoading(true)
    try {
      await addDiet({
        date,
        mealType,
        foodName: foodName.trim(),
        quantity: parseFloat(quantity) || 100,
        calories: calories ? parseFloat(calories) : undefined,
        proteinG: protein ? parseFloat(protein) : undefined,
        carbsG: carbs ? parseFloat(carbs) : undefined,
        fatG: fat ? parseFloat(fat) : undefined,
        isCustom,
      })
      setFoodName(''); setQuantity('100'); setCalories(''); setProtein(''); setCarbs(''); setFat(''); setIsCustom(false)
      setShowForm(false)
    } catch (e) { console.error(e) } finally { setLoading(false) }
  }

  // Group by date
  const grouped = diet.reduce<Record<string, typeof diet>>((acc, d) => {
    if (!acc[d.date]) acc[d.date] = []
    acc[d.date].push(d)
    return acc
  }, {})

  const dates = Object.keys(grouped).sort((a, b) => b.localeCompare(a))

  // Today's totals
  const todayDiet = diet.filter(d => d.date === getToday())
  const todayTotalCal = todayDiet.reduce((s, d) => s + (d.calories || 0), 0)
  const todayTotalProtein = todayDiet.reduce((s, d) => s + (d.proteinG || 0), 0)
  const todayTotalCarbs = todayDiet.reduce((s, d) => s + (d.carbsG || 0), 0)
  const todayTotalFat = todayDiet.reduce((s, d) => s + (d.fatG || 0), 0)

  return (
    <div className="animate-fade-in pt-6 pb-8">
      <div className="flex items-center justify-between mb-4">
        <h1 className="text-xl font-bold text-text-primary">饮食记录</h1>
        <button onClick={() => setShowForm(true)} className="px-4 py-2 bg-accent-primary hover:bg-indigo-500 rounded-lg text-sm font-medium transition-colors flex items-center gap-1.5">
          <Plus className="w-4 h-4" /> 记录
        </button>
      </div>

      {/* Today's Summary */}
      <DataCard title="今日概览" className="mb-4">
        <div className="grid grid-cols-4 gap-3 text-center">
          <div>
            <div className="text-lg font-bold text-accent-primary">{Math.round(todayTotalCal)}</div>
            <div className="text-xs text-text-muted">kcal</div>
          </div>
          <div>
            <div className="text-lg font-bold text-accent-secondary">{todayTotalProtein.toFixed(0)}g</div>
            <div className="text-xs text-text-muted">蛋白质</div>
          </div>
          <div>
            <div className="text-lg font-bold text-accent-warning">{todayTotalCarbs.toFixed(0)}g</div>
            <div className="text-xs text-text-muted">碳水</div>
          </div>
          <div>
            <div className="text-lg font-bold text-accent-danger">{todayTotalFat.toFixed(0)}g</div>
            <div className="text-xs text-text-muted">脂肪</div>
          </div>
        </div>
      </DataCard>

      {dates.length === 0 ? (
        <DataCard>
          <div className="text-center py-12">
            <Utensils className="w-12 h-12 text-text-muted mx-auto mb-3 opacity-50" />
            <p className="text-text-muted text-sm">还没有饮食记录</p>
          </div>
        </DataCard>
      ) : (
        <div className="space-y-3">
          {dates.map(dateStr => (
            <DataCard key={dateStr}>
              <div className="flex items-center gap-2 mb-2">
                <span className="text-xs font-medium text-text-secondary">{formatDate(dateStr)}</span>
                <span className="text-xs text-text-muted">· {grouped[dateStr].length} 餐</span>
              </div>
              <div className="space-y-1.5">
                {grouped[dateStr].map(d => {
                  const meal = MEAL_TYPES.find(m => m.id === d.mealType)
                  return (
                    <div key={d.id} className="flex items-center justify-between py-1.5 px-2 bg-bg-input rounded-lg">
                      <div className="flex items-center gap-2">
                        <span className="text-sm">{meal?.emoji}</span>
                        <div>
                          <p className="text-sm text-text-primary">{d.foodName}</p>
                          <p className="text-xs text-text-muted">{meal?.name} · {d.quantity}g</p>
                        </div>
                      </div>
                      <span className="text-sm text-text-secondary">{d.calories ? `${d.calories}kcal` : '-'}</span>
                    </div>
                  )
                })}
              </div>
            </DataCard>
          ))}
        </div>
      )}

      {/* Add Diet Modal */}
      <Modal open={showForm} onClose={() => setShowForm(false)} title="记录饮食" size="lg">
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-text-secondary mb-1.5">日期</label>
            <input type="date" value={date} onChange={e => setDate(e.target.value)} className="w-full px-3 py-2 bg-bg-input border border-border rounded-lg text-text-primary focus:outline-none focus:border-accent-primary/50" />
          </div>

          <div>
            <label className="block text-sm font-medium text-text-secondary mb-1.5">餐别</label>
            <div className="flex flex-wrap gap-2">
              {MEAL_TYPES.map(mt => (
                <button
                  key={mt.id}
                  onClick={() => setMealType(mt.id)}
                  className={`px-3 py-1.5 rounded-lg text-sm transition-all ${
                    mealType === mt.id ? 'bg-accent-primary text-white' : 'bg-bg-input text-text-muted hover:text-text-primary'
                  }`}
                >
                  {mt.emoji} {mt.name}
                </button>
              ))}
            </div>
          </div>

          {/* Food Picker */}
          <div>
            <label className="block text-sm font-medium text-text-secondary mb-1.5">食物</label>
            <div className="flex gap-2">
              <button
                onClick={() => setShowFoodPicker(!showFoodPicker)}
                className="flex-1 py-2.5 bg-bg-input border border-border rounded-lg text-sm text-text-primary hover:border-border-light transition-colors text-left px-3 flex items-center justify-between"
              >
                <span>{foodName || '搜索食物...'}</span>
                <Search className="w-4 h-4 text-text-muted" />
              </button>
              <label className="flex items-center gap-2 text-sm text-text-secondary cursor-pointer">
                <input type="checkbox" checked={isCustom} onChange={e => { setIsCustom(e.target.checked); if (e.target.checked) { setShowFoodPicker(false); setFoodName('') } }} />
                自定义
              </label>
            </div>

            {showFoodPicker && (
              <div className="mt-2 bg-bg-card border border-border rounded-lg overflow-hidden">
                <div className="p-2 border-b border-border">
                  <input
                    type="text"
                    placeholder="搜索食物..."
                    value={searchTerm}
                    onChange={e => setSearchTerm(e.target.value)}
                    className="w-full px-3 py-1.5 bg-bg-input border border-border rounded-lg text-sm text-text-primary placeholder-text-muted focus:outline-none focus:border-accent-primary/50"
                    autoFocus
                  />
                </div>
                <div className="max-h-48 overflow-y-auto">
                  {filteredFoods.map(food => (
                    <button
                      key={food.id}
                      onClick={() => handleSelectFood(food)}
                      className="w-full text-left px-3 py-2 text-sm text-text-secondary hover:text-text-primary hover:bg-bg-card-hover transition-colors flex items-center justify-between"
                    >
                      <span>{food.name}</span>
                      <span className="text-xs text-text-muted">{food.calories}kcal/{food.unit}</span>
                    </button>
                  ))}
                </div>
              </div>
            )}

            {isCustom && (
              <input
                type="text"
                placeholder="输入食物名称..."
                value={foodName}
                onChange={e => setFoodName(e.target.value)}
                className="w-full mt-2 px-3 py-2 bg-bg-input border border-border rounded-lg text-text-primary placeholder-text-muted focus:outline-none focus:border-accent-primary/50"
              />
            )}
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-sm font-medium text-text-secondary mb-1.5">份量 (g)</label>
              <input type="number" value={quantity} onChange={e => setQuantity(e.target.value)} className="w-full px-3 py-2 bg-bg-input border border-border rounded-lg text-text-primary placeholder-text-muted focus:outline-none focus:border-accent-primary/50" />
            </div>
            <div>
              <label className="block text-sm font-medium text-text-secondary mb-1.5">热量 (kcal)</label>
              <input type="number" value={calories} onChange={e => setCalories(e.target.value)} className="w-full px-3 py-2 bg-bg-input border border-border rounded-lg text-text-primary placeholder-text-muted focus:outline-none focus:border-accent-primary/50" />
            </div>
          </div>

          <div className="grid grid-cols-3 gap-3">
            <div>
              <label className="block text-xs font-medium text-text-secondary mb-1.5">蛋白质 (g)</label>
              <input type="number" value={protein} onChange={e => setProtein(e.target.value)} className="w-full px-3 py-2 bg-bg-input border border-border rounded-lg text-sm text-text-primary placeholder-text-muted focus:outline-none focus:border-accent-primary/50" />
            </div>
            <div>
              <label className="block text-xs font-medium text-text-secondary mb-1.5">碳水 (g)</label>
              <input type="number" value={carbs} onChange={e => setCarbs(e.target.value)} className="w-full px-3 py-2 bg-bg-input border border-border rounded-lg text-sm text-text-primary placeholder-text-muted focus:outline-none focus:border-accent-primary/50" />
            </div>
            <div>
              <label className="block text-xs font-medium text-text-secondary mb-1.5">脂肪 (g)</label>
              <input type="number" value={fat} onChange={e => setFat(e.target.value)} className="w-full px-3 py-2 bg-bg-input border border-border rounded-lg text-sm text-text-primary placeholder-text-muted focus:outline-none focus:border-accent-primary/50" />
            </div>
          </div>

          <button onClick={handleSubmit} disabled={loading || !foodName.trim()} className="w-full py-2.5 bg-accent-primary hover:bg-indigo-500 disabled:opacity-50 disabled:cursor-not-allowed rounded-lg font-medium text-white transition-colors">
            {loading ? '保存中...' : '保存饮食记录'}
          </button>
        </div>
      </Modal>
    </div>
  )
}
