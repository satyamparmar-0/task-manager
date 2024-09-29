import { Navigate } from 'react-router-dom';

const ProtectedRoute = ({ user, children }) => {
  const token = localStorage.getItem('token');
  if (!token||!user) {
    return <Navigate to="/login" />;  // Redirect to login if no user is found
  }

  return children;  // Render the protected content if the user exists
};

export default ProtectedRoute;
