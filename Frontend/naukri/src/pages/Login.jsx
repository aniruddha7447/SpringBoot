import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';

function Login() {
  const navigate = useNavigate();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [message, setMessage] = useState('');
  const [loading, setLoading] = useState(false);
  const [welcome, setWelcome] = useState('');

  const handleLogin = async (e) => {
    e.preventDefault();
    setMessage('');
    setWelcome('');
    try {
      const res = await axios.post('http://localhost:8080/api/auth/login', {
        email,
        password,
      });
      if (res.status === 200) {
        const { message, role, username } = res.data;
        setWelcome(`Welcome ${username} (${role})`);
        setMessage(message);
        localStorage.setItem('role', role.toLowerCase());
        localStorage.setItem('username', username);
        setLoading(true);
        setTimeout(() => {
          setLoading(false);
          navigate(
            role.toLowerCase() === 'hr' ? '/hr-dashboard' : '/student-dashboard'
          );
        }, 2000);
      }
    } catch (err) {
      setLoading(false);
      setMessage(err.response?.data?.message || 'Login failed');
    }
  };

  return (
    <div style={styles.container}>
      <h2 style={styles.title}>Login</h2>
      <form onSubmit={handleLogin}>
        <input
          type="email"
          placeholder="Email"
          value={email}
          required
          onChange={(e) => setEmail(e.target.value)}
          style={styles.input}
        />
        <input
          type="password"
          placeholder="Password"
          value={password}
          required
          onChange={(e) => setPassword(e.target.value)}
          style={styles.input}
        />
        <button type="submit" style={styles.button} disabled={loading}>
          {loading ? 'Logging in...' : 'Login'}
        </button>
      </form>

      {!loading && (
        <p style={styles.redirectText}>
          Don&apos;t have an account?{' '}
          <span style={styles.link} onClick={() => navigate('/register')}>
            Register here
          </span>
        </p>
      )}

      {message && (
        <p
          style={{
            ...styles.message,
            color: message.includes('success') ? 'green' : 'red',
          }}
        >
          {message}
        </p>
      )}
      {welcome && (
        <p style={{ ...styles.message, color: 'green' }}>{welcome}</p>
      )}
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
  redirectText: {
    marginTop: 20,
    fontSize: 14,
    textAlign: 'center',
  },
  link: {
    color: '#007bff',
    textDecoration: 'underline',
    cursor: 'pointer',
  },
  message: {
    marginTop: 20,
    fontSize: 14,
    textAlign: 'center',
  },
};

export default Login;
