import { useState } from 'react';
import axios from 'axios';
import './AddJob.css';

const AddJob = ({ onSuccess }) => {
  const [job, setJob] = useState({
    jobTitle: '',
    company: '',
    description: '',
    location: '',
    salary: '',
  });
  const [errors, setErrors] = useState({});
  const [submitting, setSubmitting] = useState(false);

  const validate = () => {
    const newErrors = {};
    if (!job.jobTitle.trim()) newErrors.jobTitle = 'Job Title is required';
    if (!job.company.trim()) newErrors.company = 'Company is required';
    if (!job.description.trim())
      newErrors.description = 'Description is required';
    if (!job.location.trim()) newErrors.location = 'Location is required';
    if (!job.salary || isNaN(job.salary) || job.salary <= 0)
      newErrors.salary = 'Valid salary is required';
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setJob((prev) => ({ ...prev, [name]: value }));
    setErrors((prev) => ({ ...prev, [name]: '' }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validate()) return;
    setSubmitting(true);

    try {
      const hrUsername = localStorage.getItem('username');
      await axios.post('http://localhost:8080/api/jobs', job, {
        headers: { 'HR-Username': hrUsername },
      });
      alert('Job added successfully!');
      setJob({
        jobTitle: '',
        company: '',
        description: '',
        location: '',
        salary: '',
      });
      onSuccess();
    } catch (error) {
      console.error('Error adding job:', error);
      alert('Failed to add job. Please try again later.');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="form-container">
      <h2>Add New Job</h2>
      <form onSubmit={handleSubmit} noValidate>
        <div className="form-group">
          <label htmlFor="jobTitle">Job Title</label>
          <input
            id="jobTitle"
            type="text"
            name="jobTitle"
            value={job.jobTitle}
            onChange={handleChange}
            aria-describedby="jobTitleError"
            required
          />
          {errors.jobTitle && (
            <small id="jobTitleError" className="error-text">
              {errors.jobTitle}
            </small>
          )}
        </div>

        <div className="form-group">
          <label htmlFor="company">Company</label>
          <input
            id="company"
            type="text"
            name="company"
            value={job.company}
            onChange={handleChange}
            aria-describedby="companyError"
            required
          />
          {errors.company && (
            <small id="companyError" className="error-text">
              {errors.company}
            </small>
          )}
        </div>

        <div className="form-group">
          <label htmlFor="description">Description</label>
          <textarea
            id="description"
            name="description"
            value={job.description}
            onChange={handleChange}
            aria-describedby="descriptionError"
            required
          />
          {errors.description && (
            <small id="descriptionError" className="error-text">
              {errors.description}
            </small>
          )}
        </div>

        <div className="form-group">
          <label htmlFor="location">Location</label>
          <input
            id="location"
            type="text"
            name="location"
            value={job.location}
            onChange={handleChange}
            aria-describedby="locationError"
            required
          />
          {errors.location && (
            <small id="locationError" className="error-text">
              {errors.location}
            </small>
          )}
        </div>

        <div className="form-group">
          <label htmlFor="salary">Salary (₹)</label>
          <input
            id="salary"
            type="number"
            name="salary"
            value={job.salary}
            onChange={handleChange}
            aria-describedby="salaryError"
            required
            min="1"
          />
          {errors.salary && (
            <small id="salaryError" className="error-text">
              {errors.salary}
            </small>
          )}
        </div>

        <button type="submit" className="submit-btn" disabled={submitting}>
          {submitting ? 'Submitting...' : 'Submit Job'}
        </button>
      </form>
    </div>
  );
};

export default AddJob;
