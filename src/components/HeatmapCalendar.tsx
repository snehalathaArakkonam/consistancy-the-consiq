import { Habit } from '@/store'
import { getHeatmapData, getDayOfWeek } from '@/lib/utils'

interface HeatmapCalendarProps {
  habits: Habit[]
}

export default function HeatmapCalendar({ habits }: HeatmapCalendarProps) {
  // Combine all completed dates from all habits
  const allCompletedDates = new Set<string>()
  habits.forEach((habit) => {
    habit.completedDates.forEach((date) => {
      allCompletedDates.add(date)
    })
  })

  // Get last 12 weeks of data
  const weeks: { date: string; completed: boolean }[][] = []
  const today = new Date()

  for (let week = 0; week < 12; week++) {
    const weekDays: { date: string; completed: boolean }[] = []
    for (let day = 0; day < 7; day++) {
      const date = new Date(today)
      date.setDate(date.getDate() - (week * 7 + day))
      const dateStr = date.toISOString().split('T')[0]
      weekDays.unshift({
        date: dateStr,
        completed: allCompletedDates.has(dateStr),
      })
    }
    weeks.unshift(weekDays)
  }

  const getColorIntensity = (completed: boolean): string => {
    return completed
      ? 'bg-emerald-500/80 hover:bg-emerald-400'
      : 'bg-white/5 hover:bg-white/10'
  }

  return (
    <div className="space-y-4">
      <div className="overflow-x-auto pb-2">
        <div className="flex gap-1 min-w-fit">
          {weeks.map((week, weekIdx) => (
            <div key={weekIdx} className="flex flex-col gap-1">
              {week.map((day, dayIdx) => (
                <div
                  key={`${weekIdx}-${dayIdx}`}
                  className={`w-3 h-3 rounded-sm smooth-transition cursor-pointer border border-white/10 ${getColorIntensity(
                    day.completed
                  )}`}
                  title={`${day.date}: ${day.completed ? 'Completed' : 'No activity'}`}
                />
              ))}
            </div>
          ))}
        </div>
      </div>
      <div className="flex items-center gap-3 text-xs text-muted-foreground">
        <span>Less</span>
        <div className="flex gap-1">
          {[0, 25, 50, 75, 100].map((intensity) => (
            <div
              key={intensity}
              className={`w-3 h-3 rounded-sm border border-white/10 ${
                intensity === 0
                  ? 'bg-white/5'
                  : `opacity-${Math.round(intensity / 100 * 100)} bg-emerald-500`
              }`}
            />
          ))}
        </div>
        <span>More</span>
      </div>
    </div>
  )
}
