import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  messages: [],
  users: [],
  selectedUser: null, // the one who is selected to chat with
};

export const chatSlice = createSlice({
  name: "chat",
  initialState,
  reducers: {
    setMessages: (state, action) => {
      state.messages = action.payload;
    },
    addMessage: (state, action) => {
      state.messages.push(action.payload);
    },
    setSelectedUser: (state, action) => {
      state.selectedUser = action.payload;
    },
    setUsers: (state, action) => {
      state.users = action.payload;
    },
  },
});

export const selectMessages = (state) => state.chat.messages;
export const selectUsers = (state) => state.chat.users;
export const selectSelectedUser = (state) => state.chat.selectedUser;

export const { setMessages, setSelectedUser, setUsers, addMessage } = chatSlice.actions;
export default chatSlice.reducer;
