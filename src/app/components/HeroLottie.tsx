"use client";
import { DotLottiePlayer, PlayerEvents } from "@dotlottie/react-player";
import { Spinner } from "@nextui-org/react";
import { useState } from "react";

const HeroLottie = () => {
  const [isLoading, setIsLoading] = useState(true);
  return (
    <div
      style={{
        height: 180,
        alignItems: "center",
        width: "100%",
      }}
    >
      {isLoading && (
        <Spinner
          label="Loading..."
          style={{ position: "absolute", left: 0, right: 0, height: 180 }}
        />
      )}
      <DotLottiePlayer
        onEvent={(event: PlayerEvents) => {
          if (event === PlayerEvents.Ready) {
            setIsLoading(false);
          }
        }}
        src="/lottie1.lottie"
        autoplay
        loop
      />
    </div>
  );
};

export default HeroLottie;
