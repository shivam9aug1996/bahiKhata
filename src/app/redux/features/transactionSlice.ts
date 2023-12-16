import { createSlice } from "@reduxjs/toolkit";
import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";

export const transactionApi = createApi({
  reducerPath: "transactionApi",
  baseQuery: fetchBaseQuery({
    baseUrl: "/api",
  }),
  tagTypes: ["transaction"],
  //refetchOnMountOrArgChange: true,
  endpoints: (builder) => ({
    createTransaction: builder.mutation({
      query: (data) => ({
        url: "/transactionList",
        method: "POST",
        body: data,
      }),
      invalidatesTags: ["transaction"],
    }),
    updateTransaction: builder.mutation({
      query: (data) => ({
        url: "/transactionList",
        method: "PUT",
        body: data,
      }),
      invalidatesTags: ["transaction"],
    }),
    getTransactionList: builder.query({
      query: (data) => {
        console.log("kjhgfghj", data);
        return {
          url: "/transactionList",
          method: "GET",
          params: {
            businessId: data?.businessId,
            partyId: data?.partyId,
            page: data?.page,
          },
        };
      },
      providesTags: ["transaction"],
      // forceRefetch() {
      //   return true;
      // },
    }),
    deleteTransaction: builder.mutation({
      query: (data) => ({
        url: "/transactionList",
        method: "DELETE",
        body: data,
      }),
      invalidatesTags: ["transaction"],
    }),
  }),
});

const transactionSlice = createSlice({
  name: "transactionSlice",
  initialState: {
    transactionList: [],
    triggerGetTransactionApi: false,
    // triggerUpdateBusinessApi: false,
  },
  reducers: {
    setTriggerGetTransactionApi: (state, action) => {
      state.triggerGetTransactionApi = action.payload;
    },
    // setTriggerUpdateBusinessApi: (state, action) => {
    //   state.triggerUpdateBusinessApi = action.payload;
    // },
  },
  extraReducers: (builder) => {
    // builder.addMatcher(
    //   businessApi.endpoints.createBusiness.matchFulfilled,
    //   (state, action) => {
    //     console.log(action.payload.data);
    //     const newBusiness = action.payload.data;
    //     // If the newly created business has primaryKey set to true
    //     //if (newBusiness.primaryKey) {
    //     // Set primaryKey to false for all other businesses in the list
    //     let g = state.businessList.map((business) => {
    //       if (business?._id !== newBusiness._id) {
    //         return { ...business, primaryKey: false };
    //       }
    //     });
    //     g.push(newBusiness);
    //     // }
    //     // Push the new business to the businessList
    //     state.businessList = g;
    //     // state.businessList.push(action.payload.data);
    //   }
    // );
    // builder.addMatcher(
    //   transactionApi.endpoints.getTransactionList.matchFulfilled,
    //   (state, action) => {
    //     console.log(action.payload.data);
    //     state.transactionList = action.payload.data;
    //     // state.triggerGetCustomerApi = true;
    //   }
    // );
    // builder.addMatcher(
    //   businessApi.endpoints.deleteBusiness.matchFulfilled,
    //   (state, action) => {
    //     console.log(action.payload.data?._id);
    //     let businessToDelete = state.businessList.filter((item) => {
    //       return item?._id === action?.payload?.data?._id;
    //     });
    //     let modifiedData = state.businessList.filter((item) => {
    //       return item?._id !== action?.payload?.data?._id;
    //     });
    //     console.log(businessToDelete[0]);
    //     if (businessToDelete[0]?.primaryKey && modifiedData?.length > 0) {
    //       modifiedData[0].primaryKey = true;
    //     }
    //     console.log("hiiiiiii", modifiedData);
    //     state.businessList = modifiedData;
    //   }
    // );
    // builder.addMatcher(
    //   customerApi.endpoints.updateBusiness.matchFulfilled,
    //   (state, action) => {
    //     state.triggerUpdateBusinessApi = true;
    //   }
    // );
  },
});

export const {
  useGetTransactionListQuery,
  useCreateTransactionMutation,
  useDeleteTransactionMutation,
  useUpdateTransactionMutation,
} = transactionApi;

export const { setTriggerGetTransactionApi } = transactionSlice.actions;

export default transactionSlice.reducer;
