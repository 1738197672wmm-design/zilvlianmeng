import { create } from 'zustand'
import { api } from '@/utils/api'

export interface BodyRecord {
  id: string
  userId: string
  date: string
  weight?: number
  bodyFatPercent?: number
  muscleMass?: number
  notes?: string
  createdAt: string
}

export interface WorkoutRecord {
  id: string
  userId: string
  date: string
  type: string
  exerciseName: string
  sets?: number
  reps?: number
  weightKg?: number
  notes?: string
  isCustom?: boolean
  createdAt: string
}

export interface CardioRecord {
  id: string
  userId: string
  date: string
  type: string
  durationMinutes: number
  distanceKm?: number
  caloriesBurned?: number
  notes?: string
  createdAt: string
}

export interface DietRecord {
  id: string
  userId: string
  date: string
  mealType: string
  foodName: string
  quantity: number
  calories?: number
  proteinG?: number
  carbsG?: number
  fatG?: number
  isCustom?: boolean
  createdAt: string
}

export interface Goal {
  id: string
  userId: string
  type: string
  targetValue: number
  currentValue?: number
  startDate: string
  endDate?: string
  createdAt: string
}

export interface FeedActivity {
  id: string
  userId: string
  username: string
  avatar?: string
  type: string
  dataRef: string
  data: any
  createdAt: string
  likes: number
  liked?: boolean
}

interface DataState {
  bodyData: BodyRecord[]
  workouts: WorkoutRecord[]
  cardio: CardioRecord[]
  diet: DietRecord[]
  goals: Goal[]
  feed: FeedActivity[]
  loading: boolean
  error: string | null

  fetchAll: () => Promise<void>
  fetchBodyData: () => Promise<void>
  fetchWorkouts: () => Promise<void>
  fetchCardio: () => Promise<void>
  fetchDiet: () => Promise<void>
  fetchGoals: () => Promise<void>
  fetchFeed: () => Promise<void>
  addBodyData: (data: Omit<BodyRecord, 'id' | 'userId' | 'createdAt'>) => Promise<BodyRecord>
  addWorkout: (data: Omit<WorkoutRecord, 'id' | 'userId' | 'createdAt'>) => Promise<WorkoutRecord>
  addCardio: (data: Omit<CardioRecord, 'id' | 'userId' | 'createdAt'>) => Promise<CardioRecord>
  addDiet: (data: Omit<DietRecord, 'id' | 'userId' | 'createdAt'>) => Promise<DietRecord>
  addGoal: (data: Omit<Goal, 'id' | 'userId' | 'createdAt'>) => Promise<Goal>
  setLoading: (loading: boolean) => void
  setError: (error: string | null) => void
  clearError: () => void
}

export const useDataStore = create<DataState>((set, get) => ({
  bodyData: [],
  workouts: [],
  cardio: [],
  diet: [],
  goals: [],
  feed: [],
  loading: false,
  error: null,

  setLoading: (loading) => set({ loading }),
  setError: (error) => set({ error }),
  clearError: () => set({ error: null }),

  fetchBodyData: async () => {
    try {
      set({ loading: true, error: null })
      const data: BodyRecord[] = await api.getBodyData(90)
      set({ bodyData: data, loading: false })
    } catch (e: any) {
      set({ error: e.message, loading: false })
    }
  },

  fetchWorkouts: async () => {
    try {
      set({ loading: true, error: null })
      const data: WorkoutRecord[] = await api.getWorkouts(90)
      set({ workouts: data, loading: false })
    } catch (e: any) {
      set({ error: e.message, loading: false })
    }
  },

  fetchCardio: async () => {
    try {
      set({ loading: true, error: null })
      const data: CardioRecord[] = await api.getCardio(90)
      set({ cardio: data, loading: false })
    } catch (e: any) {
      set({ error: e.message, loading: false })
    }
  },

  fetchDiet: async () => {
    try {
      set({ loading: true, error: null })
      const data: DietRecord[] = await api.getDiet(90)
      set({ diet: data, loading: false })
    } catch (e: any) {
      set({ error: e.message, loading: false })
    }
  },

  fetchGoals: async () => {
    try {
      set({ loading: true, error: null })
      const data: Goal[] = await api.getGoals()
      set({ goals: data, loading: false })
    } catch (e: any) {
      set({ error: e.message, loading: false })
    }
  },

  fetchFeed: async () => {
    try {
      set({ loading: true, error: null })
      const data: FeedActivity[] = await api.getFeed()
      set({ feed: data, loading: false })
    } catch (e: any) {
      set({ error: e.message, loading: false })
    }
  },

  fetchAll: async () => {
    const { fetchBodyData, fetchWorkouts, fetchCardio, fetchDiet, fetchGoals, fetchFeed } = get()
    await Promise.all([fetchBodyData(), fetchWorkouts(), fetchCardio(), fetchDiet(), fetchGoals(), fetchFeed()])
  },

  addBodyData: async (data) => {
    const result = await api.addBodyData(data)
    set((state) => ({ bodyData: [result, ...state.bodyData] }))
    return result
  },

  addWorkout: async (data) => {
    const result = await api.addWorkout(data)
    set((state) => ({ workouts: [result, ...state.workouts] }))
    return result
  },

  addCardio: async (data) => {
    const result = await api.addCardio(data)
    set((state) => ({ cardio: [result, ...state.cardio] }))
    return result
  },

  addDiet: async (data) => {
    const result = await api.addDiet(data)
    set((state) => ({ diet: [result, ...state.diet] }))
    return result
  },

  addGoal: async (data) => {
    const result = await api.addGoal(data)
    set((state) => ({ goals: [...state.goals, result] }))
    return result
  },
}))
