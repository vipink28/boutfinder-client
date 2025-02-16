import { useSelector } from "react-redux"
import { Navigate } from "react-router"
import { RootState } from "../../app/store"

interface ProtectedRouteProps {
  children: React.ReactNode
}

const ProtectedRoute = ({ children }: ProtectedRouteProps) => {
  const token = useSelector((state: RootState) => state.auth.token)

  if (!token) {
    // If not logged in, redirect to login
    return <Navigate to="/login" replace />
  }

  return <>{children}</>
}

export default ProtectedRoute
