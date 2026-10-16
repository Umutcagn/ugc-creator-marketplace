"use client";

import Link from "next/link";
import { useState, useEffect } from "react";
import { Sparkles, ShoppingBag, LogOut, LayoutDashboard, ArrowRight, ShieldCheck, Zap } from "lucide-react";

export default function Navbar() {
  const [user, setUser] = useState<{ full_name?: string; role?: string; email?: string } | null>(null);

  useEffect(() => {
    const storedUser = localStorage.getItem("ugc_user");
    if (storedUser) {
      try {
        setUser(JSON.parse(storedUser));
      } catch (e) {
        console.error(e);
      }
    }
  }, []);

  const handleLogout = () => {
    localStorage.removeItem("ugc_token");
    localStorage.removeItem("ugc_user");
    setUser(null);
    window.location.href = "/";
  };

  return (
    <header className="sticky top-0 z-50 bg-[#0a0b0e]/90 backdrop-blur-md border-b border-white/10 text-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 md:h-20 flex items-center justify-between">
        
        {/* Brand Identity & Logo */}
        <Link href="/" className="flex items-center gap-3.5 group">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-[#6366f1] via-[#8b5cf6] to-[#ec4899] flex items-center justify-center text-white shadow-lg shadow-[#6366f1]/30 group-hover:scale-105 transition-transform">
            <Sparkles className="w-5 h-5 text-white" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="text-xl font-bold tracking-tight text-white font-serif">
                InfMarket
              </span>
              <span className="px-2 py-0.5 rounded-md border border-[#8b5cf6]/40 bg-[#8b5cf6]/15 text-[#a78bfa] text-[10px] font-bold uppercase tracking-wider">
                UGC Platform 2.5
              </span>
            </div>
            <span className="block text-[10px] text-gray-400 font-medium tracking-wide">
              Micro-Influencer & E-Ticaret Reklam Pazaryeri
            </span>
          </div>
        </Link>

        {/* Navigation Links */}
        <nav className="hidden md:flex items-center gap-8 text-xs font-semibold text-gray-300">
          <Link href="/campaigns" className="hover:text-white transition-colors flex items-center gap-1.5 group">
            <ShoppingBag className="w-4 h-4 text-[#a78bfa] group-hover:scale-110 transition-transform" />
            <span>Aktif Kampanyalar</span>
          </Link>
          <Link href="/#how-it-works" className="hover:text-white transition-colors">
            Nasıl Çalışır?
          </Link>
          <Link href="/#brands" className="hover:text-white transition-colors">
            Markalar İçin ROI
          </Link>
          <Link href="/#creators" className="hover:text-white transition-colors">
            İçerik Üreticileri
          </Link>
        </nav>

        {/* User Auth Controls */}
        <div className="flex items-center gap-3">
          <div className="hidden lg:flex items-center gap-2 px-3 py-1.5 rounded-lg border border-emerald-500/30 bg-emerald-500/10 text-emerald-400 text-xs font-semibold">
            <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" />
            <span>%100 Escrow Koruması</span>
          </div>

          {user ? (
            <div className="flex items-center gap-2.5">
              <Link
                href={user.role === "brand" ? "/dashboard/brand" : "/dashboard/creator"}
                className="flex items-center gap-2 px-4 py-2 rounded-xl bg-white/10 hover:bg-white/20 text-white border border-white/20 transition-all text-xs font-semibold"
              >
                <LayoutDashboard className="w-4 h-4 text-[#a78bfa]" />
                <span>{user.role === "brand" ? "Marka Kontrol Paneli" : "Yayıncı Panelim"}</span>
              </Link>
              <button
                onClick={handleLogout}
                className="p-2.5 rounded-xl bg-[#12141c] border border-white/15 text-gray-400 hover:text-red-400 hover:bg-red-500/10 transition-colors"
                title="Çıkış Yap"
              >
                <LogOut className="w-4 h-4" />
              </button>
            </div>
          ) : (
            <div className="flex items-center gap-2.5">
              <Link
                href="/login"
                className="hidden sm:inline-flex px-4 py-2.5 text-xs font-semibold text-gray-200 border border-white/20 hover:bg-white/10 rounded-xl transition-colors"
              >
                Giriş Yap
              </Link>
              <Link
                href="/login?tab=register"
                className="ee-btn-primary px-4 py-2.5 text-xs font-bold text-white rounded-xl transition-all flex items-center gap-1.5"
              >
                <span>Ücretsiz Katıl</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </Link>
            </div>
          )}
        </div>
      </div>
    </header>
  );
}
