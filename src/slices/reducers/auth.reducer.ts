import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { initialState } from "src/store/initialState";
import { apiSlice } from "../apis/app.api";
import { ISigninRes } from "../apis/types";

const authSlice = createSlice({
  name: "auth",
  initialState: initialState.user,

  reducers: {
    logoutUser: (state) => {
      state.email = "";
      state.fullName = "";
      state.role = "";
      state.token = "";
    },
  },

  extraReducers: (builder) => {
    builder.addMatcher(
      apiSlice.endpoints.signin.matchFulfilled,
      (state, action: PayloadAction<ISigninRes>) => {
        state.email = action.payload.resultData.user.email;
        state.fullName = action.payload.resultData.user.fullName;
        state.role = action.payload.resultData.user.role;
        state.token = action.payload.resultData.token;
      },
    );
  },
});

export const { logoutUser } = authSlice.actions;

export const authReducer = authSlice.reducer;
