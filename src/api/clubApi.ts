import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react"

export const clubApi = createApi({
  reducerPath: "clubApi",
  baseQuery: fetchBaseQuery({
    baseUrl: "https://localhost:53166/api/Club",
    prepareHeaders: (headers, { getState }) => {
      const token = (getState() as any).auth.token
      if (token) headers.set("Authorization", `Bearer ${token}`)
      return headers
    },
  }),
  endpoints: build => ({
    createClub: build.mutation({
      query: clubData => ({
        url: "/create",
        method: "POST",
        body: clubData,
      }),
    }),
  }),
})

export const { useCreateClubMutation } = clubApi
