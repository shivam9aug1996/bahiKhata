"use client";
import React, { useEffect } from "react";
import Pusher from "pusher-js/with-encryption";

const pusher = new Pusher("a7a14b0a75a3d073c905", {
  cluster: "ap2",
});

const PusherChannel = () => {
  useEffect(() => {
    var channel = pusher.subscribe("my-channel");
    () => {
      pusher.unsubscribe("my-channel");
    };
  }, []);
  return null;
};

export default PusherChannel;
