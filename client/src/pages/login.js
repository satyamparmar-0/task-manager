import { useState } from 'react';
import axios from 'axios';
import '../styles/login.modules.css'; // Import the CSS file
import Navbar from '../components/navbar';

function Login({ setUser }) {
  const [formData, setFormData] = useState({
    email: '',
    password: ''
  });
  const [error, setError] = useState(null);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(null);
    
    try {
      const response = await axios.post(`${process.env.REACT_APP_API_URL}/auth/login`, formData, { withCredentials: true });
      localStorage.setItem('token', response.data.token);
      setUser(response.data.user);
      console.log(response.data);
    } catch (error) {
      setError(error.response.data.message || 'Error logging in');
    }
  };

  const handleGoogleLogin = () => {
    window.open(`${process.env.REACT_APP_API_URL}/auth/google`, '_self');
  };  

  return (
    <div className="login-container">
    <Navbar/>
      <h2>Login</h2>
      <form className="login-form" onSubmit={handleSubmit}>
        {error && <p style={{ color: 'red' }}>{error}</p>}
        <input
          type="email"
          name="email"
          placeholder="Email"
          value={formData.email}
          onChange={handleChange}
          required
        />
        <input
          type="password"
          name="password"
          placeholder="Password"
          value={formData.password}
          onChange={handleChange}
          required
        />
        <button className="login-button" type="submit">Login</button>
      </form>
      <div className="auth-options">
        <p>Don't have an account? <a href="/signup">Signup</a></p>
        <button className="google-auth-button" onClick={handleGoogleLogin}>
          Login with Google
        </button>
      </div>
    </div>
  );
}

export default Login;
