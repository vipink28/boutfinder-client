import { Route, Routes } from "react-router"
import AdminDashboard from "../admin/AdminDashboard"
import { AddClubRoute } from "../features/auth/AddClubRoute"
import AdminProtectedRoute from "../features/auth/AdminProtectedRoute"
import GeneralProtectedRoute from "../features/auth/GeneralProtectedRoute"
import { MembershipStatusRoute } from "../features/auth/MembershipStatusRoute"
import ProtectedRoute from "../features/auth/ProtectedRoute"
import VerifyEmailRoute from "../features/auth/VerifyEmailRoute"
import ClubLayout from "../layouts/ClubLayout"
import AllMessages from "../pages/AllMessages"
import ForgotPassword from "../pages/auth/ForgotPassword"
import MembershipStatus from "../pages/auth/MembershipStatus"
import PinVerfication from "../pages/auth/PinVerification"
import ResetPassword from "../pages/auth/ResetPassword"
import Signin from "../pages/auth/Signin"
import Signup from "../pages/auth/Signup"
import StripeSubscriptionPage from "../pages/auth/StripeSubscriptionPage"
import BoutEnquiries from "../pages/BoutEnquiries"
import Boxers from "../pages/Boxers"
import Account from "../pages/club/Account"
import ClubRegistration from "../pages/club/ClubRegistration"
import CompletedShows from "../pages/CompletedShows"
import Finder from "../pages/Finder"
import ShowEnquiries from "../pages/ShowEnquiries"
import UpcomingShows from "../pages/UpcomingShows"

const AppRouter = () => {
  return (
    <Routes>
      {/* Public Routes */}
      <Route path="/" element={<Signup />} />
      <Route path="/login" element={<Signin />} />
      <Route path="/forgot-password" element={<ForgotPassword />} />
      <Route path="/reset-password" element={<ResetPassword />} />
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

      <Route path="/club" element={<ProtectedRoute />}>
        <Route element={<ClubLayout />}>
          <Route index element={<Finder />} />
          <Route path="account" element={<Account />} />
          <Route path="my-boxers" element={<Boxers />} />
          <Route path="shows">
            <Route index element={<UpcomingShows />} />
            <Route path="completed" element={<CompletedShows />} />
          </Route>
          <Route path="messages">
            <Route index element={<AllMessages />} />
            <Route path="show-enquiries" element={<ShowEnquiries />} />
            <Route path="bout-enquiries" element={<BoutEnquiries />} />
          </Route>
        </Route>
      </Route>

      <Route
        path="/admin"
        element={
          <AdminProtectedRoute>
            <AdminDashboard />
          </AdminProtectedRoute>
        }
      />
      {/* Default redirect to login */}
      <Route path="*" element={<Signin />} />
    </Routes>
  )
}

export default AppRouter
