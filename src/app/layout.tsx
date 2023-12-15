import type { Metadata } from "next";
import dynamic from "next/dynamic";
import { Inter } from "next/font/google";
// import Providers from "./components/Providers";
import "./globals.css";
import { SpeedInsights } from "@vercel/speed-insights/next";

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
        <Providers>{children}</Providers>
        <SpeedInsights />
      </body>
    </html>
  );
}
