import { useState } from 'react'
import { useStore, Habit } from '@/store'
import { CATEGORIES } from '@/lib/utils'
import { Plus, Trash2, Edit2, X } from 'lucide-react'

export default function HabitsPage() {
  const { habits, addHabit, deleteHabit, updateHabit } = useStore()
  const [showAddForm, setShowAddForm] = useState(false)
  const [editingId, setEditingId] = useState<string | null>(null)
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    category: '',
    identity: '',
    cue: '',
    craving: '',
    response: '',
    reward: '',
    twoMinuteRule: true,
  })

  const handleAddHabit = () => {
    if (formData.title && formData.category) {
      addHabit({
        title: formData.title,
        description: formData.description,
        category: formData.category,
        identity: formData.identity,
        cue: formData.cue,
        craving: formData.craving,
        response: formData.response,
        reward: formData.reward,
        dailyTarget: 1,
        twoMinuteRule: formData.twoMinuteRule,
      })
      resetForm()
      setShowAddForm(false)
    }
  }

  const handleUpdateHabit = (id: string) => {
    updateHabit(id, formData)
    resetForm()
    setEditingId(null)
  }

  const resetForm = () => {
    setFormData({
      title: '',
      description: '',
      category: '',
      identity: '',
      cue: '',
      craving: '',
      response: '',
      reward: '',
      twoMinuteRule: true,
    })
  }

  const startEdit = (habit: Habit) => {
    setFormData({
      title: habit.title,
      description: habit.description,
      category: habit.category,
      identity: habit.identity,
      cue: habit.cue,
      craving: habit.craving,
      response: habit.response,
      reward: habit.reward,
      twoMinuteRule: habit.twoMinuteRule,
    })
    setEditingId(habit.id)
  }

  return (
    <div className="p-6 space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-4xl font-bold">My Habits</h1>
        <button
          onClick={() => {
            setShowAddForm(!showAddForm)
            resetForm()
            setEditingId(null)
          }}
          className="btn-primary flex items-center gap-2"
        >
          <Plus className="w-4 h-4" />
          Add Habit
        </button>
      </div>

      {/* Add/Edit Form */}
      {(showAddForm || editingId) && (
        <div className="glass p-6 rounded-xl space-y-4">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-xl font-bold">{editingId ? 'Edit Habit' : 'Add New Habit'}</h2>
            <button
              onClick={() => {
                setShowAddForm(false)
                setEditingId(null)
                resetForm()
              }}
              className="text-muted-foreground hover:text-foreground"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <input
              type="text"
              placeholder="Habit name (e.g., Morning Meditation)"
              value={formData.title}
              onChange={(e) => setFormData((p) => ({ ...p, title: e.target.value }))}
              className="input-premium"
            />

            <select
              value={formData.category}
              onChange={(e) => setFormData((p) => ({ ...p, category: e.target.value }))}
              className="input-premium"
            >
              <option value="">Select category</option>
              {CATEGORIES.map((cat) => (
                <option key={cat} value={cat}>
                  {cat}
                </option>
              ))}
            </select>

            <textarea
              placeholder="Description"
              value={formData.description}
              onChange={(e) => setFormData((p) => ({ ...p, description: e.target.value }))}
              className="input-premium md:col-span-2"
              rows={2}
            />

            <input
              type="text"
              placeholder="Identity (e.g., 'I am a disciplined person')"
              value={formData.identity}
              onChange={(e) => setFormData((p) => ({ ...p, identity: e.target.value }))}
              className="input-premium md:col-span-2"
            />

            <input
              type="text"
              placeholder="Cue (What triggers the habit?)"
              value={formData.cue}
              onChange={(e) => setFormData((p) => ({ ...p, cue: e.target.value }))}
              className="input-premium"
            />

            <input
              type="text"
              placeholder="Craving (What do you crave?)"
              value={formData.craving}
              onChange={(e) => setFormData((p) => ({ ...p, craving: e.target.value }))}
              className="input-premium"
            />

            <input
              type="text"
              placeholder="Response (What's your action?)"
              value={formData.response}
              onChange={(e) => setFormData((p) => ({ ...p, response: e.target.value }))}
              className="input-premium"
            />

            <input
              type="text"
              placeholder="Reward (What's the reward?)"
              value={formData.reward}
              onChange={(e) => setFormData((p) => ({ ...p, reward: e.target.value }))}
              className="input-premium"
            />
          </div>

          <label className="flex items-center gap-3 cursor-pointer">
            <input
              type="checkbox"
              checked={formData.twoMinuteRule}
              onChange={(e) => setFormData((p) => ({ ...p, twoMinuteRule: e.target.checked }))}
              className="w-4 h-4"
            />
            <span className="text-sm">Apply 2-Minute Rule (Start small)</span>
          </label>

          <div className="flex gap-3 pt-4">
            <button
              onClick={() => {
                setShowAddForm(false)
                setEditingId(null)
                resetForm()
              }}
              className="flex-1 btn-secondary"
            >
              Cancel
            </button>
            <button
              onClick={() =>
                editingId ? handleUpdateHabit(editingId) : handleAddHabit()
              }
              disabled={!formData.title || !formData.category}
              className="flex-1 btn-primary disabled:opacity-50"
            >
              {editingId ? 'Save Changes' : 'Create Habit'}
            </button>
          </div>
        </div>
      )}

      {/* Habits List */}
      <div className="space-y-3">
        {habits.length === 0 ? (
          <div className="glass p-8 rounded-xl text-center">
            <p className="text-muted-foreground mb-4">No habits yet. Start building your consistency!</p>
            <button
              onClick={() => setShowAddForm(true)}
              className="btn-primary inline-flex items-center gap-2"
            >
              <Plus className="w-4 h-4" />
              Create Your First Habit
            </button>
          </div>
        ) : (
          habits.map((habit) => (
            <div key={habit.id} className="glass p-4 rounded-lg">
              <div className="flex items-start justify-between mb-3">
                <div className="flex-1">
                  <h3 className="font-bold text-lg">{habit.title}</h3>
                  <p className="text-xs text-muted-foreground">{habit.category}</p>
                </div>
                <div className="flex gap-2">
                  <button
                    onClick={() => startEdit(habit)}
                    className="p-2 hover:bg-white/10 rounded-lg smooth-transition"
                  >
                    <Edit2 className="w-4 h-4 text-blue-400" />
                  </button>
                  <button
                    onClick={() => deleteHabit(habit.id)}
                    className="p-2 hover:bg-white/10 rounded-lg smooth-transition"
                  >
                    <Trash2 className="w-4 h-4 text-red-400" />
                  </button>
                </div>
              </div>

              {habit.description && (
                <p className="text-sm text-muted-foreground mb-3">{habit.description}</p>
              )}

              {(habit.cue || habit.craving || habit.response || habit.reward) && (
                <div className="grid grid-cols-2 md:grid-cols-4 gap-2 mb-3 text-xs">
                  {habit.cue && (
                    <div className="bg-white/5 p-2 rounded border border-white/10">
                      <p className="text-muted-foreground text-xs font-semibold">Cue</p>
                      <p className="text-foreground">{habit.cue}</p>
                    </div>
                  )}
                  {habit.craving && (
                    <div className="bg-white/5 p-2 rounded border border-white/10">
                      <p className="text-muted-foreground text-xs font-semibold">Craving</p>
                      <p className="text-foreground">{habit.craving}</p>
                    </div>
                  )}
                  {habit.response && (
                    <div className="bg-white/5 p-2 rounded border border-white/10">
                      <p className="text-muted-foreground text-xs font-semibold">Response</p>
                      <p className="text-foreground">{habit.response}</p>
                    </div>
                  )}
                  {habit.reward && (
                    <div className="bg-white/5 p-2 rounded border border-white/10">
                      <p className="text-muted-foreground text-xs font-semibold">Reward</p>
                      <p className="text-foreground">{habit.reward}</p>
                    </div>
                  )}
                </div>
              )}

              <div className="flex items-center gap-4 text-xs">
                {habit.twoMinuteRule && (
                  <span className="badge-premium bg-blue-500/20 text-blue-400 border-blue-500/30">
                    ⚡ 2-Min Rule
                  </span>
                )}
                <span className="text-muted-foreground">Streak: {habit.streak} days</span>
                <span className="text-muted-foreground">Longest: {habit.longestStreak} days</span>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  )
}
