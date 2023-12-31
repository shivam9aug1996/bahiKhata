import { getFp } from "@/app/utils/function";
import { createSlice } from "@reduxjs/toolkit";
import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";

export const qrApi = createApi({
  reducerPath: "qrApi",
  baseQuery: fetchBaseQuery({
    baseUrl: "/api",
    prepareHeaders: async (headers) => {
      headers.set("user-fingerprint", await getFp());
    },
  }),
  keepUnusedDataFor: 0,
  endpoints: (builder) => ({
    getQRcode: builder.mutation({
      query: () => ({
        url: "/auth/getQR",
        method: "POST",
        body: {},
      }),
      // forceRefetch: () => true,
    }),
    scanQRcode: builder.mutation({
      query: (data) => ({
        url: "/qrScanner",
        method: "POST",
        body: data,
      }),
    }),
  }),
});

const qrSlice = createSlice({
  name: "qrSlice",
  initialState: {},
  reducers: {},
  extraReducers: (builder) => {},
});

export const { useGetQRcodeMutation, useScanQRcodeMutation } = qrApi;

export const {} = qrSlice.actions;

export default qrSlice.reducer;
