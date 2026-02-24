import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { AppProvider } from "@/lib/AppContext";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Wholesale Pricing App",
  description: "Smart Pricing Manager for Wholesale Shops",
  manifest: "/manifest.json",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        <AppProvider>
          <div className="fixed inset-0 z-[-1] pointer-events-none opacity-50">
            <div className="absolute top-[-10%] left-[-10%] w-96 h-96 bg-purple-500 rounded-full mix-blend-multiply filter blur-[128px]"></div>
            <div className="absolute bottom-[-10%] right-[-10%] w-96 h-96 bg-indigo-500 rounded-full mix-blend-multiply filter blur-[128px]"></div>
            <div className="absolute top-[40%] left-[50%] w-96 h-96 bg-emerald-500 rounded-full mix-blend-multiply filter blur-[128px]"></div>
          </div>
          <main className="relative min-h-screen z-0">
            {children}
          </main>
        </AppProvider>
      </body>
    </html>
  );
}
