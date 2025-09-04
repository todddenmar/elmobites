import type { Metadata } from "next";
import { Geist, Geist_Mono, Montserrat } from "next/font/google";
import "./globals.css";
import Header from "@/components/Header";
import localFont from "next/font/local";

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
const dreamAvenue = localFont({
  src: "../../public/fonts/dream-avenue.ttf",
  variable: "--font-dream",
});

const signature = localFont({
  src: "../../public/fonts/signature.otf",
  variable: "--font-signature",
});

const bostonAngel = localFont({
  src: "../../public/fonts/boston-angel.ttf",
  variable: "--font-boston",
});

export const metadata: Metadata = {
  title: "The Cake Co.",
  description:
    "Order delicious custom cakes online from The Cake Co. Pagadian City. Freshly baked, beautifully designed, and delivered straight to your doorstep.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      className={`${geistSans.variable} ${geistMono.variable} ${dreamAvenue.variable} ${signature.variable} ${bostonAngel.variable} ${montserrat.variable} antialiased`}
    >
      <body className="font-sans flex flex-col h-screen">
        <Header />
        <div className="flex-1 flex flex-col">{children}</div>
      </body>
    </html>
  );
}
