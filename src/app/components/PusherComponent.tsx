"use client";
import React from "react";
import usePusher from "../custom-hooks/usePusher";

const PusherComponent = () => {
  const { isConnected, error, startSocket, closeSocket } = usePusher(
    "a7a14b0a75a3d073c905",
    "ap2",
    "my-channel"
  );

  const handleButtonClick = () => {
    if (isConnected) {
      closeSocket();
    } else {
      startSocket();
    }
  };

  return (
    <div>
      <h2>Pusher Component</h2>
      <div>Status: {isConnected ? "Connected" : "Disconnected"}</div>
      {error && <div>Error: {error}</div>}
      <button onClick={handleButtonClick}>
        {isConnected ? "Close Socket" : "Start Socket"}
      </button>
      {/* Other components or content related to Pusher */}
    </div>
  );
};

export default PusherComponent;
