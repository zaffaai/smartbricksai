import type { Metadata } from "next";
import "./globals.css";
import Navbar from "@/components/layout/Navbar";
import { ToastProvider } from "@/components/shared/Toast";

export const metadata: Metadata = {
  title: "SmartBricks — AI-First OS for Wealth",
  description: "The AI-powered property investment platform for the UAE market.",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className="min-h-screen bg-white">
        <ToastProvider>
          <Navbar />
          <main>{children}</main>
        </ToastProvider>
      </body>
    </html>
  );
}
