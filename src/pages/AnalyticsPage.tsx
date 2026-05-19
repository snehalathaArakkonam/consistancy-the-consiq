import { useState } from 'react'
import { useStore } from '@/store'
import { getDateRange } from '@/lib/utils'
import { TrendingUp, Calendar } from 'lucide-react'
import {
  BarChart,
  Bar,
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
} from 'recharts'

export default function AnalyticsPage() {
  const { habits, stats } = useStore()
  const [timeRange, setTimeRange] = useState<'week' | 'month'>('week')

  // Calculate weekly data
  const weekDays = getDateRange(7)
  const weekData = weekDays.map((date) => {
    const completed = habits.filter((h) => h.completedDates.includes(date)).length
    return {
      date: new Date(date).toLocaleDateString('en-US', { weekday: 'short' }),
      completed,
      total: habits.length,
      percentage: habits.length > 0 ? Math.round((completed / habits.length) * 100) : 0,
    }
  })

  // Calculate monthly data (last 30 days)
  const monthDays = getDateRange(30)
  const monthData = monthDays.map((date, idx) => {
    const completed = habits.filter((h) => h.completedDates.includes(date)).length
    const total = habits.length
    return {
      date: `Day ${idx + 1}`,
      completed,
      total,
      percentage: total > 0 ? Math.round((completed / total) * 100) : 0,
    }
  })

  const displayData = timeRange === 'week' ? weekData : monthData

  // Habit performance
  const habitPerformance = habits.map((habit) => ({
    name: habit.title,
    completion: Math.round((habit.completedDates.length / Math.max(Math.floor((Date.now() - new Date(habit.createdAt).getTime()) / 86400000), 1)) * 100),
    streak: habit.streak,
    longest: habit.longestStreak,
  }))

  // Category breakdown
  const categoryData = Array.from(
    habits.reduce((acc, habit) => {
      const count = acc.get(habit.category) || 0
      acc.set(habit.category, count + 1)
      return acc
    }, new Map())
  ).map(([category, count]) => ({
    name: category,
    value: count,
  }))

  const COLORS = [
    '#10b981',
    '#14b8a6',
    '#06b6d4',
    '#0ea5e9',
    '#3b82f6',
    '#8b5cf6',
    '#ec4899',
    '#f43f5e',
  ]

  // Summary insights
  const totalCompletions = habits.reduce((sum, h) => sum + h.completedDates.length, 0)
  const avgCompletionRate = habits.length > 0
    ? Math.round(
        (totalCompletions / (habits.length * Math.max(Math.floor((Date.now() - new Date(Math.min(...habits.map(h => new Date(h.createdAt).getTime())))) / 86400000), 1))) * 100
      )
    : 0

  return (
    <div className="p-6 space-y-8">
      <div>
        <h1 className="text-4xl font-bold mb-2 flex items-center gap-3">
          <TrendingUp className="w-8 h-8" />
          Analytics & Performance
        </h1>
        <p className="text-muted-foreground">Deep insights into your consistency journey</p>
      </div>

      {/* Summary Stats */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <div className="glass p-6 rounded-xl">
          <p className="text-sm text-muted-foreground mb-2">Total Completions</p>
          <p className="text-3xl font-bold text-emerald-400">{totalCompletions}</p>
          <p className="text-xs text-muted-foreground mt-2">Lifetime total</p>
        </div>
        <div className="glass p-6 rounded-xl">
          <p className="text-sm text-muted-foreground mb-2">Avg Completion</p>
          <p className="text-3xl font-bold text-blue-400">{avgCompletionRate}%</p>
          <p className="text-xs text-muted-foreground mt-2">All habits</p>
        </div>
        <div className="glass p-6 rounded-xl">
          <p className="text-sm text-muted-foreground mb-2">Active Habits</p>
          <p className="text-3xl font-bold text-purple-400">{habits.length}</p>
          <p className="text-xs text-muted-foreground mt-2">Being tracked</p>
        </div>
        <div className="glass p-6 rounded-xl">
          <p className="text-sm text-muted-foreground mb-2">Current XP</p>
          <p className="text-3xl font-bold text-yellow-400">{stats.totalXP}</p>
          <p className="text-xs text-muted-foreground mt-2">Level {stats.currentLevel}</p>
        </div>
      </div>

      {/* Time Range Selector */}
      <div className="flex gap-2">
        <button
          onClick={() => setTimeRange('week')}
          className={`px-4 py-2 rounded-lg font-semibold smooth-transition ${
            timeRange === 'week'
              ? 'bg-emerald-500/20 border border-emerald-500 text-emerald-400'
              : 'glass'
          }`}
        >
          <Calendar className="w-4 h-4 inline-block mr-2" />
          Weekly
        </button>
        <button
          onClick={() => setTimeRange('month')}
          className={`px-4 py-2 rounded-lg font-semibold smooth-transition ${
            timeRange === 'month'
              ? 'bg-emerald-500/20 border border-emerald-500 text-emerald-400'
              : 'glass'
          }`}
        >
          <Calendar className="w-4 h-4 inline-block mr-2" />
          Monthly
        </button>
      </div>

      {/* Completion Chart */}
      <div className="glass p-6 rounded-xl">
        <h2 className="font-bold mb-4">Completion Trend</h2>
        <ResponsiveContainer width="100%" height={300}>
          <BarChart data={displayData}>
            <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.1)" />
            <XAxis dataKey="date" stroke="rgba(255,255,255,0.3)" />
            <YAxis stroke="rgba(255,255,255,0.3)" />
            <Tooltip
              contentStyle={{
                backgroundColor: 'rgba(0,0,0,0.8)',
                border: '1px solid rgba(255,255,255,0.1)',
              }}
            />
            <Bar dataKey="percentage" fill="#10b981" name="Completion %" />
          </BarChart>
        </ResponsiveContainer>
      </div>

      {/* Category Breakdown */}
      {categoryData.length > 0 && (
        <div className="glass p-6 rounded-xl">
          <h2 className="font-bold mb-4">Habits by Category</h2>
          <ResponsiveContainer width="100%" height={300}>
            <PieChart>
              <Pie
                data={categoryData}
                cx="50%"
                cy="50%"
                labelLine={false}
                label={({ name, value }) => `${name}: ${value}`}
                outerRadius={100}
                fill="#8884d8"
                dataKey="value"
              >
                {categoryData.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                ))}
              </Pie>
              <Tooltip
                contentStyle={{
                  backgroundColor: 'rgba(0,0,0,0.8)',
                  border: '1px solid rgba(255,255,255,0.1)',
                }}
              />
            </PieChart>
          </ResponsiveContainer>
        </div>
      )}

      {/* Habit Performance */}
      {habitPerformance.length > 0 && (
        <div className="glass p-6 rounded-xl space-y-4">
          <h2 className="font-bold">Habit Performance</h2>
          <div className="space-y-3">
            {habitPerformance
              .sort((a, b) => b.completion - a.completion)
              .map((habit, idx) => (
                <div key={idx} className="space-y-1">
                  <div className="flex items-center justify-between text-sm">
                    <span className="font-medium">{habit.name}</span>
                    <span className="text-emerald-400 font-bold">{habit.completion}%</span>
                  </div>
                  <div className="w-full bg-white/5 rounded-full h-2">
                    <div
                      className="bg-gradient-to-r from-emerald-500 to-teal-500 h-2 rounded-full"
                      style={{ width: `${habit.completion}%` }}
                    />
                  </div>
                  <div className="flex gap-4 text-xs text-muted-foreground">
                    <span>Streak: {habit.streak} days</span>
                    <span>Best: {habit.longest} days</span>
                  </div>
                </div>
              ))}
          </div>
        </div>
      )}

      {/* Insights */}
      <div className="bg-gradient-to-r from-blue-500/10 to-emerald-500/10 border border-blue-500/20 rounded-xl p-6 space-y-3">
        <p className="font-bold text-blue-400">💡 Insights</p>
        <ul className="text-sm text-muted-foreground space-y-2 list-disc list-inside">
          <li>Your consistency score has improved by maintaining your habits</li>
          <li>
            {habits.length > 0
              ? `${habits.length} habits are being tracked with an average ${avgCompletionRate}% completion rate`
              : 'Add more habits to get personalized insights'}
          </li>
          <li>Keep your streaks alive! The longer your streak, the stronger your identity</li>
          <li>Each day of consistency compounds into remarkable long-term results</li>
        </ul>
      </div>
    </div>
  )
}
