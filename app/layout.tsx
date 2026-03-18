import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { Chakra } from './chakra-provider'

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
});

export const metadata: Metadata = {
  title: "Flora Gas Customer Registration",
  description: "Digital customer registration system for Flora Gas Zimbabwe",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        className={`${inter.variable} font-sans antialiased`}
      >
        <Chakra>
          {children}
        </Chakra>
      </body>
    </html>
  );
}
