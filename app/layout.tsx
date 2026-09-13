import type { Metadata } from "next";
import { Baloo_2, Nunito } from "next/font/google";
import "./globals.css";
import TopBar from "@/components/TopBar";
import BottomNav from "@/components/BottomNav";
import ToastLayer from "@/components/ToastLayer";
import { AuthProvider } from "@/components/AuthProvider";
import GameSync from "@/components/GameSync";

const display = Baloo_2({ subsets: ["latin"], variable: "--font-display", weight: ["500", "600", "700", "800"] });
const body = Nunito({ subsets: ["latin"], variable: "--font-body", weight: ["400", "600", "700", "800"] });

export const metadata: Metadata = {
  title: "The Everything Game",
  description: "A tiny interactive world: explore town, play mini-games, and build your house.",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body className={`${display.variable} ${body.variable} font-body`}>
        <AuthProvider>
          <GameSync />
          <div className="mx-auto flex min-h-screen max-w-2xl flex-col pb-24">
            <TopBar />
            <main className="flex-1 px-4 pb-6 pt-4">{children}</main>
            <BottomNav />
          </div>
          <ToastLayer />
        </AuthProvider>
      </body>
    </html>
  );
}