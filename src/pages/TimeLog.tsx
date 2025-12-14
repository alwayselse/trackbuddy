import { useState, useEffect } from 'react';
import { useLiveQuery } from 'dexie-react-hooks';
import { goalService } from '@/services/goalService';
import { timeLogService } from '@/services/timeLogService';
import type { TimeLog, NewTimeLog } from '@/types';
import { Plus, Edit2, Trash2, Clock } from 'lucide-react';
import './TimeLog.css';

export default function TimeLog() {
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [editingLog, setEditingLog] = useState<TimeLog | null>(null);
  const [selectedDate, setSelectedDate] = useState(new Date().toISOString().split('T')[0]);
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const checkMobile = () => setIsMobile(window.innerWidth <= 768);
    checkMobile();
    window.addEventListener('resize', checkMobile);
    return () => window.removeEventListener('resize', checkMobile);
  }, []);

  const activeGoals = useLiveQuery(() => goalService.getActive(), []);
  const timeLogs = useLiveQuery(() => timeLogService.getAll(), []);

  // Filter logs by selected date
  const filteredLogs = timeLogs?.filter(log => log.date === selectedDate) || [];

  // Calculate total hours for selected date
  const totalHours = filteredLogs.reduce((sum, log) => sum + log.hoursSpent, 0);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);
    
    const logData: NewTimeLog = {
      goalId: formData.get('goalId') as string,
      date: formData.get('date') as string,
      activity: formData.get('activity') as string,
      hoursSpent: Number(formData.get('hoursSpent')),
      reflection: (formData.get('reflection') as string) || undefined,
    };

    if (editingLog) {
      await timeLogService.update(editingLog.id, logData);
    } else {
      await timeLogService.create(logData);
    }

    setIsFormOpen(false);
    setEditingLog(null);
    e.currentTarget.reset();
  };

  const handleEdit = (log: TimeLog) => {
    setEditingLog(log);
    setIsFormOpen(true);
  };

  const handleDelete = async (id: string) => {
    if (confirm('Are you sure you want to delete this time log?')) {
      await timeLogService.delete(id);
    }
  };

  const handleQuickLog = () => {
    setEditingLog(null);
    setIsFormOpen(true);
  };

  return (
    <div className="timelog-page">
      {/* Desktop Header */}
      {!isMobile && (
        <div className="page-header">
          <div>
            <h1>Time Log</h1>
            <p className="subtitle">Track your daily progress</p>
          </div>
          <button 
            className="btn btn-primary"
            onClick={handleQuickLog}
          >
            <Plus size={20} />
            Quick Log
          </button>
        </div>
      )}

      {/* Mobile-Only: Compact Title */}
      {isMobile && (
        <div className="mobile-page-title">
          <h1>Time Log</h1>
        </div>
      )}

      {/* Mobile-Only: Date Bar */}
      {isMobile && (
        <div className="mobile-date-bar">
          <input
            type="date"
            value={selectedDate}
            onChange={(e) => setSelectedDate(e.target.value)}
            max={new Date().toISOString().split('T')[0]}
            className="mobile-date-input"
          />
          <div className="mobile-hours-badge">
            <Clock size={16} />
            <span><strong>{totalHours.toFixed(1)}</strong> hrs</span>
          </div>
        </div>
      )}

      {/* Desktop: Controls Card */}
      {!isMobile && (
        <div className="timelog-controls card">
          <div className="date-selector">
            <label htmlFor="dateFilter">Select Date:</label>
            <input
              type="date"
              id="dateFilter"
              value={selectedDate}
              onChange={(e) => setSelectedDate(e.target.value)}
              max={new Date().toISOString().split('T')[0]}
            />
          </div>
          <div className="day-summary">
            <Clock size={20} />
            <span className="summary-text">
              <strong>{totalHours.toFixed(1)} hours</strong> logged on{' '}
              {new Date(selectedDate + 'T00:00:00').toLocaleDateString('en-US', { 
                month: 'long', 
                day: 'numeric', 
                year: 'numeric' 
              })}
            </span>
          </div>
        </div>
      )}

      {/* Mobile-Only: FAB */}
      {isMobile && (
        <button 
          className="mobile-fab"
          onClick={handleQuickLog}
          aria-label="Add time log"
        >
          <Plus size={24} />
        </button>
      )}

      {/* Time Log Form Modal */}
      {isFormOpen && (
        <div className="modal-overlay" onClick={() => setIsFormOpen(false)}>
          <div className="modal-content" onClick={(e) => e.stopPropagation()}>
            <h2>{editingLog ? 'Edit Time Log' : 'Log Time'}</h2>
            <form onSubmit={handleSubmit}>
              <div className="form-group">
                <label htmlFor="date">Date *</label>
                <input
                  type="date"
                  id="date"
                  name="date"
                  required
                  defaultValue={editingLog?.date || selectedDate}
                  max={new Date().toISOString().split('T')[0]}
                />
              </div>

              <div className="form-group">
                <label htmlFor="goalId">Goal *</label>
                <select
                  id="goalId"
                  name="goalId"
                  required
                  defaultValue={editingLog?.goalId}
                >
                  <option value="">Select a goal...</option>
                  {activeGoals?.map(goal => (
                    <option key={goal.id} value={goal.id}>
                      {goal.title} ({goal.category})
                    </option>
                  ))}
                </select>
              </div>

              <div className="form-group">
                <label htmlFor="activity">Activity *</label>
                <input
                  type="text"
                  id="activity"
                  name="activity"
                  required
                  defaultValue={editingLog?.activity}
                  placeholder="e.g., Completed Python tutorial, Built API endpoint"
                />
              </div>

              <div className="form-group">
                <label htmlFor="hoursSpent">Hours Spent *</label>
                <input
                  type="number"
                  id="hoursSpent"
                  name="hoursSpent"
                  required
                  min="0.25"
                  max="24"
                  step="0.25"
                  defaultValue={editingLog?.hoursSpent || 1}
                />
              </div>

              <div className="form-group">
                <label htmlFor="reflection">Reflection (Optional)</label>
                <textarea
                  id="reflection"
                  name="reflection"
                  defaultValue={editingLog?.reflection}
                  placeholder="How did it go? What did you learn?"
                  rows={3}
                />
              </div>

              <div className="form-actions">
                <button 
                  type="button" 
                  className="btn btn-secondary"
                  onClick={() => {
                    setIsFormOpen(false);
                    setEditingLog(null);
                  }}
                >
                  Cancel
                </button>
                <button type="submit" className="btn btn-primary">
                  {editingLog ? 'Update Log' : 'Log Time'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Time Logs List */}
      <div className="timelogs-list">
        {filteredLogs.length === 0 ? (
          <div className="empty-state card">
            <p>No time logged for this date. Start tracking your progress!</p>
            <button 
              className="btn btn-primary"
              onClick={handleQuickLog}
            >
              <Plus size={20} />
              Log Time
            </button>
          </div>
        ) : (
          filteredLogs.map((log) => {
            const goal = activeGoals?.find(g => g.id === log.goalId);
            return (
              <div key={log.id} className="timelog-card card">
                <div className="timelog-header">
                  <div className="timelog-info">
                    {goal && (
                      <span className="goal-tag" style={{ 
                        background: goal.category === 'learning' ? '#4f46e5' : 
                                   goal.category === 'project' ? '#10b981' : '#f59e0b'
                      }}>
                        {goal.title}
                      </span>
                    )}
                    <h3>{log.activity}</h3>
                  </div>
                  <div className="timelog-actions">
                    <span className="hours-badge">{log.hoursSpent}h</span>
                    <button
                      className="icon-btn"
                      onClick={() => handleEdit(log)}
                      title="Edit"
                    >
                      <Edit2 size={18} />
                    </button>
                    <button
                      className="icon-btn"
                      onClick={() => handleDelete(log.id)}
                      title="Delete"
                    >
                      <Trash2 size={18} />
                    </button>
                  </div>
                </div>
                {log.reflection && (
                  <p className="timelog-reflection">{log.reflection}</p>
                )}
                <div className="timelog-meta">
                  <span className="timestamp">
                    Logged {new Date(log.createdAt).toLocaleString()}
                  </span>
                </div>
              </div>
            );
          })
        )}
      </div>

      {/* Recent Logs from Other Days */}
      {selectedDate === new Date().toISOString().split('T')[0] && (
        <div className="recent-section">
          <h2>Recent Logs</h2>
          <div className="recent-logs">
            {timeLogs?.slice(0, 10).map((log) => {
              if (log.date === selectedDate) return null;
              const goal = activeGoals?.find(g => g.id === log.goalId);
              return (
                <div key={log.id} className="recent-log-item card">
                  <div className="recent-log-date">
                    {new Date(log.date).toLocaleDateString('en-US', { 
                      month: 'short', 
                      day: 'numeric' 
                    })}
                  </div>
                  <div className="recent-log-content">
                    <h4>{log.activity}</h4>
                    {goal && <span className="recent-goal-name">{goal.title}</span>}
                  </div>
                  <div className="recent-log-hours">{log.hoursSpent}h</div>
                </div>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
}
