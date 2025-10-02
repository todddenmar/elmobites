import type { Metadata } from "next";
import { Geist, Geist_Mono, Montserrat } from "next/font/google";
import "./globals.css";
import Header from "@/components/Header";
import { Toaster } from "@/components/ui/sonner";
import CustomProgressProvider from "@/components/custom-ui/CustomProgressProvider";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});
const montserrat = Montserrat({
  subsets: ["latin"],
  variable: "--font-montserrat", // 👈 expose as CSS variable
  weight: ["400", "500", "700"], // choose weights you need
});

export const metadata: Metadata = {
  title: "Elmo Bites",
  description:
    "Order delicious products online from Elmo Bites Pagadian City. Freshly made, beautifully designed, and delivered straight to your doorstep.",
  // openGraph: {
  //   images: "https://elmobites.com/images/thumbnail.png",
  // },
  keywords: ["Salad", "Pagadian City", "Sweets"],
  // manifest: "/manifest.webmanifest",
  // icons: {
  //   icon: "/icons/icon-192x192.png",
  //   apple: "/icons/apple-touch-icon.png",
  // },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      className={`${geistSans.variable} ${geistMono.variable} ${montserrat.variable} antialiased`}
    >
      <body className="font-sans flex flex-col h-screen">
        <CustomProgressProvider>
          <Header />
          <div className="flex-1 flex flex-col">{children}</div>
          <Toaster position="top-center" />
        </CustomProgressProvider>
      </body>
    </html>
  );
}
