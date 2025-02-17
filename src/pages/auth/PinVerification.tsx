import { CheckCircle, Mail } from "lucide-react"
import { useEffect, useRef, useState } from "react"
import { useDispatch } from "react-redux"
import { Link, useNavigate } from "react-router"
import {
  useGetUserStatusQuery,
  useResendEmailVerificationMutation,
  useVerifyEmailMutation,
} from "../../api/authApi"
import { setCredentials } from "../../features/auth/authSlice"
import { getEmailFromToken } from "../../utils/authUtils"

const PinVerfication = () => {
  const [pin, setPin] = useState(["", "", "", ""])
  const [isVerified, setIsVerified] = useState(false)
  const inputRefs = useRef<(HTMLInputElement | null)[]>([])
  const token = localStorage.getItem("token")
  const [email, setEmail] = useState("")
  const [error, setError] = useState("")
  const { refetch } = useGetUserStatusQuery(undefined, { skip: !token })
  const navigate = useNavigate()

  const [verifyEmail] = useVerifyEmailMutation()
  const [resendEmail] = useResendEmailVerificationMutation()

  const dispatch = useDispatch()

  useEffect(() => {
    const token = localStorage.getItem("token")
    const justRegistered = sessionStorage.getItem("justRegistered")

    if (justRegistered) {
      // User came from registration
      const registeredEmail = JSON.parse(justRegistered)
      if (registeredEmail) {
        setEmail(registeredEmail.email)
      } else {
        navigate("/signup") // Redirect if email is missing
      }
    } else if (token) {
      try {
        const extractedEmail = getEmailFromToken(token)
        if (extractedEmail) {
          setEmail(extractedEmail)
        } else {
          navigate("/login") // Redirect if email is missing in token
        }
      } catch (error) {
        console.error("Error decoding token:", error)
        navigate("/login") // Redirect if token is invalid
      }

      sessionStorage.removeItem("justRegistered") // Clean up session storage
    } else {
      navigate("/login") // Redirect if not logged in
    }
  }, [navigate])

  useEffect(() => {
    inputRefs.current[0]?.focus()
  }, [])

  const handleInputChange = (index: number, value: string) => {
    if (!/^\d*$/.test(value)) return

    const newPin = [...pin]
    newPin[index] = value
    setPin(newPin)

    if (value && index < 3) {
      inputRefs.current[index + 1]?.focus()
    }

    if (newPin.every(digit => digit !== "")) {
      validatePin(newPin.join(""))
    }
  }

  const handleBackspace = (index: number) => {
    if (index > 0 && pin[index] === "") {
      const newPin = [...pin]
      newPin[index - 1] = ""
      setPin(newPin)
      inputRefs.current[index - 1]?.focus()
    }
  }

  const handlePaste = (e: React.ClipboardEvent<HTMLInputElement>) => {
    e.preventDefault()
    const pastedData = e.clipboardData.getData("text/plain").replace(/\D/g, "") // Remove non-digits
    if (pastedData.length === 4) {
      const newPin = pastedData.split("")
      setPin(newPin)
      validatePin(newPin.join(""))
    }
  }

  // Validate the pin
  const validatePin = async (code: string) => {
    try {
      const response = await verifyEmail({ email, code }).unwrap()
      if (response.statusCode === 200) {
        setIsVerified(true)
        sessionStorage.removeItem("justRegistered")
        refetch() // ✅ Force re-fetch user status
          .then(({ data }) => {
            if (data) {
              dispatch(setCredentials({ token, user: data })) // ✅ Update Redux state
              setTimeout(() => {
                if (data.RedirectTo === "add-club") {
                  navigate("/subscribe") // Redirect to subscription check before club
                } else {
                  navigate(`/login`)
                }
              }, 3000) // Show success state for 1 second
            }
          })
      }
    } catch (err) {
      setError("Invalid verification code. Please try again.")
    }
  }

  const handleResendEmail = async () => {
    try {
      const response = await resendEmail({ email }).unwrap()
      if (response.statusCode === 200) {
        setError("") // Clear any previous errors
        alert("Verification code resent successfully.")
      }
    } catch (err) {
      setError("Failed to resend verification code. Please try again.")
    }
  }

  return (
    <div className="min-h-screen bg-white p-4">
      {!isVerified ? (
        <div className="max-w-sm mx-auto pt-6">
          {/* Email icon */}
          <div className="flex justify-center mb-8">
            <div className="w-16 h-16 bg-red-50 rounded-full flex items-center justify-center">
              <Mail className="w-8 h-8 text-primary-500" />
            </div>
          </div>

          {/* Heading */}
          <h1 className="text-2xl font-semibold text-center mb-2">
            Check your email
          </h1>
          <p className="text-center text-gray-600 text-sm mb-1">
            Enter the 4-digit code sent to you at:
          </p>
          <p className="text-center text-gray-900 font-medium mb-8">{email}</p>

          {/* Pin inputs */}
          <div className="flex justify-center gap-3 mb-6">
            {pin.map((digit, index) => (
              <input
                key={index}
                ref={el => (inputRefs.current[index] = el)}
                type="text"
                inputMode="numeric"
                pattern="\d*"
                maxLength={1}
                value={digit}
                onChange={e => handleInputChange(index, e.target.value)}
                onKeyDown={e => {
                  if (e.key === "Backspace") {
                    handleBackspace(index)
                  }
                }}
                onPaste={handlePaste}
                className={`w-14 h-14 text-center text-xl font-semibold border-2 rounded-lg focus:outline-none transition-colors focus:border-primary-500 ${
                  digit ? "border-primary-500" : "border-gray-300"
                }`}
              />
            ))}
          </div>

          {/* Verify button */}
          <button
            className="w-full bg-primary-500 text-white rounded-lg py-3 text-sm font-medium disabled:opacity-50 disabled:cursor-not-allowed mb-6"
            disabled={!pin.every(digit => digit !== "")}
            onClick={() => validatePin(pin.join(""))}
          >
            Verify email
          </button>

          {/* Resend button */}
          <p className="text-center text-sm text-gray-500 mb-4">
            Tip: Be sure to check your inbox and spam folders
          </p>
          <button
            onClick={handleResendEmail}
            className="w-full text-center cursor-pointer text-sm text-primary-500 hover:text-primary-500/90"
          >
            Click to resend
          </button>
        </div>
      ) : (
        <div className="max-w-sm mx-auto text-center">
          {/* Success state */}
          <div className="flex justify-center mb-8">
            <div className="w-16 h-16 bg-green-50 rounded-full flex items-center justify-center">
              <CheckCircle className="w-8 h-8 text-green-500" />
            </div>
          </div>

          <h1 className="text-2xl font-semibold mb-2">Email verified</h1>
          <p className="text-gray-600 mb-8">
            Login to complete your registration
          </p>

          {/* <button className="w-full bg-primary-500 text-white rounded-lg py-3 font-medium hover:bg-primary-500/90 transition-colors">
            Continue
          </button> */}

          <Link
            to="/login"
            className="mt-4 text-sm cursor-pointer text-gray-600 hover:text-gray-900"
          >
            Back to log in
          </Link>
        </div>
      )}
    </div>
  )
}

export default PinVerfication
