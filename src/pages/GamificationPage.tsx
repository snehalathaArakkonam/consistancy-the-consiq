import { useStore } from '@/store'
import { Award, Star, Zap, Heart, Trophy } from 'lucide-react'

const BADGE_TEMPLATES = [
  {
    id: 'first-habit',
    name: 'New Starter',
    description: 'Create your first habit',
    icon: '🌱',
    rarity: 'common',
  },
  {
    id: 'week-streak',
    name: 'Week Warrior',
    description: 'Maintain a 7-day streak',
    icon: '🔥',
    rarity: 'rare',
  },
  {
    id: 'month-streak',
    name: 'Monthly Master',
    description: 'Reach a 30-day streak',
    icon: '👑',
    rarity: 'epic',
  },
  {
    id: 'century',
    name: 'Century',
    description: 'Reach 100-day streak',
    icon: '💯',
    rarity: 'legendary',
  },
  {
    id: 'xp-100',
    name: 'Rising Star',
    description: 'Earn 500 XP',
    icon: '⭐',
    rarity: 'rare',
  },
  {
    id: 'level-5',
    name: 'Achiever',
    description: 'Reach Level 5',
    icon: '🚀',
    rarity: 'epic',
  },
  {
    id: 'perfect-day',
    name: 'Perfect Day',
    description: 'Complete all habits in a day',
    icon: '✨',
    rarity: 'epic',
  },
  {
    id: 'five-habits',
    name: 'Habit Master',
    description: 'Create 5 habits',
    icon: '🎯',
    rarity: 'rare',
  },
]

const LEVELS = Array.from({ length: 50 }, (_, i) => ({
  level: i + 1,
  requiredXP: i * 500,
  title: ['Seedling', 'Sprout', 'Sapling', 'Tree', 'Oak'][i % 5],
}))

