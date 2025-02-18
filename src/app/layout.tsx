import localFont from "next/font/local";

import type { Metadata, Viewport } from "next";

import "@/global.css";

export const metadata: Metadata = {
  title: "showtime | booqable",
  description: "showtime composer made exclusively for booqable",
};

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  maximumScale: 1,
};

const itc = localFont({
  src: [
    {
      path: "../../public/itc-bold.otf",
      weight: "700",
      style: "normal",
    },
    {
      path: "../../public/itc-demi.otf",
      weight: "400",
      style: "normal",
    },
  ],
  variable: "--itc-font",
});

const RootLayout = ({ children }: { children: React.ReactNode }) => {
  return (
    <html lang="en" className={itc.className}>
      <body>{children}</body>
    </html>
  );
};

export default RootLayout;
