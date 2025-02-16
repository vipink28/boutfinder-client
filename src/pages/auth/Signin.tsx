import { yupResolver } from "@hookform/resolvers/yup"
import { ArrowRight, Eye, EyeOff, Lock, Mail } from "lucide-react"
import { useState } from "react"
import { SubmitHandler, useForm } from "react-hook-form"
import { useDispatch } from "react-redux"
import { Link, useNavigate } from "react-router"
import * as yup from "yup"
import { useLoginMutation } from "../../api/authApi"
import { setCredentials } from "../../features/auth/authSlice"

// Define the error response type
interface ErrorResponse {
  message?: string
}

// Define validation schema using yup
const schema = yup.object().shape({
  email: yup.string().email("Invalid email").required("Email is required"),
  password: yup.string().required("Password is required"),
})

type FormData = {
  email: string
  password: string
}
const handleVerifyEmail = async () => {
  sessionStorage.removeItem("justRegistered") // Remove flag after verification
}

const Signin = () => {
  const [showPassword, setShowPassword] = useState(false)
  const navigate = useNavigate()
  const dispatch = useDispatch()
  const [login, { isLoading, error }] = useLoginMutation()

  const {
    register,
    handleSubmit,
    formState: { errors },
    setError: setFormError,
  } = useForm<FormData>({
    resolver: yupResolver(schema),
  })

  const onSubmit: SubmitHandler<FormData> = async data => {
    try {
      const response = await login(data).unwrap()
      if (response.RedirectTo) {
        navigate(`/${response.RedirectTo}`)
      } else {
        navigate("/dashboard")
      }
      dispatch(setCredentials({ user: null, token: response.token }))
    } catch (err) {
      // Handle server-side errors
      setFormError("root", {
        type: "manual",
        message: "Invalid email or password. Please try again.",
      })
    }
  }

  return (
    <div className="min-h-screen flex flex-col justify-start bg-gray-50 px-4 sm:px-6 lg:px-8">
      <div className="w-full max-w-md mx-auto mt-8 sm:mt-12">
        <div>
          <h1 className="font-extrabold text-4xl text-center">
            <span className="text-primary-500">BOUT</span>
            <span className="text-gray-900">FINDER</span>
          </h1>
          <h2 className="mt-4 text-center text-2xl sm:text-3xl font-extrabold text-gray-900">
            Sign in to your account
          </h2>
          <p className="mt-2 text-center text-sm text-gray-600">
            Don't have an account?{" "}
            <Link
              to="/"
              className="font-medium text-primary-500 hover:text-primary-500/90"
            >
              Sign up
            </Link>
          </p>
        </div>

        {/* Server-side error */}
        {error && (
          <div className="mb-4 text-sm text-primary-500">
            {("data" in error && (error.data as ErrorResponse)?.message) ||
              "Login failed. Please try again."}
          </div>
        )}

        <form
          onSubmit={handleSubmit(onSubmit)}
          className="mt-6 space-y-4 sm:space-y-6"
        >
          <div className="rounded-md shadow-sm space-y-4">
            <div>
              <label htmlFor="email" className="sr-only">
                Email address
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <Mail className="h-5 w-5 text-gray-400" />
                </div>
                <input
                  id="email"
                  {...register("email")}
                  type="email"
                  autoComplete="email"
                  className={`appearance-none relative block w-full px-3 py-3 pl-10 border ${
                    errors.email ? "border-primary-500" : "border-gray-300"
                  } placeholder-gray-500 text-gray-900 rounded-lg focus:outline-none focus:ring-primary-500 focus:border-primary-500 focus:z-10 sm:text-sm`}
                  placeholder="Email address"
                />
              </div>
              {errors.email && (
                <p className="mt-1 text-sm text-primary-500">
                  {errors.email.message}
                </p>
              )}
            </div>

            <div>
              <label htmlFor="password" className="sr-only">
                Password
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <Lock className="h-5 w-5 text-gray-400" />
                </div>
                <input
                  id="password"
                  {...register("password")}
                  type={showPassword ? "text" : "password"}
                  autoComplete="current-password"
                  className={`appearance-none relative block w-full px-3 py-3 pl-10 border ${
                    errors.password ? "border-primary-500" : "border-gray-300"
                  } placeholder-gray-500 text-gray-900 rounded-lg focus:outline-none focus:ring-primary-500 focus:border-primary-500 focus:z-10 sm:text-sm`}
                  placeholder="Password"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute inset-y-0 right-0 pr-3 flex items-center"
                >
                  {showPassword ? (
                    <EyeOff className="h-5 w-5 text-gray-400" />
                  ) : (
                    <Eye className="h-5 w-5 text-gray-400" />
                  )}
                </button>
              </div>
              {errors.password && (
                <p className="mt-1 text-sm text-primary-500">
                  {errors.password.message}
                </p>
              )}
            </div>
          </div>

          <div className="flex items-center justify-between">
            <div className="flex items-center">
              <input
                id="remember-me"
                name="remember-me"
                type="checkbox"
                className="h-4 w-4 text-primary-500 focus:ring-primary-500 border-gray-300 rounded"
              />
              <label
                htmlFor="remember-me"
                className="ml-2 block text-sm text-gray-900"
              >
                Remember me
              </label>
            </div>

            <div className="text-sm">
              <button
                type="button"
                onClick={() => navigate("/forgot-password")}
                className="font-medium text-primary-500 hover:text-primary-500/90"
              >
                Forgot your password?
              </button>
            </div>
          </div>

          <div>
            <button
              type="submit"
              disabled={isLoading}
              className="group relative w-full flex justify-center py-3 px-4 border border-transparent text-sm font-medium rounded-lg text-white bg-primary-500 hover:bg-primary-500/90 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500"
            >
              <span className="absolute left-0 inset-y-0 flex items-center pl-3">
                <ArrowRight className="h-5 w-5 text-primary-500-light group-hover:text-primary-500-light" />
              </span>
              {isLoading ? "Signing in..." : "Sign in"}
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}

export default Signin
