"use client";

import Script from "next/script";
import React, { useLayoutEffect, useState } from "react";
import { Toaster } from "react-hot-toast";
import { Provider } from "react-redux";

import { setAuth } from "../redux/features/authSlice";
import { setBusinessIdSelected } from "../redux/features/businessSlice";

import store from "../redux/store";
import { getFp } from "../utils/function";
import { NextUIProvider } from "@nextui-org/react";
import dynamic from "next/dynamic";

// const PusherChannel = dynamic(() => import("../components/PusherChannel"), {
//   ssr: false,
// });

const Providers = ({ children, getCookies, getBusinessIdSelected }: any) => {
  const [fpHash, setFpHash] = useState("");

  useLayoutEffect(() => {
    getCookie();
    getFp();
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
      <NextUIProvider>
        {/* <PusherChannel /> */}
        <div>
          <Toaster />
        </div>
        <div className="flex flex-col">{children}</div>
      </NextUIProvider>
    </Provider>
  );
};

export default Providers;
