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

const RootLayout = ({ children }: { children: React.ReactNode }) => {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
};

export default RootLayout;
