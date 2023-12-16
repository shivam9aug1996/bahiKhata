import { createSlice } from "@reduxjs/toolkit";
import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";

export const supplierApi = createApi({
  reducerPath: "supplierApi",
  baseQuery: fetchBaseQuery({
    baseUrl: "/api",
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
        console.log("kjhgfghj", data);
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
    builder.addMatcher(
      supplierApi.endpoints.getSupplierList.matchFulfilled,
      (state, action) => {
        console.log(action.payload.data);
        state.supplierList = action.payload.data;
        // state.triggerGetCustomerApi = true;
      }
    );
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
  useGetSupplierListQuery,
  useDeleteSupplierMutation,
  useCreateSupplierMutation,
  useUpdateSupplierMutation,
} = supplierApi;

export const { setTriggerGetSupplierApi } = supplierSlice.actions;

export default supplierSlice.reducer;
