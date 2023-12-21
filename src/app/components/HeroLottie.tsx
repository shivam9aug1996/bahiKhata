"use client";
import { DotLottiePlayer } from "@dotlottie/react-player";

const HeroLottie = () => {
  return (
    <div
      style={{
        height: 180,
        alignItems: "center",
        width: "100%",
      }}
    >
      <DotLottiePlayer src="/lottie1.lottie" autoplay loop />
    </div>
  );
};

export default HeroLottie;
