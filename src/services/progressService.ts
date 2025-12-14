import { timeLogService } from './timeLogService';
import { goalService } from './goalService';
import { startOfWeek, endOfWeek, getWeek, getYear, startOfMonth, endOfMonth } from 'date-fns';
import { WeeklyProgress, MonthlyProgress } from '@/types';

export const progressService = {
  // Calculate weekly progress for a specific goal
  async getWeeklyProgress(goalId: string, date: Date = new Date()): Promise<WeeklyProgress> {
    const goal = await goalService.getById(goalId);
    if (!goal) {
      throw new Error(`Goal not found: ${goalId}`);
    }

    const weekStart = startOfWeek(date);
    const weekEnd = endOfWeek(date);
    const totalHours = await timeLogService.getTotalHours(goalId, weekStart, weekEnd);
    
    const weekNumber = getWeek(date);
    const year = getYear(date);
    const targetHours = goal.weeklyHourTarget;
    const completionPercentage = targetHours > 0 ? (totalHours / targetHours) * 100 : 0;

    return {
      goalId,
      weekNumber,
      year,
      totalHours,
      targetHours,
      completionPercentage,
    };
  },

  // Get weekly progress for all active goals
  async getAllWeeklyProgress(date: Date = new Date()): Promise<WeeklyProgress[]> {
    const activeGoals = await goalService.getActive();
    const progressPromises = activeGoals.map(goal => 
      this.getWeeklyProgress(goal.id, date)
    );
    return await Promise.all(progressPromises);
  },

  // Calculate monthly summary
  async getMonthlyProgress(date: Date = new Date()): Promise<MonthlyProgress> {
    const monthStart = startOfMonth(date);
    const monthEnd = endOfMonth(date);
    
    const logs = await timeLogService.getByDateRange(monthStart, monthEnd);
    const totalHoursLogged = logs.reduce((sum, log) => sum + log.hoursSpent, 0);
    
    // Count projects completed (simple heuristic: count unique project-related goals with logs)
    const projectGoals = await goalService.getByCategory('project');
    const projectsWithLogs = new Set(
      logs.filter(log => projectGoals.some(g => g.id === log.goalId)).map(log => log.goalId)
    );
    
    // Count articles published (heuristic: look for "article" or "medium" in activity descriptions)
    const articlesPublished = logs.filter(log => 
      log.activity.toLowerCase().includes('article') || 
      log.activity.toLowerCase().includes('medium') ||
      log.activity.toLowerCase().includes('published')
    ).length;

    return {
      month: date.getMonth() + 1,
      year: date.getFullYear(),
      projectsCompleted: projectsWithLogs.size,
      articlesPublished,
      totalHoursLogged,
    };
  },

  // Calculate streak (consecutive days with logs)
  async getCurrentStreak(): Promise<number> {
    const allLogs = await timeLogService.getAll();
    if (allLogs.length === 0) return 0;

    // Sort by date descending
    const sortedLogs = allLogs.sort((a, b) => 
      new Date(b.date).getTime() - new Date(a.date).getTime()
    );

    // Get unique dates
    const uniqueDates = Array.from(new Set(sortedLogs.map(log => log.date))).sort().reverse();
    
    let streak = 0;
    const today = new Date().toISOString().split('T')[0];
    let checkDate = new Date(today);

    for (const logDate of uniqueDates) {
      const logDateStr = new Date(logDate).toISOString().split('T')[0];
      const checkDateStr = checkDate.toISOString().split('T')[0];
      
      if (logDateStr === checkDateStr) {
        streak++;
        checkDate.setDate(checkDate.getDate() - 1);
      } else {
        break;
      }
    }

    return streak;
  },

  // Get heatmap data (hours logged per day for last N days)
  async getHeatmapData(days: number = 90): Promise<{ date: string; hours: number }[]> {
    const endDate = new Date();
    const startDate = new Date();
    startDate.setDate(startDate.getDate() - days);

    const logs = await timeLogService.getByDateRange(startDate, endDate);
    
    // Group by date
    const heatmapMap = new Map<string, number>();
    logs.forEach(log => {
      const current = heatmapMap.get(log.date) || 0;
      heatmapMap.set(log.date, current + log.hoursSpent);
    });

    // Convert to array and sort
    return Array.from(heatmapMap.entries())
      .map(([date, hours]) => ({ date, hours }))
      .sort((a, b) => a.date.localeCompare(b.date));
  },
};
