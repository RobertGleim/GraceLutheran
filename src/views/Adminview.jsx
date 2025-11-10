import { useState, useContext } from 'react';
import { AuthContext } from '../contexts/AuthContext';
import PastorMessages from '../components/admin/PastorMessages';
import UserManage from '../components/admin/UserManage'; // added import
import './AdminView.css';

function AdminView() {
  const { user } = useContext(AuthContext);
  const [currentView, setCurrentView] = useState('dashboard');

  if (user?.role !== 'admin') {
    return (
      <div className="admin-view">
        <div className="access-denied">
          <h1>Access Denied</h1>
          <p>Admin privileges required to access this page.</p>
        </div>
      </div>
    );
  }

  // Render different views based on currentView state
  const renderView = () => {
    switch (currentView) {
      case 'pastor-messages':
        return <PastorMessages />;
      case 'user-management':
        return <UserManage />; // new route/view
      case 'dashboard':
      default:
        return (
          <div className="admin-dashboard">
            <h1>Admin Dashboard</h1>
            <p className="dashboard-subtitle">Manage church website content and features</p>
            
            <div className="admin-features">
              <div className="feature-card" onClick={() => setCurrentView('pastor-messages')}>
                <div className="feature-icon">
                  📝
                </div>
                <h3>Pastor Messages</h3>
                <p>Create, edit, and manage messages from the pastor displayed on the homepage</p>
                <div className="feature-arrow">→</div>
              </div>
              
              {/* Replaced disabled User Management card with active navigation */}
              <div className="feature-card" onClick={() => setCurrentView('user-management')}>
                <div className="feature-icon">
                  👥
                </div>
                <h3>User Management</h3>
                <p>View and manage user accounts, edit details, and grant admin privileges</p>
                <div className="feature-arrow">→</div>
              </div>
              
              {/* Placeholder for future features */}
              <div className="feature-card disabled">
                <div className="feature-icon">
                  📅
                </div>
                <h3>Events Management</h3>
                <p>Coming soon - Manage church events and calendar</p>
                <div className="feature-status">Coming Soon</div>
              </div>
              
              <div className="feature-card disabled">
                <div className="feature-icon">
                  📊
                </div>
                <h3>Analytics</h3>
                <p>Coming soon - View website statistics and engagement metrics</p>
                <div className="feature-status">Coming Soon</div>
              </div>
            </div>
          </div>
        );
    }
  };

  return (
    <div className="admin-view">
      {currentView !== 'dashboard' && (
        <div className="admin-nav">
          <button 
            className="back-button" 
            onClick={() => setCurrentView('dashboard')}
          >
            ← Back to Dashboard
          </button>
        </div>
      )}
      {renderView()}
    </div>
  );
}

export default AdminView;