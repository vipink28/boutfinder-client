import { Suspense, lazy } from "react"
import { Navigate, Route, Routes } from "react-router"
import Loading from "../components/global/Loading"
import AddClubRoute from "../features/auth/AddClubRoute"
import AdminProtectedRoute from "../features/auth/AdminProtectedRoute"
import GeneralProtectedRoute from "../features/auth/GeneralProtectedRoute"
import MembershipStatusRoute from "../features/auth/MembershipStatusRoute"
import ProtectedRoute from "../features/auth/ProtectedRoute"
import VerifyEmailRoute from "../features/auth/VerifyEmailRoute"
import AllMessages from "../pages/AllMessages"
import ForgotPassword from "../pages/auth/ForgotPassword"
import ResetPassword from "../pages/auth/ResetPassword"
import Signin from "../pages/auth/Signin"
import Signup from "../pages/auth/Signup"
import BoutEnquiries from "../pages/BoutEnquiries"
import Boxers from "../pages/Boxers"
import Account from "../pages/club/Account"
import CompletedShows from "../pages/CompletedShows"
import Finder from "../pages/Finder"
import Messages from "../pages/Messages"
import ShowEnquiries from "../pages/ShowEnquiries"
import Shows from "../pages/Shows"
import UpcomingShows from "../pages/UpcomingShows"
const AdminDashboard = lazy(() => import("../admin/AdminDashboard"))
const MembershipStatus = lazy(() => import("../pages/auth/MembershipStatus"))
const ClubLayout = lazy(() => import("../layouts/ClubLayout"))
const ClubRegistration = lazy(() => import("../pages/club/ClubRegistration"))
const StripeSubscriptionPage = lazy(
  () => import("../pages/auth/StripeSubscriptionPage"),
)
const PinVerfication = lazy(() => import("../pages/auth/PinVerification"))
const AppRouter = () => {
  return (
    <Routes>
      {/* Public Routes */}
      <Route path="/" element={<Signup />} />
      <Route path="/login" element={<Signin />} />
      <Route path="/forgot-password" element={<ForgotPassword />} />
      <Route path="/reset-password" element={<ResetPassword />} />

      {/* Semi-protected Routes */}
      <Route
        path="/verify-email"
        element={
          <VerifyEmailRoute>
            <Suspense fallback={<Loading />}>
              <PinVerfication />
            </Suspense>
          </VerifyEmailRoute>
        }
      />
      <Route
        path="/subscribe"
        element={
          <GeneralProtectedRoute>
            <Suspense fallback={<Loading />}>
              <StripeSubscriptionPage />
            </Suspense>
          </GeneralProtectedRoute>
        }
      />
      <Route
        path="/add-club"
        element={
          <AddClubRoute>
            <Suspense fallback={<Loading />}>
              <ClubRegistration />
            </Suspense>
          </AddClubRoute>
        }
      />
      <Route
        path="/membership-status"
        element={
          <MembershipStatusRoute>
            <Suspense fallback={<Loading />}>
              <MembershipStatus />
            </Suspense>
          </MembershipStatusRoute>
        }
      />

      {/* Club Routes */}
      <Route
        path="/club"
        element={
          <ProtectedRoute>
            <Suspense fallback={<Loading />}>
              <ClubLayout />
            </Suspense>
          </ProtectedRoute>
        }
      >
        <Route index element={<Finder />} />
        <Route path="account" element={<Account />} />
        <Route path="my-boxers" element={<Boxers />} />
        <Route path="shows" element={<Shows />}>
          <Route index element={<UpcomingShows />} />
          <Route path="completed" element={<CompletedShows />} />
        </Route>
        <Route path="messages" element={<Messages />}>
          <Route index element={<AllMessages />} />
          <Route path="show-enquiries" element={<ShowEnquiries />} />
          <Route path="bout-enquiries" element={<BoutEnquiries />} />
        </Route>
      </Route>

      {/* Admin Routes */}
      <Route
        path="/admin/*"
        element={
          <AdminProtectedRoute>
            <Suspense fallback={<Loading />}>
              <AdminDashboard />
            </Suspense>
          </AdminProtectedRoute>
        }
      />

      {/* Catch all route */}
      <Route path="*" element={<Navigate to="/login" replace />} />
    </Routes>
  )
}

export default AppRouter
