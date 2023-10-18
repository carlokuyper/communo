import { createSlice } from "@reduxjs/toolkit";

const authSlice = createSlice({
    name: "auth",
    initialState: {
        token: null,
        userData: null,
        didTryAutoLogin: false,
        firstLaunch: false,
    },
    reducers: {
        authenticate: (state, action) => {
            const { payload } = action;
            state.token = payload.token;
            state.userData = payload.userData;
            state.didTryAutoLogin = true;
        },
        setDidTryAutoLogin: (state, action) => {
            state.didTryAutoLogin = true;
        },
        setFirstLaunch: (state, action) => {
            state.firstLaunch= true;
        },
        logout: (state, action) => {
            state.token = null;
            state.userData = null;
            state.didTryAutoLogin = false;
        },
        reset: (state, action) => {
            state.token = null;
            state.userData = null;
            state.didTryAutoLogin = false;
            state.firstLaunch= false;
        },
        updateLoggedInUserData: (state, action) => {
            state.userData = { ...state.userData, ...action.payload.newData }
        }
    }
});
export const setDidTryAutoLogin = authSlice.actions.setDidTryAutoLogin;
export const setFirstLaunch = authSlice.actions.setFirstLaunch;
export const authenticate = authSlice.actions.authenticate;
export const updateLoggedInUserData = authSlice.actions.updateLoggedInUserData;
export const logout = authSlice.actions.logout;
export const reset = authSlice.actions.reset;
export default authSlice.reducer;