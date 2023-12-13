import { createSlice } from "@reduxjs/toolkit";
import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";

export const businessApi = createApi({
  reducerPath: "businessApi",
  baseQuery: fetchBaseQuery({
    baseUrl: "/api",
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
      query: () => ({
        url: "/businessList",
        method: "GET",
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
  }),
});

const businessSlice = createSlice({
  name: "businessSlice",
  initialState: {
    businessList: [],
    triggerGetBusinessApi: false,
    triggerUpdateBusinessApi: false,
    businessIdSelected: "",
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
  },
  extraReducers: (builder) => {
    builder.addMatcher(
      businessApi.endpoints.getBusinessList.matchFulfilled,
      (state, action) => {
        console.log(action.payload.data);
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
  },
});

export const {
  useCreateBusinessMutation,
  useGetBusinessListQuery,
  useDeleteBusinessMutation,
  useUpdateBusinessMutation,
  useLazyGetBusinessListQuery,
} = businessApi;

export const {
  setTriggerGetBusinessApi,
  setTriggerUpdateBusinessApi,
  setBusinessIdSelected,
} = businessSlice.actions;

export default businessSlice.reducer;
