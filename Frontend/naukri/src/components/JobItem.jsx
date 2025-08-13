import './JobItem.css';

const JobItem = ({
  job,
  showActions = false,
  onApply,
  onReject,
  isProcessing = false,
}) => {
  return (
    <div className="job-card">
      <div className="job-header">
        <h3>{job.jobTitle}</h3>
        <span className="company">{job.company}</span>
      </div>

      <div className="job-details">
        <p>
          <strong>Location:</strong> {job.location}
        </p>
        <p>
          <strong>Salary:</strong> ₹{job.salary}
        </p>
        <p>
          <strong>Description:</strong> {job.description}
        </p>
      </div>

      {showActions && (
        <div className="job-actions">
          <button
            onClick={() => onApply(job.id)}
            disabled={isProcessing}
            className={`apply-btn ${isProcessing ? 'disabled' : ''}`}
          >
            {isProcessing ? 'Applying...' : 'Apply'}
          </button>
          <button
            onClick={() => onReject(job.id)}
            disabled={isProcessing}
            className={`reject-btn ${isProcessing ? 'disabled' : ''}`}
          >
            {isProcessing ? 'Processing...' : 'Reject'}
          </button>
        </div>
      )}
    </div>
  );
};

export default JobItem;
