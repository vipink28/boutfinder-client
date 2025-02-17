import { createSlice } from "@reduxjs/toolkit"

interface User {
  isEmailVerified: boolean
  clubId: string | null
  isClubApproved: boolean
  stripeSubscriptionId: string
  isMemberActive: boolean
}

interface AuthState {
  user: User | null
  token: string | null
  isAuthenticated: boolean
}

const initialState: AuthState = {
  user: null,
  token: localStorage.getItem("token"),
  isAuthenticated: !!localStorage.getItem("token"),
}

export const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: create => ({
    setCredentials: (state, action) => {
      const { token, user } = action.payload
      state.user = user?.user ?? user
      state.token = token
      state.isAuthenticated = true
      localStorage.setItem("token", token)
    },
    logout: state => {
      state.user = null
      state.token = null
      state.isAuthenticated = false
      localStorage.removeItem("token")
    },
  }),
  selectors: {
    selectUser: auth => auth.user,
    selectToken: auth => auth.token,
    selectAuthStatus: auth => auth.isAuthenticated,
  },
})

export const { setCredentials, logout } = authSlice.actions
export const { selectAuthStatus, selectToken, selectUser } = authSlice.selectors
