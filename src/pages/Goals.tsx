import { useState, useEffect } from 'react';
import { useLiveQuery } from 'dexie-react-hooks';
import { goalService } from '@/services/goalService';
import { Goal, NewGoal, GoalCategory } from '@/types';
import { Plus, Edit2, Trash2, Power } from 'lucide-react';
import './Goals.css';

export default function Goals() {
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [editingGoal, setEditingGoal] = useState<Goal | null>(null);
  const [isMobile, setIsMobile] = useState(window.innerWidth <= 768);

  const goals = useLiveQuery(() => goalService.getAll(), []);

  useEffect(() => {
    const handleResize = () => setIsMobile(window.innerWidth <= 768);
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);
    
    const goalData: NewGoal = {
      title: formData.get('title') as string,
      description: formData.get('description') as string,
      category: formData.get('category') as GoalCategory,
      weeklyHourTarget: Number(formData.get('weeklyHourTarget')),
      rules: (formData.get('rules') as string).split('\n').filter(r => r.trim()),
      startDate: formData.get('startDate') as string,
      endDate: formData.get('endDate') as string || undefined,
      isActive: true,
    };

    if (editingGoal) {
      await goalService.update(editingGoal.id, goalData);
    } else {
      await goalService.create(goalData);
    }

    setIsFormOpen(false);
    setEditingGoal(null);
    e.currentTarget.reset();
  };

  const handleEdit = (goal: Goal) => {
    setEditingGoal(goal);
    setIsFormOpen(true);
  };

  const handleDelete = async (id: string) => {
    if (confirm('Are you sure you want to delete this goal? All related time logs will also be deleted.')) {
      await goalService.delete(id);
    }
  };

  const handleToggleActive = async (id: string) => {
    await goalService.toggleActive(id);
  };

  const getCategoryColor = (category: GoalCategory) => {
    switch (category) {
      case 'learning': return '#4f46e5';
      case 'project': return '#10b981';
      case 'income': return '#f59e0b';
    }
  };

  return (
    <div className="goals-page">
      {isMobile ? (
        <div className="mobile-page-title">
          <h1>Goals</h1>
        </div>
      ) : (
        <div className="page-header">
          <div>
            <h1>Goals</h1>
            <p className="subtitle">Manage your learning, project, and income goals</p>
          </div>
          <button 
            className="btn btn-primary"
            onClick={() => {
              setEditingGoal(null);
              setIsFormOpen(true);
            }}
          >
            <Plus size={20} />
            New Goal
          </button>
        </div>
      )}

      {/* Mobile FAB */}
      {isMobile && (
        <button 
          className="mobile-fab"
          onClick={() => {
            setEditingGoal(null);
            setIsFormOpen(true);
          }}
          aria-label="Add Goal"
        >
          <Plus size={24} />
        </button>
      )}

      {/* Goal Form Modal */}
      {isFormOpen && (
        <div className="modal-overlay" onClick={() => setIsFormOpen(false)}>
          <div className="modal-content" onClick={(e) => e.stopPropagation()}>
            <h2>{editingGoal ? 'Edit Goal' : 'Create New Goal'}</h2>
            <form onSubmit={handleSubmit}>
              <div className="form-group">
                <label htmlFor="title">Goal Title *</label>
                <input
                  type="text"
                  id="title"
                  name="title"
                  required
                  defaultValue={editingGoal?.title}
                  placeholder="e.g., Learn Machine Learning"
                />
              </div>

              <div className="form-group">
                <label htmlFor="description">Description</label>
                <textarea
                  id="description"
                  name="description"
                  defaultValue={editingGoal?.description}
                  placeholder="What do you want to achieve?"
                />
              </div>

              <div className="form-row">
                <div className="form-group">
                  <label htmlFor="category">Category *</label>
                  <select
                    id="category"
                    name="category"
                    required
                    defaultValue={editingGoal?.category || 'learning'}
                  >
                    <option value="learning">Learning</option>
                    <option value="project">Project</option>
                    <option value="income">Income</option>
                  </select>
                </div>

                <div className="form-group">
                  <label htmlFor="weeklyHourTarget">Weekly Hours Target *</label>
                  <input
                    type="number"
                    id="weeklyHourTarget"
                    name="weeklyHourTarget"
                    required
                    min="0"
                    step="0.5"
                    defaultValue={editingGoal?.weeklyHourTarget || 20}
                  />
                </div>
              </div>

              <div className="form-row">
                <div className="form-group">
                  <label htmlFor="startDate">Start Date *</label>
                  <input
                    type="date"
                    id="startDate"
                    name="startDate"
                    required
                    defaultValue={editingGoal?.startDate.split('T')[0]}
                  />
                </div>

                <div className="form-group">
                  <label htmlFor="endDate">End Date (Optional)</label>
                  <input
                    type="date"
                    id="endDate"
                    name="endDate"
                    defaultValue={editingGoal?.endDate?.split('T')[0]}
                  />
                </div>
              </div>

              <div className="form-group">
                <label htmlFor="rules">Rules (one per line)</label>
                <textarea
                  id="rules"
                  name="rules"
                  defaultValue={editingGoal?.rules.join('\n')}
                  placeholder="e.g.,&#10;Maintain digital notes&#10;Complete 1 project per month&#10;Publish articles regularly"
                  rows={5}
                />
              </div>

              <div className="form-actions">
                <button 
                  type="button" 
                  className="btn btn-secondary"
                  onClick={() => {
                    setIsFormOpen(false);
                    setEditingGoal(null);
                  }}
                >
                  Cancel
                </button>
                <button type="submit" className="btn btn-primary">
                  {editingGoal ? 'Update Goal' : 'Create Goal'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Goals List */}
      <div className="goals-list">
        {!goals || goals.length === 0 ? (
          <div className="empty-state card">
            <p>No goals yet. Create your first goal to get started!</p>
          </div>
        ) : (
          goals.map((goal) => (
            <div key={goal.id} className={`goal-card card ${!goal.isActive ? 'inactive' : ''}`}>
              <div className="goal-header">
                <div className="goal-title-section">
                  <div 
                    className="category-badge"
                    style={{ background: getCategoryColor(goal.category) }}
                  >
                    {goal.category}
                  </div>
                  <h3>{goal.title}</h3>
                </div>
                <div className="goal-actions">
                  <button
                    className="icon-btn"
                    onClick={() => handleToggleActive(goal.id)}
                    title={goal.isActive ? 'Deactivate' : 'Activate'}
                  >
                    <Power size={18} style={{ color: goal.isActive ? 'var(--secondary)' : 'var(--text-tertiary)' }} />
                  </button>
                  <button
                    className="icon-btn"
                    onClick={() => handleEdit(goal)}
                    title="Edit"
                  >
                    <Edit2 size={18} />
                  </button>
                  <button
                    className="icon-btn"
                    onClick={() => handleDelete(goal.id)}
                    title="Delete"
                  >
                    <Trash2 size={18} />
                  </button>
                </div>
              </div>

              {goal.description && (
                <p className="goal-description">{goal.description}</p>
              )}

              <div className="goal-meta">
                <div className="meta-item">
                  <span className="meta-label">Target:</span>
                  <span className="meta-value">{goal.weeklyHourTarget}h/week</span>
                </div>
                <div className="meta-item">
                  <span className="meta-label">Started:</span>
                  <span className="meta-value">
                    {new Date(goal.startDate).toLocaleDateString()}
                  </span>
                </div>
                {goal.endDate && (
                  <div className="meta-item">
                    <span className="meta-label">Ends:</span>
                    <span className="meta-value">
                      {new Date(goal.endDate).toLocaleDateString()}
                    </span>
                  </div>
                )}
              </div>

              {goal.rules.length > 0 && (
                <div className="goal-rules">
                  <h4>Rules:</h4>
                  <ul>
                    {goal.rules.map((rule, index) => (
                      <li key={index}>{rule}</li>
                    ))}
                  </ul>
                </div>
              )}
            </div>
          ))
        )}
      </div>
    </div>
  );
}
