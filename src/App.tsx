import { useEffect } from "react"
import { useSelector } from "react-redux"
import { useLocation, useNavigate } from "react-router"
import { useGetUserStatusQuery } from "./api/authApi"
import { RootState } from "./app/store"
import AppRouter from "./routes/AppRouter"

const App = () => {
  const navigate = useNavigate()
  const location = useLocation()
  const token = useSelector((state: RootState) => state.auth.token)
  const { data, isLoading, error } = useGetUserStatusQuery()

  // List of public routes
  const publicRoutes = [
    "/",
    "/login",
    "/verify-email",
    "/forgot-password",
    "/change-password",
  ]

  useEffect(() => {
    if (token) {
      // If logged in, check user status and redirect accordingly
      if (data) {
        switch (data.RedirectTo) {
          case "verify-email":
            navigate("/verify-email")
            break
          case "add-club":
            navigate("/add-club")
            break
          case "club-pending":
            navigate("/membership-status")
            break
          case "dashboard":
            navigate("/dashboard")
            break
          default:
            navigate("/login")
        }
      }
    } else if (!publicRoutes.includes(location.pathname)) {
      // If not logged in and not on a public route, redirect to login
      navigate("/login")
    }
  }, [token, data, navigate, location.pathname])

  // Handle 401 Unauthorized separately
  useEffect(() => {
    if (
      error &&
      "status" in error &&
      error.status === 401 &&
      !publicRoutes.includes(location.pathname)
    ) {
      navigate("/login")
    }
  }, [error, navigate])

  if (isLoading) {
    return <div>Loading...</div> // Show a loading spinner
  }

  // Only show error message for non-401 errors
  if (error && (!("status" in error) || error.status !== 401)) {
    return <div>Error fetching user status.</div> // Handle error
  }

  return <AppRouter />
}

export default App
