import { Outlet, useLocation, useNavigate } from 'react-router'
import { Sidebar } from './Sidebar'
import { BottomNav } from './BottomNav'

export function Layout() {
  return (
    <div className="min-h-screen bg-bg-primary">
      <div className="flex">
        {/* Desktop Sidebar */}
        <aside className="hidden lg:block lg:fixed lg:inset-y-0 lg:w-64 lg:z-50">
          <Sidebar />
        </aside>

        {/* Main content */}
        <main className="lg:ml-64 min-h-screen">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-24 lg:pb-8">
            <Outlet />
          </div>
        </main>
      </div>

      {/* Mobile Bottom Nav */}
      <div className="lg:hidden fixed bottom-0 left-0 right-0 z-50">
        <BottomNav />
      </div>
    </div>
  )
}
