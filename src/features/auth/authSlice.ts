import { createSlice } from "@reduxjs/toolkit"
import { jwtDecode } from "jwt-decode"
import { getRoleFromToken } from "../../utils/authUtils"

interface User {
  isEmailVerified: boolean
  clubId: string | null
  isClubApproved: boolean
  stripeSubscriptionId: string
  isMemberActive: boolean
  userId: number
}

interface AuthState {
  user: User | null
  token: string | null
  isAuthenticated: boolean
  userRole: string | null
  isLoading: boolean
}

const initialState: AuthState = {
  user: null,
  token: localStorage.getItem("token"),
  isAuthenticated: !!localStorage.getItem("token"),
  userRole: localStorage.getItem("token")
    ? getRoleFromToken(localStorage.getItem("token")!)
    : null,
  isLoading: true,
}

export const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: create => ({
    setCredentials: (state, action) => {
      const { token, user } = action.payload

      // Only decode if token is a valid non-empty string
      if (token && typeof token === "string") {
        try {
          const tokenDecode = jwtDecode(token)
          state.token = token
          state.isAuthenticated = true
          localStorage.setItem("token", token)
          state.userRole = getRoleFromToken(token)
        } catch (error) {
          console.error("Invalid token during decoding:", error)
          state.token = null
          state.isAuthenticated = false
          state.userRole = null
          localStorage.removeItem("token")
        }
      }

      // Always set user, even if token is null
      state.user = user?.user ?? user
      state.isLoading = false
    },
    logout: state => {
      state.user = null
      state.token = null
      state.isAuthenticated = false
      localStorage.removeItem("token")
      state.isLoading = false
    },
    setLoading: (state, action) => {
      state.isLoading = action.payload
    },
  }),
  selectors: {
    selectUser: auth => auth.user,
    selectToken: auth => auth.token,
    selectAuthStatus: auth => auth.isAuthenticated,
  },
})

export const { setCredentials, logout, setLoading } = authSlice.actions
export const { selectAuthStatus, selectToken, selectUser } = authSlice.selectors
