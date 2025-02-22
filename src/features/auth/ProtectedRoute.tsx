import { useSelector } from "react-redux"
import { Navigate, useLocation } from "react-router"
import { RootState } from "../../app/store"
import Loading from "../../components/global/Loading"

interface ProtectedRouteProps {
  children: React.ReactNode
  requiresVerification?: boolean
  requiresClub?: boolean
  requiresApproval?: boolean
}

const ProtectedRoute = ({
  children,
  requiresVerification = true,
  requiresClub = true,
  requiresApproval = true,
}: ProtectedRouteProps) => {
  const user = useSelector((state: RootState) => state.auth.user)
  const token = useSelector((state: RootState) => state.auth.token)
  const isUserLoading = useSelector((state: RootState) => state.auth.isLoading)
  const location = useLocation()

  if (isUserLoading) {
    return <Loading />
  }

  if (!token || !user) {
    return <Navigate to="/login" state={{ from: location }} replace />
  }

  if (requiresVerification && !user.isEmailVerified) {
    return <Navigate to="/verify-email" replace />
  }

  if (requiresClub && !user.clubId) {
    return <Navigate to="/add-club" replace />
  }

  if (requiresApproval && !user.isClubApproved) {
    return <Navigate to="/membership-status" replace />
  }

  return <>{children}</>
}

export default ProtectedRoute
