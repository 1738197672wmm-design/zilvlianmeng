import { create } from 'zustand'

interface User {
  id: string
  username: string
  email: string
  avatar?: string
  bio?: string
  joinDate: string
}

interface AuthState {
  user: User | null
  token: string | null
  loading: boolean
  error: string | null

  setUser: (user: User) => void
  setToken: (token: string) => void
  setLoading: (loading: boolean) => void
  setError: (error: string | null) => void
  clearAuth: () => void
}

export const useAuthStore = create<AuthState>((set) => ({
  user: null,
  token: localStorage.getItem('fit_token'),
  loading: false,
  error: null,

  setUser: (user) => set({ user }),
  setToken: (token) => {
    localStorage.setItem('fit_token', token)
    set({ token })
  },
  setLoading: (loading) => set({ loading }),
  setError: (error) => set({ error }),
  clearAuth: () => {
    localStorage.removeItem('fit_token')
    localStorage.removeItem('fit_user_id')
    localStorage.removeItem('fit_username')
    set({ user: null, token: null, error: null })
  },
}))
