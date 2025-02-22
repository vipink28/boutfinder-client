import { KeyRound } from "lucide-react"
import { useState } from "react"
import { useForm } from "react-hook-form"
import { useNavigate } from "react-router"
import { useRequestPasswordResetMutation } from "../../api/authApi"

interface ForgotPasswordForm {
  email: string
}
const ForgotPassword = () => {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<ForgotPasswordForm>()
  const [requestPasswordReset, { isLoading }] =
    useRequestPasswordResetMutation()
  const [message, setMessage] = useState<string | null>(null)
  const navigate = useNavigate()

  const onSubmit = async (data: ForgotPasswordForm) => {
    try {
      const response = await requestPasswordReset(data).unwrap()
      navigate("/reset-password", { state: { email: data.email } })
    } catch (error: any) {
      setMessage(error.data?.message || "Something went wrong.")
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
          Forgot Password ?
        </h1>
        <p className="text-center text-gray-600 text-sm mb-8">
          Enter your email to get 4 digit code to reset password:
        </p>

        {message && <p className="text-sm text-green-600">{message}</p>}
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Email
            </label>
            <input
              type="email"
              {...register("email", { required: "Email is required" })}
              className="w-full border rounded-lg p-3 text-gray-900 focus:ring-2 focus:ring-gray-500 focus:border-transparent"
            />
            {errors.email && (
              <p className="text-primary-500 text-xs">{errors.email.message}</p>
            )}
          </div>
          <button
            type="submit"
            className="w-full bg-primary-500 text-white rounded-lg py-3 text-sm font-medium disabled:opacity-50 disabled:cursor-not-allowed mb-6"
            disabled={isLoading}
          >
            {isLoading ? "Sending..." : "Send Reset Code"}
          </button>
        </form>
      </div>
    </div>
  )
}

export default ForgotPassword
