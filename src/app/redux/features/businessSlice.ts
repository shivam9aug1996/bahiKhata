import { getFp } from "@/app/utils/function";
import { createSlice } from "@reduxjs/toolkit";
import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";

export const businessApi = createApi({
  reducerPath: "businessApi",
  baseQuery: fetchBaseQuery({
    baseUrl: "/api",
    prepareHeaders: async (headers) => {
      headers.set("user-fingerprint", await getFp());
    },
  }),
  tagTypes: ["business"],
  endpoints: (builder) => ({
    createBusiness: builder.mutation({
      query: (data) => ({
        url: "/businessList",
        method: "POST",
        body: data,
      }),
      invalidatesTags: ["business"],
    }),
    updateBusiness: builder.mutation({
      query: (data) => ({
        url: "/businessList",
        method: "PUT",
        body: data,
      }),
      invalidatesTags: ["business"],
    }),
    getBusinessList: builder.query({
      query: (data) => ({
        url: "/businessList",
        method: "GET",
        params: {
          userId: data?.userId,
        },
      }),
      providesTags: ["business"],
    }),
    deleteBusiness: builder.mutation({
      query: (data) => ({
        url: "/businessList",
        method: "DELETE",
        body: data,
      }),
      invalidatesTags: ["business"],
    }),
    syncBusiness: builder.mutation({
      query: (data) => {
        return {
          url: "/sync",
          method: "POST",
          body: {
            businessId: data?.businessId,
          },
        };
      },
    }),
  }),
});

const businessSlice = createSlice({
  name: "businessSlice",
  initialState: {
    businessList: [],
    triggerGetBusinessApi: false,
    triggerUpdateBusinessApi: false,
    businessIdSelected: "",
    customerSelected: "",
  },
  reducers: {
    setTriggerGetBusinessApi: (state, action) => {
      state.triggerGetBusinessApi = action.payload;
    },
    setTriggerUpdateBusinessApi: (state, action) => {
      state.triggerUpdateBusinessApi = action.payload;
    },
    setBusinessIdSelected: (state, action) => {
      state.businessIdSelected = action.payload;
    },
    setSelectedCustomer: (state, action) => {
      state.customerSelected = action.payload;
      localStorage.setItem(
        "customerSelected",
        JSON.stringify(state.customerSelected)
      );
    },
    getSelectedCustomer: (state) => {
      let data = localStorage.getItem("customerSelected");
      if (
        data !== undefined &&
        data !== "undefined" &&
        data !== "null" &&
        data !== null
      ) {
        data = JSON.parse(data);
        state.customerSelected = data;
      } else {
        state.customerSelected = "";
      }
    },
  },
  extraReducers: (builder) => {
    builder.addMatcher(
      businessApi.endpoints.getBusinessList.matchFulfilled,
      (state, action) => {
        state.businessList = action.payload.data;
        state.triggerGetBusinessApi = true;
      }
    );

    builder.addMatcher(
      businessApi.endpoints.updateBusiness.matchFulfilled,
      (state, action) => {
        state.triggerUpdateBusinessApi = true;
      }
    );
    builder.addMatcher(
      businessApi.endpoints.deleteBusiness.matchFulfilled,
      (state, action) => {
        //state.businessIdSelected = "";
      }
    );
  },
});

export const {
  useCreateBusinessMutation,
  useGetBusinessListQuery,
  useDeleteBusinessMutation,
  useUpdateBusinessMutation,
  useSyncBusinessMutation,
} = businessApi;

export const {
  setTriggerGetBusinessApi,
  setTriggerUpdateBusinessApi,
  setBusinessIdSelected,
  setSelectedCustomer,
  getSelectedCustomer,
} = businessSlice.actions;

export default businessSlice.reducer;
