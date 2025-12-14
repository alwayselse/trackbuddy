import { useEffect, useState } from 'react';
import { useLiveQuery } from 'dexie-react-hooks';
import { goalService } from '@/services/goalService';
import { timeLogService } from '@/services/timeLogService';
import { progressService } from '@/services/progressService';
import { Goal, WeeklyProgress } from '@/types';
import { TrendingUp, Target, Clock, Calendar } from 'lucide-react';
import './Dashboard.css';

export default function Dashboard() {
  const [weeklyProgress, setWeeklyProgress] = useState<WeeklyProgress[]>([]);
  const [streak, setStreak] = useState(0);
  const [todayHours, setTodayHours] = useState(0);

  // Live queries for real-time updates
  const activeGoals = useLiveQuery(() => goalService.getActive(), []);
  const recentLogs = useLiveQuery(() => 
    timeLogService.getAll().then(logs => logs.slice(0, 5)), 
    []
  );

  useEffect(() => {
    loadDashboardData();
  }, []);

  const loadDashboardData = async () => {
    const progress = await progressService.getAllWeeklyProgress();
    setWeeklyProgress(progress);

    const currentStreak = await progressService.getCurrentStreak();
    setStreak(currentStreak);

    const today = await timeLogService.getByDate(new Date());
    const hours = today.reduce((sum, log) => sum + log.hoursSpent, 0);
    setTodayHours(hours);
  };

  const getCategoryColor = (category: Goal['category']) => {
    switch (category) {
      case 'learning': return '#4f46e5';
      case 'project': return '#10b981';
      case 'income': return '#f59e0b';
      default: return '#6b7280';
    }
  };

  return (
    <div className="dashboard">
      <div className="dashboard-header">
        <h1>Dashboard</h1>
        <p className="subtitle">Your personal learning & productivity overview</p>
      </div>

      {/* Quick Stats */}
      <div className="stats-grid">
        <div className="stat-card">
          <div className="stat-icon" style={{ background: 'rgba(79, 70, 229, 0.1)' }}>
            <Target size={24} style={{ color: 'var(--primary)' }} />
          </div>
          <div className="stat-content">
            <p className="stat-label">Active Goals</p>
            <p className="stat-value">{activeGoals?.length || 0}</p>
          </div>
        </div>

        <div className="stat-card">
          <div className="stat-icon" style={{ background: 'rgba(239, 68, 68, 0.1)' }}>
            <TrendingUp size={24} style={{ color: 'var(--danger)' }} />
          </div>
          <div className="stat-content">
            <p className="stat-label">Current Streak</p>
            <p className="stat-value">{streak} days</p>
          </div>
        </div>

        <div className="stat-card">
          <div className="stat-icon" style={{ background: 'rgba(16, 185, 129, 0.1)' }}>
            <Clock size={24} style={{ color: 'var(--secondary)' }} />
          </div>
          <div className="stat-content">
            <p className="stat-label">Today's Hours</p>
            <p className="stat-value">{todayHours.toFixed(1)}h</p>
          </div>
        </div>

        <div className="stat-card">
          <div className="stat-icon" style={{ background: 'rgba(245, 158, 11, 0.1)' }}>
            <Calendar size={24} style={{ color: 'var(--warning)' }} />
          </div>
          <div className="stat-content">
            <p className="stat-label">This Week</p>
            <p className="stat-value">
              {weeklyProgress.reduce((sum, p) => sum + p.totalHours, 0).toFixed(1)}h
            </p>
          </div>
        </div>
      </div>

      {/* Weekly Progress */}
      <div className="section">
        <h2>This Week's Progress</h2>
        <div className="progress-list">
          {weeklyProgress.length === 0 ? (
            <p className="empty-state">No progress data yet. Start logging time!</p>
          ) : (
            weeklyProgress.map((progress) => {
              const goal = activeGoals?.find(g => g.id === progress.goalId);
              if (!goal) return null;

              return (
                <div key={progress.goalId} className="progress-item card">
                  <div className="progress-header">
                    <div className="progress-info">
                      <div 
                        className="category-badge"
                        style={{ background: getCategoryColor(goal.category) }}
                      >
                        {goal.category}
                      </div>
                      <h3>{goal.title}</h3>
                    </div>
                    <div className="progress-stats">
                      <span className="hours-logged">
                        {progress.totalHours.toFixed(1)}h / {progress.targetHours}h
                      </span>
                    </div>
                  </div>
                  <div className="progress-bar-container">
                    <div 
                      className="progress-bar-fill"
                      style={{ 
                        width: `${Math.min(progress.completionPercentage, 100)}%`,
                        background: getCategoryColor(goal.category)
                      }}
                    />
                  </div>
                  <p className="progress-percentage">
                    {progress.completionPercentage.toFixed(0)}% complete
                  </p>
                </div>
              );
            })
          )}
        </div>
      </div>

      {/* Recent Activity */}
      <div className="section">
        <h2>Recent Activity</h2>
        <div className="activity-list">
          {!recentLogs || recentLogs.length === 0 ? (
            <p className="empty-state">No activity yet. Start logging your time!</p>
          ) : (
            recentLogs.map((log) => {
              const goal = activeGoals?.find(g => g.id === log.goalId);
              return (
                <div key={log.id} className="activity-item card">
                  <div className="activity-header">
                    <div className="activity-date">
                      {new Date(log.date).toLocaleDateString('en-US', { 
                        month: 'short', 
                        day: 'numeric' 
                      })}
                    </div>
                    <div className="activity-hours">{log.hoursSpent}h</div>
                  </div>
                  <h4>{log.activity}</h4>
                  {goal && (
                    <span 
                      className="activity-goal"
                      style={{ color: getCategoryColor(goal.category) }}
                    >
                      {goal.title}
                    </span>
                  )}
                  {log.reflection && (
                    <p className="activity-reflection">{log.reflection}</p>
                  )}
                </div>
              );
            })
          )}
        </div>
      </div>
    </div>
  );
}
