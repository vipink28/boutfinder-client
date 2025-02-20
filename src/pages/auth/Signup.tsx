import { yupResolver } from "@hookform/resolvers/yup"
import * as yup from "yup"
import { useLazyCheckEmailQuery, useRegisterMutation } from "../../api/authApi"

import { useState } from "react"
import { SubmitHandler, useForm } from "react-hook-form"
import { useDispatch } from "react-redux"
import { Link, useNavigate } from "react-router"

interface ErrorResponse {
  message?: string
}

const schema = yup.object().shape({
  username: yup.string().required("Club Name is required"),
  email: yup.string().email("Invalid email").required("Email is required"),
  password: yup
    .string()
    .min(8, "Password must be at least 8 characters")
    .required("Password is required"),
})

type FormData = {
  username: string
  email: string
  password: string
}

const Signup = () => {
  const navigate = useNavigate()
  const [register, { isLoading, error }] = useRegisterMutation()
  const [checkEmail, { data: emailCheckData, isFetching: isCheckingEmail }] =
    useLazyCheckEmailQuery()
  const [emailError, setEmailError] = useState<string | null>(null)
  const dispatch = useDispatch()

  const {
    register: registerForm,
    handleSubmit,
    formState: { errors },
    setError: setFormError,
  } = useForm<FormData>({
    resolver: yupResolver(schema),
  })

  const onSubmit: SubmitHandler<FormData> = async data => {
    try {
      const response = await register(data).unwrap()
      if (response.statusCode === 201) {
        sessionStorage.setItem(
          "justRegistered",
          JSON.stringify({ status: true, email: data.email }),
        )
        navigate("/verify-email")
      }
    } catch (err) {
      // Handle server-side errors
      setFormError("root", {
        type: "manual",
        message: "Registration failed. Please try again.",
      })
    }
  }

  const handleEmailBlur = async (email: string) => {
    if (!email) return
    try {
      const response = await checkEmail(email).unwrap()
      if (response.exists) {
        setEmailError("Email already exists. Please login.")
      } else {
        setEmailError(null)
      }
    } catch (err) {
      setEmailError("Error checking email availability.")
    }
  }

  return (
    <div className="min-h-screen flex">
      <div className="flex-1 p-8 flex flex-col">
        <div className="max-w-md mx-auto w-full">
          {/* Form Header */}
          <h2 className="text-2xl font-semibold mb-2">Sign up</h2>
          <p className="text-gray-600 mb-8">12 Months FREE then £5 per month</p>

          {/* Server-side error */}
          {error && (
            <div className="mb-4 text-sm text-primary-500">
              {("data" in error && (error.data as ErrorResponse)?.message) ||
                "Registration failed. Please try again."}
            </div>
          )}

          <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
            {/* Club Name */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Club Name
              </label>
              <input
                type="text"
                {...registerForm("username")}
                className={`w-full border ${
                  errors.username ? "border-primary-500" : "border-gray-300"
                } rounded-lg p-3 text-gray-900 focus:ring-2 focus:ring-gray-500 focus:border-transparent`}
                placeholder="Enter your club name"
              />
              {errors.username && (
                <p className="mt-1 text-sm text-primary-500">
                  {errors.username.message}
                </p>
              )}
            </div>

            {/* Email */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Email*
              </label>
              <input
                type="email"
                {...registerForm("email", {
                  onBlur: e => handleEmailBlur(e.target.value),
                })}
                className={`w-full border ${
                  errors.email || emailError
                    ? "border-primary-500"
                    : "border-gray-300"
                } rounded-lg p-3 text-gray-900 focus:ring-2 focus:ring-gray-500 focus:border-transparent`}
                placeholder="Enter your email"
              />
              {errors.email && (
                <p className="mt-1 text-sm text-primary-500">
                  {errors.email.message}
                </p>
              )}
              {emailError && (
                <p className="mt-1 text-sm text-primary-500">{emailError}</p>
              )}
              {isCheckingEmail && (
                <p className="mt-1 text-sm text-gray-500">Checking email...</p>
              )}
            </div>

            {/* Password */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Password*
              </label>
              <input
                type="password"
                {...registerForm("password")}
                className={`w-full border ${
                  errors.password ? "border-primary-500" : "border-gray-300"
                } rounded-lg p-3 text-gray-900 focus:ring-2 focus:ring-gray-500 focus:border-transparent`}
                placeholder="Create a password"
              />
              {errors.password && (
                <p className="mt-1 text-sm text-primary-500">
                  {errors.password.message}
                </p>
              )}
              <p className="mt-1 text-sm text-gray-500">
                Must be at least 8 characters.
              </p>
            </div>

            {/* Submit Button */}
            <button
              type="submit"
              disabled={isLoading || isCheckingEmail}
              className="w-full bg-primary-500 text-white rounded-lg py-3 font-medium hover:bg-primary-500/90 transition-colors"
            >
              {isLoading ? "Signing up..." : "Continue"}
            </button>
          </form>

          {/* Login Link */}
          <div className="mt-6 text-center">
            <p className="text-gray-600">
              Already have an account?{" "}
              <Link
                to="/login"
                className="text-primary-500 hover:text-primary-500/90 font-medium"
              >
                Log in
              </Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}

export default Signup
