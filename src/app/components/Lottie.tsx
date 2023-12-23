"use client";
import { DotLottiePlayer } from "@dotlottie/react-player";

const Lottie = () => {
  return (
    <div style={{ height: 250 }}>
      <DotLottiePlayer src="/lottie2.lottie" autoplay loop />
    </div>
  );
};

export default Lottie;
