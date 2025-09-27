import type { Metadata } from "next";
import { Poppins } from "next/font/google";
import { BottomNav } from "@/components/ui/bottom-nav";
import { TopNav } from "@/components/ui/top-nav";
import "./globals.css";

const poppins = Poppins({
  subsets: ["latin"],
  weight: ["300", "400", "500", "600", "700"]
});

export const metadata: Metadata = {
  title: "House Plants App",
  description: "A digital plant journal to help you care for your green family",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className={poppins.className}>
        <div className="min-h-screen bg-gradient-to-b from-primary-50 to-earth-50">
          <TopNav />
          <div className="pb-20 md:pb-0">
            {children}
          </div>
          <BottomNav />
        </div>
      </body>
    </html>
  );
}