import type { Metadata } from "next";
import dynamic from "next/dynamic";
import { Inter } from "next/font/google";
// import Providers from "./components/Providers";
import "./globals.css";
import { SpeedInsights } from "@vercel/speed-insights/next";
import NextTopLoader from "nextjs-toploader";
import "react-loading-skeleton/dist/skeleton.css";

const inter = Inter({ subsets: ["latin"] });
const Providers = dynamic(() => import("./components/Providers"));

export const metadata: Metadata = {
  title: "BahiKhata",
  description: "Simplify Business Management",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className={inter.className}>
        <NextTopLoader height={5} color="#df5b49" />
        <Providers>{children}</Providers>
        <SpeedInsights />
      </body>
    </html>
  );
}
