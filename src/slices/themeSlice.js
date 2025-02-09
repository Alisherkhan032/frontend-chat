import { createSlice } from "@reduxjs/toolkit";

const initialState = {
    theme: localStorage.getItem("chat-theme") || "dark",
};

const themeSlice = createSlice({
    name: "theme",
    initialState,
    reducers: {
        setTheme: (state, action) => {
            localStorage.setItem("chat-theme", action.payload);
            state.theme = action.payload;
        },
    },
})

export const selectTheme = (state) => state.theme.theme;

export const { setTheme } = themeSlice.actions;
export default themeSlice.reducer;