import { useState } from 'react'
import { useStore } from '@/store'
import { projectedLevel, calculateCompoundGrowth } from '@/lib/utils'
import { Zap, TrendingUp, Award, Sparkles } from 'lucide-react'
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from 'recharts'

export default function FutureSelfPage() {
  const { user, stats, habits } = useStore()
  const [daysAhead, setDaysAhead] = useState(365)

  // Calculate projections
  const avgDailyXP = 50 * Math.min(habits.length, 10) // Scale with number of habits
  const projectedXP = stats.totalXP + daysAhead * avgDailyXP
  const projectedLvl = projectedLevel(stats.currentLevel, stats.totalXP, daysAhead, avgDailyXP)

  // Compound growth calculation (1% daily improvement)
  const compoundValue = calculateCompoundGrowth(stats.consistencyScore, 0.01, daysAhead)

  // Generate chart data
  const chartData = Array.from({ length: Math.min(daysAhead, 365) }, (_, i) => {
    const currentDay = i
    const xp = stats.totalXP + currentDay * avgDailyXP
    const level = Math.floor(xp / 500) + 1
    const consistency = calculateCompoundGrowth(stats.consistencyScore, 0.01, currentDay)
    return {
      day: currentDay,
      xp,
      level,
      consistency: Math.min(consistency, 100),
    }
  })

  // Calculate badges by day 365
  const projectedBadges = Math.min(stats.badges.length + Math.floor(daysAhead / 60), 8)

  const futureIdentity = user.categories[0]
    ? `Master ${user.categories[0]} with unwavering consistency`
    : 'A person of unshakeable consistency'

  return (
    <div className="p-6 space-y-8">
      <div>
        <h1 className="text-4xl font-bold mb-2 flex items-center gap-3">
          <Sparkles className="w-8 h-8 text-yellow-400" />
          Future Self Visualization
        </h1>
        <p className="text-muted-foreground">See your potential with consistent daily growth</p>
      </div>

      {/* Time Slider */}
      <div className="glass p-6 rounded-xl space-y-4">
        <div className="flex items-center justify-between">
          <label className="text-sm font-semibold">Project ahead</label>
          <span className="badge-premium bg-emerald-500/20 text-emerald-400 border-emerald-500/30">
            {daysAhead} days
          </span>
        </div>
        <input
          type="range"
          min="30"
          max="365"
          step="30"
          value={daysAhead}
          onChange={(e) => setDaysAhead(parseInt(e.target.value))}
          className="w-full"
        />
        <div className="flex justify-between text-xs text-muted-foreground">
          <span>1 Month</span>
          <span>3 Months</span>
          <span>6 Months</span>
          <span>1 Year</span>
        </div>
      </div>

      {/* Projection Stats */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="glass p-6 rounded-xl">
          <div className="flex items-center justify-between mb-2">
            <p className="text-sm text-muted-foreground">Projected Level</p>
            <Zap className="w-4 h-4 text-yellow-400" />
          </div>
          <p className="text-4xl font-bold gradient-text">{projectedLvl}</p>
          <p className="text-xs text-muted-foreground mt-2">
            +{projectedLvl - stats.currentLevel} levels
          </p>
        </div>

        <div className="glass p-6 rounded-xl">
          <div className="flex items-center justify-between mb-2">
            <p className="text-sm text-muted-foreground">Projected XP</p>
            <TrendingUp className="w-4 h-4 text-blue-400" />
          </div>
          <p className="text-4xl font-bold text-blue-400">{projectedXP.toLocaleString()}</p>
          <p className="text-xs text-muted-foreground mt-2">
            +{(projectedXP - stats.totalXP).toLocaleString()} XP
          </p>
        </div>

        <div className="glass p-6 rounded-xl">
          <div className="flex items-center justify-between mb-2">
            <p className="text-sm text-muted-foreground">Consistency Growth</p>
            <TrendingUp className="w-4 h-4 text-emerald-400" />
          </div>
          <p className="text-4xl font-bold text-emerald-400">
            {compoundValue.toFixed(0)}%
          </p>
          <p className="text-xs text-muted-foreground mt-2">
            1% daily compounding
          </p>
        </div>

        <div className="glass p-6 rounded-xl">
          <div className="flex items-center justify-between mb-2">
            <p className="text-sm text-muted-foreground">Projected Badges</p>
            <Award className="w-4 h-4 text-yellow-500" />
          </div>
          <p className="text-4xl font-bold text-yellow-400">{projectedBadges}</p>
          <p className="text-xs text-muted-foreground mt-2">
            +{projectedBadges - stats.badges.length} badges
          </p>
        </div>
      </div>

      {/* Growth Chart */}
      <div className="glass p-6 rounded-xl">
        <h2 className="font-bold mb-4">Growth Trajectory</h2>
        <ResponsiveContainer width="100%" height={300}>
          <LineChart data={chartData}>
            <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.1)" />
            <XAxis
              dataKey="day"
              label={{ value: 'Days', position: 'insideBottomRight', offset: -5 }}
              stroke="rgba(255,255,255,0.3)"
            />
            <YAxis stroke="rgba(255,255,255,0.3)" />
            <Tooltip
              contentStyle={{
                backgroundColor: 'rgba(0,0,0,0.8)',
                border: '1px solid rgba(255,255,255,0.1)',
              }}
            />
            <Line
              type="monotone"
              dataKey="consistency"
              stroke="#10b981"
              strokeWidth={2}
              dot={false}
              name="Consistency %"
            />
          </LineChart>
        </ResponsiveContainer>
      </div>

      {/* Level Progression */}
      <div className="glass p-6 rounded-xl">
        <h2 className="font-bold mb-4">Level Progression</h2>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
          {[0, 90, 180, 365].map((day) => {
            const data = chartData[Math.min(day, chartData.length - 1)]
            if (!data) return null
            return (
              <div key={day} className="bg-white/5 rounded-lg p-4 border border-white/10 text-center">
                <p className="text-sm text-muted-foreground mb-2">Day {day}</p>
                <p className="text-3xl font-bold text-emerald-400">{data.level}</p>
                <p className="text-xs text-muted-foreground mt-1">{data.xp} XP</p>
              </div>
            )
          })}
        </div>
      </div>

      {/* Future Self Description */}
      <div className="glass p-8 rounded-xl space-y-4">
        <h2 className="text-2xl font-bold">Your Future Self in {daysAhead} Days</h2>
        <div className="space-y-4">
          <div>
            <p className="text-sm text-muted-foreground mb-2">Identity</p>
            <p className="text-lg font-semibold text-emerald-400">"I am {futureIdentity}"</p>
          </div>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
            <div className="bg-white/5 p-3 rounded border border-white/10">
              <p className="text-2xl font-bold">{projectedLvl}</p>
              <p className="text-xs text-muted-foreground">Level</p>
            </div>
            <div className="bg-white/5 p-3 rounded border border-white/10">
              <p className="text-2xl font-bold text-emerald-400">{Math.min(daysAhead, 365)}</p>
              <p className="text-xs text-muted-foreground">Streak Possible</p>
            </div>
            <div className="bg-white/5 p-3 rounded border border-white/10">
              <p className="text-2xl font-bold text-yellow-400">{projectedBadges}</p>
              <p className="text-xs text-muted-foreground">Achievements</p>
            </div>
            <div className="bg-white/5 p-3 rounded border border-white/10">
              <p className="text-2xl font-bold text-teal-400">{compoundValue.toFixed(0)}%</p>
              <p className="text-xs text-muted-foreground">Consistency</p>
            </div>
          </div>
          <p className="text-sm text-muted-foreground leading-relaxed">
            Through daily consistency and the power of compounding, you'll have transformed your life.
            Every single day of commitment compounds into extraordinary results. Your future self will
            thank you for the habits you build today.
          </p>
        </div>
      </div>

      {/* Motivational Message */}
      <div className="bg-gradient-to-r from-emerald-500/10 to-teal-500/10 border border-emerald-500/20 rounded-xl p-6 space-y-3">
        <p className="font-bold text-emerald-400">🎯 Remember</p>
        <p className="text-sm text-foreground leading-relaxed">
          The person you'll become in {daysAhead} days isn't determined by a single day's actions—it's
          determined by the accumulated effect of small, consistent choices. Every time you complete a
          habit, you're voting for the person you want to become.
        </p>
      </div>
    </div>
  )
}
