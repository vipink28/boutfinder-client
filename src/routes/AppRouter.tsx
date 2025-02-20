import { Route, Routes } from "react-router"
import ClubApprovalList from "../admin/ClubApprovalList"
import { AddClubRoute } from "../features/auth/AddClubRoute"
import GeneralProtectedRoute from "../features/auth/GeneralProtectedRoute"
import { MembershipStatusRoute } from "../features/auth/MembershipStatusRoute"
import ProtectedRoute from "../features/auth/ProtectedRoute"
import VerifyEmailRoute from "../features/auth/VerifyEmailRoute"
import Account from "../pages/auth/Account"
import ForgotPassword from "../pages/auth/ForgotPassword"
import MembershipStatus from "../pages/auth/MembershipStatus"
import PinVerfication from "../pages/auth/PinVerification"
import ResetPassword from "../pages/auth/ResetPassword"
import Signin from "../pages/auth/Signin"
import Signup from "../pages/auth/Signup"
import StripeSubscriptionPage from "../pages/auth/StripeSubscriptionPage"
import ClubRegistration from "../pages/club/ClubRegistration"
import Dashboard from "../pages/Dashboard"

const AppRouter = () => {
  return (
    <Routes>
      {/* Public Routes */}
      <Route path="/" element={<Signup />} />
      <Route path="/login" element={<Signin />} />
      <Route path="/forgot-password" element={<ForgotPassword />} />
      <Route path="/reset-password" element={<ResetPassword />} />
      <Route path="/admin" element={<ClubApprovalList />}></Route>
      <Route
        path="/verify-email"
        element={
          <VerifyEmailRoute>
            <PinVerfication />
          </VerifyEmailRoute>
        }
      />
      <Route
        path="/subscribe"
        element={
          <GeneralProtectedRoute>
            <StripeSubscriptionPage />
          </GeneralProtectedRoute>
        }
      />
      <Route
        path="/add-club"
        element={
          <AddClubRoute>
            <ClubRegistration />
          </AddClubRoute>
        }
      />

      {/* Protected Routes */}
      <Route
        path="/membership-status"
        element={
          <MembershipStatusRoute>
            <MembershipStatus />
          </MembershipStatusRoute>
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
