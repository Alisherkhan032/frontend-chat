import { createSlice } from "@reduxjs/toolkit";

const initialState = {
    socket : null
}

const socketSlice = createSlice({
    name: "socket",
    initialState,
    reducers: {
        setSocket: (state, action) => {
            state.socket = action.payload;
        }
    }
})

export const selectSocket = (state) => state.socket.socket;
export const { setSocket } = socketSlice.actions;
export default socketSlice.reducer;