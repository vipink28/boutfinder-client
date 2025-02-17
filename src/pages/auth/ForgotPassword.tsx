import { ArrowRight, CheckCircle, ChevronLeft, Mail } from "lucide-react"
import { Link } from "react-router"

const ForgotPassword = () => {
  return (
    <div className="min-h-screen bg-white p-4">
      {/*Initial screen to get user email and send api request to change password*/}
      <div className="max-w-sm mx-auto">
        <button className="flex items-center gap-1 text-boutfinder hover:text-boutfinder/90 mb-6">
          <ChevronLeft className="w-4 h-4" />
          <span>Back to login</span>
        </button>

        <div className="flex justify-center mb-8">
          <div className="w-16 h-16 bg-red-50 rounded-full flex items-center justify-center">
            <Mail className="w-8 h-8 text-boutfinder" />
          </div>
        </div>

        <h1 className="text-2xl font-semibold text-center mb-2">
          Reset password
        </h1>
        <p className="text-center text-gray-600 mb-8">
          Enter your email address and we'll send you instructions to reset your
          password.
        </p>

        <form>
          <div className="mb-6">
            <label
              htmlFor="email"
              className="block text-sm font-medium text-gray-700 mb-1"
            >
              Email address
            </label>
            <input
              type="email"
              id="email"
              className="w-full border border-gray-300 rounded-lg p-3 focus:outline-none focus:ring-2 focus:ring-boutfinder focus:border-transparent"
              placeholder="Enter your email"
              required
            />
          </div>

          <button
            type="submit"
            className="w-full bg-boutfinder text-white rounded-lg py-3 font-medium hover:bg-boutfinder/90 transition-colors flex items-center justify-center gap-2"
          >
            <span>Reset password</span>
            <ArrowRight className="w-5 h-5" />
          </button>
        </form>
      </div>

      {/*After submiting the request this will render where user can try again or go to login*/}
      <div className="max-w-sm mx-auto text-center">
        <div className="flex justify-center mb-8">
          <div className="w-16 h-16 bg-green-50 rounded-full flex items-center justify-center">
            <CheckCircle className="w-8 h-8 text-green-500" />
          </div>
        </div>

        <h1 className="text-2xl font-semibold mb-2">Check your email</h1>
        <p className="text-gray-600 mb-2">
          We've sent a password reset link to:
        </p>
        <p className="font-medium text-gray-900 mb-8">{/* user email */}</p>

        <Link
          to="/login"
          className="w-full bg-boutfinder text-white rounded-lg py-3 font-medium hover:bg-boutfinder/90 transition-colors"
        >
          Back to login
        </Link>

        <button className="mt-4 text-sm text-gray-600 hover:text-gray-900">
          Didn't receive the email? Try again
        </button>
      </div>
    </div>
  )
}

export default ForgotPassword
