import { create } from 'zustand'
import { persist } from 'zustand/middleware'

export interface User {
  id: string
  name: string
  gender: 'male' | 'female' | 'other'
  age: number
  categories: string[]
  goals: string[]
  joinDate: string
}

export interface Habit {
  id: string
  title: string
  description: string
  category: string
  identity: string // "I am a..."
  cue: string
  craving: string
  response: string
  reward: string
  dailyTarget: number
  twoMinuteRule: boolean
  completedDates: string[]
  streak: number
  longestStreak: number
  createdAt: string
}

export interface DailyCompletion {
  habitId: string
  date: string
  completed: boolean
  xpGained: number
}

export interface Badge {
  id: string
  name: string
  description: string
  icon: string
  unlockedAt: string
  rarity: 'common' | 'rare' | 'epic' | 'legendary'
}

export interface UserStats {
  totalXP: number
  currentLevel: number
  currentStreak: number
  longestStreak: number
  consistencyScore: number
  habitsCompleted: number
  habitsMissed: number
  totalHabits: number
  lastActiveDate: string
  badges: Badge[]
}

interface Store {
  user: User
  habits: Habit[]
  stats: UserStats
  dailyCompletions: DailyCompletion[]
  
  // Onboarding
  completeOnboarding: (data: Partial<User>) => void
  
  // Habits
  addHabit: (habit: Omit<Habit, 'id' | 'streak' | 'longestStreak' | 'completedDates' | 'createdAt'>) => void
  updateHabit: (id: string, updates: Partial<Habit>) => void
  deleteHabit: (id: string) => void
  completeHabit: (habitId: string, date: string) => void
  
  // Stats
  updateStats: (updates: Partial<UserStats>) => void
  addXP: (amount: number) => void
  resetDailyStreaks: () => void
  unlockBadge: (badge: Badge) => void
  
  // Utils
  initializeStore: () => void
  getConsistencyScore: () => number
  getDailyCompletionRate: () => number
  exportData: () => object
  importData: (data: object) => void
}

const INITIAL_USER: User = {
  id: '',
  name: '',
  gender: 'other',
  age: 0,
  categories: [],
  goals: [],
  joinDate: new Date().toISOString(),
}

const INITIAL_STATS: UserStats = {
  totalXP: 0,
  currentLevel: 1,
  currentStreak: 0,
  longestStreak: 0,
  consistencyScore: 0,
  habitsCompleted: 0,
  habitsMissed: 0,
  totalHabits: 0,
  lastActiveDate: new Date().toISOString().split('T')[0],
  badges: [],
}

export const useStore = create<Store>()(
  persist(
    (set, get) => ({
      user: INITIAL_USER,
      habits: [],
      stats: INITIAL_STATS,
      dailyCompletions: [],

      completeOnboarding: (data) => {
        set((state) => ({
          user: {
            ...state.user,
            ...data,
            id: `user_${Date.now()}`,
            joinDate: new Date().toISOString(),
          },
        }))
      },

      addHabit: (habitData) => {
        const newHabit: Habit = {
          ...habitData,
          id: `habit_${Date.now()}`,
          streak: 0,
          longestStreak: 0,
          completedDates: [],
          createdAt: new Date().toISOString(),
        }
        set((state) => ({
          habits: [...state.habits, newHabit],
          stats: {
            ...state.stats,
            totalHabits: state.stats.totalHabits + 1,
          },
        }))
      },

      updateHabit: (id, updates) => {
        set((state) => ({
          habits: state.habits.map((h) =>
            h.id === id ? { ...h, ...updates } : h
          ),
        }))
      },

      deleteHabit: (id) => {
        set((state) => ({
          habits: state.habits.filter((h) => h.id !== id),
          stats: {
            ...state.stats,
            totalHabits: Math.max(0, state.stats.totalHabits - 1),
          },
        }))
      },

      completeHabit: (habitId, date) => {
        const state = get()
        const habit = state.habits.find((h) => h.id === habitId)
        if (!habit) return

        const alreadyCompleted = habit.completedDates.includes(date)
        if (alreadyCompleted) return

        const xpGained = 50
        set((state) => ({
          habits: state.habits.map((h) =>
            h.id === habitId
              ? {
                  ...h,
                  completedDates: [...h.completedDates, date],
                  streak: h.streak + 1,
                  longestStreak: Math.max(h.longestStreak, h.streak + 1),
                }
              : h
          ),
          stats: {
            ...state.stats,
            totalXP: state.stats.totalXP + xpGained,
            habitsCompleted: state.stats.habitsCompleted + 1,
            lastActiveDate: date,
          },
        }))

        // Check for level up
        const newStats = get().stats
        const newLevel = Math.floor(newStats.totalXP / 500) + 1
        if (newLevel > state.stats.currentLevel) {
          get().updateStats({ currentLevel: newLevel })
        }
      },

      updateStats: (updates) => {
        set((state) => ({
          stats: {
            ...state.stats,
            ...updates,
          },
        }))
      },

      addXP: (amount) => {
        const state = get()
        const newTotalXP = state.stats.totalXP + amount
        const newLevel = Math.floor(newTotalXP / 500) + 1
        
        set((state) => ({
          stats: {
            ...state.stats,
            totalXP: newTotalXP,
            currentLevel: newLevel,
          },
        }))
      },

      resetDailyStreaks: () => {
        const today = new Date().toISOString().split('T')[0]
        const yesterday = new Date(Date.now() - 86400000).toISOString().split('T')[0]

        set((state) => ({
          habits: state.habits.map((habit) => {
            const lastCompleted = habit.completedDates[habit.completedDates.length - 1]
            if (lastCompleted !== today && lastCompleted !== yesterday) {
              return { ...habit, streak: 0 }
            }
            return habit
          }),
        }))
      },

      unlockBadge: (badge) => {
        set((state) => ({
          stats: {
            ...state.stats,
            badges: [...state.stats.badges, badge],
          },
        }))
      },

      initializeStore: () => {
        const state = get()
        if (state.user.id) {
          state.resetDailyStreaks()
          
          // Update consistency score
          const completionRate = state.getDailyCompletionRate()
          state.updateStats({ consistencyScore: Math.round(completionRate) })
        }
      },

      getConsistencyScore: () => {
        const state = get()
        if (state.habits.length === 0) return 0
        
        const today = new Date().toISOString().split('T')[0]
        const completedToday = state.habits.filter((h) =>
          h.completedDates.includes(today)
        ).length

        return Math.round((completedToday / state.habits.length) * 100)
      },

      getDailyCompletionRate: () => {
        const state = get()
        if (state.habits.length === 0) return 0
        
        const last30Days = 30
        let totalPossible = 0
        let totalCompleted = 0

        for (let i = 0; i < last30Days; i++) {
          const date = new Date(Date.now() - i * 86400000)
            .toISOString()
            .split('T')[0]
          totalPossible += state.habits.length
          totalCompleted += state.habits.filter((h) =>
            h.completedDates.includes(date)
          ).length
        }

        return (totalCompleted / Math.max(totalPossible, 1)) * 100
      },

      exportData: () => {
        const state = get()
        return {
          user: state.user,
          habits: state.habits,
          stats: state.stats,
          dailyCompletions: state.dailyCompletions,
          exportDate: new Date().toISOString(),
        }
      },

      importData: (data: any) => {
        if (data.user && data.habits && data.stats) {
          set({
            user: data.user,
            habits: data.habits,
            stats: data.stats,
            dailyCompletions: data.dailyCompletions || [],
          })
        }
      },
    }),
    {
      name: 'consiq-store',
      version: 1,
    }
  )
)
