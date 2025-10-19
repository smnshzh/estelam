import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { SuperTokensProvider } from "./providers/SuperTokensProvider";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "پلتفرم استعلام - مدیریت فروشندگان",
  description: "پلتفرم مبتنی بر نقشه برای فروشندگان با قابلیت‌های پیشرفته نظردهی و ارتباط زنده",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="fa" dir="rtl">
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        <SuperTokensProvider>
          {children}
        </SuperTokensProvider>
      </body>
    </html>
  );
}
