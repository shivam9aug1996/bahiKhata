"use client";

import React, { useLayoutEffect } from "react";
import { Toaster } from "react-hot-toast";
import { Provider } from "react-redux";
import getCookies from "../actions";
import { setAuth } from "../redux/features/authSlice";

import store from "../redux/store";

const Providers = ({ children, getCookies }: any) => {
  useLayoutEffect(() => {
    getCookie();
  }, []);
  const getCookie = async () => {
    let data = await getCookies();
    store.dispatch(setAuth(data));
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
