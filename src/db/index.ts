import Dexie, { Table } from 'dexie';
import { Goal, TimeLog, Note } from '@/types';

// IndexedDB database using Dexie
export class TrackBuddyDB extends Dexie {
  goals!: Table<Goal>;
  timeLogs!: Table<TimeLog>;
  notes!: Table<Note>;

  constructor() {
    super('TrackBuddyDB');
    
    this.version(1).stores({
      goals: 'id, category, isActive, startDate, endDate',
      timeLogs: 'id, goalId, date, createdAt',
      notes: 'id, *linkedGoalIds, *tags, linkedDate, createdAt'
    });
  }
}

// Export singleton instance
export const db = new TrackBuddyDB();
