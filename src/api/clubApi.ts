import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react"

export const clubApi = createApi({
  reducerPath: "clubApi",
  baseQuery: fetchBaseQuery({ baseUrl: "/api/club" }),
  endpoints: build => ({
    registerClub: build.mutation({
      query: clubDetails => ({
        url: "/register",
        method: "POST",
        body: clubDetails,
      }),
    }),
    updateClub: build.mutation({
      query: clubDetails => ({
        url: "/update",
        method: "PUT",
        body: clubDetails,
      }),
    }),
    getMembershipStatus: build.query({
      query: () => "/membership-status",
    }),
  }),
})

export const {
  useRegisterClubMutation,
  useUpdateClubMutation,
  useGetMembershipStatusQuery,
} = clubApi
