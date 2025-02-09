import { configureStore } from "@reduxjs/toolkit";
import authReducer from "./slices/authSlice"
import themeReducer from "./slices/themeSlice"
import chatReducer from "./slices/chatSlice"
import socketReducer from "./slices/socketSlice"

export const store = configureStore({
    reducer: {
        auth: authReducer,
        theme: themeReducer,
        chat: chatReducer,
        socket: socketReducer
    },
})

