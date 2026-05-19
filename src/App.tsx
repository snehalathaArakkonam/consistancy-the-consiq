import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom'
import { useStore } from './store'
import OnboardingPage from './pages/OnboardingPage'
import DashboardPage from './pages/DashboardPage'
import HabitsPage from './pages/HabitsPage'
import GamificationPage from './pages/GamificationPage'
import FocusPage from './pages/FocusPage'
import JournalPage from './pages/JournalPage'
import FutureSelfPage from './pages/FutureSelfPage'
import AnalyticsPage from './pages/AnalyticsPage'
import SettingsPage from './pages/SettingsPage'
import Sidebar from './components/layout/Sidebar'
import MobileNav from './components/layout/MobileNav'
import { useEffect } from 'react'

export default function App() {
  const { user, initializeStore } = useStore()

  useEffect(() => {
    initializeStore()
  }, [initializeStore])

  const hasCompletedOnboarding = user.id !== ''

  if (!hasCompletedOnboarding) {
    return <OnboardingPage />
  }

  return (
    <Router>
      <div className="flex h-screen bg-background overflow-hidden">
        {/* Sidebar */}
        <Sidebar />

        {/* Main Content */}
        <main className="flex-1 overflow-auto pb-20 md:pb-0">
          <Routes>
            <Route path="/dashboard" element={<DashboardPage />} />
            <Route path="/habits" element={<HabitsPage />} />
            <Route path="/gamification" element={<GamificationPage />} />
            <Route path="/focus" element={<FocusPage />} />
            <Route path="/journal" element={<JournalPage />} />
            <Route path="/future-self" element={<FutureSelfPage />} />
            <Route path="/analytics" element={<AnalyticsPage />} />
            <Route path="/settings" element={<SettingsPage />} />
            <Route path="/" element={<Navigate to="/dashboard" replace />} />
          </Routes>
        </main>

        {/* Mobile Navigation */}
        <MobileNav />
      </div>
    </Router>
  )
}
