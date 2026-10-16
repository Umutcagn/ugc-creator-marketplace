import type { Metadata } from "next";
import { Zilla_Slab, Plus_Jakarta_Sans, JetBrains_Mono } from "next/font/google";
import "./globals.css";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";

const zillaSlab = Zilla_Slab({
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
  variable: "--font-zilla-slab",
});

const jakarta = Plus_Jakarta_Sans({
  subsets: ["latin"],
  weight: ["400", "500", "600", "700", "800"],
  variable: "--font-jakarta",
});

const mono = JetBrains_Mono({
  subsets: ["latin"],
  weight: ["400", "500", "700"],
  variable: "--font-mono",
});

export const metadata: Metadata = {
  title: "InfMarket - Micro-Influencer & E-Ticaret UGC Pazaryeri",
  description: "E-Ticaret markanız için yüksek dönüşümlü 9:16 Reels ve TikTok UGC reklam videoları üretin.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="tr" className="dark">
      <body className={`${zillaSlab.variable} ${jakarta.variable} ${mono.variable} font-sans bg-[#07080a] text-slate-100 min-h-screen flex flex-col antialiased selection:bg-[#7c3aed] selection:text-white`}>
        <Navbar />
        <main className="flex-1">{children}</main>
        <Footer />
      </body>
    </html>
  );
}
