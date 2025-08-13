import { useEffect, useState } from 'react';
import axios from 'axios';
import { Link, useNavigate } from 'react-router-dom';
import './ViewJobs.css';

const ViewJobs = () => {
  const [jobs, setJobs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const navigate = useNavigate();

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
        alert('Failed to load jobs');
      } finally {
        setLoading(false);
      }
    };
    fetchJobs();
  }, []);

  const handleDelete = async (id) => {
    if (!window.confirm('Are you sure you want to delete this job?')) return;

    try {
      const hrUsername = localStorage.getItem('username');
      await axios.delete(`http://localhost:8080/api/jobs/${id}`, {
        headers: {
          'HR-Username': hrUsername,
        },
      });
      setJobs(jobs.filter((job) => job.id !== id));
      alert('Job deleted successfully');
    } catch (error) {
      console.error('Error deleting job:', error);
      alert('Failed to delete job');
    }
  };

  const filteredJobs = jobs.filter(
    (job) =>
      job.jobTitle.toLowerCase().includes(searchTerm.toLowerCase()) ||
      job.company.toLowerCase().includes(searchTerm.toLowerCase()) ||
      job.location.toLowerCase().includes(searchTerm.toLowerCase())
  );

  if (loading) return <div className="loading-jobs">Loading jobs...</div>;

  return (
    <div className="view-jobs-container">
      <button onClick={() => navigate(-1)} className="back-button">
        &larr; Back
      </button>

      <h1 className="page-title">Posted Jobs</h1>

      <div className="controls">
        {/* <input
          type="text"
          placeholder="Search jobs..."
          className="search-input"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        /> */}
        <div className="top-bar">
          <h1 className="page-title">Posted Jobs</h1>
          {/* <Link to="/AddJob" className="create-job-btn">
            + Create New Job
          </Link> */}
        </div>
      </div>

      {filteredJobs.length === 0 ? (
        <div className="no-jobs-container">
          <p className="no-jobs">No jobs available</p>
          <Link to="/create-job" className="create-job-btn">
            Create Your First Job
          </Link>
        </div>
      ) : (
        <div className="jobs-grid">
          {filteredJobs.map((job) => (
            <div key={job.id} className="job-card">
              <div className="job-card-header">
                <h3 className="job-title">{job.jobTitle}</h3>
                <span className="job-status">{job.status || 'Active'}</span>
              </div>
              <p className="job-company">
                <strong>Company:</strong> {job.company}
              </p>
              <p className="job-location">
                <strong>Location:</strong> {job.location}
              </p>
              <p className="job-description">
                <strong>Description:</strong>{' '}
                {job.description.length > 100
                  ? `${job.description.substring(0, 100)}...`
                  : job.description}
              </p>
              <p className="job-salary">
                <strong>Salary:</strong> ₹{job.salary}
              </p>
              <p className="job-posted-date">
                <strong>Posted:</strong>{' '}
                {new Date(job.postedDate).toLocaleDateString()}
              </p>

              <div className="job-actions">
                <button
                  onClick={() => handleDelete(job.id)}
                  className="btn btn-delete"
                >
                  Delete
                </button>
                <Link to={`/job-applicants/${job.id}`} className="btn btn-view">
                  View Applicants ({job.applicants || 0})
                </Link>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default ViewJobs;
