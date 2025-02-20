import { useState } from "react"
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
  const email = location.state?.email || ""

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
    <div className="max-w-md mx-auto p-6 bg-white shadow-md rounded-lg">
      <h2 className="text-xl font-bold mb-4">Reset Password</h2>
      {message && <p className="text-sm text-blue-600">{message}</p>}
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
        <div>
          <label className="block text-sm font-medium">Email</label>
          <input
            type="email"
            defaultValue={email || ""}
            {...register("email", { required: "Email is required" })}
            className="w-full px-3 py-2 border rounded-lg focus:outline-none"
          />
          {errors.email && (
            <p className="text-red-500 text-xs">{errors.email.message}</p>
          )}
        </div>

        <div>
          <label className="block text-sm font-medium">Reset Code</label>
          <input
            type="text"
            {...register("token", { required: "Reset code is required" })}
            className="w-full px-3 py-2 border rounded-lg focus:outline-none"
          />
          {errors.token && (
            <p className="text-red-500 text-xs">{errors.token.message}</p>
          )}
        </div>

        <div>
          <label className="block text-sm font-medium">New Password</label>
          <input
            type="password"
            {...register("newPassword", {
              required: "Password is required",
              minLength: {
                value: 6,
                message: "Password must be at least 6 characters",
              },
            })}
            className="w-full px-3 py-2 border rounded-lg focus:outline-none"
          />
          {errors.newPassword && (
            <p className="text-red-500 text-xs">{errors.newPassword.message}</p>
          )}
        </div>

        <div>
          <label className="block text-sm font-medium">Confirm Password</label>
          <input
            type="password"
            {...register("confirmPassword", {
              required: "Please confirm password",
              validate: value =>
                value === watch("newPassword") || "Passwords do not match",
            })}
            className="w-full px-3 py-2 border rounded-lg focus:outline-none"
          />
          {errors.confirmPassword && (
            <p className="text-red-500 text-xs">
              {errors.confirmPassword.message}
            </p>
          )}
        </div>

        <button
          type="submit"
          className="w-full bg-blue-600 text-white py-2 rounded-lg"
          disabled={isLoading}
        >
          {isLoading ? "Resetting..." : "Reset Password"}
        </button>
      </form>
    </div>
  )
}
