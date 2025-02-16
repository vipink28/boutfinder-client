import { Route, Routes } from "react-router"
import ProtectedRoute from "../features/auth/ProtectedRoute"
import VerifyEmailRoute from "../features/auth/VerifyEmailRoute"
import ChangePassword from "../pages/auth/ChangePassword"
import ForgotPassword from "../pages/auth/ForgotPassword"
import MembershipStatus from "../pages/auth/MembershipStatus"
import PinVerfication from "../pages/auth/PinVerification"
import Signin from "../pages/auth/Signin"
import Signup from "../pages/auth/Signup"
import Account from "../pages/club/Account"
import ClubRegistration from "../pages/club/ClubRegistration"
import Dashboard from "../pages/Dashboard"

const AppRouter = () => {
  return (
    <Routes>
      {/* Public Routes */}
      <Route path="/" element={<Signup />} />
      <Route path="/login" element={<Signin />} />
      <Route path="/forgot-password" element={<ForgotPassword />} />
      <Route path="/change-password" element={<ChangePassword />} />
      <Route
        path="/verify-email"
        element={
          <VerifyEmailRoute>
            <PinVerfication />
          </VerifyEmailRoute>
        }
      />

      {/* Protected Routes */}
      <Route
        path="/membership-status"
        element={
          <ProtectedRoute>
            <MembershipStatus />
          </ProtectedRoute>
        }
      />
      <Route
        path="/dashboard"
        element={
          <ProtectedRoute>
            <Dashboard />
          </ProtectedRoute>
        }
      />
      <Route
        path="/add-club"
        element={
          <ProtectedRoute>
            <ClubRegistration />
          </ProtectedRoute>
        }
      />
      <Route
        path="/my-account"
        element={
          <ProtectedRoute>
            <Account />
          </ProtectedRoute>
        }
      />

      {/* Default redirect to login */}
      <Route path="*" element={<Signin />} />
    </Routes>
  )
}

export default AppRouter
