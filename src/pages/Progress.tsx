import { useEffect, useState } from 'react';
import { useLiveQuery } from 'dexie-react-hooks';
import { progressService } from '@/services/progressService';
import { goalService } from '@/services/goalService';
import { WeeklyProgress, MonthlyProgress } from '@/types';
import { TrendingUp, Calendar, Award, Flame } from 'lucide-react';
import './Progress.css';

export default function Progress() {
  const [weeklyProgress, setWeeklyProgress] = useState<WeeklyProgress[]>([]);
  const [monthlyProgress, setMonthlyProgress] = useState<MonthlyProgress | null>(null);
  const [streak, setStreak] = useState(0);
  const [heatmapData, setHeatmapData] = useState<{ date: string; hours: number }[]>([]);

  const goals = useLiveQuery(() => goalService.getAll(), []);

  useEffect(() => {
    loadProgressData();
  }, []);

  const loadProgressData = async () => {
    const weekly = await progressService.getAllWeeklyProgress();
    setWeeklyProgress(weekly);

    const monthly = await progressService.getMonthlyProgress();
    setMonthlyProgress(monthly);

    const currentStreak = await progressService.getCurrentStreak();
    setStreak(currentStreak);

    const heatmap = await progressService.getHeatmapData(90);
    setHeatmapData(heatmap);
  };

  const getCategoryColor = (category: string) => {
    switch (category) {
      case 'learning': return '#4f46e5';
      case 'project': return '#10b981';
      case 'income': return '#f59e0b';
      default: return '#6b7280';
    }
  };

  const getHeatmapColor = (hours: number) => {
    if (hours === 0) return 'var(--bg-tertiary)';
    if (hours < 2) return 'rgba(79, 70, 229, 0.3)';
    if (hours < 4) return 'rgba(79, 70, 229, 0.5)';
    if (hours < 6) return 'rgba(79, 70, 229, 0.7)';
    return 'rgba(79, 70, 229, 1)';
  };

  // Organize heatmap data by weeks
  const getHeatmapWeeks = () => {
    const weeks: { date: string; hours: number }[][] = [];
    let currentWeek: { date: string; hours: number }[] = [];
    
    heatmapData.forEach((day, index) => {
      currentWeek.push(day);
      
      if (currentWeek.length === 7 || index === heatmapData.length - 1) {
        weeks.push([...currentWeek]);
        currentWeek = [];
      }
    });
    
    return weeks;
  };

  return (
    <div className="progress-page">
      <div className="page-header">
        <div>
          <h1>Progress Tracking</h1>
          <p className="subtitle">Visualize your learning journey</p>
        </div>
      </div>

      {/* Overview Stats */}
      <div className="overview-stats">
        <div className="stat-card">
          <div className="stat-icon" style={{ background: 'rgba(239, 68, 68, 0.1)' }}>
            <Flame size={28} style={{ color: 'var(--danger)' }} />
          </div>
          <div className="stat-content">
            <p className="stat-value">{streak}</p>
            <p className="stat-label">Day Streak</p>
          </div>
        </div>

        <div className="stat-card">
          <div className="stat-icon" style={{ background: 'rgba(79, 70, 229, 0.1)' }}>
            <Calendar size={28} style={{ color: 'var(--primary)' }} />
          </div>
          <div className="stat-content">
            <p className="stat-value">{monthlyProgress?.totalHoursLogged.toFixed(1) || 0}h</p>
            <p className="stat-label">This Month</p>
          </div>
        </div>

        <div className="stat-card">
          <div className="stat-icon" style={{ background: 'rgba(16, 185, 129, 0.1)' }}>
            <TrendingUp size={28} style={{ color: 'var(--secondary)' }} />
          </div>
          <div className="stat-content">
            <p className="stat-value">{monthlyProgress?.projectsCompleted || 0}</p>
            <p className="stat-label">Projects</p>
          </div>
        </div>

        <div className="stat-card">
          <div className="stat-icon" style={{ background: 'rgba(245, 158, 11, 0.1)' }}>
            <Award size={28} style={{ color: 'var(--warning)' }} />
          </div>
          <div className="stat-content">
            <p className="stat-value">{monthlyProgress?.articlesPublished || 0}</p>
            <p className="stat-label">Articles</p>
          </div>
        </div>
      </div>

      {/* Activity Heatmap */}
      <div className="section">
        <h2>Activity Heatmap (Last 90 Days)</h2>
        <div className="heatmap-container card">
          <div className="heatmap">
            {getHeatmapWeeks().map((week, weekIndex) => (
              <div key={weekIndex} className="heatmap-week">
                {week.map((day) => (
                  <div
                    key={day.date}
                    className="heatmap-day"
                    style={{ background: getHeatmapColor(day.hours) }}
                    title={`${day.date}: ${day.hours.toFixed(1)}h`}
                  />
                ))}
              </div>
            ))}
          </div>
          <div className="heatmap-legend">
            <span>Less</span>
            <div className="legend-colors">
              <div className="legend-color" style={{ background: 'var(--bg-tertiary)' }} />
              <div className="legend-color" style={{ background: 'rgba(79, 70, 229, 0.3)' }} />
              <div className="legend-color" style={{ background: 'rgba(79, 70, 229, 0.5)' }} />
              <div className="legend-color" style={{ background: 'rgba(79, 70, 229, 0.7)' }} />
              <div className="legend-color" style={{ background: 'rgba(79, 70, 229, 1)' }} />
            </div>
            <span>More</span>
          </div>
        </div>
      </div>

      {/* Weekly Progress by Goal */}
      <div className="section">
        <h2>This Week's Progress</h2>
        <div className="progress-cards">
          {weeklyProgress.length === 0 ? (
            <p className="empty-state">No progress data for this week yet.</p>
          ) : (
            weeklyProgress.map((progress) => {
              const goal = goals?.find(g => g.id === progress.goalId);
              if (!goal) return null;

              const percentage = Math.min(progress.completionPercentage, 100);
              const isOverTarget = progress.completionPercentage > 100;

              return (
                <div key={progress.goalId} className="progress-card card">
                  <div className="progress-card-header">
                    <div className="progress-card-title">
                      <div 
                        className="category-dot"
                        style={{ background: getCategoryColor(goal.category) }}
                      />
                      <h3>{goal.title}</h3>
                    </div>
                    <span className={`percentage-badge ${isOverTarget ? 'over-target' : ''}`}>
                      {progress.completionPercentage.toFixed(0)}%
                    </span>
                  </div>

                  <div className="hours-info">
                    <span className="hours-logged">
                      {progress.totalHours.toFixed(1)}h logged
                    </span>
                    <span className="hours-target">
                      of {progress.targetHours}h target
                    </span>
                  </div>

                  <div className="progress-bar-large">
                    <div 
                      className="progress-bar-fill-large"
                      style={{ 
                        width: `${percentage}%`,
                        background: getCategoryColor(goal.category)
                      }}
                    />
                  </div>

                  {isOverTarget && (
                    <p className="over-target-message">🎉 Target exceeded!</p>
                  )}
                </div>
              );
            })
          )}
        </div>
      </div>

      {/* Monthly Summary */}
      {monthlyProgress && (
        <div className="section">
          <h2>Monthly Summary</h2>
          <div className="monthly-summary card">
            <div className="summary-grid">
              <div className="summary-item">
                <span className="summary-value">{monthlyProgress.totalHoursLogged.toFixed(1)}h</span>
                <span className="summary-label">Total Hours</span>
              </div>
              <div className="summary-item">
                <span className="summary-value">{monthlyProgress.projectsCompleted}</span>
                <span className="summary-label">Projects Completed</span>
              </div>
              <div className="summary-item">
                <span className="summary-value">{monthlyProgress.articlesPublished}</span>
                <span className="summary-label">Articles Published</span>
              </div>
              <div className="summary-item">
                <span className="summary-value">
                  {new Date(monthlyProgress.year, monthlyProgress.month - 1).toLocaleDateString('en-US', { month: 'long', year: 'numeric' })}
                </span>
                <span className="summary-label">Period</span>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
