import { createSlice } from "@reduxjs/toolkit";
import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";
import Cookies from "js-cookie";

export const authApi = createApi({
  reducerPath: "authApi",
  baseQuery: fetchBaseQuery({
    baseUrl: "/api/auth",
  }),
  endpoints: (builder) => ({
    login: builder.mutation({
      query: (data) => ({
        url: "/login",
        method: "POST",
        body: data,
      }),
    }),
    signup: builder.mutation({
      query: (data) => ({
        url: "/signup",
        method: "POST",
        body: data,
      }),
    }),
    logout: builder.mutation({
      query: () => ({
        url: "/logout",
        method: "POST",
      }),
    }),
    // verifyNumber: builder.mutation({
    //   query: (data) => ({
    //     url: "/verifyNumber",
    //     method: "POST",
    //     body: data,
    //   }),
    // }),
  }),
});

const authSlice = createSlice({
  name: "authSlice",
  initialState: {
    token: null,
    userData: null,
  },
  reducers: {
    setAuth: (state, action) => {
      // console.log("kuytrerfghjk", action);
      // if (action?.payload?.token) {
      //   //state.token = action.payload.token;
      // } else {
      //   state.token = null;
      // }
      if (action?.payload?.userData) {
        state.userData = JSON.parse(action?.payload?.userData);
      } else {
        state.userData = null;
      }
    },
  },
  extraReducers: (builder) => {
    builder.addMatcher(
      authApi.endpoints.login.matchFulfilled,
      (state, action) => {
        console.log("kjhgffgh", action?.payload, action.payload?.token);
        state.token = action.payload?.token || null;
        state.userData = action.payload?.userData || null;
      }
    );

    builder.addMatcher(
      authApi.endpoints.signup.matchFulfilled,
      (state, action) => {
        state.token = action.payload?.token || null;
        state.userData = action.payload?.userData || null;
      }
    );
    builder.addMatcher(authApi.endpoints.logout.matchFulfilled, (state) => {
      state.token = null;
      state.userData = null;
      Cookies.remove("bahi_khata_user_token");
      Cookies.remove("bahi_khata_user_data");
    });
    // builder.addMatcher(
    //   authApi.endpoints.verifyNumber.matchFulfilled,
    //   (state, action) => {
    //     console.log("kjhgffgh", action?.payload, action.payload?.token);
    //     // state.token = action.payload?.token || "";
    //   }
    // );
  },
});

export const {
  useLoginMutation,
  useLogoutMutation,
  useSignupMutation,
  //useVerifyNumberMutation,
} = authApi;

export const { setAuth } = authSlice.actions;

export default authSlice.reducer;
