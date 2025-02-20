import { useSelector } from "react-redux"
import { Navigate } from "react-router"
import { RootState } from "../../app/store"

const AdminProtectedRoute = ({ children }: { children: JSX.Element }) => {
  const token = useSelector((state: RootState) => state.auth.token)
  const userRole = useSelector((state: RootState) => state.auth.userRole)

  if (!token || !userRole) {
    return <Navigate to="/login" replace />
  }

  if (userRole !== "Admin") {
    return <Navigate to="/club" replace />
  }

  return children
}

export default AdminProtectedRoute
