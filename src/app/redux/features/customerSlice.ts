import { createSlice } from "@reduxjs/toolkit";
import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";

export const customerApi = createApi({
  reducerPath: "customerApi",
  baseQuery: fetchBaseQuery({
    baseUrl: "/api",
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
        console.log("kjhgfghj", data);
        return {
          url: "/customerList",
          method: "GET",
          params: {
            businessId: data?.businessId,
          },
        };
      },
      providesTags: ["customer"],
      // forceRefetch() {
      //   return true;
      // },
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
      customerApi.endpoints.getCustomerList.matchFulfilled,
      (state, action) => {
        console.log(action.payload.data);
        state.customerList = action.payload.data;
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
  useGetCustomerListQuery,
  useCreateCustomerMutation,
  useUpdateCustomerMutation,
  useDeleteCustomerMutation,
} = customerApi;

export const { setTriggerGetCustomerApi } = customerSlice.actions;

export default customerSlice.reducer;
