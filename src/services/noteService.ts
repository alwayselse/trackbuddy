import { db } from '@/db';
import { Note, NewNote } from '@/types';
import { v4 as uuidv4 } from 'uuid';

export const noteService = {
  // Create a new note
  async create(noteData: NewNote): Promise<Note> {
    const now = new Date().toISOString();
    const note: Note = {
      id: uuidv4(),
      ...noteData,
      createdAt: now,
      updatedAt: now,
    };
    
    await db.notes.add(note);
    return note;
  },

  // Get all notes
  async getAll(): Promise<Note[]> {
    return await db.notes.orderBy('updatedAt').reverse().toArray();
  },

  // Get note by ID
  async getById(id: string): Promise<Note | undefined> {
    return await db.notes.get(id);
  },

  // Search notes by title or content
  async search(query: string): Promise<Note[]> {
    const allNotes = await db.notes.toArray();
    const lowerQuery = query.toLowerCase();
    
    return allNotes.filter(note =>
      note.title.toLowerCase().includes(lowerQuery) ||
      note.content.toLowerCase().includes(lowerQuery) ||
      note.tags.some(tag => tag.toLowerCase().includes(lowerQuery))
    );
  },

  // Get notes by goal ID
  async getByGoal(goalId: string): Promise<Note[]> {
    return await db.notes
      .where('linkedGoalIds')
      .equals(goalId)
      .toArray();
  },

  // Get notes by tag
  async getByTag(tag: string): Promise<Note[]> {
    return await db.notes
      .where('tags')
      .equals(tag)
      .toArray();
  },

  // Get notes by date
  async getByDate(date: Date): Promise<Note[]> {
    const dateStr = date.toISOString().split('T')[0];
    return await db.notes
      .where('linkedDate')
      .equals(dateStr)
      .toArray();
  },

  // Update a note
  async update(id: string, updates: Partial<Note>): Promise<void> {
    await db.notes.update(id, {
      ...updates,
      updatedAt: new Date().toISOString(),
    });
  },

  // Delete a note
  async delete(id: string): Promise<void> {
    await db.notes.delete(id);
  },
};
