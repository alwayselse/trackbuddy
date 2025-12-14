# 📊 TrackBuddy - Personal Goal & Learning Tracker

> **"A personal operating system for learning, projects, and income — built for one user, but architected like a real product."**

TrackBuddy is a fully-featured personal goal tracking and learning management web application designed to help you stay accountable, track progress, and achieve your goals.

---

## 🎯 **Core Features**

### ✅ **Goal Management**
- Create and manage goals across three categories: **Learning**, **Project**, and **Income**
- Set weekly hour targets for each goal
- Define custom rules for each goal
- Activate/deactivate goals as needed
- Track start and end dates

### ⏱ **Time Logging**
- Fast, minimal-click daily time logging interface
- Log hours spent on each goal
- Add activity descriptions and reflections
- View logs by date with automatic filtering
- See recent activity across all dates

### 📝 **Digital Notes**
- Full markdown support for rich note-taking
- Link notes to specific goals
- Link notes to specific dates
- Add tags for easy organization
- Powerful search functionality
- Beautiful markdown preview

### 📊 **Progress Tracking**
- **Weekly Progress**: Track hours logged vs. targets for each goal
- **Monthly Summaries**: Projects completed, articles published, total hours
- **Streak Counter**: Track consecutive days of logging
- **Activity Heatmap**: GitHub-style 90-day activity visualization
- **Visual Progress Bars**: See completion percentages at a glance

---

## 🏗 **Technical Architecture**

### **Tech Stack**
- **Frontend**: React 18 + TypeScript
- **Build Tool**: Vite
- **Routing**: React Router v6
- **Database**: Dexie (IndexedDB wrapper)
- **Styling**: Pure CSS with CSS Variables (mobile-first)
- **Icons**: Lucide React
- **Dates**: date-fns
- **Markdown**: react-markdown
- **PWA**: vite-plugin-pwa

### **Project Structure**
```
trackbuddy/
├── src/
│   ├── types/           # TypeScript interfaces and types
│   │   └── index.ts
│   ├── db/              # Database configuration
│   │   └── index.ts
│   ├── services/        # Business logic layer
│   │   ├── goalService.ts
│   │   ├── timeLogService.ts
│   │   ├── noteService.ts
│   │   └── progressService.ts
│   ├── components/      # Reusable components
│   │   ├── Layout.tsx
│   │   └── Layout.css
│   ├── pages/           # Route components
│   │   ├── Dashboard.tsx/css
│   │   ├── Goals.tsx/css
│   │   ├── TimeLog.tsx/css
│   │   ├── Notes.tsx/css
│   │   └── Progress.tsx/css
│   ├── App.tsx          # Main app component
│   ├── main.tsx         # Entry point
│   └── index.css        # Global styles
├── package.json
├── tsconfig.json
├── vite.config.ts
└── index.html
```

### **Architecture Principles**
- **Clean Architecture**: Separation of concerns (UI → Services → Database)
- **Service Layer**: All business logic isolated in service files
- **Type Safety**: Comprehensive TypeScript types for all entities
- **Offline-First**: IndexedDB for persistent local storage
- **Real-time Updates**: Dexie React Hooks for live queries
- **Mobile-First**: Responsive design with mobile as priority

---

## 🚀 **Getting Started**

### **Prerequisites**
- Node.js (v18 or higher)
- npm or yarn

### **Installation**
```bash
# Navigate to project directory
cd trackbuddy

# Install dependencies
npm install

# Start development server
npm run dev

# Open in browser
# Navigate to http://localhost:5173
```

### **Build for Production**
```bash
# Create optimized production build
npm run build

# Preview production build
npm run preview
```

---

## 📱 **PWA Installation**

TrackBuddy is a Progressive Web App (PWA) and can be installed on your device:

### **Desktop (Chrome/Edge)**
1. Open the app in your browser
2. Click the install icon in the address bar
3. Click "Install"

### **Mobile (Chrome/Safari)**
1. Open the app in your mobile browser
2. Tap the share/menu button
3. Select "Add to Home Screen"
4. The app will work offline!

---

## 💡 **Usage Guide**

### **1. Create Your First Goal**
1. Go to the **Goals** page
2. Click "New Goal"
3. Fill in:
   - Title (e.g., "Learn Machine Learning")
   - Description
   - Category (Learning/Project/Income)
   - Weekly hour target
   - Rules (one per line)
   - Start and end dates

### **2. Log Daily Time**
1. Go to the **Time Log** page
2. Click "Quick Log"
3. Select:
   - Date (defaults to today)
   - Goal
   - Activity description
   - Hours spent
   - Optional reflection

### **3. Take Notes**
1. Go to the **Notes** page
2. Click "New Note"
3. Write in Markdown
4. Link to goals or dates
5. Add tags for organization

### **4. Track Progress**
1. Go to the **Progress** page
2. View:
   - Current streak
   - Weekly progress for each goal
   - Monthly summary
   - 90-day activity heatmap

---

## 🎨 **Customization**

Everything is customizable:
- Edit goals anytime (targets, rules, dates)
- Deactivate goals without deleting them
- Update time logs if you make mistakes
- Edit notes with full revision history
- Change hour targets as your schedule evolves

---

## 📊 **Data Model**

### **Goals**
```typescript
{
  id: string
  title: string
  description: string
  category: 'learning' | 'project' | 'income'
  weeklyHourTarget: number
  rules: string[]
  startDate: string
  endDate?: string
  isActive: boolean
}
```

### **Time Logs**
```typescript
{
  id: string
  goalId: string
  date: string
  activity: string
  hoursSpent: number
  reflection?: string
}
```

### **Notes**
```typescript
{
  id: string
  title: string
  content: string  // Markdown
  linkedGoalIds: string[]
  linkedProjectNames: string[]
  linkedDate?: string
  tags: string[]
}
```

---

## 🔐 **Privacy & Data**

- **100% Local**: All data stored in your browser's IndexedDB
- **No Server**: No backend, no data leaves your device
- **No Tracking**: No analytics, no cookies
- **Offline-First**: Works without internet connection
- **Your Data**: You own and control everything

---

## 🛣 **Future Enhancements**

- [ ] Data export (JSON/CSV)
- [ ] Cloud sync (optional)
- [ ] Charts and advanced analytics
- [ ] Custom goal templates
- [ ] Weekly/monthly reports
- [ ] Reminders and notifications
- [ ] Dark mode
- [ ] Multi-language support

---

## 🤝 **Contributing**

This is a personal project, but suggestions and improvements are welcome!

---

## 📄 **License**

MIT License - Feel free to use this for your own goals!

---

## 🙏 **Acknowledgments**

Built with modern web technologies and designed for productivity enthusiasts who want to:
- Learn continuously
- Build projects
- Stay accountable
- Track progress
- Achieve goals

---

**Happy Tracking! 🚀**
