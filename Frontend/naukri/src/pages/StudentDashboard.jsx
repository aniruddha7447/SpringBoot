import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import JobItem from '../components/JobItem';
import ProfileForm from '../components/ProfileForm';
import './StudentDashboard.css';

// Use placeholder images or actual URLs
const logo =
  'https://img.freepik.com/free-vector/bird-colorful-logo-gradient-vector_343694-1365.jpg';
const banner =
  'https://images.unsplash.com/photo-1521791055366-0d553872125f?ixlib=rb-1.2.1&auto=format&fit=crop&w=1350&q=80';

const AppliedJobCard = ({ application }) => {
  const status = application.status || 'APPLIED';
  const isHrRejected = status === 'HR_REJECTED';
  const isInterview = status === 'INTERVIEW_SCHEDULED';

  return (
    <div className="applied-job-card">
      <JobItem job={application.job} />
      <div className="application-status-container">
        <span
          className={`status-badge status-${status
            .toLowerCase()
            .replace('_', '-')}`}
        >
          {status
            .replace('_', ' ')
            .toLowerCase()
            .replace(/\b\w/g, (l) => l.toUpperCase())}
        </span>
        {isInterview && (
          <button className="interview-details-btn">
            View Interview Details
          </button>
        )}
      </div>
    </div>
  );
};

