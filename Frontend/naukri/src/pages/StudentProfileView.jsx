import { useEffect, useState } from 'react';
import axios from 'axios';
import { useParams, useNavigate } from 'react-router-dom';
import './StudentProfileView.css';

const StudentProfileView = () => {
  const { username } = useParams();
  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        setLoading(true);
        setError(null);
        const response = await axios.get(
          `http://localhost:8080/api/student/profile/${username}`,
          {
            headers: {
              'HR-Username': localStorage.getItem('username'), // Add HR auth
            },
          }
        );
        setProfile(response.data);
      } catch (err) {
        console.error('Error fetching profile:', err);
        setError('Failed to load profile. Please try again later.');
      } finally {
        setLoading(false);
      }
    };

    fetchProfile();
  }, [username]);

  const handleBack = () => {
    navigate(-1); // Go back to previous page
  };

  if (loading) {
    return (
      <div className="profile-view-container">
        <div className="loading-spinner">Loading profile...</div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="profile-view-container">
        <button onClick={handleBack} className="back-btn">
          &larr; Back to Applicants
        </button>
        <div className="error-message">{error}</div>
      </div>
    );
  }

  if (!profile) {
    return (
      <div className="profile-view-container">
        <button onClick={handleBack} className="back-btn">
          &larr; Back to Applicants
        </button>
        <div className="not-found">Profile not found</div>
      </div>
    );
  }

  return (
    <div className="profile-view-container">
      <button onClick={handleBack} className="back-btn">
        &larr; Back to Applicants
      </button>

      <div className="profile-header">
        <h2>{profile.fullName || username}'s Profile</h2>
        <div className="contact-info">
          {profile.contactInfo && <span>📧 {profile.contactInfo}</span>}
          {profile.profileLinks && <span>🔗 {profile.profileLinks}</span>}
        </div>
      </div>

      <div className="profile-sections">
        {profile.professionalSummary && (
          <div className="profile-section">
            <h3>Professional Summary</h3>
            <p>{profile.professionalSummary}</p>
          </div>
        )}

        {profile.education && (
          <div className="profile-section">
            <h3>Education</h3>
            <pre>{profile.education}</pre>
          </div>
        )}

        {profile.technicalSkills && (
          <div className="profile-section">
            <h3>Technical Skills</h3>
            <p>{profile.technicalSkills}</p>
          </div>
        )}

        {profile.projects && (
          <div className="profile-section">
            <h3>Projects</h3>
            <pre>{profile.projects}</pre>
          </div>
        )}

        {(profile.internships || profile.workExperience) && (
          <div className="profile-section">
            <h3>Experience</h3>
            {profile.internships && (
              <>
                <h4>Internships</h4>
                <pre>{profile.internships}</pre>
              </>
            )}
            {profile.workExperience && (
              <>
                <h4>Work Experience</h4>
                <pre>{profile.workExperience}</pre>
              </>
            )}
          </div>
        )}

        {(profile.certifications ||
          profile.languages ||
          profile.achievements ||
          profile.extracurricular ||
          profile.leadership) && (
          <div className="profile-section">
            <h3>Additional Information</h3>
            {profile.certifications && (
              <div className="info-item">
                <strong>Certifications:</strong> {profile.certifications}
              </div>
            )}
            {profile.languages && (
              <div className="info-item">
                <strong>Languages:</strong> {profile.languages}
              </div>
            )}
            {profile.achievements && (
              <div className="info-item">
                <strong>Achievements:</strong> {profile.achievements}
              </div>
            )}
            {profile.extracurricular && (
              <div className="info-item">
                <strong>Extracurricular:</strong> {profile.extracurricular}
              </div>
            )}
            {profile.leadership && (
              <div className="info-item">
                <strong>Leadership:</strong> {profile.leadership}
              </div>
            )}
          </div>
        )}

        {profile.careerInterests && (
          <div className="profile-section">
            <h3>Career Interests</h3>
            <p>{profile.careerInterests}</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default StudentProfileView;
