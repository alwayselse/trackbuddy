import { db } from '@/db';
import { TimeLog, NewTimeLog } from '@/types';
import { v4 as uuidv4 } from 'uuid';
import { startOfWeek, endOfWeek, startOfMonth, endOfMonth } from 'date-fns';

export const timeLogService = {
  // Create a new time log
  async create(logData: NewTimeLog): Promise<TimeLog> {
    const timeLog: TimeLog = {
      id: uuidv4(),
      ...logData,
      createdAt: new Date().toISOString(),
    };
    
    await db.timeLogs.add(timeLog);
    return timeLog;
  },

  // Get all time logs
  async getAll(): Promise<TimeLog[]> {
    return await db.timeLogs.orderBy('date').reverse().toArray();
  },

  // Get time logs for a specific goal
  async getByGoal(goalId: string): Promise<TimeLog[]> {
    return await db.timeLogs.where('goalId').equals(goalId).toArray();
  },

  // Get time logs for a date range
  async getByDateRange(startDate: Date, endDate: Date): Promise<TimeLog[]> {
    const start = startDate.toISOString().split('T')[0];
    const end = endDate.toISOString().split('T')[0];
    
    return await db.timeLogs
      .where('date')
      .between(start, end, true, true)
      .toArray();
  },

  // Get time logs for current week
  async getCurrentWeek(): Promise<TimeLog[]> {
    const now = new Date();
    return await this.getByDateRange(startOfWeek(now), endOfWeek(now));
  },

  // Get time logs for current month
  async getCurrentMonth(): Promise<TimeLog[]> {
    const now = new Date();
    return await this.getByDateRange(startOfMonth(now), endOfMonth(now));
  },

  // Get total hours for a goal in a date range
  async getTotalHours(goalId: string, startDate: Date, endDate: Date): Promise<number> {
    const logs = await this.getByDateRange(startDate, endDate);
    return logs
      .filter(log => log.goalId === goalId)
      .reduce((sum, log) => sum + log.hoursSpent, 0);
  },

  // Update a time log
  async update(id: string, updates: Partial<TimeLog>): Promise<void> {
    await db.timeLogs.update(id, updates);
  },

  // Delete a time log
  async delete(id: string): Promise<void> {
    await db.timeLogs.delete(id);
  },

  // Get logs for a specific date
  async getByDate(date: Date): Promise<TimeLog[]> {
    const dateStr = date.toISOString().split('T')[0];
    return await db.timeLogs.where('date').equals(dateStr).toArray();
  },
};
