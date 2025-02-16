import { createSlice } from "@reduxjs/toolkit"

interface ClubState {
  clubDetails: null | any
}
const initialState: ClubState = {
  clubDetails: null,
}

export const clubSlice = createSlice({
  name: "club",
  initialState,
  reducers: create => ({
    setClubDetails: create.reducer((state, action) => {
      state.clubDetails = action.payload
    }),
  }),
})
