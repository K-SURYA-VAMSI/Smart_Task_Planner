import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import GoalForm from '../components/GoalForm';
import TaskTimeline from '../components/TaskTimeline';
import { plansApi, healthCheck } from '../services/api';
import { AlertCircle, CheckCircle, Wifi, WifiOff } from 'lucide-react';

const Home = () => {
  const [currentPlan, setCurrentPlan] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(false);
  const [serverStatus, setServerStatus] = useState('checking');
  const navigate = useNavigate();

  useEffect(() => {
    checkServerHealth();
  }, []);

  const checkServerHealth = async () => {
    try {
      await healthCheck();
      setServerStatus('online');
    } catch (error) {
      setServerStatus('offline');
      setError('Backend server is not responding. Please make sure the server is running.');
    }
  };

  const handleGoalSubmit = async (goalData) => {
    setLoading(true);
    setError(null);
    setSuccess(false);

    try {
      console.log('Submitting goal:', goalData);
      const plan = await plansApi.generatePlan(goalData);
      setCurrentPlan(plan);
      setSuccess(true);
      
      // Navigate to the plan detail page
      setTimeout(() => {
        navigate(`/plans/${plan._id}`);
      }, 2000);
    } catch (error) {
      console.error('Error generating plan:', error);
      setError(
        error.response?.data?.error || 
        error.message || 
        'Failed to generate plan. Please try again.'
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="container" style={{ paddingTop: '2rem', paddingBottom: '2rem' }}>
      {/* Server Status */}
      <div style={{ marginBottom: '2rem' }}>
        <div style={{ 
          display: 'flex', 
          alignItems: 'center', 
          gap: '0.5rem',
          padding: '0.75rem 1rem',
          borderRadius: '0.5rem',
          fontSize: '0.875rem',
          ...(serverStatus === 'online' 
            ? { background: '#dcfce7', color: '#166534' }
            : serverStatus === 'offline'
            ? { background: '#fee2e2', color: '#991b1b' }
            : { background: '#fef3c7', color: '#92400e' })
        }}>
          {serverStatus === 'online' && <Wifi size={16} />}
          {serverStatus === 'offline' && <WifiOff size={16} />}
          {serverStatus === 'checking' && <div className="loading" style={{ fontSize: '0.875rem' }} />}
          
          <span>
            {serverStatus === 'online' && 'Server is online and ready'}
            {serverStatus === 'offline' && 'Server is offline - some features may not work'}
            {serverStatus === 'checking' && 'Checking server status...'}
          </span>
        </div>
      </div>

      {/* Hero Section */}
      <div style={{ textAlign: 'center', marginBottom: '3rem' }}>
        <h1 style={{ 
          fontSize: '3rem', 
          fontWeight: '800', 
          marginBottom: '1rem',
          background: 'linear-gradient(135deg, #3b82f6, #8b5cf6)',
          WebkitBackgroundClip: 'text',
          WebkitTextFillColor: 'transparent',
          backgroundClip: 'text'
        }}>
          Smart Task Planner
        </h1>
        <p style={{ 
          fontSize: '1.25rem', 
          color: '#6b7280', 
          maxWidth: '600px', 
          margin: '0 auto' 
        }}>
          Break down your goals into actionable tasks with AI-powered planning and intelligent timelines
        </p>
      </div>

      {/* Error Message */}
      {error && (
        <div style={{ 
          display: 'flex', 
          alignItems: 'center', 
          gap: '0.5rem',
          padding: '1rem', 
          background: '#fee2e2', 
          color: '#991b1b', 
          borderRadius: '0.5rem', 
          marginBottom: '2rem' 
        }}>
          <AlertCircle size={20} />
          <span>{error}</span>
        </div>
      )}

      {/* Success Message */}
      {success && !error && (
        <div style={{ 
          display: 'flex', 
          alignItems: 'center', 
          gap: '0.5rem',
          padding: '1rem', 
          background: '#dcfce7', 
          color: '#166534', 
          borderRadius: '0.5rem', 
          marginBottom: '2rem' 
        }}>
          <CheckCircle size={20} />
          <span>Plan generated successfully! Redirecting to plan details...</span>
        </div>
      )}

      <div className="grid grid-cols-1" style={{ gap: '2rem' }}>
        {/* Goal Form */}
        <GoalForm 
          onSubmit={handleGoalSubmit} 
          loading={loading}
        />

        {/* Current Plan Preview */}
        {currentPlan && (
          <div>
            <h2 style={{ marginBottom: '1rem', fontSize: '1.5rem', fontWeight: '600' }}>
              Generated Plan Preview
            </h2>
            <TaskTimeline plan={currentPlan} />
          </div>
        )}

        {/* Features Section */}
        {!currentPlan && (
          <div className="card">
            <div className="card-body">
              <h3 style={{ marginBottom: '1.5rem', fontSize: '1.25rem', fontWeight: '600' }}>
                How it works
              </h3>
              <div className="grid grid-cols-1" style={{ gap: '1.5rem' }}>
                <div style={{ display: 'flex', gap: '1rem' }}>
                  <div style={{ 
                    width: '2rem', 
                    height: '2rem', 
                    background: '#dbeafe', 
                    color: '#1e40af',
                    borderRadius: '50%',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    fontWeight: '600',
                    flexShrink: 0
                  }}>1</div>
                  <div>
                    <h4 style={{ marginBottom: '0.5rem', fontWeight: '600' }}>Describe Your Goal</h4>
                    <p style={{ color: '#6b7280', margin: 0 }}>
                      Tell us what you want to achieve. Be specific about your objective and any constraints.
                    </p>
                  </div>
                </div>
                
                <div style={{ display: 'flex', gap: '1rem' }}>
                  <div style={{ 
                    width: '2rem', 
                    height: '2rem', 
                    background: '#dcfce7', 
                    color: '#166534',
                    borderRadius: '50%',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    fontWeight: '600',
                    flexShrink: 0
                  }}>2</div>
                  <div>
                    <h4 style={{ marginBottom: '0.5rem', fontWeight: '600' }}>AI-Powered Analysis</h4>
                    <p style={{ color: '#6b7280', margin: 0 }}>
                      Our AI analyzes your goal and breaks it down into actionable tasks with dependencies.
                    </p>
                  </div>
                </div>
                
                <div style={{ display: 'flex', gap: '1rem' }}>
                  <div style={{ 
                    width: '2rem', 
                    height: '2rem', 
                    background: '#fef3c7', 
                    color: '#92400e',
                    borderRadius: '50%',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    fontWeight: '600',
                    flexShrink: 0
                  }}>3</div>
                  <div>
                    <h4 style={{ marginBottom: '0.5rem', fontWeight: '600' }}>Smart Timeline</h4>
                    <p style={{ color: '#6b7280', margin: 0 }}>
                      Get a realistic timeline with start and end dates for each task based on dependencies.
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default Home;