import { getFp } from "@/app/utils/function";
import { createSlice } from "@reduxjs/toolkit";
import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";

export const supplierApi = createApi({
  reducerPath: "supplierApi",
  baseQuery: fetchBaseQuery({
    baseUrl: "/api",
    prepareHeaders: async (headers) => {
      headers.set("user-fingerprint", await getFp());
    },
  }),
  tagTypes: ["supplier"],
  endpoints: (builder) => ({
    createSupplier: builder.mutation({
      query: (data) => ({
        url: "/supplierList",
        method: "POST",
        body: data,
      }),
      invalidatesTags: ["supplier"],
    }),
    updateSupplier: builder.mutation({
      query: (data) => ({
        url: "/supplierList",
        method: "PUT",
        body: data,
      }),
      invalidatesTags: ["supplier"],
    }),
    getSupplierList: builder.query({
      query: (data) => {
        return {
          url: "/supplierList",
          method: "GET",
          params: {
            businessId: data?.businessId,
            searchQuery: data?.searchQuery,
            page: data?.page,
          },
        };
      },
      providesTags: ["supplier"],
      // forceRefetch() {
      //   return true;
      // },
    }),
    deleteSupplier: builder.mutation({
      query: (data) => ({
        url: "/supplierList",
        method: "DELETE",
        body: data,
      }),
      invalidatesTags: ["supplier"],
    }),
  }),
});

const supplierSlice = createSlice({
  name: "supplierSlice",
  initialState: {
    supplierList: [],
    triggerGetSupplierApi: false,
    // triggerUpdateBusinessApi: false,
  },
  reducers: {
    setTriggerGetSupplierApi: (state, action) => {
      state.triggerGetSupplierApi = action.payload;
    },
    // setTriggerUpdateBusinessApi: (state, action) => {
    //   state.triggerUpdateBusinessApi = action.payload;
    // },
  },
  extraReducers: (builder) => {
    builder.addMatcher(
      supplierApi.endpoints.getSupplierList.matchFulfilled,
      (state, action) => {
        state.supplierList = action.payload.data;
        // state.triggerGetCustomerApi = true;
      }
    );
  },
});

export const {
  useGetSupplierListQuery,
  useDeleteSupplierMutation,
  useCreateSupplierMutation,
  useUpdateSupplierMutation,
} = supplierApi;

export const { setTriggerGetSupplierApi } = supplierSlice.actions;

export default supplierSlice.reducer;
