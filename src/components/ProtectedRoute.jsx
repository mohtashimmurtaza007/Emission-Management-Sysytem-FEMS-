import { Navigate } from 'react-router-dom';
import { useAuth } from '../contexts/authContext';

export default function ProtectedRoute({ children }) {
  const { currentUser } = useAuth();

  if (!currentUser) {
    return <Navigate to="/login" />;
  }

  return children;
}
