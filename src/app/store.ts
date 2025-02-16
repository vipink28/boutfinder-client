import {
  Action,
  combineSlices,
  configureStore,
  ThunkAction,
} from "@reduxjs/toolkit"
import { setupListeners } from "@reduxjs/toolkit/query"
import { authApi } from "../api/authApi"
import { clubApi } from "../api/clubApi"
import { authSlice } from "../features/auth/authSlice"

const rootReducer = combineSlices({
  auth: authSlice.reducer,
  [authApi.reducerPath]: authApi.reducer, // Add authApi reducer
  [clubApi.reducerPath]: clubApi.reducer, // Add clubApi reducer
})
// Infer the `RootState` type from the root reducer
export type RootState = ReturnType<typeof rootReducer>

export const makeStore = (preloadedState?: Partial<RootState>) => {
  const store = configureStore({
    reducer: rootReducer,
    // Adding the api middleware enables caching, invalidation, polling,
    // and other useful features of `rtk-query`.
    middleware: getDefaultMiddleware =>
      getDefaultMiddleware().concat(authApi.middleware, clubApi.middleware),
    preloadedState,
  })
  // configure listeners using the provided defaults
  // optional, but required for `refetchOnFocus`/`refetchOnReconnect` behaviors
  setupListeners(store.dispatch)
  return store
}

export const store = makeStore()

// Infer the type of `store`
export type AppStore = typeof store
// Infer the `AppDispatch` type from the store itself
export type AppDispatch = AppStore["dispatch"]
export type AppThunk<ThunkReturnType = void> = ThunkAction<
  ThunkReturnType,
  RootState,
  unknown,
  Action
>
