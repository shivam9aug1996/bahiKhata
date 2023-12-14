"use client";

import React from "react";
import { Toaster } from "react-hot-toast";
import { Provider } from "react-redux";

import store from "../redux/store";

const Providers = ({ children }: any) => {
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
