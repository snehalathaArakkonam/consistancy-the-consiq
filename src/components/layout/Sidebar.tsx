import { Link, useLocation } from 'react-router-dom'
import { cn } from '@/lib/utils'
import {
  LayoutDashboard,
  Target,
  Award,
  Flame,
  BookOpen,
  Zap,
  TrendingUp,
  Settings,
  LogOut,
  Sparkles,
} from 'lucide-react'
import { useStore } from '@/store'

const menuItems = [
  { icon: LayoutDashboard, label: 'Dashboard', path: '/dashboard' },
  { icon: Target, label: 'Habits', path: '/habits' },
  { icon: Award, label: 'Gamification', path: '/gamification' },
  { icon: Flame, label: 'Deep Focus', path: '/focus' },
  { icon: BookOpen, label: 'Journal', path: '/journal' },
  { icon: Zap, label: 'Future Self', path: '/future-self' },
  { icon: TrendingUp, label: 'Analytics', path: '/analytics' },
  { icon: Settings, label: 'Settings', path: '/settings' },
]

export default function Sidebar() {
  const location = useLocation()
  const { user, stats } = useStore()

  const handleLogout = () => {
    localStorage.clear()
    window.location.reload()
  }

  return (
    <aside className="hidden md:flex flex-col w-64 bg-gradient-to-b from-card/80 to-background/50 border-r border-white/5 glass">
      {/* Logo Section */}
      <div className="p-6 border-b border-white/5">
        <div className="flex items-center gap-3 mb-4">
          <div className="w-10 h-10 rounded-lg bg-gradient-to-r from-emerald-500 to-teal-500 flex items-center justify-center">
            <Sparkles className="w-6 h-6 text-white" />
          </div>
          <div>
            <h1 className="font-bold text-lg gradient-text">CONSIQ</h1>
            <p className="text-xs text-muted-foreground">1% Daily</p>
          </div>
        </div>
        <div className="bg-white/5 rounded-lg p-3 border border-white/10">
          <p className="text-xs text-muted-foreground">Level</p>
          <p className="text-2xl font-bold text-emerald-400">{stats.currentLevel}</p>
        </div>
      </div>

      {/* User Info */}
      <div className="px-6 py-4 border-b border-white/5">
        <p className="text-sm font-semibold text-foreground">{user.name}</p>
        <p className="text-xs text-muted-foreground">{stats.currentStreak}🔥 Current Streak</p>
      </div>

      {/* Menu Items */}
      <nav className="flex-1 px-4 py-6 space-y-2 overflow-y-auto">
        {menuItems.map((item) => {
          const Icon = item.icon
          const isActive = location.pathname === item.path
          return (
            <Link
              key={item.path}
              to={item.path}
              className={cn(
                'flex items-center gap-3 px-4 py-3 rounded-lg smooth-transition',
                isActive
                  ? 'bg-gradient-to-r from-emerald-500/20 to-teal-500/20 text-emerald-400 border border-emerald-500/30'
                  : 'text-muted-foreground hover:text-foreground hover:bg-white/5'
              )}
            >
              <Icon className="w-5 h-5 flex-shrink-0" />
              <span className="text-sm font-medium">{item.label}</span>
            </Link>
          )
        })}
      </nav>

      {/* Footer */}
      <div className="px-4 py-6 border-t border-white/5 space-y-3">
        <div className="bg-white/5 rounded-lg p-4 border border-white/10 text-center">
          <p className="text-xs text-muted-foreground mb-2">XP Points</p>
          <p className="text-xl font-bold text-emerald-400">{stats.totalXP}</p>
        </div>
        <button
          onClick={handleLogout}
          className="w-full flex items-center justify-center gap-2 px-4 py-2 rounded-lg bg-red-500/10 border border-red-500/20 text-red-400 hover:bg-red-500/20 smooth-transition text-sm font-medium"
        >
          <LogOut className="w-4 h-4" />
          Logout
        </button>
      </div>
    </aside>
  )
}
