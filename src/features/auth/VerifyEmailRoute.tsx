import { useEffect, useState } from "react"
import { useNavigate } from "react-router"

interface VerifyEmailRouteProps {
  children: React.ReactNode
}

const VerifyEmailRoute = ({ children }: VerifyEmailRouteProps) => {
  const token = localStorage.getItem("token") // Check if user has a token
  const justRegistered = sessionStorage.getItem("justRegistered") // Check if the user came from registration
  const [isValid, setIsValid] = useState(false)
  const navigate = useNavigate()
  useEffect(() => {
    if (token) {
      setIsValid(true)
    } else if (justRegistered) {
      setIsValid(true)
    } else {
      navigate("/login")
    }
  }, [token, justRegistered])

  return <>{isValid ? children : null}</>
}

export default VerifyEmailRoute
