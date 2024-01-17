"use client";
import { DotLottiePlayer, PlayerEvents } from "@dotlottie/react-player";
import { Spinner } from "@nextui-org/react";
import { useState } from "react";

const Lottie = () => {
  const [isLoading, setIsLoading] = useState(true);

  return (
    <div style={{ minHeight: 448 }}>
      {isLoading && (
        <Spinner
          label="Loading..."
          style={{ position: "absolute", minHeight: 448, left: 0, right: 0 }}
        />
      )}
      <DotLottiePlayer
        onEvent={(event: PlayerEvents) => {
          if (event === PlayerEvents.Ready) {
            setIsLoading(false);
          }
        }}
        src="/lottie2.lottie"
        autoplay
        loop
      />
    </div>
  );
};

export default Lottie;
