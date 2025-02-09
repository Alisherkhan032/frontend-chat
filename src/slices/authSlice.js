import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  authUser: null,
  onlineUsers: [],
};

const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    setAuthUser: (state, action) => {
      state.authUser = action.payload;
    },
    setOnlineUsers: (state, action) => {
      state.onlineUsers = action.payload;
    },
  },
});

export const selectAuthUser = (state) => state.auth.authUser;
export const selectOnlineUsers = (state) => state.auth.onlineUsers;

export const { setAuthUser, setOnlineUsers } = authSlice.actions;
export default authSlice.reducer;
