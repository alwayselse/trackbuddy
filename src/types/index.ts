// Core data types for TrackBuddy

export type GoalCategory = 'learning' | 'project' | 'income';

export interface Goal {
  id: string;
  title: string;
  description: string;
  category: GoalCategory;
  weeklyHourTarget: number;
  rules: string[]; // Flexible text-based rules
  startDate: string; // ISO date string
  endDate?: string; // Optional, can be updated
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface TimeLog {
  id: string;
  goalId: string;
  date: string; // ISO date string
  activity: string;
  hoursSpent: number;
  reflection?: string; // Optional daily note
  createdAt: string;
}

export interface Note {
  id: string;
  title: string;
  content: string; // Markdown
  linkedGoalIds: string[];
  linkedProjectNames: string[];
  linkedDate?: string; // ISO date string
  tags: string[];
  createdAt: string;
  updatedAt: string;
}

export interface WeeklyProgress {
  goalId: string;
  weekNumber: number;
  year: number;
  totalHours: number;
  targetHours: number;
  completionPercentage: number;
}

export interface MonthlyProgress {
  month: number;
  year: number;
  projectsCompleted: number;
  articlesPublished: number;
  totalHoursLogged: number;
}

// Helper type for creating new entities (without id and timestamps)
export type NewGoal = Omit<Goal, 'id' | 'createdAt' | 'updatedAt'>;
export type NewTimeLog = Omit<TimeLog, 'id' | 'createdAt'>;
export type NewNote = Omit<Note, 'id' | 'createdAt' | 'updatedAt'>;
