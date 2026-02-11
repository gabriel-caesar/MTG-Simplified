import { useContext, useEffect } from 'react'
import { authContext } from './contexts/contexts'
import { useLocation, useNavigate } from 'react-router';

export default function ProtectedRoute({ children, toDashboard = false }) {
  const { user } = useContext(authContext);
  const navigate = useNavigate();
  const location = useLocation();

  // Doesn't let the user access certain routes based of authentication
  useEffect(() => {
    if (user && toDashboard)
      navigate('multiplayer/dashboard', { replace: true })
    if (!user && location.pathname.includes('dashboard'))
      navigate('multiplayer/login', { replace: true })
  }, [user, navigate])

  return children
}