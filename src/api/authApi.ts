// Need to use the React-specific entry point to import `createApi`
import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react"

export const authApi = createApi({
  baseQuery: fetchBaseQuery({
    baseUrl: "https://localhost:53166/api/Auth",
    prepareHeaders: headers => {
      const token = localStorage.getItem("token")
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
    login: builder.mutation({
      query: credentials => ({
        url: "/Login",
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
    getUserStatus: builder.query<{ RedirectTo: string; Message: string }, void>(
      {
        query: () => "/UserStatus",
      },
    ),
  }),
})

export const {
  useRegisterMutation,
  useLoginMutation,
  useLazyCheckEmailQuery,
  useGetUserStatusQuery,
  useResendEmailVerificationMutation,
  useVerifyEmailMutation,
} = authApi
