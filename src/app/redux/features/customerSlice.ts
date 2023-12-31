import { getFp } from "@/app/utils/function";
import { createSlice } from "@reduxjs/toolkit";
import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";

export const customerApi = createApi({
  reducerPath: "customerApi",
  baseQuery: fetchBaseQuery({
    baseUrl: "/api",
    prepareHeaders: async (headers) => {
      headers.set("user-fingerprint", await getFp());
    },
  }),

  tagTypes: ["customer"],
  endpoints: (builder) => ({
    createCustomer: builder.mutation({
      query: (data) => ({
        url: "/customerList",
        method: "POST",
        body: data,
      }),
      invalidatesTags: ["customer"],
    }),
    updateCustomer: builder.mutation({
      query: (data) => ({
        url: "/customerList",
        method: "PUT",
        body: data,
      }),
      invalidatesTags: ["customer"],
    }),
    getCustomerList: builder.query({
      query: (data) => {
        return {
          url: "/customerList",
          method: "GET",
          params: {
            businessId: data?.businessId,
            searchQuery: data?.searchQuery,
            page: data?.page,
          },
        };
      },
      providesTags: ["customer"],
    }),
    deleteCustomer: builder.mutation({
      query: (data) => ({
        url: "/customerList",
        method: "DELETE",
        body: data,
      }),
      invalidatesTags: ["customer"],
    }),
  }),
});

const customerSlice = createSlice({
  name: "customerSlice",
  initialState: {
    customerList: [],
    triggerGetCustomerApi: false,
    // triggerUpdateBusinessApi: false,
  },
  reducers: {
    setTriggerGetCustomerApi: (state, action) => {
      state.triggerGetCustomerApi = action.payload;
    },
    // setTriggerUpdateBusinessApi: (state, action) => {
    //   state.triggerUpdateBusinessApi = action.payload;
    // },
  },
  extraReducers: (builder) => {
    builder.addMatcher(
      customerApi.endpoints.getCustomerList.matchFulfilled,
      (state, action) => {
        // If it's the first page, replace the data; otherwise, append it

        if (action?.meta?.arg?.originalArgs?.page === 1) {
          state.customerList = action.payload.data; // Replace data for page 1
        } else {
          state.customerList = [...state.customerList, ...action.payload.data]; // Append new data
        }
      }
    );
  },
});

export const {
  useGetCustomerListQuery,
  useCreateCustomerMutation,
  useUpdateCustomerMutation,
  useDeleteCustomerMutation,
} = customerApi;

export const { setTriggerGetCustomerApi } = customerSlice.actions;

export default customerSlice.reducer;
