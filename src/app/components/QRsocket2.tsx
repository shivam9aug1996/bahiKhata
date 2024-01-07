"use client";
import React, { useState, useEffect } from "react";
import pusher from "./pusher"; // Import the initialized Pusher instance

const QRsocket2 = () => {
  const [isConnected, setIsConnected] = useState(false);
  const [channel, setChannel] = useState(null);

  useEffect(() => {
    if (isConnected) {
      const newChannel = pusher.subscribe("my-channel");
      setChannel(newChannel);
    } else {
      if (channel) {
        channel?.unbind(); // Unbind all event callbacks
        pusher.unsubscribe("my-channel"); // Unsubscribe from the channel
        setChannel(null);
      }
    }

    // Cleanup when component unmounts
    return () => {
      if (channel) {
        channel.unbind(); // Unbind all event callbacks
        pusher.unsubscribe("my-channel"); // Unsubscribe from the channel
      }
    };
  }, [isConnected]); // Re-run effect only if 'isConnected' changes

  // Function to start or close the socket connection and channel subscription
  const toggleSocket = () => {
    setIsConnected((prevState) => !prevState);
  };

  return (
    <div>
      <button onClick={toggleSocket}>
        {isConnected ? "Close Socket" : "Start Socket"}
      </button>
      <div>Status: {isConnected ? "Connected" : "Disconnected"}</div>
      {/* Other components or content related to Pusher */}
    </div>
  );
};

export default QRsocket2;
