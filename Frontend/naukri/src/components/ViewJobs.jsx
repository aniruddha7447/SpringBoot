import { useEffect, useState } from 'react';
import axios from 'axios';
import { Link } from 'react-router-dom';
import './ViewJobs.css';

const ViewJobs = () => {
  const [jobs, setJobs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchJobs = async () => {
      try {
        const hrUsername = localStorage.getItem('username');
        const response = await axios.get('http://localhost:8080/api/jobs', {
          headers: {
            'HR-Username': hrUsername,
          },
        });
        setJobs(response.data);
      } catch (error) {
        console.error('Error fetching jobs:', error);
        setError('Failed to load jobs. Please try again later.');
      } finally {
        setLoading(false);
      }
    };
    fetchJobs();
  }, []);

  const handleDelete = async (id) => {
    if (!window.confirm('Are you sure you want to delete this job posting?'))
      return;

    try {
      const hrUsername = localStorage.getItem('username');
      await axios.delete(`http://localhost:8080/api/jobs/${id}`, {
        headers: {
          'HR-Username': hrUsername,
        },
      });
      setJobs(jobs.filter((job) => job.id !== id));
    } catch (error) {
      console.error('Error deleting job:', error);
      setError('Failed to delete job. Please try again.');
    }
  };

  if (loading) {
    return (
      <div className="loading-container">
        <div className="spinner"></div>
        <p>Loading your job postings...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="error-container">
        <p className="error-message">{error}</p>
        <button className="retry-btn" onClick={() => window.location.reload()}>
          Retry
        </button>
      </div>
    );
  }

  return (
    <div className="view-jobs-container">
      <div className="header-section">
        <h1>Your Job Postings</h1>
        <Link to="/create-job" className="create-job-btn">
          + Create New Job
        </Link>
      </div>

      {jobs.length === 0 ? (
        <div className="empty-state">
          <img
            src="/images/no-jobs.svg"
            alt="No jobs posted"
            className="empty-state-img"
          />
          <h3>No jobs posted yet</h3>
          <p>Create your first job posting to start receiving applications</p>
          <Link to="/create-job" className="primary-btn">
            Post a Job
          </Link>
        </div>
      ) : (
        <div className="jobs-grid">
          {jobs.map((job) => (
            <div key={job.id} className="job-card">
              <div className="job-card-header">
                <h3>{job.title}</h3>
                <span className="salary-badge">₹{job.salary}</span>
              </div>
              <div className="job-details">
                <div className="detail-item">
                  <span className="detail-icon">📍</span>
                  <span>{job.location}</span>
                </div>
                <div className="detail-item">
                  <span className="detail-icon">📝</span>
                  <span>{job.description.substring(0, 100)}...</span>
                </div>
              </div>
              <div className="job-actions">
                <Link
                  to={`/job-applicants/${job.id}`}
                  className="action-btn view-applicants-btn"
                >
                  View Applicants ({job.applicantCount || 0})
                </Link>
                <div className="secondary-actions">
                  <Link
                    to={`/edit-job/${job.id}`}
                    className="action-btn edit-btn"
                  >
                    Edit
                  </Link>
                  <button
                    onClick={() => handleDelete(job.id)}
                    className="action-btn delete-btn"
                  >
                    Delete
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default ViewJobs;
