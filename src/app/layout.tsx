import type { Metadata } from "next";
import "./globals.css";
import Navbar from "@/components/layout/Navbar";
import { ToastProvider } from "@/components/shared/Toast";
import { DemoProvider } from "@/lib/demo";
import DemoBanner from "@/components/shared/DemoBanner";
import { DemoTourProvider } from "@/components/shared/DemoTour";

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
        <DemoProvider>
          <ToastProvider>
            <DemoTourProvider>
              <Navbar />
              <main>{children}</main>
              <DemoBanner />
            </DemoTourProvider>
          </ToastProvider>
        </DemoProvider>
      </body>
    </html>
  );
}
