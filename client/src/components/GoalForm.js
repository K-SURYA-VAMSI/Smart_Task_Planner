import React, { useState } from 'react';
import { Send, Calendar, Clock } from 'lucide-react';

const GoalForm = ({ onSubmit, loading = false }) => {
  const [formData, setFormData] = useState({
    goal: '',
    horizonDays: 14,
    startDate: new Date().toISOString().split('T')[0]
  });
  const [errors, setErrors] = useState({});

  const handleChange = (e) => {
    const { name, value, type } = e.target;
    
    let processedValue = value;
    if (type === 'number') {
      // Handle number inputs safely
      const numberValue = parseInt(value, 10);
      processedValue = isNaN(numberValue) ? '' : numberValue;
    }
    
    setFormData(prev => ({
      ...prev,
      [name]: processedValue
    }));
    
    // Clear error when user starts typing
    if (errors[name]) {
      setErrors(prev => ({ ...prev, [name]: '' }));
    }
  };

  const validateForm = () => {
    const newErrors = {};
    
    if (!formData.goal.trim()) {
      newErrors.goal = 'Goal is required';
    } else if (formData.goal.trim().length < 5) {
      newErrors.goal = 'Goal must be at least 5 characters long';
    }
    
    const days = Number(formData.horizonDays);
    if (!formData.horizonDays || isNaN(days) || days < 1 || days > 365) {
      newErrors.horizonDays = 'Timeline must be between 1 and 365 days';
    }
    
    if (!formData.startDate) {
      newErrors.startDate = 'Start date is required';
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (validateForm()) {
      onSubmit({
        goal: formData.goal.trim(),
        horizonDays: Number(formData.horizonDays),
        startDate: new Date(formData.startDate).toISOString()
      });
    }
  };

  return (
    <div className="card">
      <div className="card-header">
        <h2 className="card-title">Create Your Smart Task Plan</h2>
        <p style={{ color: '#6b7280', margin: 0 }}>
          Describe your goal and let AI break it down into actionable tasks with timelines
        </p>
      </div>
      
      <div className="card-body">
        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label htmlFor="goal" className="form-label">
              What do you want to achieve?
            </label>
            <textarea
              id="goal"
              name="goal"
              value={formData.goal}
              onChange={handleChange}
              className={`input textarea ${errors.goal ? 'error' : ''}`}
              placeholder="e.g., Launch a product in 2 weeks, Learn React in 30 days, Organize a conference..."
              rows="3"
              disabled={loading}
            />
            {errors.goal && <div className="error-message">{errors.goal}</div>}
          </div>

          <div className="grid grid-cols-2">
            <div className="form-group">
              <label htmlFor="horizonDays" className="form-label">
                <Clock size={16} style={{ display: 'inline', marginRight: '0.5rem' }} />
                Timeline (Days)
              </label>
              <input
                id="horizonDays"
                name="horizonDays"
                type="number"
                value={formData.horizonDays || ''}
                onChange={handleChange}
                className={`input ${errors.horizonDays ? 'error' : ''}`}
                min="1"
                max="365"
                disabled={loading}
              />
              {errors.horizonDays && <div className="error-message">{errors.horizonDays}</div>}
            </div>

            <div className="form-group">
              <label htmlFor="startDate" className="form-label">
                <Calendar size={16} style={{ display: 'inline', marginRight: '0.5rem' }} />
                Start Date
              </label>
              <input
                id="startDate"
                name="startDate"
                type="date"
                value={formData.startDate}
                onChange={handleChange}
                className={`input ${errors.startDate ? 'error' : ''}`}
                disabled={loading}
              />
              {errors.startDate && <div className="error-message">{errors.startDate}</div>}
            </div>
          </div>

          <button 
            type="submit" 
            className="btn btn-primary"
            disabled={loading}
            style={{ width: '100%' }}
          >
            {loading ? (
              <span className="loading">Generating plan...</span>
            ) : (
              <>
                <Send size={16} />
                Generate Smart Plan
              </>
            )}
          </button>
        </form>
      </div>
    </div>
  );
};

export default GoalForm;