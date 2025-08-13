import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';

function Register() {
  const navigate = useNavigate();
  const [user, setUser] = useState({
    username: '',
    email: '',
    password: '',
    role: 'STUDENT',
  });
  const [message, setMessage] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const res = await axios.post(
        'http://localhost:8080/api/auth/register',
        user
      );
      setMessage(res.data);
      if (res.data === 'Registered successfully!') {
        setTimeout(() => navigate('/'), 1500);
      }
    } catch (err) {
      const serverMsg =
        typeof err.response?.data === 'string'
          ? err.response.data
          : 'Server error: ' + (err.response?.data?.message || 'Try again later');
      setMessage(serverMsg);
    }
  };

  return (
    <div style={styles.container}>
      <h2 style={styles.title}>Register</h2>
      <form onSubmit={handleSubmit}>
        <input
          placeholder="Username"
          required
          onChange={(e) => setUser({ ...user, username: e.target.value })}
          style={styles.input}
        />
        <input
          placeholder="Email"
          type="email"
          required
          onChange={(e) => setUser({ ...user, email: e.target.value })}
          style={styles.input}
        />
        <input
          placeholder="Password"
          type="password"
          required
          onChange={(e) => setUser({ ...user, password: e.target.value })}
          style={styles.input}
        />
        <select
          value={user.role}
          onChange={(e) => setUser({ ...user, role: e.target.value })}
          style={styles.input}
        >
          <option value="STUDENT">Student</option>
          <option value="ADMIN">HR</option>
        </select>

        <button type="submit" style={styles.button}>
          Register
        </button>
      </form>

      <p style={styles.message}>{message}</p>
    </div>
  );
}

const styles = {
  container: {
    maxWidth: 420,
    margin: '70px auto',
    padding: 35,
    borderRadius: 16,
    background: 'linear-gradient(to bottom right, #dff6ff, #b9e4ff)',
    boxShadow: '0 8px 24px rgba(0,0,0,0.15)',
    fontFamily: 'Segoe UI, sans-serif',
  },
  title: {
    textAlign: 'center',
    color: '#003566',
    marginBottom: 25,
  },
  input: {
    width: '100%',
    padding: '12px 10px',
    marginBottom: 16,
    border: '1px solid #ccc',
    borderRadius: 10,
    fontSize: 15,
  },
  button: {
    width: '100%',
    padding: 12,
    backgroundColor: '#007bff',
    color: '#fff',
    fontWeight: 'bold',
    border: 'none',
    borderRadius: 10,
    fontSize: 16,
    cursor: 'pointer',
  },
  message: {
    marginTop: 20,
    textAlign: 'center',
    color: '#003566',
  },
};

export default Register;