export default function GamificationPage() {
  const { stats, habits } = useStore()

  const unlockedBadgeIds = new Set(stats.badges.map((b) => b.id))

  const getProgress = (badgeId: string): number => {
    switch (badgeId) {
      case 'first-habit':
        return habits.length > 0 ? 100 : 0
      case 'week-streak':
        return Math.min(Math.round((stats.currentStreak / 7) * 100), 100)
      case 'month-streak':
        return Math.min(Math.round((stats.currentStreak / 30) * 100), 100)
      case 'century':
        return Math.min(Math.round((stats.currentStreak / 100) * 100), 100)
      case 'xp-100':
        return Math.min(Math.round((stats.totalXP / 500) * 100), 100)
      case 'level-5':
        return Math.min(Math.round((stats.currentLevel / 5) * 100), 100)
      case 'five-habits':
        return Math.min(Math.round((habits.length / 5) * 100), 100)
      default:
        return 0
    }
  }

  const getRarityColor = (rarity: string): string => {
    const colors: Record<string, string> = {
      common: 'from-gray-500 to-gray-600',
      rare: 'from-blue-500 to-blue-600',
      epic: 'from-purple-500 to-purple-600',
      legendary: 'from-yellow-500 to-yellow-600',
    }
    return colors[rarity] || colors.common
  }

  const getRarityTextColor = (rarity: string): string => {
    const colors: Record<string, string> = {
      common: 'text-gray-400',
      rare: 'text-blue-400',
      epic: 'text-purple-400',
      legendary: 'text-yellow-400',
    }
    return colors[rarity] || colors.common
  }

  return (
    <div className="p-6 space-y-8">
      <div>
        <h1 className="text-4xl font-bold mb-2">Gamification</h1>
        <p className="text-muted-foreground">Track your achievements and level up your consistency</p>
      </div>

      {/* Level Progress */}
      <div className="glass p-8 rounded-xl">
        <div className="flex items-center justify-between mb-6">
          <div>
            <p className="text-sm text-muted-foreground mb-2">Current Level</p>
            <p className="text-5xl font-bold gradient-text">{stats.currentLevel}</p>
          </div>
          <div className="text-right">
            <p className="text-sm text-muted-foreground mb-2">Total XP</p>
            <p className="text-4xl font-bold text-yellow-400">{stats.totalXP}</p>
          </div>
        </div>

        {/* XP Progress Bar */}
        <div className="space-y-2">
          <div className="flex items-center justify-between text-xs text-muted-foreground">
            <span>Level Progress</span>
            <span>
              {stats.totalXP % 500} / 500 XP
            </span>
          </div>
          <div className="w-full bg-white/5 rounded-full h-4 overflow-hidden border border-white/10">
            <div
              className="bg-gradient-to-r from-emerald-500 to-teal-500 h-full smooth-transition"
              style={{ width: `${(stats.totalXP % 500) / 5}%` }}
            />
          </div>
        </div>
      </div>

      {/* Stats Overview */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <div className="glass p-4 rounded-lg text-center">
          <Trophy className="w-6 h-6 text-yellow-400 mx-auto mb-2" />
          <p className="text-2xl font-bold">{stats.badges.length}</p>
          <p className="text-xs text-muted-foreground">Badges Earned</p>
        </div>
        <div className="glass p-4 rounded-lg text-center">
          <Zap className="w-6 h-6 text-blue-400 mx-auto mb-2" />
          <p className="text-2xl font-bold">{stats.currentStreak}</p>
          <p className="text-xs text-muted-foreground">Current Streak</p>
        </div>
        <div className="glass p-4 rounded-lg text-center">
          <Heart className="w-6 h-6 text-red-400 mx-auto mb-2" />
          <p className="text-2xl font-bold">{stats.longestStreak}</p>
          <p className="text-xs text-muted-foreground">Longest Streak</p>
        </div>
        <div className="glass p-4 rounded-lg text-center">
          <Star className="w-6 h-6 text-emerald-400 mx-auto mb-2" />
          <p className="text-2xl font-bold">{stats.habitsCompleted}</p>
          <p className="text-xs text-muted-foreground">Habits Completed</p>
        </div>
      </div>

      {/* Badges Section */}
      <div className="space-y-4">
        <h2 className="text-2xl font-bold flex items-center gap-2">
          <Award className="w-6 h-6" />
          Achievements
        </h2>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {BADGE_TEMPLATES.map((badge) => {
            const isUnlocked = unlockedBadgeIds.has(badge.id)
            const progress = getProgress(badge.id)

            return (
              <div
                key={badge.id}
                className={`glass p-6 rounded-lg transition-all ${
                  isUnlocked ? 'border-emerald-500/50' : 'border-white/10'
                }`}
              >
                <div className="flex items-start justify-between mb-3">
                  <div className="text-4xl">{badge.icon}</div>
                  {isUnlocked && (
                    <span className="badge-premium bg-emerald-500/20 text-emerald-400 border-emerald-500/30">
                      Unlocked ✓
                    </span>
                  )}
                </div>

                <h3 className="font-bold mb-1">{badge.name}</h3>
                <p className="text-xs text-muted-foreground mb-3">{badge.description}</p>

                <div className="flex items-center gap-2 mb-2">
                  <span className={`text-xs font-semibold ${getRarityTextColor(badge.rarity)}`}>
                    {badge.rarity.toUpperCase()}
                  </span>
                </div>

                {!isUnlocked && (
                  <div className="w-full bg-white/5 rounded-full h-2 overflow-hidden">
                    <div
                      className={`bg-gradient-to-r ${getRarityColor(badge.rarity)} h-full`}
                      style={{ width: `${progress}%` }}
                    />
                  </div>
                )}
              </div>
            )
          })}
        </div>
      </div>

      {/* Level Roadmap */}
      <div className="space-y-4">
        <h2 className="text-2xl font-bold">Level Roadmap</h2>
        <div className="glass p-6 rounded-lg">
          <div className="grid grid-cols-2 md:grid-cols-5 lg:grid-cols-10 gap-2">
            {LEVELS.slice(0, 20).map((level) => (
              <div
                key={level.level}
                className={`flex flex-col items-center justify-center p-3 rounded-lg border smooth-transition ${
                  level.level <= stats.currentLevel
                    ? 'bg-emerald-500/20 border-emerald-500/50 text-emerald-400'
                    : 'bg-white/5 border-white/10 text-muted-foreground'
                }`}
              >
                <p className="font-bold text-sm">{level.level}</p>
                <p className="text-xs">{level.title}</p>
              </div>
            ))}
          </div>
          <p className="text-xs text-muted-foreground mt-4">
            Each level requires 500 XP. Keep building your habits to level up!
          </p>
        </div>
      </div>
    </div>
  )
}
