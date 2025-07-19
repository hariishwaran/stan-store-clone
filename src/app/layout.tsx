import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { AuthProvider } from "@/contexts/AuthContext";
import Navigation from "@/components/layout/Navigation";
import AuthDebug from "@/components/debug/AuthDebug";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "StanStore - Sell Digital Products",
  description: "Create your own digital store and sell products, courses, and memberships",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={inter.className}>
        <AuthProvider>
          <div className="min-h-screen bg-gray-50">
            <Navigation />
            <main>{children}</main>
            <AuthDebug />
          </div>
        </AuthProvider>
      </body>
    </html>
  );
}
