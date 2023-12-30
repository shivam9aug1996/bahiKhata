"use client";

import React, { useLayoutEffect } from "react";
import { Toaster } from "react-hot-toast";
import { Provider } from "react-redux";

import { setAuth } from "../redux/features/authSlice";
import { setBusinessIdSelected } from "../redux/features/businessSlice";

import store from "../redux/store";

const Providers = ({ children, getCookies, getBusinessIdSelected }: any) => {
  useLayoutEffect(() => {
    getCookie();
  }, []);
  const getCookie = async () => {
    let data = await getCookies();
    store.dispatch(setAuth(data));
    let businessIdSelected = data?.businessIdSelected;
    if (businessIdSelected)
      store.dispatch(setBusinessIdSelected(businessIdSelected));
  };
  return (
    <Provider store={store}>
      <div>
        <Toaster />
      </div>

      <div className="flex flex-col">{children}</div>
    </Provider>
  );
};

export default Providers;
