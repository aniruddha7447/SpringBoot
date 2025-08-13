import { Link } from 'react-router-dom';
import './Navbar.css';

const Navbar = () => {
  return (
    <nav className="navbar">
      <div className="nav-container">
        <Link to="/" className="nav-link">
          HR Dashboard
        </Link>
        <Link to="/view-jobs" className="nav-link">
          View Jobs
        </Link>
      </div>
    </nav>
  );
};

export default Navbar;
