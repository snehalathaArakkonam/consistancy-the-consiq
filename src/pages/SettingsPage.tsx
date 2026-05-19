import { useState } from 'react'
import { useStore } from '@/store'
import { CATEGORIES, GOAL_TEMPLATES } from '@/lib/utils'
import { Settings, Download, Trash2, LogOut } from 'lucide-react'

export default function SettingsPage() {
  const { user, exportData, importData } = useStore()
  const [editMode, setEditMode] = useState(false)
  const [formData, setFormData] = useState({
    name: user.name,
    age: user.age,
    gender: user.gender,
    categories: user.categories,
    goals: user.goals,
  })

  const handleExport = () => {
    const data = exportData()
    const jsonString = JSON.stringify(data, null, 2)
    const blob = new Blob([jsonString], { type: 'application/json' })
    const url = URL.createObjectURL(blob)
    const link = document.createElement('a')
    link.href = url
    link.download = `consiq-backup-${new Date().toISOString().split('T')[0]}.json`
    link.click()
    URL.revokeObjectURL(url)
  }

  const handleImport = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (file) {
      const reader = new FileReader()
      reader.onload = (event) => {
        try {
          const data = JSON.parse(event.target?.result as string)
          importData(data)
          alert('Data imported successfully!')
          window.location.reload()
        } catch (error) {
          alert('Error importing data. Please check the file format.')
        }
      }
      reader.readAsText(file)
    }
  }

  const handleReset = () => {
    if (window.confirm('Are you sure? This will delete all your data and cannot be undone.')) {
      localStorage.clear()
      window.location.reload()
    }
  }

  const handleLogout = () => {
    if (window.confirm('Logout from CONSIQ?')) {
      localStorage.clear()
      window.location.reload()
    }
  }

  return (
    <div className="p-6 space-y-8 max-w-2xl">
      <div>
        <h1 className="text-4xl font-bold mb-2 flex items-center gap-3">
          <Settings className="w-8 h-8" />
          Settings
        </h1>
        <p className="text-muted-foreground">Manage your profile and preferences</p>
      </div>

      {/* Profile Section */}
      <div className="glass p-6 rounded-xl space-y-4">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-xl font-bold">Profile Information</h2>
          <button
            onClick={() => setEditMode(!editMode)}
            className={`px-4 py-2 rounded-lg font-medium smooth-transition ${
              editMode
                ? 'bg-red-500/20 text-red-400 border border-red-500/30'
                : 'btn-secondary'
            }`}
          >
            {editMode ? 'Cancel' : 'Edit'}
          </button>
        </div>

        {editMode ? (
          <div className="space-y-4">
            <div>
              <label className="text-sm text-muted-foreground block mb-2">Name</label>
              <input
                type="text"
                value={formData.name}
                onChange={(e) => setFormData((p) => ({ ...p, name: e.target.value }))}
                className="input-premium"
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="text-sm text-muted-foreground block mb-2">Age</label>
                <input
                  type="number"
                  value={formData.age}
                  onChange={(e) => setFormData((p) => ({ ...p, age: parseInt(e.target.value) }))}
                  className="input-premium"
                />
              </div>
              <div>
                <label className="text-sm text-muted-foreground block mb-2">Gender</label>
                <select
                  value={formData.gender}
                  onChange={(e) => setFormData((p) => ({ ...p, gender: e.target.value as any }))}
                  className="input-premium"
                >
                  <option value="male">Male</option>
                  <option value="female">Female</option>
                  <option value="other">Other</option>
                </select>
              </div>
            </div>

            <div>
              <label className="text-sm text-muted-foreground block mb-2">Categories</label>
              <div className="grid grid-cols-2 gap-2">
                {CATEGORIES.map((cat) => (
                  <button
                    key={cat}
                    onClick={() =>
                      setFormData((p) => ({
                        ...p,
                        categories: p.categories.includes(cat)
                          ? p.categories.filter((c) => c !== cat)
                          : [...p.categories, cat],
                      }))
                    }
                    className={`px-3 py-2 rounded-lg text-sm smooth-transition border ${
                      formData.categories.includes(cat)
                        ? 'bg-emerald-500/20 border-emerald-500 text-emerald-400'
                        : 'border-white/10 hover:border-white/20'
                    }`}
                  >
                    {cat}
                  </button>
                ))}
              </div>
            </div>

            <button className="w-full btn-primary">Save Changes</button>
          </div>
        ) : (
          <div className="space-y-4 text-sm">
            <div>
              <p className="text-muted-foreground mb-1">Name</p>
              <p className="font-medium">{user.name}</p>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <p className="text-muted-foreground mb-1">Age</p>
                <p className="font-medium">{user.age} years old</p>
              </div>
              <div>
                <p className="text-muted-foreground mb-1">Gender</p>
                <p className="font-medium capitalize">{user.gender}</p>
              </div>
            </div>
            <div>
              <p className="text-muted-foreground mb-1">Categories</p>
              <div className="flex flex-wrap gap-2 mt-2">
                {user.categories.map((cat) => (
                  <span key={cat} className="badge-premium bg-emerald-500/20 text-emerald-400 border-emerald-500/30">
                    {cat}
                  </span>
                ))}
              </div>
            </div>
            <div>
              <p className="text-muted-foreground mb-1">Goals</p>
              <div className="flex flex-wrap gap-2 mt-2">
                {user.goals.slice(0, 3).map((goal) => (
                  <span key={goal} className="badge-premium bg-blue-500/20 text-blue-400 border-blue-500/30">
                    {goal}
                  </span>
                ))}
                {user.goals.length > 3 && (
                  <span className="badge-premium bg-gray-500/20 text-gray-400 border-gray-500/30">
                    +{user.goals.length - 3} more
                  </span>
                )}
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Data Management */}
      <div className="space-y-4">
        <h2 className="text-xl font-bold">Data Management</h2>

        <div className="glass p-6 rounded-xl space-y-3">
          <button
            onClick={handleExport}
            className="w-full flex items-center justify-center gap-2 px-4 py-3 bg-blue-500/10 border border-blue-500/20 rounded-lg hover:bg-blue-500/20 smooth-transition text-blue-400 font-medium"
          >
            <Download className="w-4 h-4" />
            Export Data Backup
          </button>

          <label className="w-full flex items-center justify-center gap-2 px-4 py-3 bg-blue-500/10 border border-blue-500/20 rounded-lg hover:bg-blue-500/20 smooth-transition text-blue-400 font-medium cursor-pointer">
            <Download className="w-4 h-4" />
            Import Data Backup
            <input
              type="file"
              accept=".json"
              onChange={handleImport}
              className="hidden"
            />
          </label>
        </div>
      </div>

      {/* Preferences */}
      <div className="space-y-4">
        <h2 className="text-xl font-bold">Preferences</h2>

        <div className="glass p-6 rounded-xl space-y-4">
          <label className="flex items-center gap-3 cursor-pointer">
            <input type="checkbox" defaultChecked className="w-4 h-4" />
            <span className="text-sm">Enable notifications</span>
          </label>
          <label className="flex items-center gap-3 cursor-pointer">
            <input type="checkbox" defaultChecked className="w-4 h-4" />
            <span className="text-sm">Dark mode (always on)</span>
          </label>
          <label className="flex items-center gap-3 cursor-pointer">
            <input type="checkbox" defaultChecked className="w-4 h-4" />
            <span className="text-sm">Show motivational messages</span>
          </label>
        </div>
      </div>

      {/* Danger Zone */}
      <div className="space-y-4">
        <h2 className="text-xl font-bold text-red-400">Danger Zone</h2>

        <div className="space-y-3">
          <button
            onClick={handleReset}
            className="w-full flex items-center justify-center gap-2 px-4 py-3 bg-red-500/10 border border-red-500/20 rounded-lg hover:bg-red-500/20 smooth-transition text-red-400 font-medium"
          >
            <Trash2 className="w-4 h-4" />
            Reset All Data
          </button>

          <button
            onClick={handleLogout}
            className="w-full flex items-center justify-center gap-2 px-4 py-3 bg-orange-500/10 border border-orange-500/20 rounded-lg hover:bg-orange-500/20 smooth-transition text-orange-400 font-medium"
          >
            <LogOut className="w-4 h-4" />
            Logout
          </button>
        </div>
      </div>

      {/* About */}
      <div className="glass p-6 rounded-xl space-y-3">
        <h2 className="font-bold">About CONSIQ</h2>
        <div className="space-y-2 text-sm text-muted-foreground">
          <p><span className="font-semibold text-foreground">Version:</span> 1.0.0</p>
          <p><span className="font-semibold text-foreground">Last Updated:</span> {new Date().getFullYear()}</p>
          <p>
            CONSIQ is built on the principles of{' '}
            <span className="text-emerald-400 font-semibold">Atomic Habits</span> by James Clear.
          </p>
          <p>
            Transform your life with consistent daily growth. 1% improvement every day compounds into
            remarkable results.
          </p>
        </div>
      </div>
    </div>
  )
}
