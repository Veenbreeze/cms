import { Navigate, Outlet } from 'react-router-dom'

import { useAuth } from '../context/AuthContext'
import { ROUTES } from './routePaths'

export default function RoleRoute({ allowedRoles }) {
  const { user } = useAuth()

  if (!allowedRoles.includes(user?.role)) {
    return <Navigate to={ROUTES.FORBIDDEN} replace />
  }

  return <Outlet />
}
