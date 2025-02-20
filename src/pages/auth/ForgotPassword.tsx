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
      setMessage(response.message) // Show success message

      // Redirect user to reset-password page, passing email as state
      navigate("/reset-password", { state: { email: data.email } })
    } catch (error: any) {
      setMessage(error.data?.message || "Something went wrong.")
    }
  }

  return (
    <div className="max-w-md mx-auto p-6 bg-white shadow-md rounded-lg">
      <h2 className="text-xl font-bold mb-4">Forgot Password</h2>
      {message && <p className="text-sm text-blue-600">{message}</p>}
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
        <div>
          <label className="block text-sm font-medium">Email</label>
          <input
            type="email"
            {...register("email", { required: "Email is required" })}
            className="w-full px-3 py-2 border rounded-lg focus:outline-none"
          />
          {errors.email && (
            <p className="text-red-500 text-xs">{errors.email.message}</p>
          )}
        </div>
        <button
          type="submit"
          className="w-full bg-blue-600 text-white py-2 rounded-lg"
          disabled={isLoading}
        >
          {isLoading ? "Sending..." : "Send Reset Code"}
        </button>
      </form>
    </div>
  )
}

export default ForgotPassword
