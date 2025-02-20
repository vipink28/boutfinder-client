import { useSelector } from "react-redux"
import { Navigate, Outlet, useLocation } from "react-router"
import { RootState } from "../../app/store"

interface ProtectedRouteProps {
  children: React.ReactNode
}

const ProtectedRoute = () => {
  const userStatus = useSelector((state: RootState) => state.auth.user)
  const token = useSelector((state: RootState) => state.auth.token)
  const location = useLocation()

  if (!userStatus && token) return <div>Loading...</div>

  if (!userStatus)
    return <Navigate to="/login" state={{ from: location }} replace />

  if (!userStatus.isEmailVerified)
    return <Navigate to="/verify-email" replace />
  if (!userStatus.clubId) return <Navigate to="/add-club" replace />
  if (!userStatus.isClubApproved)
    return <Navigate to="/membership-status" replace />
  return <Outlet />
}

export default ProtectedRoute
