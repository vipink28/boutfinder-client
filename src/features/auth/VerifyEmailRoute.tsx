import { useEffect, useState } from "react"
import { useSelector } from "react-redux"
import { useNavigate } from "react-router"
import { RootState } from "../../app/store"

interface VerifyEmailRouteProps {
  children: React.ReactNode
}

const VerifyEmailRoute = ({ children }: VerifyEmailRouteProps) => {
  const navigate = useNavigate()
  const token = useSelector((state: RootState) => state.auth.token)
  const user = useSelector((state: RootState) => state.auth.user)
  const justRegistered = sessionStorage.getItem("justRegistered") // User came from signup
  const [isValid, setIsValid] = useState(false)

  useEffect(() => {
    if (token || justRegistered) {
      setIsValid(true)
    } else {
      navigate("/login")
    }
  }, [token, justRegistered, navigate])

  // ✅ Ensure user is loaded before checking verification status
  useEffect(() => {
    if (user === null) return // 🛑 Wait for user to load
    if (user.isEmailVerified) {
      navigate("/subscribe", { replace: true }) // ✅ Redirect once email is verified
    }
  }, [user?.isEmailVerified, navigate])

  return <>{isValid ? children : null}</>
}

export default VerifyEmailRoute
