import { useState, useEffect } from 'react'
import { Play, Pause, RotateCcw, Volume2, VolumeX } from 'lucide-react'

type FocusMode = 'pomodoro' | 'custom'
type TimerState = 'idle' | 'running' | 'paused'

export default function FocusPage() {
  const [focusMode, setFocusMode] = useState<'25/5' | '50/10' | 'custom'>('25/5')
  const [timerState, setTimerState] = useState<TimerState>('idle')
  const [isGreyscale, setIsGreyscale] = useState(false)
  const [soundEnabled, setSoundEnabled] = useState(true)
  const [customWork, setCustomWork] = useState(25)
  const [customBreak, setCustomBreak] = useState(5)
  const [isWorkSession, setIsWorkSession] = useState(true)
  const [timeLeft, setTimeLeft] = useState(25 * 60)
  const [sessionsCompleted, setSessionsCompleted] = useState(0)

  const focusModes: Record<string, { work: number; break: number }> = {
    '25/5': { work: 25, break: 5 },
    '50/10': { work: 50, break: 10 },
    'custom': { work: customWork, break: customBreak },
  }

  const getCurrentDuration = () => {
    const mode = focusModes[focusMode]
    return isWorkSession ? mode.work * 60 : mode.break * 60
  }

  useEffect(() => {
    let interval: NodeJS.Timeout
    if (timerState === 'running') {
      interval = setInterval(() => {
        setTimeLeft((prev) => {
          if (prev <= 1) {
            setTimerState('idle')
            if (isWorkSession) {
              setSessionsCompleted((s) => s + 1)
            }
            setIsWorkSession(!isWorkSession)
            const nextDuration = isWorkSession
              ? focusModes[focusMode].break * 60
              : focusModes[focusMode].work * 60
            setTimeLeft(nextDuration)
            playSound()
            return nextDuration
          }
          return prev - 1
        })
      }, 1000)
    }
    return () => clearInterval(interval)
  }, [timerState, isWorkSession, focusMode, focusModes])

  const playSound = () => {
    if (soundEnabled) {
      const audio = new (window.AudioContext || (window as any).webkitAudioContext)()
      const osc = audio.createOscillator()
      const gain = audio.createGain()
      osc.connect(gain)
      gain.connect(audio.destination)
      osc.frequency.value = 800
      gain.gain.setValueAtTime(0.3, audio.currentTime)
      gain.gain.exponentialRampToValueAtTime(0.01, audio.currentTime + 0.5)
      osc.start(audio.currentTime)
      osc.stop(audio.currentTime + 0.5)
    }
  }

  const handleStart = () => {
    if (timerState === 'idle' || timerState === 'paused') {
      setTimerState('running')
    }
  }

  const handlePause = () => {
    setTimerState('paused')
  }

  const handleReset = () => {
    setTimerState('idle')
    setTimeLeft(getCurrentDuration())
  }

  const handleSkip = () => {
    setIsWorkSession(!isWorkSession)
    if (!isWorkSession && isWorkSession) {
      setSessionsCompleted((s) => s + 1)
    }
    const nextDuration = isWorkSession
      ? focusModes[focusMode].break * 60
      : focusModes[focusMode].work * 60
    setTimeLeft(nextDuration)
    setTimerState('idle')
  }

  const formatTime = (seconds: number): string => {
    const mins = Math.floor(seconds / 60)
    const secs = seconds % 60
    return `${String(mins).padStart(2, '0')}:${String(secs).padStart(2, '0')}`
  }

  const progress = ((getCurrentDuration() - timeLeft) / getCurrentDuration()) * 100

  return (
    <div
      className={`min-h-screen p-6 transition-all duration-300 ${
        isGreyscale ? 'grayscale' : ''
      }`}
    >
      <div className="max-w-2xl mx-auto space-y-8">
        {/* Header */}
        <div className="text-center space-y-2">
          <h1 className="text-4xl font-bold">Deep Focus Mode</h1>
          <p className="text-muted-foreground">Minimize distractions, maximize productivity</p>
        </div>

        {/* Timer Display */}
        <div className="glass p-8 rounded-2xl text-center space-y-6">
          {/* Big Timer Circle */}
          <div className="relative w-64 h-64 mx-auto">
            <svg className="w-full h-full transform -rotate-90" viewBox="0 0 100 100">
              <circle
                cx="50"
                cy="50"
                r="45"
                fill="none"
                stroke="rgba(255,255,255,0.1)"
                strokeWidth="3"
              />
              <circle
                cx="50"
                cy="50"
                r="45"
                fill="none"
                stroke={isWorkSession ? '#10b981' : '#06b6d4'}
                strokeWidth="3"
                strokeDasharray={`${(progress / 100) * 282.7} 282.7`}
                strokeLinecap="round"
              />
            </svg>
            <div className="absolute inset-0 flex flex-col items-center justify-center">
              <p className="text-6xl font-bold">{formatTime(timeLeft)}</p>
              <p className="text-lg text-muted-foreground mt-2">
                {isWorkSession ? 'Focus Time' : 'Break Time'}
              </p>
            </div>
          </div>

          {/* Controls */}
          <div className="flex items-center justify-center gap-4">
            {timerState === 'running' ? (
              <button onClick={handlePause} className="btn-primary flex items-center gap-2">
                <Pause className="w-5 h-5" />
                Pause
              </button>
            ) : (
              <button onClick={handleStart} className="btn-primary flex items-center gap-2">
                <Play className="w-5 h-5" />
                Start
              </button>
            )}
            <button onClick={handleReset} className="btn-secondary flex items-center gap-2">
              <RotateCcw className="w-5 h-5" />
              Reset
            </button>
            <button
              onClick={handleSkip}
              className="btn-secondary"
            >
              Skip
            </button>
          </div>

          {/* Sessions Count */}
          <div className="text-sm text-muted-foreground">
            Sessions completed: <span className="font-bold text-emerald-400">{sessionsCompleted}</span>
          </div>
        </div>

        {/* Focus Modes */}
        <div className="glass p-6 rounded-xl space-y-4">
          <h2 className="font-bold">Focus Modes</h2>
          <div className="grid grid-cols-3 gap-3">
            <button
              onClick={() => {
                setFocusMode('25/5')
                setTimeLeft(25 * 60)
                setTimerState('idle')
              }}
              className={`py-3 rounded-lg font-semibold smooth-transition border-2 ${
                focusMode === '25/5'
                  ? 'bg-emerald-500/20 border-emerald-500 text-emerald-400'
                  : 'border-white/10 hover:border-white/20'
              }`}
            >
              25/5
            </button>
            <button
              onClick={() => {
                setFocusMode('50/10')
                setTimeLeft(50 * 60)
                setTimerState('idle')
              }}
              className={`py-3 rounded-lg font-semibold smooth-transition border-2 ${
                focusMode === '50/10'
                  ? 'bg-emerald-500/20 border-emerald-500 text-emerald-400'
                  : 'border-white/10 hover:border-white/20'
              }`}
            >
              50/10
            </button>
            <button
              onClick={() => setFocusMode('custom')}
              className={`py-3 rounded-lg font-semibold smooth-transition border-2 ${
                focusMode === 'custom'
                  ? 'bg-emerald-500/20 border-emerald-500 text-emerald-400'
                  : 'border-white/10 hover:border-white/20'
              }`}
            >
              Custom
            </button>
          </div>

          {focusMode === 'custom' && (
            <div className="grid grid-cols-2 gap-3 pt-2">
              <div>
                <label className="text-sm text-muted-foreground mb-2 block">Work (min)</label>
                <input
                  type="number"
                  value={customWork}
                  onChange={(e) => setCustomWork(parseInt(e.target.value))}
                  disabled={timerState === 'running'}
                  className="input-premium disabled:opacity-50"
                  min="1"
                  max="120"
                />
              </div>
              <div>
                <label className="text-sm text-muted-foreground mb-2 block">Break (min)</label>
                <input
                  type="number"
                  value={customBreak}
                  onChange={(e) => setCustomBreak(parseInt(e.target.value))}
                  disabled={timerState === 'running'}
                  className="input-premium disabled:opacity-50"
                  min="1"
                  max="60"
                />
              </div>
            </div>
          )}
        </div>

        {/* Options */}
        <div className="glass p-6 rounded-xl space-y-4">
          <h2 className="font-bold">Options</h2>
          <label className="flex items-center gap-3 cursor-pointer">
            <input
              type="checkbox"
              checked={isGreyscale}
              onChange={(e) => setIsGreyscale(e.target.checked)}
              className="w-4 h-4"
            />
            <span className="text-sm">Greyscale mode (Dopamine Control)</span>
          </label>
          <label className="flex items-center gap-3 cursor-pointer">
            <input
              type="checkbox"
              checked={soundEnabled}
              onChange={(e) => setSoundEnabled(e.target.checked)}
              className="w-4 h-4"
            />
            <span className="text-sm flex items-center gap-2">
              {soundEnabled ? (
                <Volume2 className="w-4 h-4" />
              ) : (
                <VolumeX className="w-4 h-4" />
              )}
              Sound notifications
            </span>
          </label>
        </div>

        {/* Tips */}
        <div className="bg-blue-500/10 border border-blue-500/20 rounded-lg p-4 space-y-2">
          <p className="text-sm font-semibold text-blue-400">💡 Focus Tips</p>
          <ul className="text-xs text-muted-foreground space-y-1 list-disc list-inside">
            <li>Use the 2-Minute Rule to start any task</li>
            <li>Keep your phone in a different room</li>
            <li>Block distracting websites</li>
            <li>Take real breaks during break time</li>
            <li>Track your completed sessions</li>
          </ul>
        </div>
      </div>
    </div>
  )
}
