import type { Metadata } from "next";
import "./globals.css";
import { AuraProvider } from "@/lib/store";
import Nav from "@/components/Nav";
import ChromeBackground from "@/components/ChromeBackground";

export const metadata: Metadata = {
  title: "Aura Absolute — Find Your Scent",
  description: "A futuristic fragrance recommendation platform.",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className="font-sans">
        <ChromeBackground />
        <AuraProvider>
          <Nav />
          <main className="pb-16">{children}</main>
        </AuraProvider>
      </body>
    </html>
  );
}