function StudentDashboard() {
  const [username, setUsername] = useState('');
  const [activeTab, setActiveTab] = useState('available');
  const [availableJobs, setAvailableJobs] = useState([]);
  const [appliedJobsData, setAppliedJobsData] = useState([]);
  const [rejectedJobs, setRejectedJobs] = useState([]);
  const [loading, setLoading] = useState(false);
  const [actionLoading, setActionLoading] = useState(false);
  const [profileComplete, setProfileComplete] = useState(65); // Example profile completion percentage
  const navigate = useNavigate();

  useEffect(() => {
    const storedName = localStorage.getItem('username');
    const role = localStorage.getItem('role');

    if (role !== 'student') {
      navigate('/login');
    } else {
      setUsername(storedName || 'Student User');
      fetchJobs();
      // Simulate profile completion check
      checkProfileCompletion();
    }
  }, [navigate]);

  const checkProfileCompletion = async () => {
    // In a real app, you would check with your backend
    setTimeout(() => {
      setProfileComplete(Math.floor(Math.random() * 40) + 60); // Random between 60-100
    }, 1000);
  };

  const fetchJobs = async () => {
    setLoading(true);
    try {
      const studentUsername = localStorage.getItem('username');

      const [availableRes, appliedRes, rejectedRes] = await Promise.all([
        axios.get('http://localhost:8080/api/student/jobs/available', {
          headers: { 'Student-Username': studentUsername },
        }),
        axios.get('http://localhost:8080/api/student/jobs/applied', {
          headers: { 'Student-Username': studentUsername },
        }),
        axios.get('http://localhost:8080/api/student/jobs/rejected', {
          headers: { 'Student-Username': studentUsername },
        }),
      ]);

      setAvailableJobs(availableRes.data);
      setAppliedJobsData(appliedRes.data);
      setRejectedJobs(rejectedRes.data.map((app) => app.job));
    } catch (error) {
      console.error('Error fetching jobs:', error);
      alert('Failed to load jobs');
    } finally {
      setLoading(false);
    }
  };

  const handleApply = async (jobId) => {
    setActionLoading(true);
    try {
      const studentUsername = localStorage.getItem('username');
      await axios.post(
        `http://localhost:8080/api/student/jobs/apply?jobId=${jobId}`,
        null,
        { headers: { 'Student-Username': studentUsername } }
      );
      await fetchJobs();
    } catch (error) {
      console.error('Error applying for job:', error);
      if (error.response && error.response.status === 400) {
        alert('You have already applied or rejected this job');
      } else {
        alert('Failed to apply for job');
      }
    } finally {
      setActionLoading(false);
    }
  };

  const handleReject = async (jobId) => {
    setActionLoading(true);
    try {
      const studentUsername = localStorage.getItem('username');
      await axios.post(
        `http://localhost:8080/api/student/jobs/reject?jobId=${jobId}`,
        null,
        { headers: { 'Student-Username': studentUsername } }
      );
      await fetchJobs();
    } catch (error) {
      console.error('Error rejecting job:', error);
      if (error.response && error.response.status === 400) {
        alert('You have already applied or rejected this job');
      } else {
        alert('Failed to reject job');
      }
    } finally {
      setActionLoading(false);
    }
  };

  const handleLogout = () => {
    localStorage.removeItem('username');
    localStorage.removeItem('role');
    navigate('/login');
  };

  const renderJobList = (jobs, showActions = false) => {
    if (loading)
      return (
        <div className="loading-container">
          <div className="loading-spinner"></div>
          <p>Loading jobs...</p>
        </div>
      );

    if (jobs.length === 0) {
      return (
        <div className="empty-state">
          <img
            src="/images/no-jobs.svg"
            alt="No jobs found"
            className="empty-state-img"
          />
          <p className="no-jobs-message">No jobs found in this category</p>
          {activeTab === 'available' && (
            <button className="refresh-btn" onClick={fetchJobs}>
              Refresh Jobs
            </button>
          )}
        </div>
      );
    }

    return (
      <div className="jobs-grid">
        {jobs.map((job) => (
          <JobItem
            key={job.id}
            job={job}
            showActions={showActions}
            onApply={handleApply}
            onReject={handleReject}
            isProcessing={actionLoading}
          />
        ))}
      </div>
    );
  };

  const renderAppliedJobs = () => {
    if (loading)
      return (
        <div className="loading-container">
          <div className="loading-spinner"></div>
          <p>Loading your applications...</p>
        </div>
      );

    const filteredApplications = appliedJobsData.filter(
      (application) => application.status !== 'STUDENT_REJECTED'
    );

    if (filteredApplications.length === 0) {
      return (
        <div className="empty-state">
          <img
            src="/images/no-applications.svg"
            alt="No applications"
            className="empty-state-img"
          />
          <p className="no-jobs-message">You haven't applied to any jobs yet</p>
          <button
            className="primary-btn"
            onClick={() => setActiveTab('available')}
          >
            Browse Jobs
          </button>
        </div>
      );
    }

    return (
      <div className="applied-jobs-grid">
        {filteredApplications.map((application) => (
          <AppliedJobCard key={application.job.id} application={application} />
        ))}
      </div>
    );
  };

  return (
    <div className="dashboard-container">
      {/* Banner Section */}
      <div className="dashboard-banner">
        <img src={banner} alt="Find your dream job" className="banner-image" />
        <div className="banner-overlay">
          <div className="banner-content">
            <h1>Welcome back, {username}!</h1>
            <p>Your next career opportunity is waiting</p>
          </div>
        </div>
      </div>

      {/* Header with Logo */}
      <header className="dashboard-header">
        <div className="header-left">
          <img src={logo} alt="CareerConnect Logo" className="logo" />
          <nav className="main-nav">
            <button
              className={`nav-link ${
                activeTab === 'available' ? 'active' : ''
              }`}
              onClick={() => setActiveTab('available')}
            >
              Jobs
            </button>
            <button
              className={`nav-link ${activeTab === 'applied' ? 'active' : ''}`}
              onClick={() => setActiveTab('applied')}
            >
              Applications
            </button>
            <button
              className={`nav-link ${activeTab === 'profile' ? 'active' : ''}`}
              onClick={() => setActiveTab('profile')}
            >
              Profile
            </button>
          </nav>
        </div>
        <div className="header-right">
          <div className="profile-completion">
            <div
              className="progress-circle"
              style={{ '--progress': `${profileComplete}%` }}
            >
              <span>{profileComplete}%</span>
            </div>
            <span>Profile Complete</span>
          </div>
          <button onClick={handleLogout} className="logout-btn">
            <i className="fas fa-sign-out-alt"></i> Logout
          </button>
        </div>
      </header>

      {/* Quick Stats Bar */}
      <div className="stats-bar">
        <div className="stat-card">
          <h3>{availableJobs.length}</h3>
          <p>Available Jobs</p>
        </div>
        <div className="stat-card">
          <h3>{appliedJobsData.length}</h3>
          <p>Applications</p>
        </div>
        <div className="stat-card">
          <h3>{rejectedJobs.length}</h3>
          <p>Rejected</p>
        </div>
        <div className="stat-card highlight">
          <h3>3</h3> {/* Example interview count */}
          <p>Interviews</p>
        </div>
      </div>

      {/* Main Content */}
      <main className="dashboard-main">
        {/* Secondary Navigation */}
        <div className="secondary-nav">
          <button
            onClick={() => setActiveTab('available')}
            className={`tab ${activeTab === 'available' ? 'active' : ''}`}
          >
            <i className="fas fa-briefcase"></i> Available Jobs
          </button>
          <button
            onClick={() => setActiveTab('applied')}
            className={`tab ${activeTab === 'applied' ? 'active' : ''}`}
          >
            <i className="fas fa-file-alt"></i> Applied Jobs
          </button>
          <button
            onClick={() => setActiveTab('rejected')}
            className={`tab ${activeTab === 'rejected' ? 'active' : ''}`}
          >
            <i className="fas fa-times-circle"></i> Rejected Jobs
          </button>
          <button
            onClick={() => setActiveTab('profile')}
            className={`tab ${activeTab === 'profile' ? 'active' : ''}`}
          >
            <i className="fas fa-user"></i> My Profile
          </button>
        </div>

        {/* Content Section */}
        <div className="content-section">
          {activeTab === 'available' && (
            <>
              <div className="section-header">
                <h2>Available Jobs</h2>
                <div className="search-filter">
                  <input
                    type="text"
                    placeholder="Search jobs..."
                    className="search-input"
                  />
                  <select className="filter-select">
                    <option>All Categories</option>
                    <option>IT</option>
                    <option>Marketing</option>
                    <option>Finance</option>
                  </select>
                </div>
              </div>
              {renderJobList(availableJobs, true)}
            </>
          )}

          {activeTab === 'applied' && (
            <>
              <div className="section-header">
                <h2>Your Applications</h2>
                <div className="application-filters">
                  <button className="filter-btn active">All</button>
                  <button className="filter-btn">Pending</button>
                  <button className="filter-btn">Interviews</button>
                  <button className="filter-btn">Rejected</button>
                </div>
              </div>
              {renderAppliedJobs()}
            </>
          )}

          {activeTab === 'rejected' && (
            <>
              <div className="section-header">
                <h2>Rejected Jobs</h2>
                <p className="subtitle">
                  Jobs you've declined or were rejected from
                </p>
              </div>
              {renderJobList(rejectedJobs)}
            </>
          )}

          {activeTab === 'profile' && (
            <>
              <div className="section-header">
                <h2>My Profile</h2>
                <div className="profile-completion-mobile">
                  <span>Profile Strength: {profileComplete}%</span>
                  <div className="progress-bar">
                    <div
                      className="progress-fill"
                      style={{ width: `${profileComplete}%` }}
                    ></div>
                  </div>
                </div>
              </div>
              <ProfileForm onUpdate={checkProfileCompletion} />
            </>
          )}
        </div>
      </main>

      {/* Footer */}
      <footer className="dashboard-footer">
        <div className="footer-content">
          <div className="footer-logo">
            <img src={logo} alt="CareerConnect" />
            <p>Connecting talent with opportunity</p>
          </div>
          <div className="footer-links">
            <h4>Quick Links</h4>
            <a href="#">About Us</a>
            <a href="#">Contact</a>
            <a href="#">Privacy Policy</a>
            <a href="#">Terms of Service</a>
          </div>
          <div className="footer-contact">
            <h4>Contact Us</h4>
            <p>
              <i className="fas fa-envelope"></i> harsh@gmail.com
            </p>
            <p>
              <i className="fas fa-phone"></i> +91 8149992599
            </p>
          </div>
        </div>
        <div className="footer-bottom">
          <p>
            &copy; {new Date().getFullYear()} CareerConnect. All rights
            reserved.
          </p>
        </div>
      </footer>
    </div>
  );
}

export default StudentDashboard;
