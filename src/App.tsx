import { BrowserRouter, Routes, Route, Navigate } from 'react-router'
import { Layout } from './components/Layout'
import { Login } from './pages/Login'
import { Register } from './pages/Register'
import { Dashboard } from './pages/Dashboard'
import { BodyData } from './pages/BodyData'
import { WorkoutLog } from './pages/WorkoutLog'
import { CardioLog } from './pages/CardioLog'
import { DietLog } from './pages/DietLog'
import { Goals } from './pages/Goals'
import { Feed } from './pages/Feed'
import { SettingsPage } from './pages/Settings'
import { useAuthStore } from './stores/authStore'

function PrivateRoute({ children }: { children: React.ReactNode }) {
  const token = useAuthStore(s => s.token)
  if (!token) return <Navigate to="/login" replace />
  return <>{children}</>
}

function PublicRoute({ children }: { children: React.ReactNode }) {
  const token = useAuthStore(s => s.token)
  if (token) return <Navigate to="/" replace />
  return <>{children}</>
}

function App() {
  return (
    <BrowserRouter>
      <Routes>
        {/* Auth routes */}
        <Route path="/login" element={
          <PublicRoute>
            <Login />
          </PublicRoute>
        } />
        <Route path="/register" element={
          <PublicRoute>
            <Register />
          </PublicRoute>
        } />

        {/* Protected routes */}
        <Route path="/" element={
          <PrivateRoute>
            <Layout />
          </PrivateRoute>
        }>
          <Route index element={<Dashboard />} />
          <Route path="body" element={<BodyData />} />
          <Route path="workout" element={<WorkoutLog />} />
          <Route path="cardio" element={<CardioLog />} />
          <Route path="diet" element={<DietLog />} />
          <Route path="goals" element={<Goals />} />
          <Route path="feed" element={<Feed />} />
          <Route path="settings" element={<SettingsPage />} />
        </Route>

        {/* Fallback */}
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </BrowserRouter>
  )
}

export default App
