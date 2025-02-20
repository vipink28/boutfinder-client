import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react"
import { RootState } from "../app/store"

interface UserStatus {
  isEmailVerified: boolean
  clubId: string | null
  isClubApproved: boolean
  stripeSubscriptionId: string
  isMemberActive: boolean
  userId: number
}

export const authApi = createApi({
  baseQuery: fetchBaseQuery({
    baseUrl: "https://localhost:53166/api/Auth",
    prepareHeaders: (headers, { getState }) => {
      const token = (getState() as RootState).auth.token
      if (token) {
        headers.set("Authorization", `Bearer ${token}`)
      }
      return headers
    },
  }),
  reducerPath: "authApi",
  endpoints: builder => ({
    register: builder.mutation({
      query: credentials => ({
        url: "/Register",
        method: "POST",
        body: credentials,
      }),
    }),
    login: builder.mutation<
      { token: string; user: any; redirectTo: string },
      { email: string; password: string }
    >({
      query: credentials => ({
        url: "/login",
        method: "POST",
        body: credentials,
      }),
    }),
    verifyEmail: builder.mutation({
      query: data => ({
        url: "/VerifyEmail",
        method: "POST",
        body: data,
      }),
    }),
    resendEmailVerification: builder.mutation({
      query: data => ({
        url: "/ResendVerificationCode",
        method: "POST",
        body: data,
      }),
    }),
    checkEmail: builder.query<{ exists: boolean; message: string }, string>({
      query: email => `/CheckEmail?email=${email}`,
    }),
    getUserStatus: builder.query<
      {
        RedirectTo: string
        Message: string
        isEmailVerified: boolean
        clubId: string | null
        isClubApproved: boolean
        stripeSubscriptionId: string
        isMemberActive: boolean
        userId: number
      },
      void
    >({
      query: () => "/UserStatus",
    }),
    createSubscription: builder.mutation<
      { url: string },
      { email: string; priceTableId: string }
    >({
      query: ({ email, priceTableId }) => ({
        url: "/create-subscription",
        method: "POST",
        body: { email, priceTableId },
      }),
    }),
    requestPasswordReset: builder.mutation<
      { message: string },
      { email: string }
    >({
      query: credentials => ({
        url: "/request-password-reset",
        method: "POST",
        body: credentials,
      }),
    }),

    resetPassword: builder.mutation<
      { message: string },
      { email: string; newPassword: string; token: string }
    >({
      query: credentials => ({
        url: "/reset-password",
        method: "POST",
        body: credentials,
      }),
    }),
  }),
})

export const {
  useRegisterMutation,
  useLoginMutation,
  useLazyCheckEmailQuery,
  useGetUserStatusQuery,
  useResendEmailVerificationMutation,
  useVerifyEmailMutation,
  useCreateSubscriptionMutation,
  useRequestPasswordResetMutation,
  useResetPasswordMutation,
  useLazyGetUserStatusQuery,
} = authApi
