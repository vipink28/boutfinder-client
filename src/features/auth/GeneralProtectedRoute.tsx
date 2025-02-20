import { useSelector } from "react-redux"
import { Navigate } from "react-router"
import { RootState } from "../../app/store"

interface ProtectedRouteProps {
  children: React.ReactNode
}

const GeneralProtectedRoute = ({ children }: ProtectedRouteProps) => {
  const userStatus = useSelector((state: RootState) => state.auth.user)
  if (!userStatus) return <Navigate to="/login" />
  return children
}

export default GeneralProtectedRoute
