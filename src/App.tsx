import { useEffect } from "react"
import { useDispatch, useSelector } from "react-redux"
import { useLocation, useNavigate } from "react-router"
import { useGetUserStatusQuery } from "./api/authApi"
import { RootState } from "./app/store"
import { logout, setCredentials } from "./features/auth/authSlice"
import AppRouter from "./routes/AppRouter"

const App = () => {
  const navigate = useNavigate()
  const location = useLocation()
  const dispatch = useDispatch()
  const token = useSelector((state: RootState) => state.auth.token)
  const user = useSelector((state: RootState) => state.auth.user)

  const {
    data: userStatus,
    isLoading,
    error,
  } = useGetUserStatusQuery(undefined, {
    skip: !token || !!user, // Prevent API call if user is not logged in
  })

  const publicRoutes = [
    "/",
    "/login",
    "/verify-email",
    "/forgot-password",
    "/change-password",
  ]

  useEffect(() => {
    if (userStatus && token) {
      if (!user) {
        dispatch(setCredentials({ token, user: userStatus }))
      }
    }
  }, [userStatus, dispatch, token, user])

  useEffect(() => {
    if (token && user) {
      if (!user.isEmailVerified) {
        navigate("/verify-email")
      } else if (!user.clubId) {
        navigate("/add-club")
      } else if (!user.isClubApproved) {
        navigate("/membership-status")
      } else {
        navigate("/dashboard")
      }
    } else if (!token && !publicRoutes.includes(location.pathname)) {
      navigate("/login")
    }
  }, [token, user, navigate, location.pathname])

  useEffect(() => {
    if (error && "status" in error && error.status === 401) {
      if (!token) return // Prevent logout if no token exists yet
      console.log("Error in useEffect:", error)
      dispatch(logout())
      navigate("/login")
    }
  }, [error, dispatch, navigate, token])

  if (isLoading) return <div>Loading...</div>
  if (error && (!("status" in error) || error.status !== 401))
    return <div>Error fetching user status.</div>

  return <AppRouter />
}

export default App
