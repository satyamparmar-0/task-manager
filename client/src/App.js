import './App.css';
import { Routes, Route, Navigate } from "react-router-dom";
import { useState, useEffect } from 'react';
import axios from 'axios';
import Login from './pages/login';
import Signup from './pages/signup';
import TaskManager from './pages/taskmanager';
import ProtectedRoute from './components/protected.routes';

function App() {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  // Fetch and validate user session from token in localStorage
  const getUser = async () => {
    const token = localStorage.getItem('token');
    
    if (!token) {
      setLoading(false);
      return;
    }

    try {
      const response = await axios.get(`${process.env.REACT_APP_API_URL}/auth/login/success`, {
        headers: { Authorization: `Bearer ${token}` }
      });

      if (response.status === 200) {
        setUser(response.data.user);  // Store user data in state
      } else {
        localStorage.removeItem('token'); // Remove invalid token
        setUser(null);
      }
    } catch (error) {
      console.error("Error fetching user:", error);
      localStorage.removeItem('token');
      setUser(null);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    getUser();  // Fetch user details on page load
  }, []);

  if (loading) {
    return <div>Loading...</div>;  // Display loading state
  }

  return (
    <Routes>
      <Route
        path="/"
        element={user ? <Navigate to="/tasks" /> : <Navigate to="/login" />}
      />
      <Route
        path="/login"
        element={user ? <Navigate to="/tasks" /> : <Login setUser={setUser} />}
      />
      <Route
        path="/signup"
        element={user ? <Navigate to="/tasks" /> : <Signup setUser={setUser} />}
      />
      <Route
        path="/tasks"
        element={
          <ProtectedRoute user={user}>
            <TaskManager user={user} />
          </ProtectedRoute>
        }
      />
    </Routes>
  );
}

export default App;
