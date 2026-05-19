import { Link, useLocation } from 'react-router-dom'
import { cn } from '@/lib/utils'
import {
  LayoutDashboard,
  Target,
  Award,
  Settings,
} from 'lucide-react'

const mobileMenuItems = [
  { icon: LayoutDashboard, label: 'Dashboard', path: '/dashboard' },
  { icon: Target, label: 'Habits', path: '/habits' },
  { icon: Award, label: 'Gamification', path: '/gamification' },
  { icon: Settings, label: 'Settings', path: '/settings' },
]

export default function MobileNav() {
  const location = useLocation()

  return (
    <nav className="md:hidden fixed bottom-0 left-0 right-0 bg-gradient-to-t from-card/95 to-card/80 border-t border-white/10 glass">
      <div className="flex justify-around items-center h-20">
        {mobileMenuItems.map((item) => {
          const Icon = item.icon
          const isActive = location.pathname === item.path
          return (
            <Link
              key={item.path}
              to={item.path}
              className={cn(
                'flex flex-col items-center justify-center w-16 h-16 smooth-transition relative',
                isActive ? 'text-emerald-400' : 'text-muted-foreground'
              )}
            >
              {isActive && (
                <div className="absolute -top-2 left-1/2 -translate-x-1/2 w-1 h-1 rounded-full bg-emerald-400" />
              )}
              <Icon className="w-6 h-6" />
              <span className="text-xs mt-1">{item.label}</span>
            </Link>
          )
        })}
      </div>
    </nav>
  )
}
