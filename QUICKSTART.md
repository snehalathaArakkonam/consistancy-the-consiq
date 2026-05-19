# CONSIQ - Quick Start Guide

## 🎯 Getting Started in 3 Steps

### Step 1: Install Dependencies

Open your terminal in the project folder and run:

```bash
npm install
```

This will install all required packages:

- React 18
- Vite
- Tailwind CSS
- Zustand
- Recharts
- And all other dependencies

**Expected time:** 1-2 minutes depending on your internet speed

### Step 2: Start Development Server

```bash
npm run dev
```

The app will automatically open in your browser at `http://localhost:5173`

You should see the CONSIQ onboarding page with the logo and welcome message.

### Step 3: Create Your Account

1. Enter your name
2. Select your gender
3. Enter your age
4. Choose your categories (multi-select)
5. Select your goals
6. Start tracking!

## 📱 Explore the App

### Dashboard (`/dashboard`)

- See your consistency score for today
- View current and longest streaks
- Check your level and XP progress
- See your activity heatmap
- Complete today's habits

### Habits (`/habits`)

- Add new habits with the "+" button
- Define the habit loop (Cue, Craving, Response, Reward)
- Enable 2-Minute Rule for easier starts
- View and manage all habits

### Gamification (`/gamification`)

- See your current level
- Track achievements and badges
- View level progression
- Celebrate your wins

### Deep Focus (`/focus`)

- Use Pomodoro timer (25/5 or 50/10)
- Create custom focus sessions
- Enable greyscale mode for dopamine control
- Track completed sessions

### Journal (`/journal`)

- Reflect on your day with AI-powered prompts
- Track your mood
- Get AI-generated summaries
- View past reflections

### Future Self (`/future-self`)

- See projections 30-365 days ahead
- Visualize your compound growth
- Check projected level and achievements
- Stay motivated!

### Analytics (`/analytics`)

- View weekly and monthly trends
- See habit performance breakdown
- Track completion rates
- Get actionable insights

### Settings (`/settings`)

- Edit your profile
- Export data as backup
- Import from backup
- Reset or logout

## 🔧 Build for Production

When ready to deploy:

```bash
npm run build
```

This creates an optimized production build in the `dist` folder.

### Deploy to Vercel (Recommended)

1. Push your code to GitHub:

```bash
git init
git add .
git commit -m "Initial commit"
git remote add origin https://github.com/yourusername/consiq.git
git push -u origin main
```

2. Visit [vercel.com](https://vercel.com)
3. Click "New Project"
4. Select your GitHub repository
5. Click "Deploy"
6. Your app is live!

## 💡 Tips

### Make it Your Own

- Customize colors in `tailwind.config.ts`
- Add more badge conditions in `GamificationPage.tsx`
- Create custom habit templates
- Add more reflection prompts in `JournalPage.tsx`

### Data Management

- All data is saved in browser's localStorage
- Export backups from Settings
- Try it on multiple devices (data is per-browser)
- Future: Add Firebase for cloud sync

### Performance

- App is built with Vite for instant HMR (Hot Module Replacement)
- Changes auto-refresh in browser
- Production build is optimized (~100KB gzipped)

## 🆘 Troubleshooting

### Port 5173 already in use?

```bash
# Windows
netstat -ano | findstr :5173
taskkill /PID <PID> /F

# Mac/Linux
lsof -i :5173
kill -9 <PID>
```

### Dependencies not installing?

```bash
rm -rf node_modules package-lock.json
npm install
```

### Build errors?

```bash
# Clean build
rm -rf dist
npm run build
```

## 📞 Support

- Check README.md for detailed documentation
- Review code comments for implementation details
- Test features before sharing
- Report issues and track improvements

## 🎉 You're All Set!

Your premium CONSIQ app is ready to help people build atomic habits and achieve their goals through daily consistency.

**Remember:** 1% daily improvement compounds into extraordinary results over time! 🚀

---

**Happy habit building!**
