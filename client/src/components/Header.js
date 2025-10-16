import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Target, List, Home } from 'lucide-react';

const Header = () => {
  const location = useLocation();

  const isActive = (path) => {
    if (path === '/' && location.pathname === '/') return true;
    if (path !== '/' && location.pathname.startsWith(path)) return true;
    return false;
  };

  return (
    <header style={{ 
      background: 'white', 
      boxShadow: '0 1px 3px rgba(0, 0, 0, 0.1)',
      position: 'sticky',
      top: 0,
      zIndex: 50 
    }}>
      <div className="container">
        <div style={{ 
          display: 'flex', 
          alignItems: 'center', 
          justifyContent: 'space-between',
          padding: '1rem 0'
        }}>
          <Link 
            to="/" 
            style={{ 
              display: 'flex', 
              alignItems: 'center', 
              gap: '0.5rem',
              textDecoration: 'none',
              color: '#1e293b',
              fontSize: '1.5rem',
              fontWeight: '700'
            }}
          >
            <Target size={28} color="#3b82f6" />
            Smart Task Planner
          </Link>
          
          <nav>
            <div style={{ display: 'flex', gap: '1rem' }}>
              <Link 
                to="/" 
                className={`btn ${isActive('/') ? 'btn-primary' : 'btn-secondary'}`}
                style={{ textDecoration: 'none' }}
              >
                <Home size={16} />
                Create Plan
              </Link>
              <Link 
                to="/plans" 
                className={`btn ${isActive('/plans') ? 'btn-primary' : 'btn-secondary'}`}
                style={{ textDecoration: 'none' }}
              >
                <List size={16} />
                View Plans
              </Link>
            </div>
          </nav>
        </div>
      </div>
    </header>
  );
};

export default Header;