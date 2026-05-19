# CONSIQ - The Ultimate 1% Daily Consistency App

Build unshakeable consistency through the power of atomic habits. Transform your life with CONSIQ, a premium SaaS application for daily habit tracking and compound growth visualization.

## 🎯 Features

### Core Functionality

- **Onboarding System** - Gender, age, category & goal selection
- **Smart Dashboard** - Consistency score, streaks, XP, heatmap calendar
- **Habit Management** - Identity-based habits with habit loop framework
- **Gamification** - XP system, 50 levels, badges & achievements
- **Deep Focus Mode** - Pomodoro timer with greyscale dopamine control
- **AI Reflection Journal** - Daily prompts with local AI summaries
- **Future Self Visualization** - 365-day projection with compound growth
- **Analytics Dashboard** - Weekly/monthly charts & performance insights

### Premium Design

- **Glassmorphism** + Soft Neumorphism aesthetic
- **Dark mode** with emerald/teal accents
- **Smooth animations** and micro-interactions
- **Fully responsive** - Mobile, tablet, desktop optimized
- **Professional UI** - Inspired by Tailwind UI, Horizon UI, Bento Grid

### Technical Stack

- React 18 + Vite for blazing-fast development
- Tailwind CSS for utility-first styling
- Shadcn/ui + Radix UI components
- Zustand for lightweight state management
- React Router v6.4+ for navigation
- Recharts for beautiful data visualizations
- date-fns for date manipulation
- Lucide React icons
- Canvas Confetti for celebrations

## 🚀 Quick Start

### Prerequisites

