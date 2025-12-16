import { db } from '@/db';
import { Goal, NewGoal } from '@/types';
import { v4 as uuidv4 } from 'uuid';

export const goalService = {
  // Create a new goal
  async create(goalData: NewGoal): Promise<Goal> {
    const now = new Date().toISOString();
    const goal: Goal = {
      id: uuidv4(),
      ...goalData,
      createdAt: now,
      updatedAt: now,
    };
    
    await db.goals.add(goal);
    return goal;
  },

  // Get all goals
  async getAll(): Promise<Goal[]> {
    return await db.goals.toArray();
  },

  // Get active goals only
  async getActive(): Promise<Goal[]> {
    return await db.goals.filter(goal => goal.isActive === true).toArray();
  },

  // Get goal by ID
  async getById(id: string): Promise<Goal | undefined> {
    return await db.goals.get(id);
  },

  // Get goals by category
  async getByCategory(category: Goal['category']): Promise<Goal[]> {
    return await db.goals.where('category').equals(category).toArray();
  },

  // Update a goal
  async update(id: string, updates: Partial<Goal>): Promise<void> {
    await db.goals.update(id, {
      ...updates,
      updatedAt: new Date().toISOString(),
    });
  },

  // Delete a goal
  async delete(id: string): Promise<void> {
    await db.goals.delete(id);
    // Also delete associated time logs
    await db.timeLogs.where('goalId').equals(id).delete();
  },

  // Toggle goal active status
  async toggleActive(id: string): Promise<void> {
    const goal = await db.goals.get(id);
    if (goal) {
      await db.goals.update(id, {
        isActive: !goal.isActive,
        updatedAt: new Date().toISOString(),
      });
    }
  },
};
