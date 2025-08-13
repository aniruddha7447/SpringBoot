import { useEffect, useState } from 'react';
import axios from 'axios';
import { useParams, useNavigate, Link } from 'react-router-dom';
import './JobApplicants.css';

function JobApplicants() {
  const { jobId } = useParams();
  const [applicants, setApplicants] = useState([]);
  const [loading, setLoading] = useState(true);
  const [jobTitle, setJobTitle] = useState('');
  const [interviewDate, setInterviewDate] = useState('');
  const [interviewTime, setInterviewTime] = useState('');
  const [selectedStudent, setSelectedStudent] = useState(null);
  const [showScheduleModal, setShowScheduleModal] = useState(false);
  const [statusFilter, setStatusFilter] = useState('ALL');
  const navigate = useNavigate();

  useEffect(() => {
    const fetchApplicants = async () => {
      try {
        const hrUsername = localStorage.getItem('username');

        // Fetch job title first
        const jobResponse = await axios.get(
          `http://localhost:8080/api/jobs/${jobId}`,
          {
            headers: { 'HR-Username': hrUsername },
          }
        );
        setJobTitle(jobResponse.data.jobTitle);

        // Then fetch applicants
        const applicantsResponse = await axios.get(
          `http://localhost:8080/api/jobs/${jobId}/applicants`,
          {
            headers: { 'HR-Username': hrUsername },
          }
        );

        setApplicants(applicantsResponse.data);
      } catch (error) {
        console.error('Error fetching applicants:', error);
        alert('Failed to load applicants');
      } finally {
        setLoading(false);
      }
    };

    fetchApplicants();
  }, [jobId]);

  const handleStatusUpdate = async (studentUsername, newStatus) => {
    try {
      const hrUsername = localStorage.getItem('username');
      // The backend expects a PUT on /status with JSON body { status: newStatus }
      await axios.put(
        `http://localhost:8080/api/jobs/${jobId}/applicants/${studentUsername}/status`,
        { status: newStatus }, // <-- send status in request body
        {
          headers: { 'HR-Username': hrUsername },
        }
      );

      // Update local state
      setApplicants(
        applicants.map((applicant) =>
          applicant.studentUsername === studentUsername
            ? { ...applicant, status: newStatus }
            : applicant
        )
      );
    } catch (error) {
      console.error('Error updating status:', error);
      alert('Failed to update status');
    }
  };

  const handleScheduleInterview = (studentUsername) => {
    setSelectedStudent(studentUsername);
    setShowScheduleModal(true);
  };

  const confirmScheduleInterview = async () => {
    if (!interviewDate || !interviewTime) {
      alert('Please select both date and time');
      return;
    }

    try {
      const hrUsername = localStorage.getItem('username');
      await axios.post(
        `http://localhost:8080/api/jobs/${jobId}/applicants/${selectedStudent}/schedule-interview`,
        {
          interviewDate,
          interviewTime,
        },
        {
          headers: { 'HR-Username': hrUsername },
        }
      );

      // Update local state
      setApplicants(
        applicants.map((applicant) =>
          applicant.studentUsername === selectedStudent
            ? {
                ...applicant,
                status: 'INTERVIEW_SCHEDULED',
                interviewDate,
                interviewTime,
              }
            : applicant
        )
      );

      setShowScheduleModal(false);
      setInterviewDate('');
      setInterviewTime('');
      setSelectedStudent(null);
    } catch (error) {
      console.error('Error scheduling interview:', error);
      alert('Failed to schedule interview');
    }
  };

  // Filter applicants based on status
  const filteredApplicants =
    statusFilter === 'ALL'
      ? applicants
      : applicants.filter((app) => app.status === statusFilter);

  if (loading) return <div className="loading">Loading applicants...</div>;

  return (
    <div className="applicants-container">
      <button onClick={() => navigate(-1)} className="back-btn">
        &larr; Back to Jobs
      </button>

      <h2>Applicants for: {jobTitle}</h2>

      {/* Status Filter Dropdown */}
      <div className="filter-container">
        <label htmlFor="status-filter">Filter by Status: </label>
        <select
          id="status-filter"
          value={statusFilter}
          onChange={(e) => setStatusFilter(e.target.value)}
          className="status-filter"
        >
          <option value="ALL">All Statuses</option>
          <option value="APPLIED">Applied</option>
          <option value="INTERVIEW_SCHEDULED">Interview Scheduled</option>
          <option value="SHORTLISTED">Shortlisted</option>
          <option value="REJECTED">Rejected</option>
        </select>
      </div>

      {filteredApplicants.length === 0 ? (
        <p className="no-applicants">
          No applicants found with the selected status
        </p>
      ) : (
        <div className="applicants-list">
          <table className="applicants-table">
            <thead>
              <tr>
                <th>Name</th>
                <th>Status</th>
                <th>Interview Details</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {filteredApplicants.map((applicant) => (
                <tr key={applicant.id}>
                  <td>
                    {applicant.profile?.fullName || applicant.studentUsername}
                  </td>
                  <td>
                    <span
                      className={`status-badge ${applicant.status
                        .toLowerCase()
                        .replace('_', '-')}`}
                    >
                      {applicant.status
                        .split('_')
                        .map(
                          (word) => word.charAt(0) + word.slice(1).toLowerCase()
                        )
                        .join(' ')}
                    </span>
                  </td>
                  <td>
                    {applicant.status === 'INTERVIEW_SCHEDULED' && (
                      <div className="interview-details">
                        <div>
                          <strong>Date:</strong> {applicant.interviewDate}
                        </div>
                        <div>
                          <strong>Time:</strong> {applicant.interviewTime}
                        </div>
                      </div>
                    )}
                  </td>
                  <td className="actions-cell">
                    <Link
                      to={`/student-profile/${applicant.studentUsername}`}
                      className="view-profile-btn"
                    >
                      View Profile
                    </Link>

                    {applicant.status === 'APPLIED' && (
                      <>
                        <button
                          onClick={() =>
                            handleScheduleInterview(applicant.studentUsername)
                          }
                          className="schedule-btn"
                        >
                          Schedule Interview
                        </button>
                        <button
                          onClick={() =>
                            handleStatusUpdate(
                              applicant.studentUsername,
                              'SHORTLISTED'
                            )
                          }
                          className="shortlist-btn"
                        >
                          Shortlist
                        </button>
                        <button
                          onClick={() =>
                            handleStatusUpdate(
                              applicant.studentUsername,
                              'REJECTED'
                            )
                          }
                          className="reject-btn"
                        >
                          Reject
                        </button>
                      </>
                    )}

                    {applicant.status === 'INTERVIEW_SCHEDULED' && (
                      <>
                        <button
                          onClick={() =>
                            handleStatusUpdate(
                              applicant.studentUsername,
                              'SHORTLISTED'
                            )
                          }
                          className="shortlist-btn"
                        >
                          Shortlist
                        </button>
                        <button
                          onClick={() =>
                            handleStatusUpdate(
                              applicant.studentUsername,
                              'REJECTED'
                            )
                          }
                          className="reject-btn"
                        >
                          Reject
                        </button>
                      </>
                    )}

                    {applicant.status === 'SHORTLISTED' && (
                      <button
                        onClick={() =>
                          handleStatusUpdate(
                            applicant.studentUsername,
                            'REJECTED'
                          )
                        }
                        className="reject-btn"
                      >
                        Reject
                      </button>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {/* Schedule Interview Modal */}
      {showScheduleModal && (
        <div className="modal-overlay">
          <div className="modal-content">
            <h3>Schedule Interview for {selectedStudent}</h3>
            <div className="form-group">
              <label>Date:</label>
              <input
                type="date"
                value={interviewDate}
                onChange={(e) => setInterviewDate(e.target.value)}
                required
              />
            </div>
            <div className="form-group">
              <label>Time:</label>
              <input
                type="time"
                value={interviewTime}
                onChange={(e) => setInterviewTime(e.target.value)}
                required
              />
            </div>
            <div className="modal-actions">
              <button
                onClick={() => setShowScheduleModal(false)}
                className="cancel-btn"
              >
                Cancel
              </button>
              <button
                onClick={confirmScheduleInterview}
                className="confirm-btn"
              >
                Schedule
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default JobApplicants;
