import React, { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { format } from 'date-fns';
import TaskTimeline from '../components/TaskTimeline';
import { plansApi } from '../services/api';
import { ArrowLeft, Calendar, Clock, Edit3, Trash2, Download, Share2, AlertCircle, RefreshCw } from 'lucide-react';

const PlanDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [plan, setPlan] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [deleteLoading, setDeleteLoading] = useState(false);

  useEffect(() => {
    if (id) {
      fetchPlan();
    }
  }, [id]);

  const fetchPlan = async () => {
    try {
      setLoading(true);
      setError(null);
      const data = await plansApi.getPlan(id);
      setPlan(data);
    } catch (error) {
      console.error('Error fetching plan:', error);
      if (error.response?.status === 404) {
        setError('Plan not found. It may have been deleted.');
      } else {
        setError('Failed to load plan. Please try again.');
      }
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async () => {
    if (!window.confirm('Are you sure you want to delete this plan? This action cannot be undone.')) {
      return;
    }

    try {
      setDeleteLoading(true);
      await plansApi.deletePlan(id);
      navigate('/plans');
    } catch (error) {
      console.error('Error deleting plan:', error);
      alert('Failed to delete plan. Please try again.');
    } finally {
      setDeleteLoading(false);
    }
  };

  const handleExport = () => {
    if (!plan) return;

    const exportData = {
      goal: plan.goal,
      horizonDays: plan.horizonDays,
      createdAt: plan.createdAt,
      tasks: plan.tasks.map(task => ({
        title: task.title,
        description: task.description,
        startDate: task.startDate,
        endDate: task.endDate,
        estimatedDays: task.estimatedDays,
        dependsOn: task.dependsOn
      }))
    };

    const dataStr = JSON.stringify(exportData, null, 2);
    const dataBlob = new Blob([dataStr], { type: 'application/json' });
    const url = URL.createObjectURL(dataBlob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `plan-${plan.goal.replace(/[^a-zA-Z0-9]/g, '-').toLowerCase()}.json`;
    link.click();
    URL.revokeObjectURL(url);
  };

  const handleShare = async () => {
    if (navigator.share) {
      try {
        await navigator.share({
          title: `Plan: ${plan.goal}`,
          text: `Check out my task plan: ${plan.goal}`,
          url: window.location.href
        });
      } catch (error) {
        console.log('Error sharing:', error);
      }
    } else {
      // Fallback: copy to clipboard
      try {
        await navigator.clipboard.writeText(window.location.href);
        alert('Plan URL copied to clipboard!');
      } catch (error) {
        console.log('Error copying to clipboard:', error);
      }
    }
  };

  const formatDate = (dateString) => {
    try {
      return format(new Date(dateString), 'MMM dd, yyyy');
    } catch {
      return 'Invalid Date';
    }
  };

  const formatDateTime = (dateString) => {
    try {
      return format(new Date(dateString), 'MMM dd, yyyy • h:mm a');
    } catch {
      return 'Invalid Date';
    }
  };

  if (loading) {
    return (
      <div className="container" style={{ paddingTop: '2rem' }}>
        <div style={{ textAlign: 'center', padding: '3rem' }}>
          <div className="loading" style={{ fontSize: '1.125rem' }}>Loading plan...</div>
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
            <h3 style={{ marginBottom: '1rem', color: '#ef4444' }}>Error Loading Plan</h3>
            <p style={{ color: '#6b7280', marginBottom: '1.5rem' }}>{error}</p>
            <div style={{ display: 'flex', gap: '1rem', justifyContent: 'center' }}>
              <button onClick={fetchPlan} className="btn btn-primary">
                <RefreshCw size={16} />
                Try Again
              </button>
              <Link to="/plans" className="btn btn-secondary">
                <ArrowLeft size={16} />
                Back to Plans
              </Link>
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (!plan) {
    return null;
  }

  return (
    <div className="container" style={{ paddingTop: '2rem', paddingBottom: '2rem' }}>
      {/* Header */}
      <div style={{ marginBottom: '2rem' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', marginBottom: '1rem' }}>
          <Link to="/plans" className="btn btn-secondary">
            <ArrowLeft size={16} />
            Back to Plans
          </Link>
          
          <div style={{ flex: 1 }}>
            <h1 style={{ fontSize: '2rem', fontWeight: '700', margin: 0 }}>
              Plan Details
            </h1>
          </div>

          <div style={{ display: 'flex', gap: '0.5rem' }}>
            <button onClick={handleShare} className="btn btn-secondary">
              <Share2 size={16} />
              Share
            </button>
            <button onClick={handleExport} className="btn btn-secondary">
              <Download size={16} />
              Export
            </button>
            <button
              onClick={handleDelete}
              className="btn btn-danger"
              disabled={deleteLoading}
            >
              {deleteLoading ? (
                <span className="loading" style={{ fontSize: '0.875rem' }} />
              ) : (
                <Trash2 size={16} />
              )}
              Delete
            </button>
          </div>
        </div>

        {/* Plan Meta Info */}
        <div className="card" style={{ marginBottom: '2rem' }}>
          <div className="card-body">
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: '2rem', alignItems: 'center', marginBottom: '1rem' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                <Calendar size={16} color="#6b7280" />
                <span style={{ color: '#6b7280' }}>Created:</span>
                <span style={{ fontWeight: '500' }}>{formatDateTime(plan.createdAt)}</span>
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                <Clock size={16} color="#6b7280" />
                <span style={{ color: '#6b7280' }}>Timeline:</span>
                <span style={{ fontWeight: '500' }}>{plan.horizonDays} days</span>
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                <Edit3 size={16} color="#6b7280" />
                <span style={{ color: '#6b7280' }}>Tasks:</span>
                <span style={{ fontWeight: '500' }}>{plan.tasks?.length || 0}</span>
              </div>
              {plan.llmModel && plan.llmModel !== 'fallback' && (
                <div style={{ 
                  display: 'flex', 
                  alignItems: 'center', 
                  gap: '0.25rem',
                  padding: '0.25rem 0.75rem',
                  background: '#dbeafe',
                  color: '#1e40af',
                  borderRadius: '9999px',
                  fontSize: '0.75rem',
                  fontWeight: '500'
                }}>
                  🤖 AI Generated
                </div>
              )}
            </div>
            
            <div>
              <h3 style={{ marginBottom: '0.5rem', fontSize: '1.125rem', fontWeight: '600' }}>Goal:</h3>
              <p style={{ color: '#374151', margin: 0, fontSize: '1.125rem' }}>{plan.goal}</p>
            </div>
          </div>
        </div>
      </div>

      {/* Task Timeline */}
      <TaskTimeline plan={plan} />

      {/* Plan Statistics */}
      {plan.tasks && plan.tasks.length > 0 && (
        <div className="card" style={{ marginTop: '2rem' }}>
          <div className="card-header">
            <h3 className="card-title">Plan Statistics</h3>
          </div>
          <div className="card-body">
            <div className="grid grid-cols-2" style={{ gap: '2rem' }}>
              <div>
                <h4 style={{ marginBottom: '1rem', fontSize: '1rem', fontWeight: '600' }}>Task Distribution</h4>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                    <span>Total Tasks:</span>
                    <span style={{ fontWeight: '600' }}>{plan.tasks.length}</span>
                  </div>
                  <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                    <span>With Dependencies:</span>
                    <span style={{ fontWeight: '600' }}>
                      {plan.tasks.filter(task => task.dependsOn && task.dependsOn.length > 0).length}
                    </span>
                  </div>
                  <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                    <span>Average Duration:</span>
                    <span style={{ fontWeight: '600' }}>
                      {Math.round(plan.tasks.reduce((sum, task) => sum + (task.estimatedDays || 0), 0) / plan.tasks.length)} days
                    </span>
                  </div>
                </div>
              </div>
              
              <div>
                <h4 style={{ marginBottom: '1rem', fontSize: '1rem', fontWeight: '600' }}>Timeline</h4>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
                  {plan.tasks.length > 0 && plan.tasks[0].startDate && (
                    <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                      <span>Start Date:</span>
                      <span style={{ fontWeight: '600' }}>{formatDate(plan.tasks[0].startDate)}</span>
                    </div>
                  )}
                  {plan.tasks.length > 0 && plan.tasks[plan.tasks.length - 1].endDate && (
                    <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                      <span>End Date:</span>
                      <span style={{ fontWeight: '600' }}>{formatDate(plan.tasks[plan.tasks.length - 1].endDate)}</span>
                    </div>
                  )}
                  <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                    <span>Total Duration:</span>
                    <span style={{ fontWeight: '600' }}>{plan.horizonDays} days</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default PlanDetail;