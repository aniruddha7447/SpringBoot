import React, { useState, useEffect } from 'react';
import axios from 'axios';
import {
  FaUser,
  FaGraduationCap,
  FaTools,
  FaBriefcase,
  FaEllipsisH,
} from 'react-icons/fa';

const sections = [
  { key: 'basic', label: 'Basic Info', icon: <FaUser /> },
  { key: 'education', label: 'Education', icon: <FaGraduationCap /> },
  { key: 'skills', label: 'Skills & Projects', icon: <FaTools /> },
  { key: 'experience', label: 'Experience', icon: <FaBriefcase /> },
  { key: 'others', label: 'Others', icon: <FaEllipsisH /> },
];

const ProfileForm = () => {
  const username = localStorage.getItem('username');

  const [profile, setProfile] = useState({
    fullName: '',
    contactInfo: '',
    professionalSummary: '',
    education: '',
    technicalSkills: '',
    projects: '',
    internships: '',
    certifications: '',
    languages: '',
    achievements: '',
    extracurricular: '',
    leadership: '',
    workExperience: '',
    profileLinks: '',
    careerInterests: '',
  });

  const [loading, setLoading] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [message, setMessage] = useState('');
  const [activeSection, setActiveSection] = useState('basic');

  useEffect(() => {
    if (username) {
      setLoading(true);
      axios
        .get('http://localhost:8080/api/student/profile', {
          headers: { 'Student-Username': username },
        })
        .then((res) => {
          if (res.data) {
            setProfile(res.data);
            setSubmitted(true);
          }
        })
        .catch(() => {
          setMessage('Failed to load profile.');
        })
        .finally(() => setLoading(false));
    }
  }, [username]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setProfile((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    if (!profile.fullName.trim() || !profile.contactInfo.trim()) {
      setMessage(
        'Please fill in all required fields (Full Name, Contact Info).'
      );
      return;
    }

    setLoading(true);
    axios
      .post('http://localhost:8080/api/student/profile', profile, {
        headers: {
          'Student-Username': username,
          'Content-Type': 'application/json',
        },
      })
      .then((res) => {
        setMessage('Profile submitted successfully!');
        setSubmitted(true);
        setProfile(res.data || profile);
      })
      .catch(() => {
        setMessage('Error submitting profile. Please try again.');
      })
      .finally(() => setLoading(false));
  };

  if (loading)
    return (
      <div style={styles.loadingContainer}>
        <div className="loader"></div>
        <p>Loading profile...</p>
      </div>
    );

  if (submitted) {
    return (
      <div style={styles.container}>
        <header style={styles.header}>
          <img
            src="https://img.freepik.com/free-vector/bird-colorful-logo-gradient-vector_343694-1365.jpg"
            alt="Apna Logo"
            style={styles.logo}
          />
          <h2 style={styles.title}>My Profile</h2>
        </header>

        <div style={styles.content}>
          <nav style={styles.sidebar}>
            {sections.map(({ key, label, icon }) => (
              <button
                key={key}
                onClick={() => setActiveSection(key)}
                style={{
                  ...styles.sidebarItem,
                  ...(activeSection === key ? styles.sidebarItemActive : {}),
                }}
                aria-label={label}
              >
                <span style={styles.icon}>{icon}</span>
                <span>{label}</span>
              </button>
            ))}
          </nav>

          <section style={styles.mainContent}>
            {activeSection === 'basic' && (
              <>
                <SectionHeader title="Basic Info" />
                <InfoRow label="Full Name" value={profile.fullName} />
                <InfoRow label="Contact Info" value={profile.contactInfo} />
                <InfoRow
                  label="Professional Summary"
                  value={profile.professionalSummary || 'N/A'}
                />
                <InfoRow
                  label="Profile Links"
                  value={profile.profileLinks || 'N/A'}
                />
                <InfoRow
                  label="Career Interests"
                  value={profile.careerInterests || 'N/A'}
                />
              </>
            )}
            {activeSection === 'education' && (
              <>
                <SectionHeader title="Education & Certifications" />
                <InfoRow
                  label="Education"
                  value={profile.education || 'No details added.'}
                />
                <InfoRow
                  label="Certifications"
                  value={profile.certifications || 'No certifications listed.'}
                />
              </>
            )}
            {activeSection === 'skills' && (
              <>
                <SectionHeader title="Skills & Projects" />
                <InfoRow
                  label="Technical Skills"
                  value={profile.technicalSkills || 'No skills listed.'}
                />
                <InfoRow
                  label="Projects"
                  value={profile.projects || 'No projects added.'}
                />
                <InfoRow
                  label="Internships"
                  value={profile.internships || 'No internships added.'}
                />
                <InfoRow
                  label="Languages"
                  value={profile.languages || 'No languages listed.'}
                />
              </>
            )}
            {activeSection === 'experience' && (
              <>
                <SectionHeader title="Experience & Achievements" />
                <InfoRow
                  label="Work Experience"
                  value={profile.workExperience || 'No experience added.'}
                />
                <InfoRow
                  label="Achievements"
                  value={profile.achievements || 'No achievements listed.'}
                />
                <InfoRow
                  label="Leadership"
                  value={profile.leadership || 'No leadership roles listed.'}
                />
                <InfoRow
                  label="Extracurricular"
                  value={
                    profile.extracurricular || 'No extracurricular activities.'
                  }
                />
              </>
            )}
            {activeSection === 'others' && (
              <>
                <SectionHeader title="Other Details" />
                <InfoRow
                  label="Profile Links"
                  value={profile.profileLinks || 'N/A'}
                />
                <InfoRow
                  label="Career Interests"
                  value={profile.careerInterests || 'N/A'}
                />
              </>
            )}
            <button
              onClick={() => setSubmitted(false)}
              style={styles.editButton}
            >
              Edit Profile
            </button>
          </section>
        </div>
      </div>
    );
  }

  return (
    <div style={styles.container}>
      <header style={styles.header}>
        <img
          src="https://img.freepik.com/free-vector/bird-colorful-logo-gradient-vector_343694-1365.jpg"
          alt="Apna Logo"
          style={styles.logo}
        />
        <h2 style={styles.title}>Edit Profile</h2>
      </header>

      <form style={styles.form} onSubmit={handleSubmit} noValidate>
        {message && <p style={styles.message}>{message}</p>}

        <FormSection title="Basic Info">
          <Input
            label="Full Name*"
            name="fullName"
            value={profile.fullName}
            onChange={handleChange}
            required
            placeholder="Enter full name"
          />
          <Input
            label="Contact Info*"
            name="contactInfo"
            value={profile.contactInfo}
            onChange={handleChange}
            required
            placeholder="Phone or Email"
          />
          <Textarea
            label="Professional Summary"
            name="professionalSummary"
            value={profile.professionalSummary}
            onChange={handleChange}
            placeholder="Brief about you"
          />
          <Input
            label="Profile Links"
            name="profileLinks"
            value={profile.profileLinks}
            onChange={handleChange}
            placeholder="LinkedIn, GitHub URLs"
          />
          <Input
            label="Career Interests"
            name="careerInterests"
            value={profile.careerInterests}
            onChange={handleChange}
            placeholder="Your job preferences"
          />
        </FormSection>

        <FormSection title="Education & Certifications">
          <Textarea
            label="Education"
            name="education"
            value={profile.education}
            onChange={handleChange}
            placeholder="Your academic qualifications"
          />
          <Input
            label="Certifications"
            name="certifications"
            value={profile.certifications}
            onChange={handleChange}
            placeholder="Certifications"
          />
        </FormSection>

        <FormSection title="Skills & Projects">
          <Input
            label="Technical Skills"
            name="technicalSkills"
            value={profile.technicalSkills}
            onChange={handleChange}
            placeholder="Java, React, SQL, etc."
          />
          <Textarea
            label="Projects"
            name="projects"
            value={profile.projects}
            onChange={handleChange}
            placeholder="Describe your projects"
          />
          <Textarea
            label="Internships"
            name="internships"
            value={profile.internships}
            onChange={handleChange}
            placeholder="Details of internships"
          />
          <Input
            label="Languages"
            name="languages"
            value={profile.languages}
            onChange={handleChange}
            placeholder="Programming languages"
          />
        </FormSection>

        <FormSection title="Experience & Achievements">
          <Textarea
            label="Work Experience"
            name="workExperience"
            value={profile.workExperience}
            onChange={handleChange}
            placeholder="Job experiences"
          />
          <Textarea
            label="Achievements"
            name="achievements"
            value={profile.achievements}
            onChange={handleChange}
            placeholder="Awards and honors"
          />
          <Textarea
            label="Leadership"
            name="leadership"
            value={profile.leadership}
            onChange={handleChange}
            placeholder="Leadership roles"
          />
          <Textarea
            label="Extracurricular"
            name="extracurricular"
            value={profile.extracurricular}
            onChange={handleChange}
            placeholder="Clubs, sports, volunteer work"
          />
        </FormSection>

        <button type="submit" style={styles.saveButton} disabled={loading}>
          {loading ? 'Saving...' : 'Save Profile'}
        </button>
      </form>
    </div>
  );
};

// Subcomponents for reusability & clarity

const SectionHeader = ({ title }) => (
  <h3
    style={{
      fontWeight: '600',
      color: '#333',
      borderBottom: '2px solid #007bff',
      paddingBottom: 6,
      marginBottom: 16,
    }}
  >
    {title}
  </h3>
);

const InfoRow = ({ label, value }) => (
  <div style={{ marginBottom: 14 }}>
    <span style={{ fontWeight: '600', color: '#555' }}>{label}: </span>
    <span style={{ color: '#666' }}>{value}</span>
  </div>
);

const FormSection = ({ title, children }) => (
  <section style={{ marginBottom: 30 }}>
    <h3
      style={{
        fontWeight: '700',
        fontSize: 18,
        color: '#007bff',
        marginBottom: 14,
      }}
    >
      {title}
    </h3>
    {children}
  </section>
);

const Input = ({ label, name, value, onChange, placeholder, required }) => (
  <label style={styles.formLabel}>
    <span style={styles.labelText}>{label}</span>
    <input
      type="text"
      name={name}
      value={value}
      onChange={onChange}
      placeholder={placeholder}
      required={required}
      style={styles.input}
      autoComplete="off"
    />
  </label>
);

const Textarea = ({ label, name, value, onChange, placeholder }) => (
  <label style={styles.formLabel}>
    <span style={styles.labelText}>{label}</span>
    <textarea
      name={name}
      value={value}
      onChange={onChange}
      rows={4}
      placeholder={placeholder}
      style={styles.textarea}
    />
  </label>
);

// Styles object inspired by apna.co clean UI
const styles = {
  container: {
    maxWidth: 960,
    margin: '2rem auto',
    padding: '1.5rem 2rem',
    fontFamily: "'Segoe UI', Tahoma, Geneva, Verdana, sans-serif",
    boxShadow: '0 4px 15px rgba(0,0,0,0.1)',
    borderRadius: 12,
    backgroundColor: '#fff',
  },
  header: {
    display: 'flex',
    alignItems: 'center',
    marginBottom: 24,
  },
  logo: {
    height: 40,
    filter: 'drop-shadow(0 0 0.2rem #007bff)',
  },
  title: {
    marginLeft: 16,
    color: '#007bff',
    fontWeight: 700,
    fontSize: 28,
    letterSpacing: 0.5,
  },
  content: {
    display: 'flex',
    gap: 32,
  },
  sidebar: {
    flexShrink: 0,
    width: 220,
    borderRadius: 8,
    border: '1px solid #e6e6e6',
    backgroundColor: '#f9faff',
    boxShadow: 'inset 0 0 10px rgba(0,0,0,0.03)',
    display: 'flex',
    flexDirection: 'column',
  },
  sidebarItem: {
    backgroundColor: 'transparent',
    border: 'none',
    outline: 'none',
    cursor: 'pointer',
    padding: '14px 20px',
    fontSize: 16,
    color: '#555',
    display: 'flex',
    alignItems: 'center',
    gap: 12,
    fontWeight: 600,
    borderLeft: '4px solid transparent',
    transition: 'all 0.3s ease',
    textAlign: 'left',
  },
  sidebarItemActive: {
    backgroundColor: '#007bff',
    color: '#fff',
    borderLeft: '4px solid #0056b3',
    fontWeight: 700,
  },
  icon: {
    fontSize: 20,
  },
  mainContent: {
    flex: 1,
    padding: 16,
    backgroundColor: '#fefefe',
    borderRadius: 8,
    boxShadow: '0 0 15px rgb(0 123 255 / 0.15)',
    minHeight: 480,
    overflowY: 'auto',
  },
  editButton: {
    marginTop: 20,
    backgroundColor: '#007bff',
    color: '#fff',
    border: 'none',
    padding: '12px 24px',
    borderRadius: 6,
    cursor: 'pointer',
    fontWeight: 700,
    fontSize: 16,
    transition: 'background-color 0.3s ease',
  },
  form: {
    display: 'flex',
    flexDirection: 'column',
  },
  message: {
    color: '#d9534f',
    marginBottom: 20,
    textAlign: 'center',
    fontWeight: 600,
  },
  formLabel: {
    display: 'block',
    marginBottom: 20,
    fontWeight: 600,
    color: '#444',
  },
  labelText: {
    display: 'block',
    marginBottom: 6,
    fontSize: 14,
    color: '#333',
  },
  input: {
    width: '100%',
    padding: '10px 14px',
    fontSize: 16,
    borderRadius: 8,
    border: '1.5px solid #ccc',
    transition: 'border-color 0.3s ease',
  },
  textarea: {
    width: '100%',
    padding: '10px 14px',
    fontSize: 16,
    borderRadius: 8,
    border: '1.5px solid #ccc',
    resize: 'vertical',
    minHeight: 80,
    transition: 'border-color 0.3s ease',
  },
  saveButton: {
    backgroundColor: '#007bff',
    color: '#fff',
    border: 'none',
    padding: '14px 24px',
    borderRadius: 8,
    fontWeight: 700,
    fontSize: 18,
    cursor: 'pointer',
    alignSelf: 'flex-start',
    transition: 'background-color 0.3s ease',
  },
  loadingContainer: {
    textAlign: 'center',
    marginTop: 60,
    fontSize: 18,
    color: '#007bff',
  },
};

export default ProfileForm;
