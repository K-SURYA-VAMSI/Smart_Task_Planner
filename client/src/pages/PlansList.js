import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { format } from 'date-fns';
import { plansApi } from '../services/api';
import { Eye, Trash2, Calendar, Clock, AlertCircle, RefreshCw } from 'lucide-react';

const PlansList = () => {
  const [plans, setPlans] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [deleteLoading, setDeleteLoading] = useState(null);

  useEffect(() => {
    fetchPlans();
  }, []);

  const fetchPlans = async () => {
    try {
      setLoading(true);
      setError(null);
      const data = await plansApi.getPlans();
      setPlans(data);
    } catch (error) {
      console.error('Error fetching plans:', error);
      setError('Failed to load plans. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Are you sure you want to delete this plan?')) {
      return;
    }

    try {
      setDeleteLoading(id);
      await plansApi.deletePlan(id);
      setPlans(plans.filter(plan => plan._id !== id));
    } catch (error) {
      console.error('Error deleting plan:', error);
      alert('Failed to delete plan. Please try again.');
    } finally {
      setDeleteLoading(null);
    }
  };

  const formatDate = (dateString) => {
    try {
      return format(new Date(dateString), 'MMM dd, yyyy');
    } catch {
      return 'Invalid Date';
    }
  };

  if (loading) {
    return (
      <div className="container" style={{ paddingTop: '2rem' }}>
        <div style={{ textAlign: 'center', padding: '3rem' }}>
          <div className="loading" style={{ fontSize: '1.125rem' }}>Loading plans...</div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="container" style={{ paddingTop: '2rem' }}>
        <div className="card">
          <div className="card-body" style={{ textAlign: 'center' }}>
            <AlertCircle size={48} style={{ margin: '0 auto 1rem', color: '#ef4444' }} />
            <h3 style={{ marginBottom: '1rem', color: '#ef4444' }}>Error Loading Plans</h3>
            <p style={{ color: '#6b7280', marginBottom: '1.5rem' }}>{error}</p>
            <button onClick={fetchPlans} className="btn btn-primary">
              <RefreshCw size={16} />
              Try Again
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="container" style={{ paddingTop: '2rem', paddingBottom: '2rem' }}>
      <div style={{ marginBottom: '2rem' }}>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '1rem' }}>
          <h1 style={{ fontSize: '2rem', fontWeight: '700', margin: 0 }}>
            Your Plans
          </h1>
          <Link to="/" className="btn btn-primary">
            Create New Plan
          </Link>
        </div>
        <p style={{ color: '#6b7280', margin: 0 }}>
          {plans.length} plan{plans.length !== 1 ? 's' : ''} created
        </p>
      </div>

      {plans.length === 0 ? (
        <div className="card">
          <div className="card-body" style={{ textAlign: 'center', padding: '3rem' }}>
            <Calendar size={48} style={{ margin: '0 auto 1rem', color: '#6b7280' }} />
            <h3 style={{ marginBottom: '1rem' }}>No plans yet</h3>
            <p style={{ color: '#6b7280', marginBottom: '1.5rem' }}>
              Create your first plan to get started with AI-powered task planning
            </p>
            <Link to="/" className="btn btn-primary">
              Create Your First Plan
            </Link>
          </div>
        </div>
      ) : (
        <div className="grid grid-cols-1" style={{ gap: '1.5rem' }}>
          {plans.map((plan) => (
            <div key={plan._id} className="card">
              <div className="card-body">
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '1rem' }}>
                  <div style={{ flex: 1 }}>
                    <h3 style={{ marginBottom: '0.5rem', fontSize: '1.25rem', fontWeight: '600' }}>
                      {plan.goal}
                    </h3>
                    <div style={{ display: 'flex', flexWrap: 'wrap', gap: '1rem', color: '#6b7280', fontSize: '0.875rem' }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '0.25rem' }}>
                        <Calendar size={14} />
                        <span>Created {formatDate(plan.createdAt)}</span>
                      </div>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '0.25rem' }}>
                        <Clock size={14} />
                        <span>{plan.horizonDays} days</span>
                      </div>
                      <div>
                        {plan.tasks?.length || 0} task{(plan.tasks?.length || 0) !== 1 ? 's' : ''}
                      </div>
                      {plan.llmModel && plan.llmModel !== 'fallback' && (
                        <div style={{ 
                          display: 'flex', 
                          alignItems: 'center', 
                          gap: '0.25rem',
                          padding: '0.25rem 0.5rem',
                          background: '#dbeafe',
                          color: '#1e40af',
                          borderRadius: '0.25rem',
                          fontSize: '0.75rem',
                          fontWeight: '500'
                        }}>
                          🤖 AI Generated
                        </div>
                      )}
                    </div>
                  </div>
                  
                  <div style={{ display: 'flex', gap: '0.5rem', marginLeft: '1rem' }}>
                    <Link 
                      to={`/plans/${plan._id}`} 
                      className="btn btn-secondary"
                      style={{ textDecoration: 'none' }}
                    >
                      <Eye size={16} />
                      View
                    </Link>
                    <button
                      onClick={() => handleDelete(plan._id)}
                      className="btn btn-danger"
                      disabled={deleteLoading === plan._id}
                    >
                      {deleteLoading === plan._id ? (
                        <span className="loading" style={{ fontSize: '0.875rem' }} />
                      ) : (
                        <Trash2 size={16} />
                      )}
                    </button>
                  </div>
                </div>

                {plan.tasks && plan.tasks.length > 0 && (
                  <div>
                    <h4 style={{ marginBottom: '0.75rem', fontSize: '1rem', fontWeight: '500' }}>
                      Upcoming Tasks:
                    </h4>
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
                      {plan.tasks.slice(0, 3).map((task, index) => (
                        <div 
                          key={index}
                          style={{ 
                            display: 'flex', 
                            alignItems: 'center', 
                            gap: '0.5rem',
                            padding: '0.5rem',
                            background: '#f8fafc',
                            borderRadius: '0.25rem',
                            fontSize: '0.875rem'
                          }}
                        >
                          <span style={{ 
                            width: '1.5rem', 
                            height: '1.5rem', 
                            background: '#e2e8f0', 
                            color: '#475569',
                            borderRadius: '50%',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            fontSize: '0.75rem',
                            fontWeight: '600',
                            flexShrink: 0
                          }}>
                            {index + 1}
                          </span>
                          <span style={{ flex: 1 }}>{task.title}</span>
                          {task.startDate && (
                            <span style={{ color: '#6b7280' }}>
                              {formatDate(task.startDate)}
                            </span>
                          )}
                        </div>
                      ))}
                      {plan.tasks.length > 3 && (
                        <div style={{ 
                          textAlign: 'center', 
                          color: '#6b7280', 
                          fontSize: '0.875rem',
                          padding: '0.5rem'
                        }}>
                          +{plan.tasks.length - 3} more task{plan.tasks.length - 3 !== 1 ? 's' : ''}
                        </div>
                      )}
                    </div>
                  </div>
                )}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default PlansList;