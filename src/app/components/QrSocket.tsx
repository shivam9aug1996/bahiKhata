"use client";
import React, { useEffect } from "react";
import Pusher from "pusher-js/with-encryption";
import { useLazyGetQRcodeQuery } from "../redux/features/qrSlice";
import Image from "next/image";

const pusher = new Pusher("a7a14b0a75a3d073c905", {
  cluster: "ap2",
});

const QrSocket = () => {
  const [
    getQRcode,
    {
      isSuccess: isGetQRcodeSuccess,
      isLoading: isGetQRcodeLoading,
      isError: isGetQRcodeError,
      error: getQRcodeError,
      data: getQRcodeData,
    },
  ] = useLazyGetQRcodeQuery();

  useEffect(() => {
    getQRcode()
      ?.unwrap()
      ?.then((res) => {
        console.log(res);
        pusher.unsubscribe("my-channel");
        var channel = pusher.subscribe("my-channel");
        channel.bind(res?.temp, function (data) {
          console.log("ghjkfghjk", data);
        });
      });
    () => {
      pusher.unsubscribe("my-channel");
    };
  }, []);
  return <Image src={getQRcodeData?.data} width={100} height={100} />;
};

export default QrSocket;
