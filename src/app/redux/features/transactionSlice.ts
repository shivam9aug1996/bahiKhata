import { getFp } from "@/app/utils/function";
import { createSlice } from "@reduxjs/toolkit";
import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";

export const transactionApi = createApi({
  reducerPath: "transactionApi",
  baseQuery: fetchBaseQuery({
    baseUrl: "/api",
    prepareHeaders: async (headers) => {
      headers.set("user-fingerprint", await getFp());
    },
  }),
  tagTypes: ["transaction", "transactionpublic"],
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
        let params = {
          businessId: data?.businessId,
          partyId: data?.partyId,
          page: data?.page,
        };
        if (data?.type) {
          params.type = data.type;
        }
        if (data?.startDate && !data?.endDate) {
          params.startDate = data.startDate;
        }
        if (!data?.startDate && data?.endDate) {
          params.endDate = data.endDate;
        }
        if (data?.startDate && data?.endDate) {
          params.startDate = data.startDate;
          params.endDate = data.endDate;
        }
        if (data?.limit) {
          params.limit = data?.limit || 10;
        }
        return {
          url: "/transactionList",
          method: "GET",
          params: params,
        };
      },
      providesTags: ["transaction"],
    }),
    getPublicTransactionList: builder.query({
      query: (data) => {
        let params = {
          businessId: data?.businessId,
          partyId: data?.partyId,
          page: data?.page,
          partyType: data?.partyType,
        };
        if (data?.type) {
          params.type = data.type;
        }
        if (data?.startDate && !data?.endDate) {
          params.startDate = data.startDate;
        }
        if (!data?.startDate && data?.endDate) {
          params.endDate = data.endDate;
        }
        if (data?.startDate && data?.endDate) {
          params.startDate = data.startDate;
          params.endDate = data.endDate;
        }
        if (data?.limit) {
          params.limit = data?.limit || 10;
        }
        return {
          url: "/transactionList/public",
          method: "GET",
          params: params,
        };
      },
      providesTags: ["transactionpublic"],
    }),
    deleteTransaction: builder.mutation({
      query: (data) => ({
        url: "/transactionList",
        method: "DELETE",
        body: data,
      }),
      invalidatesTags: ["transaction"],
    }),
    getAllTransaction: builder.query({
      query: (data) => {
        let params = {
          businessId: data?.businessId,
          partyId: data?.partyId,
          page: data?.page,
        };
        if (data?.type) {
          params.type = data.type;
        }
        if (data?.startDate && !data?.endDate) {
          params.startDate = data.startDate;
        }
        if (!data?.startDate && data?.endDate) {
          params.endDate = data.endDate;
        }
        if (data?.startDate && data?.endDate) {
          params.startDate = data.startDate;
          params.endDate = data.endDate;
        }
        if (data?.limit) {
          params.limit = data?.limit || 10;
        }
        return {
          url: "/transactionList/downloadPdf",
          method: "GET",
          params: params,
        };
      },
    }),
    getAllPublicTransaction: builder.query({
      keepUnusedDataFor: 0,
      query: (data) => {
        let params = {
          businessId: data?.businessId,
          partyId: data?.partyId,
          page: data?.page,
        };
        if (data?.type) {
          params.type = data.type;
        }
        if (data?.startDate && !data?.endDate) {
          params.startDate = data.startDate;
        }
        if (!data?.startDate && data?.endDate) {
          params.endDate = data.endDate;
        }
        if (data?.startDate && data?.endDate) {
          params.startDate = data.startDate;
          params.endDate = data.endDate;
        }
        if (data?.limit) {
          params.limit = data?.limit || 10;
        }
        return {
          url: "/transactionList/public/downloadPdf",
          method: "GET",
          params: params,
        };
      },
    }),
  }),
});

const transactionSlice = createSlice({
  name: "transactionSlice",
  initialState: {
    transactionList: [],
    triggerGetTransactionApi: false,
  },
  reducers: {
    setTriggerGetTransactionApi: (state, action) => {
      state.triggerGetTransactionApi = action.payload;
    },
  },
  extraReducers: (builder) => {},
});

export const {
  useGetTransactionListQuery,
  useCreateTransactionMutation,
  useDeleteTransactionMutation,
  useUpdateTransactionMutation,
  useLazyGetAllTransactionQuery,
  useGetPublicTransactionListQuery,
  useLazyGetAllPublicTransactionQuery,
} = transactionApi;

export const { setTriggerGetTransactionApi } = transactionSlice.actions;

export default transactionSlice.reducer;
