import { createSlice } from "@reduxjs/toolkit";

const analysisSlice = createSlice({
    name: "analysis",
    initialState: {
        user1Chats: [],
        user2Chats: [],
        selectedMessage: null,
    },
    reducers: {
        setUser1Chats: (state, action) => {
            state.user1Chats = action.payload;
        },
        setUser2Chats: (state, action) => {
            state.user2Chats = action.payload;
        },
        setSelectedMessage: (state, action) => { // new action for selected message
            state.selectedMessage = action.payload;
        },
    }
});
export const { setUser1Chats, setUser2Chats, setSelectedMessage } = analysisSlice.actions;
export default analysisSlice.reducer;