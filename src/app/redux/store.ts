import { configureStore } from "@reduxjs/toolkit";
import { setupListeners } from "@reduxjs/toolkit/query";
import businessSlice, { businessApi } from "./features/businessSlice";
import customerSlice, { customerApi } from "./features/customerSlice";
import dashboardSlice, { dashboardApi } from "./features/dashboardSlice";
import supplierSlice, { supplierApi } from "./features/supplierSlice";
import transactionSlice, { transactionApi } from "./features/transactionSlice";

const store = configureStore({
  reducer: {
    business: businessSlice,
    [businessApi.reducerPath]: businessApi.reducer,
    customer: customerSlice,
    [customerApi.reducerPath]: customerApi.reducer,
    supplier: supplierSlice,
    [supplierApi.reducerPath]: supplierApi.reducer,
    transaction: transactionSlice,
    [transactionApi.reducerPath]: transactionApi.reducer,
    dashboard: dashboardSlice,
    [dashboardApi.reducerPath]: dashboardApi.reducer,
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware()
      .concat(businessApi.middleware)
      .concat(customerApi.middleware)
      .concat(supplierApi.middleware)
      .concat(transactionApi.middleware)
      .concat(dashboardApi.middleware),
});

export default store;
setupListeners(store.dispatch);
