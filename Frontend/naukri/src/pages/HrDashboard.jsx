import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import AddJob from '../components/AddJob';
import './HrDashboard.css';

function HrDashboard() {
  const [username, setUsername] = useState('');
  const [showAddForm, setShowAddForm] = useState(false);
  const [metrics, setMetrics] = useState({
    activeCandidates: 42,
    newApplications: 12,
    interviewsScheduled: 8,
    activeJobs: 8,
    draftJobs: 3,
    closedJobs: 5,
    hiringConversion: 65,
  });
  const navigate = useNavigate();

  useEffect(() => {
    const storedName = localStorage.getItem('username');
    const role = localStorage.getItem('role');

    if (role !== 'hr') {
      navigate('/login');
    } else {
      setUsername(storedName || 'HR Manager');

    }
  }, [navigate]);

  const handleAddJobSuccess = () => {
    setShowAddForm(false);
    setMetrics((prev) => ({
      ...prev,
      activeJobs: prev.activeJobs + 1,
    }));
  };

  const handleLogout = () => {
    localStorage.removeItem('username');
    localStorage.removeItem('role');
    navigate('/login');
  };

  const recentActivities = [
    {
      id: 1,
      type: 'job_posted',
      title: 'Posted new job: Senior UX Designer',
      time: '2 hours ago',
      icon: '📝',
    },
    {
      id: 2,
      type: 'new_applications',
      title: '5 new applications for Frontend Developer',
      time: 'Today, 10:30 AM',
      icon: '👥',
    },
    {
      id: 3,
      type: 'interview_scheduled',
      title: 'Interview scheduled with Ravi Kumar (React Developer)',
      time: 'Tomorrow, 11:00 AM',
      icon: '📅',
    },
    {
      id: 4,
      type: 'offer_sent',
      title: 'Offer sent to Priya Sharma for UI Designer position',
      time: 'Yesterday, 4:45 PM',
      icon: '✉️',
    },
  ];

  const upcomingEvents = [
    {
      id: 1,
      title: 'Technical Round - Frontend Developer',
      time: 'Today, 2:30 PM',
      candidate: 'Amit Patel',
    },
    {
      id: 2,
      title: 'HR Discussion - UX Designer',
      time: 'Tomorrow, 11:00 AM',
      candidate: 'Neha Gupta',
    },
  ];

  return (
    <div className="hr-dashboard-container">
      {/* Modern Banner with Overlay */}
      <div className="dashboard-banner">
        <div className="banner-overlay">
          <h2>HR Management Portal</h2>
          <p>Streamline your hiring process with powerful tools</p>
        </div>
      </div>

      <div className="dashboard-header">
        <div className="user-greeting">
          <img
            src="https://cdn-icons-png.flaticon.com/512/3135/3135715.png"
            alt="HR Icon"
            className="user-avatar"
          />
          <div>
            <h1>Welcome, {username}</h1>
            <p className="user-role">HR Manager Dashboard</p>
          </div>
        </div>
        <button onClick={handleLogout} className="logout-btn">
          <span className="btn-icon">→</span> Logout
        </button>
      </div>

      {/* Quick Stats Cards - Enhanced with more metrics */}
      <div className="stats-container">
        <div className="stat-card">
          <div className="stat-icon">👥</div>
          <div className="stat-content">
            <h3>Active Candidates</h3>
            <p className="stat-value">{metrics.activeCandidates}</p>
            <div className="stat-progress">
              <div className="progress-bar" style={{ width: '100%' }}></div>
            </div>
          </div>
        </div>

        <div className="stat-card">
          <div className="stat-icon">📋</div>
          <div className="stat-content">
            <h3>Active Jobs</h3>
            <p className="stat-value">{metrics.activeJobs}</p>
            <div className="stat-progress">
              <div
                className="progress-bar"
                style={{
                  width: `${
                    (metrics.activeJobs /
                      (metrics.activeJobs +
                        metrics.draftJobs +
                        metrics.closedJobs)) *
                    100
                  }%`,
                  backgroundColor: '#4299e1',
                }}
              ></div>
            </div>
          </div>
        </div>

        <div className="stat-card">
          <div className="stat-icon">📈</div>
          <div className="stat-content">
            <h3>Hiring Rate</h3>
            <p className="stat-value">{metrics.hiringConversion}%</p>
            <div className="stat-progress">
              <div
                className="progress-bar"
                style={{
                  width: `${metrics.hiringConversion}%`,
                  backgroundColor: '#48bb78',
                }}
              ></div>
            </div>
          </div>
        </div>

        <div className="stat-card">
          <div className="stat-icon">📅</div>
          <div className="stat-content">
            <h3>Interviews</h3>
            <p className="stat-value">{metrics.interviewsScheduled}</p>
            <div className="stat-progress">
              <div
                className="progress-bar"
                style={{
                  width: `${
                    (metrics.interviewsScheduled / metrics.activeCandidates) *
                    100
                  }%`,
                  backgroundColor: '#ed8936',
                }}
              ></div>
            </div>
          </div>
        </div>
      </div>

      {/* Quick Actions Panel */}
      <div className="quick-actions-panel">
        <h3>Quick Actions</h3>
        <div className="action-buttons">
          <button
            onClick={() => setShowAddForm(!showAddForm)}
            className={`primary-btn ${showAddForm ? 'active' : ''}`}
          >
            <span className="btn-icon">+</span>
            {showAddForm ? 'Cancel' : 'Post New Job'}
          </button>

          <button
            onClick={() => navigate('/view-jobs')}
            className="secondary-btn"
          >
            <span className="btn-icon">👁️</span>
            View Job Listings
          </button>

          <button
            onClick={() => navigate('/candidates')}
            className="secondary-btn"
          >
            <span className="btn-icon">🔍</span>
            View Candidates
          </button>

          <button
            onClick={() => navigate('/schedule-interview')}
            className="secondary-btn"
          >
            <span className="btn-icon">📅</span>
            Schedule Interview
          </button>
        </div>
      </div>

      {/* Main Content Area */}
      <div className="dashboard-content">
        {/* Left Column */}
        <div className="content-column">
          {showAddForm && (
            <div className="form-container">
              <AddJob onSuccess={handleAddJobSuccess} />
            </div>
          )}

          {/* Recent Activity Section - Enhanced */}
          <div className="recent-activity">
            <div className="section-header">
              <h3>Recent Activity</h3>
              {/* <button className="view-all-btn">View All</button> */}
            </div>
            <ul className="activity-list">
              {recentActivities.map((activity) => (
                <li key={activity.id}>
                  <span className="activity-icon">{activity.icon}</span>
                  <div className="activity-details">
                    <p className="activity-title">{activity.title}</p>
                    <p className="activity-time">{activity.time}</p>
                  </div>
                </li>
              ))}
            </ul>
          </div>
        </div>

        {/* Right Column */}
        <div className="content-column">
          {/* Upcoming Events */}
          <div className="upcoming-events">
            <div className="section-header">
              <h3>Upcoming Events</h3>
              {/* <button className="view-all-btn">View Calendar</button> */}
            </div>
            <ul className="events-list">
              {upcomingEvents.map((event) => (
                <li key={event.id} className="event-item">
                  <div className="event-time">{event.time}</div>
                  <h4 className="event-title">{event.title}</h4>
                  <p className="event-candidate">With {event.candidate}</p>
                </li>
              ))}
            </ul>
          </div>

          {/* Hiring Pipeline Visualization */}
          <div className="pipeline-visualization">
            <div className="section-header">
              <h3>Hiring Pipeline</h3>
            </div>
            <div className="pipeline-stages">
              <div className="pipeline-stage">
                <div className="stage-count">{metrics.newApplications}</div>
                <div className="stage-label">Applied</div>
              </div>
              <div className="pipeline-arrow">→</div>
              <div className="pipeline-stage">
                <div className="stage-count">{metrics.interviewsScheduled}</div>
                <div className="stage-label">Interview</div>
              </div>
              <div className="pipeline-arrow">→</div>
              <div className="pipeline-stage">
                <div className="stage-count">3</div>
                <div className="stage-label">Offered</div>
              </div>
              <div className="pipeline-arrow">→</div>
              <div className="pipeline-stage">
                <div className="stage-count">2</div>
                <div className="stage-label">Hired</div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default HrDashboard;
