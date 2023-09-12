import { createSlice } from "@reduxjs/toolkit";

const analysisSlice = createSlice({
    name: "analysis",
    initialState: {
        user1Chats: [],
        user2Chats: []
    },
    reducers: {
        setUser1Chats: (state, action) => {
            state.user1Chats = action.payload;
        },
        setUser2Chats: (state, action) => {
            state.user2Chats = action.payload;
        },
    }
});
export const { setUser1Chats, setUser2Chats } = analysisSlice.actions;
export default analysisSlice.reducer;