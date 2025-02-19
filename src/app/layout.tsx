import { NuqsAdapter } from "nuqs/adapters/next/app";
import { QueryProvider } from "@/providers/query";

import { Roboto_Mono } from "next/font/google";
import { Toaster } from "sonner";

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

const mono = Roboto_Mono({
  subsets: ["latin", "cyrillic"],
  display: "swap",
  style: "normal",
  variable: "--font-roboto-mono",
});

const Layout = ({ children }: { children: React.ReactNode }) => {
  return (
    <html lang="en">
      <body className={`${mono.className} ${mono.variable} antialiased`}>
        <NuqsAdapter>
          <QueryProvider>
            <div className="relative flex flex-col flex-1 h-svh p-2 md:p-4 bg-background">
              <main className="flex-1 bg-black overflow-y-auto rounded-lg">
                {children}
              </main>
            </div>
            <Toaster />
          </QueryProvider>
        </NuqsAdapter>
      </body>
    </html>
  );
};

export default Layout;
