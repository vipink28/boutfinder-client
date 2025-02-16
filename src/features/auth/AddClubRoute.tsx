import { useSelector } from "react-redux"
import { RootState } from "../../app/store"

export const AddClubRoute = ({ children }: { children: JSX.Element }) => {
  const userStatus = useSelector((state: RootState) => state.auth.userStatus)

  if (!userStatus) return <Navigate to="/login" />
  if (!userStatus.isEmailVerified) return <Navigate to="/verify-email" />
  if (userStatus.clubId) return <Navigate to="/dashboard" />

  return children
}
