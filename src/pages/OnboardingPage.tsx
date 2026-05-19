import { useState } from 'react'
import { useStore } from '@/store'
import { CATEGORIES, GOAL_TEMPLATES } from '@/lib/utils'
import { ChevronRight, Sparkles } from 'lucide-react'

type OnboardingStep = 'welcome' | 'gender' | 'age' | 'categories' | 'goals' | 'complete'

export default function OnboardingPage() {
  const { completeOnboarding } = useStore()
  const [step, setStep] = useState<OnboardingStep>('welcome')
  const [formData, setFormData] = useState({
    name: '',
    gender: '',
    age: '',
    categories: [] as string[],
    goals: [] as string[],
  })

  const handleNext = () => {
    const steps: OnboardingStep[] = ['welcome', 'gender', 'age', 'categories', 'goals', 'complete']
    const currentIndex = steps.indexOf(step)
    if (currentIndex < steps.length - 1) {
      setStep(steps[currentIndex + 1])
    }
  }

  const handlePrev = () => {
    const steps: OnboardingStep[] = ['welcome', 'gender', 'age', 'categories', 'goals', 'complete']
    const currentIndex = steps.indexOf(step)
    if (currentIndex > 0) {
      setStep(steps[currentIndex - 1])
    }
  }

  const handleComplete = () => {
    if (formData.name && formData.gender && formData.age && formData.categories.length > 0 && formData.goals.length > 0) {
      completeOnboarding({
        name: formData.name,
        gender: formData.gender as 'male' | 'female' | 'other',
        age: parseInt(formData.age),
        categories: formData.categories,
        goals: formData.goals,
      })
      window.location.reload()
    }
  }

  const toggleCategory = (category: string) => {
    setFormData((prev) => ({
      ...prev,
      categories: prev.categories.includes(category)
        ? prev.categories.filter((c) => c !== category)
        : [...prev.categories, category],
    }))
  }

  const toggleGoal = (goal: string) => {
    setFormData((prev) => ({
      ...prev,
      goals: prev.goals.includes(goal)
        ? prev.goals.filter((g) => g !== goal)
        : [...prev.goals, goal],
    }))
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-background to-emerald-950/20 flex items-center justify-center px-4 py-8">
      <div className="w-full max-w-lg">
        {/* Logo */}
        <div className="text-center mb-12">
          <div className="w-16 h-16 rounded-2xl bg-gradient-to-r from-emerald-500 to-teal-500 flex items-center justify-center mx-auto mb-4">
            <Sparkles className="w-8 h-8 text-white" />
          </div>
          <h1 className="text-4xl font-bold mb-2 gradient-text">CONSIQ</h1>
          <p className="text-muted-foreground">The Ultimate 1% Daily Consistency App</p>
        </div>

        {/* Card Container */}
        <div className="glass p-8 rounded-2xl">
          {/* Welcome Step */}
          {step === 'welcome' && (
            <div className="space-y-6 animate-fade-in">
              <div>
                <h2 className="text-3xl font-bold mb-4">Welcome to CONSIQ</h2>
                <p className="text-muted-foreground mb-6">
                  Transform your life with atomic habits. Build unshakeable consistency through the power of compound growth.
                </p>
                <div className="space-y-3 mb-6">
                  <div className="flex items-start gap-3">
                    <div className="w-6 h-6 rounded-full bg-emerald-500/20 border border-emerald-500/50 flex items-center justify-center flex-shrink-0 mt-1">
                      <span className="text-xs font-bold text-emerald-400">✓</span>
                    </div>
                    <p className="text-sm">Track your daily habits with precision</p>
                  </div>
                  <div className="flex items-start gap-3">
                    <div className="w-6 h-6 rounded-full bg-emerald-500/20 border border-emerald-500/50 flex items-center justify-center flex-shrink-0 mt-1">
                      <span className="text-xs font-bold text-emerald-400">✓</span>
                    </div>
                    <p className="text-sm">Earn XP and level up your consistency</p>
                  </div>
                  <div className="flex items-start gap-3">
                    <div className="w-6 h-6 rounded-full bg-emerald-500/20 border border-emerald-500/50 flex items-center justify-center flex-shrink-0 mt-1">
                      <span className="text-xs font-bold text-emerald-400">✓</span>
                    </div>
                    <p className="text-sm">Visualize your compound growth journey</p>
                  </div>
                </div>
              </div>
              <input
                type="text"
                placeholder="Enter your name"
                value={formData.name}
                onChange={(e) => setFormData((prev) => ({ ...prev, name: e.target.value }))}
                className="input-premium"
              />
              <button
                onClick={handleNext}
                disabled={!formData.name}
                className="w-full btn-primary disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
              >
                Get Started <ChevronRight className="w-4 h-4" />
              </button>
            </div>
          )}

          {/* Gender Step */}
          {step === 'gender' && (
            <div className="space-y-6 animate-fade-in">
              <h2 className="text-2xl font-bold">How do you identify?</h2>
              <div className="grid grid-cols-3 gap-3">
                {['Male', 'Female', 'Other'].map((gender) => (
                  <button
                    key={gender}
                    onClick={() =>
                      setFormData((prev) => ({
                        ...prev,
                        gender: gender.toLowerCase() as any,
                      }))
                    }
                    className={`py-4 rounded-lg font-semibold smooth-transition border-2 ${
                      formData.gender === gender.toLowerCase()
                        ? 'bg-emerald-500/20 border-emerald-500 text-emerald-400'
                        : 'border-white/10 hover:border-white/20 text-foreground'
                    }`}
                  >
                    {gender}
                  </button>
                ))}
              </div>
              <div className="flex gap-3 pt-4">
                <button onClick={handlePrev} className="flex-1 btn-secondary">
                  Back
                </button>
                <button
                  onClick={handleNext}
                  disabled={!formData.gender}
                  className="flex-1 btn-primary disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  Next
                </button>
              </div>
            </div>
          )}

          {/* Age Step */}
          {step === 'age' && (
            <div className="space-y-6 animate-fade-in">
              <h2 className="text-2xl font-bold">What's your age?</h2>
              <input
                type="number"
                placeholder="Enter your age"
                value={formData.age}
                onChange={(e) => setFormData((prev) => ({ ...prev, age: e.target.value }))}
                className="input-premium"
                min="13"
                max="120"
              />
              <div className="flex gap-3 pt-4">
                <button onClick={handlePrev} className="flex-1 btn-secondary">
                  Back
                </button>
                <button
                  onClick={handleNext}
                  disabled={!formData.age || parseInt(formData.age) < 13}
                  className="flex-1 btn-primary disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  Next
                </button>
              </div>
            </div>
          )}

          {/* Categories Step */}
          {step === 'categories' && (
            <div className="space-y-6 animate-fade-in max-h-96 overflow-y-auto pr-2">
              <h2 className="text-2xl font-bold">Select your categories</h2>
              <p className="text-sm text-muted-foreground">Pick all that apply</p>
              <div className="grid grid-cols-2 gap-2">
                {CATEGORIES.map((category) => (
                  <button
                    key={category}
                    onClick={() => toggleCategory(category)}
                    className={`px-4 py-3 rounded-lg font-medium text-sm smooth-transition border ${
                      formData.categories.includes(category)
                        ? 'bg-emerald-500/20 border-emerald-500 text-emerald-400'
                        : 'border-white/10 hover:border-white/20 text-foreground'
                    }`}
                  >
                    {category}
                  </button>
                ))}
              </div>
              <div className="flex gap-3 pt-4">
                <button onClick={handlePrev} className="flex-1 btn-secondary">
                  Back
                </button>
                <button
                  onClick={handleNext}
                  disabled={formData.categories.length === 0}
                  className="flex-1 btn-primary disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  Next
                </button>
              </div>
            </div>
          )}

          {/* Goals Step */}
          {step === 'goals' && (
            <div className="space-y-6 animate-fade-in max-h-96 overflow-y-auto pr-2">
              <h2 className="text-2xl font-bold">What are your goals?</h2>
              <p className="text-sm text-muted-foreground">Select at least one goal</p>
              <div className="space-y-2">
                {GOAL_TEMPLATES.map((goal) => (
                  <button
                    key={goal}
                    onClick={() => toggleGoal(goal)}
                    className={`w-full px-4 py-3 rounded-lg font-medium text-sm smooth-transition border text-left ${
                      formData.goals.includes(goal)
                        ? 'bg-emerald-500/20 border-emerald-500 text-emerald-400'
                        : 'border-white/10 hover:border-white/20 text-foreground'
                    }`}
                  >
                    {goal}
                  </button>
                ))}
              </div>
              <div className="flex gap-3 pt-4">
                <button onClick={handlePrev} className="flex-1 btn-secondary">
                  Back
                </button>
                <button
                  onClick={handleNext}
                  disabled={formData.goals.length === 0}
                  className="flex-1 btn-primary disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  Next
                </button>
              </div>
            </div>
          )}

          {/* Complete Step */}
          {step === 'complete' && (
            <div className="space-y-6 animate-fade-in text-center">
              <div>
                <h2 className="text-3xl font-bold mb-4">You're All Set! 🎉</h2>
                <p className="text-muted-foreground mb-6">
                  Get ready to transform your life through the power of 1% daily improvement.
                </p>
              </div>
              <div className="bg-white/5 rounded-lg p-4 border border-white/10 text-left space-y-2">
                <p className="text-sm"><span className="font-semibold text-foreground">Name:</span> {formData.name}</p>
                <p className="text-sm"><span className="font-semibold text-foreground">Categories:</span> {formData.categories.join(', ')}</p>
                <p className="text-sm"><span className="font-semibold text-foreground">Goals:</span> {formData.goals.slice(0, 2).join(', ')}...</p>
              </div>
              <button
                onClick={handleComplete}
                className="w-full btn-primary flex items-center justify-center gap-2"
              >
                Start Your Journey <ChevronRight className="w-4 h-4" />
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
