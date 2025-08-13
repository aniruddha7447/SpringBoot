import { Routes, Route } from 'react-router-dom';
import Login from './pages/Login';
import Register from './pages/Register';
import HrDashboard from './pages/HrDashboard';
import StudentDashboard from './pages/StudentDashboard';
import ViewJobs from './pages/ViewJobs';
import JobApplicants from './pages/JobApplicants';
import StudentProfileView from './pages/StudentProfileView';

function App() {
  return (
    <Routes>
      <Route path="/" element={<Login />} />
      <Route path="/login" element={<Login />} />
      <Route path="/register" element={<Register />} />
      <Route path="/hr-dashboard" element={<HrDashboard />} />
      <Route path="/student-dashboard" element={<StudentDashboard />} />
      <Route path="/view-jobs" element={<ViewJobs />} />
      <Route path="/job-applicants/:jobId" element={<JobApplicants />} />{' '}
      <Route
        path="/student-profile/:username"
        element={<StudentProfileView />}
      />{' '}
    </Routes>
  );
}

export default App;