- Node.js 16+ (download from [nodejs.org](https://nodejs.org/))
- npm or yarn package manager

### Installation

1. **Clone or navigate to the project**

```bash
cd consiq
```

2. **Install dependencies**

```bash
npm install
```

3. **Start development server**

```bash
npm run dev
```

The app will open at `http://localhost:5173`

### Development

```bash
# Start dev server
npm run dev

# Build for production
npm run build

# Preview production build
npm run preview

# Lint code (optional - set up ESLint)
npm run lint
```

## 📁 Project Structure

```
consiq/
├── src/
│   ├── components/
│   │   ├── layout/
│   │   │   ├── Sidebar.tsx          # Main sidebar navigation
│   │   │   └── MobileNav.tsx        # Mobile bottom navigation
│   │   └── HeatmapCalendar.tsx      # GitHub-style habit heatmap
│   ├── pages/
│   │   ├── OnboardingPage.tsx       # Onboarding flow
│   │   ├── DashboardPage.tsx        # Main dashboard
│   │   ├── HabitsPage.tsx           # Habit management
│   │   ├── GamificationPage.tsx     # Achievements & badges
│   │   ├── FocusPage.tsx            # Pomodoro timer
│   │   ├── JournalPage.tsx          # Reflection journal
│   │   ├── FutureSelfPage.tsx       # 365-day projection
│   │   ├── AnalyticsPage.tsx        # Performance analytics
│   │   └── SettingsPage.tsx         # User settings
│   ├── lib/
│   │   └── utils.ts                 # Utility functions & helpers
│   ├── store.ts                     # Zustand state management
│   ├── App.tsx                      # Main app component
│   ├── main.tsx                     # Entry point
│   └── index.css                    # Global styles
├── index.html                       # HTML template
├── package.json                     # Dependencies
├── tsconfig.json                    # TypeScript config
├── tailwind.config.ts               # Tailwind CSS config
├── postcss.config.js                # PostCSS config
└── vite.config.ts                   # Vite config
```

## 💾 Data Management

### Local Storage

All user data is stored in browser's localStorage by default:

- User profile and settings
- All habits and completions
- Statistics and achievements
- Journal entries

### Export/Import

- **Export** - Download backup as JSON from Settings
- **Import** - Restore from JSON backup file
- **Reset** - Clear all data (⚠️ cannot be undone)

### Future Firebase Integration

Replace localStorage with Firebase Realtime Database:

```typescript
// In store.ts - modify persist middleware
// Add Firebase SDK and config
// Update actions to sync with Firestore
```

## 🎨 Theme & Customization

### Colors

- **Primary** - Emerald (#10b981)
- **Secondary** - Teal (#14b8a6)
- **Accent** - Cyan (#06b6d4)
- **Background** - Pure black (#000000)
- **Card** - Dark gray (#0a0a0a)

### Tailwind Config

Customize in `tailwind.config.ts`:

```typescript
theme: {
  extend: {
    colors: {
      primary: 'hsl(var(--primary))',
      accent: 'hsl(var(--accent))',
      // ...
    }
  }
}
```

### CSS Classes

Premium utility classes in `index.css`:

- `.glass` - Glassmorphism effect
- `.gradient-text` - Emerald gradient text
- `.btn-primary` - Primary button style
- `.badge-premium` - Badge styling
- `.input-premium` - Input field style

## 📊 Key Components

### Zustand Store

Complete state management with persistence:

```typescript
(useStore() - // Hook for accessing state
  // Methods:
  completeOnboarding() -
  addHabit(),
  updateHabit(),
  deleteHabit() - completeHabit() - addXP(),
  unlockBadge() - exportData(),
  importData());
```

### Habit Loop Framework

Each habit includes:

- **Cue** - What triggers it
- **Craving** - What you want
- **Response** - What you do
- **Reward** - The payoff

### Gamification System

- **XP Points** - 50 per habit completion
- **Leveling** - 500 XP per level (50 levels total)
- **Badges** - Unlock with achievements
- **Streaks** - Current & longest tracking
- **Consistency Score** - Daily percentage

### Analytics Features

- Weekly/monthly completion trends
- Habit performance breakdown by category
- Average completion rates
- Actionable insights

## 🚀 Deployment

### Deploy to Vercel (Recommended)

1. **Push to GitHub**

```bash
git init
git add .
git commit -m "Initial commit"
git remote add origin https://github.com/yourusername/consiq.git
git push -u origin main
```

2. **Connect to Vercel**
   - Visit [vercel.com](https://vercel.com)
   - Click "New Project"
   - Select your GitHub repository
   - Framework: React
   - Build command: `npm run build`
   - Output dir: `dist`
   - Click Deploy

3. **Environment Variables** (if needed)
   - Add in Vercel project settings
   - (Currently none required for localStorage version)

### Deploy to Other Platforms

**Netlify:**

```bash
npm install -g netlify-cli
netlify deploy --prod --dir=dist
```

**GitHub Pages:**

```bash
npm run build
# Commit dist folder to gh-pages branch
```

**Docker:**

```dockerfile
FROM node:18-alpine
WORKDIR /app
COPY package*.json ./
RUN npm ci
COPY . .
RUN npm run build
EXPOSE 3000
CMD ["npm", "run", "preview"]
```

## 🔧 Troubleshooting

### Port Already in Use

```bash
# Kill process on port 5173
# Windows
netstat -ano | findstr :5173
taskkill /PID <PID> /F

# Mac/Linux
lsof -i :5173
kill -9 <PID>
```

### Build Errors

```bash
# Clear cache and reinstall
rm -rf node_modules package-lock.json
npm install
npm run build
```

### localStorage Issues

- Browser might have storage disabled
- Private browsing doesn't persist localStorage
- Check browser console for errors

## 📈 Growth Roadmap

### Phase 2

- Firebase integration for cloud sync
- Collaborative habits with friends
- Push notifications
- Dark mode toggle
- Mobile app (React Native)

### Phase 3

- AI-powered habit recommendations
- Social features & leaderboards
- Wearable device integration
- Advanced analytics & ML insights
- Premium subscription features

## 📚 Resources

- [Atomic Habits by James Clear](https://jamesclear.com/atomic-habits)
- [Tailwind CSS Documentation](https://tailwindcss.com/docs)
- [React Documentation](https://react.dev)
- [Zustand Documentation](https://github.com/pmndrs/zustand)
- [Vite Documentation](https://vitejs.dev)

## 📝 Code Quality

### Best Practices

- ✅ TypeScript for type safety
- ✅ Component-based architecture
- ✅ Custom hooks for logic reuse
- ✅ Responsive design mobile-first
- ✅ Accessible UI components
- ✅ Error handling & loading states
- ✅ Performance optimized

### Performance Tips

- Use React.memo() for expensive components
- Lazy load route components
- Optimize images and assets
- Use virtualization for long lists
- Monitor Core Web Vitals

## 🤝 Contributing

This is your personal project! Feel free to:

- Add new features
- Customize the design
- Integrate with Firebase
- Add more gamification elements
- Improve analytics

## 📄 License

This project is open source and available under the MIT License.

## 💡 Tips for Success

1. **Start with 2-3 habits** - Not too many, not too few
2. **Make habits atomic** - Small, concrete actions
3. **Use habit stacking** - Link new habits to existing routines
4. **Track consistently** - Daily check-ins are key
5. **Review weekly** - Check analytics and adjust
6. **Celebrate wins** - Acknowledge your progress
7. **Never miss twice** - Recovery prompts help break the cycle

Remember: **1% daily improvement compounds into extraordinary results over time.** 🚀

---

Built with 💚 using React, Vite, and Tailwind CSS

**Version:** 1.0.0 | **Last Updated:** 2026
