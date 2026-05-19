import { type ClassValue, clsx } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export function getDateRange(days: number): string[] {
  const dates: string[] = []
  for (let i = days - 1; i >= 0; i--) {
    const date = new Date()
    date.setDate(date.getDate() - i)
    dates.push(date.toISOString().split('T')[0])
  }
  return dates
}

export function getStreakStatus(
  completedDates: string[],
  currentDate: string = new Date().toISOString().split('T')[0]
): { streak: number; broken: boolean } {
  let streak = 0
  let broken = false

  const dateSet = new Set(completedDates)
  let checkDate = new Date(currentDate)

  while (dateSet.has(checkDate.toISOString().split('T')[0])) {
    streak++
    checkDate.setDate(checkDate.getDate() - 1)
  }

  const yesterday = new Date()
  yesterday.setDate(yesterday.getDate() - 1)
  const yesterdayStr = yesterday.toISOString().split('T')[0]

  if (!dateSet.has(yesterdayStr) && !dateSet.has(currentDate)) {
    broken = true
  }

  return { streak, broken }
}

export function calculateLevel(xp: number): number {
  return Math.floor(xp / 500) + 1
}

export function getXPForLevel(level: number): number {
  return (level - 1) * 500
}

export function getXPToNextLevel(currentXP: number): number {
  const currentLevel = calculateLevel(currentXP)
  const nextLevelXP = getXPForLevel(currentLevel + 1)
  return Math.max(0, nextLevelXP - currentXP)
}

export function getCurrentLevelProgress(currentXP: number): number {
  const currentLevel = calculateLevel(currentXP)
  const currentLevelXP = getXPForLevel(currentLevel)
  const nextLevelXP = getXPForLevel(currentLevel + 1)
  return Math.round(((currentXP - currentLevelXP) / (nextLevelXP - currentLevelXP)) * 100)
}

export function formatDate(date: string | Date): string {
  const d = typeof date === 'string' ? new Date(date) : date
  return d.toLocaleDateString('en-US', {
    month: 'short',
    day: 'numeric',
    year: 'numeric',
  })
}

export function getDayOfWeek(date: string): string {
  const d = new Date(date)
  return ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'][d.getDay()]
}

export function getHeatmapData(
  completedDates: string[],
  days: number = 365
): { date: string; count: number }[] {
  const dateMap = new Map<string, number>()
  const dateSet = new Set(completedDates)

  const dates = getDateRange(days)
  dates.forEach((date) => {
    dateMap.set(date, dateSet.has(date) ? 1 : 0)
  })

  return Array.from(dateMap.entries()).map(([date, count]) => ({
    date,
    count,
  }))
}

export function getRarityColor(rarity: string): string {
  const colors: Record<string, string> = {
    common: '#6b7280',
    rare: '#3b82f6',
    epic: '#a855f7',
    legendary: '#fbbf24',
  }
  return colors[rarity] || colors.common
}

export function projectedLevel(
  currentLevel: number,
  currentXP: number,
  daysAhead: number,
  avgDailyXP: number = 50
): number {
  const projectedXP = currentXP + daysAhead * avgDailyXP
  return calculateLevel(projectedXP)
}

export function calculateCompoundGrowth(
  startValue: number,
  rate: number,
  days: number
): number {
  return startValue * Math.pow(1 + rate, days)
}

export function formatCompactNumber(num: number): string {
  if (num >= 1000000) {
    return (num / 1000000).toFixed(1) + 'M'
  }
  if (num >= 1000) {
    return (num / 1000).toFixed(1) + 'K'
  }
  return num.toString()
}

export const CATEGORIES = [
  'Student',
  'Developer',
  'Entrepreneur',
  'Content Creator',
  'YouTuber',
  'Athlete/Gym',
  'Freelancer',
  'UPSC Aspirant',
  'Writer',
  'Artist',
  'Designer',
  'Marketer',
]

export const GOAL_TEMPLATES = [
  'Build a consistent morning routine',
  'Exercise daily',
  'Read for 30 minutes',
  'Meditate daily',
  'Learn a new skill',
  'Write/Journal daily',
  'Improve productivity',
  'Build healthy habits',
  'Achieve fitness goals',
  'Master a craft',
]
