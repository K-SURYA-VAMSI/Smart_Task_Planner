import React from 'react';
import { format } from 'date-fns';
import { Calendar, Clock, Users, CheckCircle, Circle, AlertCircle } from 'lucide-react';

const TaskTimeline = ({ plan, onTaskUpdate }) => {
  if (!plan || !plan.tasks || plan.tasks.length === 0) {
    return (
      <div className="card">
        <div className="card-body" style={{ textAlign: 'center', color: '#6b7280' }}>
          <AlertCircle size={48} style={{ margin: '0 auto 1rem' }} />
          <p>No tasks available</p>
        </div>
      </div>
    );
  }

  const formatDate = (dateString) => {
    try {
      return format(new Date(dateString), 'MMM dd, yyyy');
    } catch {
      return 'Invalid Date';
    }
  };

  const getTaskStatus = (task, index) => {
    const now = new Date();
    const startDate = new Date(task.startDate);
    const endDate = new Date(task.endDate);
    
    if (now > endDate) return 'completed';
    if (now >= startDate) return 'in-progress';
    return 'pending';
  };

  const getStatusIcon = (status) => {
    switch (status) {
      case 'completed':
        return <CheckCircle size={16} color="#10b981" />;
      case 'in-progress':
        return <Clock size={16} color="#f59e0b" />;
      default:
        return <Circle size={16} color="#6b7280" />;
    }
  };

  const getStatusBadge = (status) => {
    const statusClasses = {
      completed: 'status-badge status-completed',
      'in-progress': 'status-badge status-in-progress',
      pending: 'status-badge status-pending'
    };
    
    return (
      <span className={statusClasses[status] || statusClasses.pending}>
        {status.replace('-', ' ')}
      </span>
    );
  };

  return (
    <div className="card">
      <div className="card-header">
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
          <div>
            <h3 className="card-title">Task Timeline</h3>
            <p style={{ color: '#6b7280', margin: 0 }}>
              {plan.tasks.length} tasks • {plan.horizonDays} days
            </p>
          </div>
          {plan.aiGenerated && (
            <div style={{ 
              display: 'flex', 
              alignItems: 'center', 
              gap: '0.5rem',
              padding: '0.5rem 1rem',
              background: '#dbeafe',
              color: '#1e40af',
              borderRadius: '0.5rem',
              fontSize: '0.875rem',
              fontWeight: '500'
            }}>
              🤖 AI Generated
            </div>
          )}
        </div>
      </div>
      
      <div className="card-body">
        <div className="goal-summary" style={{ marginBottom: '2rem', padding: '1rem', background: '#f8fafc', borderRadius: '0.5rem' }}>
          <h4 style={{ marginBottom: '0.5rem', color: '#1e293b' }}>Goal:</h4>
          <p style={{ color: '#475569', margin: 0 }}>{plan.goal}</p>
        </div>

        <div className="timeline">
          {plan.tasks.map((task, index) => {
            const status = getTaskStatus(task, index);
            return (
              <div key={index} className={`task-item ${status}`}>
                <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', marginBottom: '0.75rem' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                    {getStatusIcon(status)}
                    <div>
                      <div className="task-title">
                        Task {index + 1}: {task.title}
                      </div>
                      {getStatusBadge(status)}
                    </div>
                  </div>
                </div>
                
                {task.description && (
                  <div className="task-description">
                    {task.description}
                  </div>
                )}
                
                <div className="task-meta">
                  <div className="task-dates">
                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.25rem' }}>
                      <Calendar size={14} />
                      <span>{formatDate(task.startDate)} → {formatDate(task.endDate)}</span>
                    </div>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.25rem' }}>
                      <Clock size={14} />
                      <span>{task.estimatedDays} day{task.estimatedDays !== 1 ? 's' : ''}</span>
                    </div>
                  </div>
                  
                  {task.dependsOn && task.dependsOn.length > 0 && (
                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                      <Users size={14} />
                      <span>Depends on:</span>
                      <div style={{ display: 'flex', gap: '0.25rem' }}>
                        {task.dependsOn.map((dep, depIndex) => (
                          <span key={depIndex} className="dependency-badge">
                            Task {dep + 1}
                          </span>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};

export default TaskTimeline;