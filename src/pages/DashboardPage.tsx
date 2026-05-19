import { useState, useEffect } from 'react'
import { useStore } from '@/store'
import { Habit } from '@/store'
import { getCurrentLevelProgress, getXPToNextLevel, getStreakStatus } from '@/lib/utils'
import { CheckCircle2, Circle, Flame, Zap, TrendingUp } from 'lucide-react'
import HeatmapCalendar from '@/components/HeatmapCalendar'

export default function DashboardPage() {
  const { user, habits, stats, completeHabit } = useStore()
  const [todayDate] = useState(new Date().toISOString().split('T')[0])
  const [todaysHabits, setTodaysHabits] = useState<Habit[]>([])
  const [completedToday, setCompletedToday] = useState(0)

  useEffect(() => {
    const completed = habits.filter((h) => h.completedDates.includes(todayDate)).length
    setCompletedToday(completed)
    setTodaysHabits(habits)
  }, [habits, todayDate])

  const consistencyScore = Math.round((completedToday / Math.max(habits.length, 1)) * 100)
  const levelProgress = getCurrentLevelProgress(stats.totalXP)
  const xpToNext = getXPToNextLevel(stats.totalXP)

  const handleCompleteHabit = (habitId: string) => {
    completeHabit(habitId, todayDate)
  }

  const allHabitsCompleted = completedToday === habits.length && habits.length > 0

  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <div className="space-y-2">
        <h1 className="text-4xl font-bold">Welcome back, {user.name}! 👋</h1>
        <p className="text-muted-foreground">Let's track your 1% daily growth</p>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Consistency Score */}
        <div className="glass p-6 rounded-xl">
          <p className="text-sm text-muted-foreground mb-4">Today's Consistency</p>
          <div className="relative w-24 h-24 mx-auto mb-4">
            <svg className="w-full h-full transform -rotate-90" viewBox="0 0 100 100">
              <circle
                cx="50"
                cy="50"
                r="45"
                fill="none"
                stroke="rgba(255,255,255,0.1)"
                strokeWidth="8"
              />
              <circle
                cx="50"
                cy="50"
                r="45"
                fill="none"
                stroke="url(#gradient)"
                strokeWidth="8"
                strokeDasharray={`${(consistencyScore / 100) * 282.7} 282.7`}
                strokeLinecap="round"
              />
              <defs>
                <linearGradient id="gradient" x1="0%" y1="0%" x2="100%" y2="100%">
                  <stop offset="0%" stopColor="#10b981" />
                  <stop offset="100%" stopColor="#14b8a6" />
                </linearGradient>
              </defs>
            </svg>
            <div className="absolute inset-0 flex items-center justify-center">
              <div className="text-center">
                <p className="text-2xl font-bold">{consistencyScore}%</p>
              </div>
            </div>
          </div>
          <p className="text-xs text-center text-muted-foreground">
            {completedToday}/{habits.length} habits
          </p>
        </div>

        {/* Current Streak */}
        <div className="glass p-6 rounded-xl">
          <p className="text-sm text-muted-foreground mb-4 flex items-center gap-2">
            <Flame className="w-4 h-4 text-orange-500" />
            Current Streak
          </p>
          <p className="text-4xl font-bold mb-2">{stats.currentStreak}</p>
          <div className="w-full bg-white/5 rounded-full h-2">
            <div
              className="bg-gradient-to-r from-orange-500 to-red-500 h-2 rounded-full"
              style={{
                width: `${Math.min((stats.currentStreak / (stats.longestStreak || 1)) * 100, 100)}%`,
              }}
            />
          </div>
          <p className="text-xs text-muted-foreground mt-2">Longest: {stats.longestStreak}</p>
        </div>

        {/* XP & Level */}
        <div className="glass p-6 rounded-xl">
          <p className="text-sm text-muted-foreground mb-4 flex items-center gap-2">
            <Zap className="w-4 h-4 text-yellow-400" />
            Level & XP
          </p>
          <p className="text-4xl font-bold mb-2">Lv {stats.currentLevel}</p>
          <div className="w-full bg-white/5 rounded-full h-2">
            <div
              className="bg-gradient-to-r from-yellow-400 to-emerald-400 h-2 rounded-full"
              style={{ width: `${levelProgress}%` }}
            />
          </div>
          <p className="text-xs text-muted-foreground mt-2">{xpToNext} XP to next level</p>
        </div>

        {/* Total XP */}
        <div className="glass p-6 rounded-xl">
          <p className="text-sm text-muted-foreground mb-4 flex items-center gap-2">
            <TrendingUp className="w-4 h-4 text-teal-400" />
            Total XP
          </p>
          <p className="text-4xl font-bold">{stats.totalXP}</p>
          <p className="text-xs text-muted-foreground mt-4">
            {stats.habitsCompleted} habits completed
          </p>
        </div>
      </div>

      {/* Heatmap */}
      <div className="glass p-6 rounded-xl">
        <h2 className="text-lg font-bold mb-4">Your Consistency Map</h2>
        <HeatmapCalendar habits={habits} />
      </div>

      {/* Today's Habits */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <h2 className="text-lg font-bold">Today's Habits</h2>
          {allHabitsCompleted && (
            <span className="badge-premium bg-emerald-500/20 text-emerald-400 border-emerald-500/30">
              ✨ All completed!
            </span>
          )}
        </div>

        {todaysHabits.length === 0 ? (
          <div className="glass p-8 rounded-xl text-center">
            <p className="text-muted-foreground mb-4">No habits yet. Add your first habit to get started!</p>
          </div>
        ) : (
          <div className="space-y-2">
            {todaysHabits.map((habit) => {
              const isCompleted = habit.completedDates.includes(todayDate)
              return (
                <button
                  key={habit.id}
                  onClick={() => !isCompleted && handleCompleteHabit(habit.id)}
                  disabled={isCompleted}
                  className="glass p-4 rounded-lg flex items-center gap-4 hover:bg-white/8 smooth-transition w-full text-left disabled:opacity-60"
                >
                  <div className="flex-shrink-0">
                    {isCompleted ? (
                      <CheckCircle2 className="w-6 h-6 text-emerald-400" />
                    ) : (
                      <Circle className="w-6 h-6 text-muted-foreground hover:text-emerald-400" />
                    )}
                  </div>
                  <div className="flex-1">
                    <p className={`font-semibold ${isCompleted ? 'text-muted-foreground line-through' : 'text-foreground'}`}>
                      {habit.title}
                    </p>
                    <p className="text-xs text-muted-foreground">{habit.category}</p>
                  </div>
                  <div className="flex-shrink-0">
                    <p className="text-sm font-semibold text-emerald-400">+50 XP</p>
                  </div>
                </button>
              )
            })}
          </div>
        )}
      </div>
    </div>
  )
}
