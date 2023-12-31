import { getFp } from "@/app/utils/function";
import { createSlice } from "@reduxjs/toolkit";
import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";

export const dashboardApi = createApi({
  reducerPath: "dashboardApi",
  baseQuery: fetchBaseQuery({
    baseUrl: "/api",
    prepareHeaders: async (headers) => {
      headers.set("user-fingerprint", await getFp());
    },
  }),
  tagTypes: ["dashboard"],
  endpoints: (builder) => ({
    getDashboard: builder.query({
      query: (data) => ({
        url: "/businessList/dashboard",
        method: "GET",
        params: {
          businessId: data?.businessId,
        },
      }),
      providesTags: ["dashboard"],
    }),
  }),
});

const dashboardSlice = createSlice({
  name: "dashboardSlice",
  initialState: {},
  reducers: {},
  extraReducers: (builder) => {},
});

export const { useGetDashboardQuery } = dashboardApi;

export const {} = dashboardSlice.actions;

export default dashboardSlice.reducer;
