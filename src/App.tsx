import { useEffect } from "react"
import { useDispatch, useSelector } from "react-redux"
import { useLocation, useNavigate } from "react-router"
import { useGetUserStatusQuery } from "./api/authApi"
import { RootState } from "./app/store"
import { logout } from "./features/auth/authSlice"
import AppRouter from "./routes/AppRouter"

const App = () => {
  const navigate = useNavigate()
  const location = useLocation()
  const dispatch = useDispatch()
  const token = useSelector((state: RootState) => state.auth.token)
  const user = useSelector((state: RootState) => state.auth.user)
  const userRole = useSelector((state: RootState) => state.auth.userRole)
  const isUserLoading = useSelector((state: RootState) => state.auth.isLoading)

  const { error } = useGetUserStatusQuery(undefined, {
    skip: !token, // Skip if no token
  })

  const publicRoutes = [
    "/",
    "/login",
    "/verify-email",
    "/forgot-password",
    "/reset-password",
  ]

  useEffect(() => {
    if (!token && !publicRoutes.includes(location.pathname)) {
      navigate("/login")
      return
    }

    if (location.pathname === "/" || location.pathname === "/login") {
      if (token && user && userRole) {
        const isAdmin = userRole === "Admin"
        if (isAdmin) {
          navigate("/admin")
        } else if (!user.isEmailVerified) {
          navigate("/verify-email")
        } else if (!user.clubId) {
          navigate("/add-club")
        } else if (!user.isClubApproved) {
          navigate("/membership-status")
        } else {
          navigate("/club")
        }
      }
    }
  }, [token, user, userRole, navigate, location.pathname])

  useEffect(() => {
    if (error && "status" in error && error.status === 401) {
      dispatch(logout())
      navigate("/login")
    }
  }, [error, dispatch, navigate])

  if (isUserLoading) return <div>Loading...</div>
  if (error && (!("status" in error) || error.status !== 401))
    return <div>Error fetching user status.</div>

  return <AppRouter />
}

export default App
