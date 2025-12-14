import { useState } from 'react';
import { useLiveQuery } from 'dexie-react-hooks';
import { noteService } from '@/services/noteService';
import { goalService } from '@/services/goalService';
import { Note, NewNote } from '@/types';
import { Plus, Edit2, Trash2, Search, Tag } from 'lucide-react';
import ReactMarkdown from 'react-markdown';
import './Notes.css';

export default function Notes() {
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [editingNote, setEditingNote] = useState<Note | null>(null);
  const [viewingNote, setViewingNote] = useState<Note | null>(null);
  const [searchQuery, setSearchQuery] = useState('');

  const notes = useLiveQuery(() => noteService.getAll(), []);
  const goals = useLiveQuery(() => goalService.getAll(), []);

  // Filter notes by search query
  const filteredNotes = notes?.filter(note => {
    if (!searchQuery) return true;
    const query = searchQuery.toLowerCase();
    return (
      note.title.toLowerCase().includes(query) ||
      note.content.toLowerCase().includes(query) ||
      note.tags.some(tag => tag.toLowerCase().includes(query))
    );
  }) || [];

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);
    
    const selectedGoals = Array.from(formData.getAll('linkedGoalIds') as string[]);
    const tags = (formData.get('tags') as string)
      .split(',')
      .map(t => t.trim())
      .filter(t => t);

    const noteData: NewNote = {
      title: formData.get('title') as string,
      content: formData.get('content') as string,
      linkedGoalIds: selectedGoals,
      linkedProjectNames: [],
      linkedDate: (formData.get('linkedDate') as string) || undefined,
      tags,
    };

    if (editingNote) {
      await noteService.update(editingNote.id, noteData);
    } else {
      await noteService.create(noteData);
    }

    setIsFormOpen(false);
    setEditingNote(null);
    e.currentTarget.reset();
  };

  const handleEdit = (note: Note) => {
    setEditingNote(note);
    setViewingNote(null);
    setIsFormOpen(true);
  };

  const handleDelete = async (id: string) => {
    if (confirm('Are you sure you want to delete this note?')) {
      await noteService.delete(id);
      setViewingNote(null);
    }
  };

  const handleView = (note: Note) => {
    setViewingNote(note);
  };

  return (
    <div className="notes-page">
      <div className="page-header">
        <div>
          <h1>Notes</h1>
          <p className="subtitle">Your digital knowledge base</p>
        </div>
        <button 
          className="btn btn-primary"
          onClick={() => {
            setEditingNote(null);
            setViewingNote(null);
            setIsFormOpen(true);
          }}
        >
          <Plus size={20} />
          New Note
        </button>
      </div>

      {/* Search Bar */}
      <div className="search-bar card">
        <Search size={20} />
        <input
          type="text"
          placeholder="Search notes by title, content, or tags..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
        />
      </div>

      {/* Note Form Modal */}
      {isFormOpen && (
        <div className="modal-overlay" onClick={() => setIsFormOpen(false)}>
          <div className="modal-content modal-large" onClick={(e) => e.stopPropagation()}>
            <h2>{editingNote ? 'Edit Note' : 'Create New Note'}</h2>
            <form onSubmit={handleSubmit}>
              <div className="form-group">
                <label htmlFor="title">Title *</label>
                <input
                  type="text"
                  id="title"
                  name="title"
                  required
                  defaultValue={editingNote?.title}
                  placeholder="Note title"
                />
              </div>

              <div className="form-group">
                <label htmlFor="content">Content (Markdown) *</label>
                <textarea
                  id="content"
                  name="content"
                  required
                  defaultValue={editingNote?.content}
                  placeholder="Write your notes in markdown..."
                  rows={12}
                />
              </div>

              <div className="form-group">
                <label htmlFor="linkedGoalIds">Link to Goals (Optional)</label>
                <select
                  id="linkedGoalIds"
                  name="linkedGoalIds"
                  multiple
                  defaultValue={editingNote?.linkedGoalIds}
                  size={4}
                >
                  {goals?.map(goal => (
                    <option key={goal.id} value={goal.id}>
                      {goal.title}
                    </option>
                  ))}
                </select>
                <small>Hold Ctrl/Cmd to select multiple</small>
              </div>

              <div className="form-row">
                <div className="form-group">
                  <label htmlFor="linkedDate">Link to Date (Optional)</label>
                  <input
                    type="date"
                    id="linkedDate"
                    name="linkedDate"
                    defaultValue={editingNote?.linkedDate?.split('T')[0]}
                  />
                </div>

                <div className="form-group">
                  <label htmlFor="tags">Tags (comma-separated)</label>
                  <input
                    type="text"
                    id="tags"
                    name="tags"
                    defaultValue={editingNote?.tags.join(', ')}
                    placeholder="e.g., python, machine-learning, tutorial"
                  />
                </div>
              </div>

              <div className="form-actions">
                <button 
                  type="button" 
                  className="btn btn-secondary"
                  onClick={() => {
                    setIsFormOpen(false);
                    setEditingNote(null);
                  }}
                >
                  Cancel
                </button>
                <button type="submit" className="btn btn-primary">
                  {editingNote ? 'Update Note' : 'Create Note'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Note Viewer Modal */}
      {viewingNote && (
        <div className="modal-overlay" onClick={() => setViewingNote(null)}>
          <div className="modal-content modal-large" onClick={(e) => e.stopPropagation()}>
            <div className="note-viewer-header">
              <h2>{viewingNote.title}</h2>
              <div className="note-viewer-actions">
                <button
                  className="icon-btn"
                  onClick={() => handleEdit(viewingNote)}
                  title="Edit"
                >
                  <Edit2 size={18} />
                </button>
                <button
                  className="icon-btn"
                  onClick={() => handleDelete(viewingNote.id)}
                  title="Delete"
                >
                  <Trash2 size={18} />
                </button>
              </div>
            </div>
            
            {viewingNote.tags.length > 0 && (
              <div className="note-tags">
                {viewingNote.tags.map((tag, index) => (
                  <span key={index} className="tag">
                    <Tag size={12} />
                    {tag}
                  </span>
                ))}
              </div>
            )}

            <div className="note-content markdown-body">
              <ReactMarkdown>{viewingNote.content}</ReactMarkdown>
            </div>

            <div className="note-viewer-footer">
              <small>
                Created: {new Date(viewingNote.createdAt).toLocaleString()} •
                Updated: {new Date(viewingNote.updatedAt).toLocaleString()}
              </small>
            </div>
          </div>
        </div>
      )}

      {/* Notes Grid */}
      <div className="notes-grid">
        {filteredNotes.length === 0 ? (
          <div className="empty-state card">
            <p>
              {searchQuery ? 'No notes found matching your search.' : 'No notes yet. Create your first note!'}
            </p>
          </div>
        ) : (
          filteredNotes.map((note) => (
            <div 
              key={note.id} 
              className="note-card card"
              onClick={() => handleView(note)}
            >
              <h3>{note.title}</h3>
              <p className="note-preview">
                {note.content.substring(0, 150)}
                {note.content.length > 150 ? '...' : ''}
              </p>
              {note.tags.length > 0 && (
                <div className="note-card-tags">
                  {note.tags.slice(0, 3).map((tag, index) => (
                    <span key={index} className="tag-small">
                      {tag}
                    </span>
                  ))}
                  {note.tags.length > 3 && (
                    <span className="tag-small">+{note.tags.length - 3}</span>
                  )}
                </div>
              )}
              <div className="note-card-footer">
                <span className="note-date">
                  {new Date(note.updatedAt).toLocaleDateString()}
                </span>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
}
