import { useEffect, useState } from 'react';
import axios from 'axios';
import { useParams, Link, useNavigate } from 'react-router-dom';
import './ApplicantsView.css';

const ApplicantsView = () => {
  const { jobId } = useParams();
  const [applicants, setApplicants] = useState([]);
  const [loading, setLoading] = useState(true);
  const [jobDetails, setJobDetails] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchData = async () => {
      try {
        const hrUsername = localStorage.getItem('username');

        // ✅ Fetch job details
        const jobResponse = await axios.get(
          `http://localhost:8080/api/jobs/${jobId}`,
          {
            headers: { 'HR-Username': hrUsername },
          }
        );
        setJobDetails(jobResponse.data);

        // ✅ Fetch applicants using RESTful endpoint
        const applicantsResponse = await axios.get(
          `http://localhost:8080/api/jobs/${jobId}/applicants`,
          {
            headers: { 'HR-Username': hrUsername },
          }
        );

        setApplicants(applicantsResponse.data);
      } catch (error) {
        console.error('Error fetching data:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [jobId]);

  const handleBack = () => {
    navigate('/view-jobs');
  };

  if (loading) return <div className="loading">Loading applicants...</div>;

  return (
    <div className="applicants-container">
      <button onClick={handleBack} className="back-btn">
        &larr; Back to Jobs
      </button>

      {jobDetails && (
        <div className="job-header">
          <h2>Applicants for: {jobDetails.jobTitle}</h2>
          <p>
            Company: {jobDetails.company} | Location: {jobDetails.location}
          </p>
        </div>
      )}

      {applicants.length === 0 ? (
        <div className="no-applicants">
          <p>No applicants have applied for this job yet.</p>
        </div>
      ) : (
        <div className="applicants-table-container">
          <table className="applicants-table">
            <thead>
              <tr>
                <th>Student</th>
                <th>Full Name</th>
                <th>Contact</th>
                <th>Skills</th>
                <th>Education</th>
                <th>Profile</th>
              </tr>
            </thead>
            <tbody>
              {applicants.map((applicant) => (
                <tr key={applicant.id}>
                  <td>{applicant.studentUsername}</td>
                  <td>{applicant.profile?.fullName || 'N/A'}</td>
                  <td>{applicant.profile?.contactInfo || 'N/A'}</td>
                  <td>
                    {applicant.profile?.technicalSkills
                      ? applicant.profile.technicalSkills
                          .split(',')
                          .slice(0, 3)
                          .join(', ')
                      : 'N/A'}
                  </td>
                  <td>
                    {applicant.profile?.education
                      ? applicant.profile.education.split('\n')[0]
                      : 'N/A'}
                  </td>
                  <td>
                    <Link
                      to={`/student-profile/${applicant.studentUsername}`}
                      className="view-profile-btn"
                    >
                      View Full Profile
                    </Link>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
};

export default ApplicantsView;
