import { KeyRound } from "lucide-react"
import { useEffect, useState } from "react"
import { useForm } from "react-hook-form"
import { useLocation, useNavigate } from "react-router"
import { useResetPasswordMutation } from "../../api/authApi"

interface ResetPasswordForm {
  email: string
  token: string
  newPassword: string
  confirmPassword: string
}

export default function ResetPassword() {
  const {
    register,
    handleSubmit,
    watch,
    formState: { errors },
  } = useForm<ResetPasswordForm>()
  const [resetPassword, { isLoading }] = useResetPasswordMutation()
  const [message, setMessage] = useState<string | null>(null)
  const navigate = useNavigate()
  const location = useLocation()
  const email = location.state?.email

  useEffect(() => {
    if (email === undefined) {
      navigate("/forgot-password")
    }
  }, [email])

  const onSubmit = async (data: ResetPasswordForm) => {
    try {
      const response = await resetPassword({
        email: data.email,
        token: data.token,
        newPassword: data.newPassword,
      }).unwrap()
      setMessage(response.message)
      setTimeout(() => navigate("/login"), 2000)
    } catch (error: any) {
      setMessage(error.data?.message || "Reset failed.")
    }
  }

  return (
    <div className="min-h-screen bg-white p-4">
      <div className="max-w-sm mx-auto pt-6">
        <div className="flex justify-center mb-8">
          <div className="w-16 h-16 bg-red-50 rounded-full flex items-center justify-center">
            <KeyRound className="w-8 h-8 text-primary-500" />
          </div>
        </div>

        <h1 className="text-2xl font-semibold text-center mb-2">
          Reset Password
        </h1>
        <p className="text-center text-gray-600 text-sm mb-8">
          Enter the 4 digit code sent to your email to reset your password
        </p>
        {message && <p className="text-sm text-blue-600">{message}</p>}
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Email
            </label>
            <input
              type="email"
              defaultValue={email || ""}
              {...register("email", { required: "Email is required" })}
              className="w-full border rounded-lg p-3 text-gray-900 focus:ring-2 focus:ring-gray-500 focus:border-transparent"
            />
            {errors.email && (
              <p className="text-red-500 text-xs">{errors.email.message}</p>
            )}
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Reset Code
            </label>
            <input
              type="text"
              {...register("token", { required: "Reset code is required" })}
              className="w-full border rounded-lg p-3 text-gray-900 focus:ring-2 focus:ring-gray-500 focus:border-transparent"
            />
            {errors.token && (
              <p className="text-red-500 text-xs">{errors.token.message}</p>
            )}
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              New Password
            </label>
            <input
              type="password"
              {...register("newPassword", {
                required: "Password is required",
                minLength: {
                  value: 6,
                  message: "Password must be at least 6 characters",
                },
              })}
              className="w-full border rounded-lg p-3 text-gray-900 focus:ring-2 focus:ring-gray-500 focus:border-transparent"
            />
            {errors.newPassword && (
              <p className="text-red-500 text-xs">
                {errors.newPassword.message}
              </p>
            )}
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Confirm Password
            </label>
            <input
              type="password"
              {...register("confirmPassword", {
                required: "Please confirm password",
                validate: value =>
                  value === watch("newPassword") || "Passwords do not match",
              })}
              className="w-full border rounded-lg p-3 text-gray-900 focus:ring-2 focus:ring-gray-500 focus:border-transparent"
            />
            {errors.confirmPassword && (
              <p className="text-red-500 text-xs">
                {errors.confirmPassword.message}
              </p>
            )}
          </div>

          <button
            type="submit"
            className="w-full bg-primary-500 text-white rounded-lg py-3 text-sm font-medium disabled:opacity-50 disabled:cursor-not-allowed mb-6"
            disabled={isLoading}
          >
            {isLoading ? "Resetting..." : "Reset Password"}
          </button>
        </form>
      </div>
    </div>
  )
}
