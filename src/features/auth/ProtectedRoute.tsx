import { useSelector } from "react-redux"
import { Navigate } from "react-router"
import { RootState } from "../../app/store"

interface ProtectedRouteProps {
  children: React.ReactNode
}

const ProtectedRoute = ({ children }: ProtectedRouteProps) => {
  const userStatus = useSelector((state: RootState) => state.auth.user)

  if (!userStatus) return <Navigate to="/login" />
  if (!userStatus.isEmailVerified) return <Navigate to="/verify-email" />
  if (!userStatus.clubId) return <Navigate to="/subscribe" />
  if (!userStatus.isClubApproved) return <Navigate to="/membership-status" />

  return children
}

export default ProtectedRoute
