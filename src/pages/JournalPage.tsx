import { useState } from 'react'
import { useStore } from '@/store'
import { BookOpen, Send } from 'lucide-react'
import { format } from 'date-fns'

interface JournalEntry {
  id: string
  date: string
  reflection: string
  aiSummary: string
  mood: string
  createdAt: string
}

const REFLECTION_PROMPTS = [
  'What was the biggest win today in your consistency journey?',
  'Which habit was the most challenging today and why?',
  'How did your 1% improvement compound today?',
  'What did you learn about yourself through your habits today?',
  'How did staying consistent make you feel?',
  'What triggered your best habit execution today?',
  'How can you make tomorrow even better?',
  'What would your future self say about today?',
]

export default function JournalPage() {
  const { user, stats } = useStore()
  const [entries, setEntries] = useState<JournalEntry[]>(() => {
    const saved = localStorage.getItem('journal-entries')
    return saved ? JSON.parse(saved) : []
  })
  const [reflection, setReflection] = useState('')
  const [mood, setMood] = useState('neutral')
  const [selectedPrompt, setSelectedPrompt] = useState(REFLECTION_PROMPTS[0])

  const today = new Date().toISOString().split('T')[0]
  const todayEntry = entries.find((e) => e.date === today)

  const handleSubmit = () => {
    if (reflection.trim()) {
      const newEntry: JournalEntry = {
        id: `entry_${Date.now()}`,
        date: today,
        reflection,
        aiSummary: generateAISummary(reflection),
        mood,
        createdAt: new Date().toISOString(),
      }

      const updated = entries.filter((e) => e.date !== today)
      updated.push(newEntry)
      setEntries(updated)
      localStorage.setItem('journal-entries', JSON.stringify(updated))
      setReflection('')
    }
  }

  const generateAISummary = (text: string): string => {
    // Simple local "AI" summary based on keywords
    const keywords = {
      positive: ['great', 'amazing', 'excellent', 'proud', 'achieved', 'won', 'success'],
      challenging: ['difficult', 'struggle', 'hard', 'failed', 'missed', 'challenge'],
      learning: ['learn', 'understand', 'realized', 'discovered', 'insight', 'lesson'],
    }

    let summary = 'Today was a day of '
    const lower = text.toLowerCase()

    if (keywords.positive.some((k) => lower.includes(k))) {
      summary += 'positive momentum and achievement. '
    } else if (keywords.challenging.some((k) => lower.includes(k))) {
      summary += 'growth through challenges. '
    } else {
      summary += 'consistency and persistence. '
    }

    if (keywords.learning.some((k) => lower.includes(k))) {
      summary += 'Key insights were gained and applied. '
    }

    summary += `Your ${mood} mood reflects your journey well. Keep building!`

    return summary
  }

  const moods = [
    { emoji: '😔', label: 'Sad', value: 'sad' },
    { emoji: '😐', label: 'Neutral', value: 'neutral' },
    { emoji: '🙂', label: 'Good', value: 'good' },
    { emoji: '😄', label: 'Great', value: 'great' },
    { emoji: '🤩', label: 'Amazing', value: 'amazing' },
  ]

  return (
    <div className="p-6 space-y-6">
      <div>
        <h1 className="text-4xl font-bold mb-2 flex items-center gap-3">
          <BookOpen className="w-8 h-8" />
          AI Reflection Journal
        </h1>
        <p className="text-muted-foreground">Reflect on your journey and track your growth mindset</p>
      </div>

      {/* Today's Reflection Form */}
      <div className="glass p-6 rounded-xl space-y-4">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-xl font-bold">Today's Reflection</h2>
          <span className="badge-premium bg-emerald-500/20 text-emerald-400 border-emerald-500/30">
            {format(new Date(), 'MMM dd, yyyy')}
          </span>
        </div>

        {/* Prompt Selector */}
        <div className="space-y-2">
          <label className="text-sm text-muted-foreground">Today's Prompt</label>
          <select
            value={selectedPrompt}
            onChange={(e) => setSelectedPrompt(e.target.value)}
            className="input-premium"
          >
            {REFLECTION_PROMPTS.map((prompt) => (
              <option key={prompt} value={prompt}>
                {prompt}
              </option>
            ))}
          </select>
        </div>

        {/* Mood Selector */}
        <div className="space-y-3">
          <label className="text-sm text-muted-foreground">How are you feeling?</label>
          <div className="grid grid-cols-5 gap-2">
            {moods.map((m) => (
              <button
                key={m.value}
                onClick={() => setMood(m.value)}
                className={`py-3 rounded-lg smooth-transition border-2 text-center ${
                  mood === m.value
                    ? 'bg-emerald-500/20 border-emerald-500'
                    : 'border-white/10 hover:border-white/20'
                }`}
              >
                <div className="text-2xl mb-1">{m.emoji}</div>
                <p className="text-xs">{m.label}</p>
              </button>
            ))}
          </div>
        </div>

        {/* Reflection Text Area */}
        <div className="space-y-2">
          <label className="text-sm text-muted-foreground">Your Reflection</label>
          <textarea
            value={reflection}
            onChange={(e) => setReflection(e.target.value)}
            placeholder={selectedPrompt}
            className="input-premium min-h-32 resize-none"
          />
        </div>

        {/* Submit Button */}
        <button
          onClick={handleSubmit}
          disabled={!reflection.trim()}
          className="w-full btn-primary flex items-center justify-center gap-2 disabled:opacity-50"
        >
          <Send className="w-4 h-4" />
          Save Reflection
        </button>

        {todayEntry && (
          <div className="bg-emerald-500/10 border border-emerald-500/20 rounded-lg p-4 space-y-2">
            <p className="text-sm font-semibold text-emerald-400">✓ Entry Saved</p>
            <p className="text-xs text-muted-foreground">Check your past entries below</p>
          </div>
        )}
      </div>

      {/* Past Entries */}
      <div className="space-y-4">
        <h2 className="text-xl font-bold">Your Journey</h2>
        {entries.length === 0 ? (
          <div className="glass p-8 rounded-xl text-center text-muted-foreground">
            <p>Start your reflection journey today</p>
          </div>
        ) : (
          <div className="space-y-3">
            {entries
              .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())
              .map((entry) => (
                <div key={entry.id} className="glass p-4 rounded-lg space-y-3">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="font-semibold">{format(new Date(entry.date), 'MMM dd, yyyy')}</p>
                      <p className="text-xs text-muted-foreground">
                        Mood: <span className="text-foreground">
                          {moods.find((m) => m.value === entry.mood)?.emoji}
                        </span>
                      </p>
                    </div>
                  </div>
                  <p className="text-sm text-muted-foreground">{entry.reflection}</p>
                  <div className="bg-white/5 rounded p-3 border border-white/10">
                    <p className="text-xs text-blue-400 font-semibold mb-1">AI Insight</p>
                    <p className="text-xs text-muted-foreground">{entry.aiSummary}</p>
                  </div>
                </div>
              ))}
          </div>
        )}
      </div>

      {/* Statistics */}
      <div className="grid grid-cols-3 gap-4">
        <div className="glass p-4 rounded-lg text-center">
          <p className="text-2xl font-bold text-emerald-400">{entries.length}</p>
          <p className="text-xs text-muted-foreground">Reflections</p>
        </div>
        <div className="glass p-4 rounded-lg text-center">
          <p className="text-2xl font-bold text-blue-400">{stats.currentStreak}</p>
          <p className="text-xs text-muted-foreground">Streak Days</p>
        </div>
        <div className="glass p-4 rounded-lg text-center">
          <p className="text-2xl font-bold text-yellow-400">{stats.totalXP}</p>
          <p className="text-xs text-muted-foreground">XP Earned</p>
        </div>
      </div>
    </div>
  )
}
