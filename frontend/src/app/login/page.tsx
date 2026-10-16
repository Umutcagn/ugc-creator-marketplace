"use client";

import { useState, useEffect, Suspense } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import { Sparkles, Building2, UserCheck, ArrowRight } from "lucide-react";
import { API_BASE_URL } from "@/lib/api";

function AuthFormContent() {
  const searchParams = useSearchParams();
  const router = useRouter();

  const [tab, setTab] = useState<"login" | "register">("login");
  const [role, setRole] = useState<"brand" | "creator">("brand");

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [fullName, setFullName] = useState("");
  const [handleOrCompany, setHandleOrCompany] = useState("");

  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const tabParam = searchParams.get("tab");
    const roleParam = searchParams.get("role");
    if (tabParam === "register") setTab("register");
    if (roleParam === "creator") setRole("creator");
  }, [searchParams]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      if (tab === "login") {
        const formData = new URLSearchParams();
        formData.append("username", email);
        formData.append("password", password);

        const res = await fetch(`${API_BASE_URL}/api/auth/token`, {
          method: "POST",
          headers: { "Content-Type": "application/x-www-form-urlencoded" },
          body: formData.toString()
        });

        const data = await res.json();
        if (res.ok) {
          localStorage.setItem("ugc_token", data.access_token);
          localStorage.setItem("ugc_user", JSON.stringify(data.user));

          if (data.user.role === "brand") {
            window.location.href = "/dashboard/brand";
          } else {
            window.location.href = "/dashboard/creator";
          }
        } else {
          setError(data.detail || "Giriş yapılamadı.");
        }
      } else {
        const res = await fetch(`${API_BASE_URL}/api/auth/register`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            email,
            password,
            full_name: fullName,
            role,
            handle_or_company: handleOrCompany
          })
        });

        const data = await res.json();
        if (res.ok) {
          localStorage.setItem("ugc_token", data.access_token);
          localStorage.setItem("ugc_user", JSON.stringify(data.user));

          if (data.user.role === "brand") {
            window.location.href = "/dashboard/brand";
          } else {
            window.location.href = "/dashboard/creator";
          }
        } else {
          setError(data.detail || "Kayıt olunamadı.");
        }
      }
    } catch (e) {
      setError("Sunucuya bağlanılamadı. Lütfen backend servisinin çalıştığından emin olun.");
    } finally {
      setLoading(false);
    }
  };

  const handleDemoBrandLogin = async () => {
    setEmail("marka@trendyolstore.com");
    setPassword("123456");
  };

  const handleDemoCreatorLogin = async () => {
    setEmail("influencer@gmail.com");
    setPassword("123456");
  };

  return (
    <div className="max-w-md mx-auto my-12 px-4 space-y-6 font-serif text-white bg-black">
      {/* Header Logo */}
      <div className="text-center space-y-2">
        <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-[#9541e0] to-[#7c30c7] mx-auto flex items-center justify-center text-white shadow-lg shadow-[#9541e0]/40">
          <Sparkles className="w-6 h-6" />
        </div>
        <h1 className="text-2xl font-bold text-white">InfMarket Hesabı</h1>
        <p className="text-xs text-gray-400">Türkiye&apos;nin en aktif UGC ve Micro Influencer platformuna hoş geldiniz.</p>
      </div>

      {/* Quick Demo Fill Buttons */}
      <div className="p-3 bg-black/60 border border-white/10 rounded-xl space-y-2">
        <div className="text-[11px] font-bold text-[#c793ff] text-center">Hızlı Test Girişleri:</div>
        <div className="grid grid-cols-2 gap-2 text-xs font-semibold">
          <button
            type="button"
            onClick={handleDemoBrandLogin}
            className="p-2 rounded-lg bg-white/10 text-white border border-white/10 hover:bg-white/20 transition-colors text-[11px]"
          >
            Marka Doldur
          </button>
          <button
            type="button"
            onClick={handleDemoCreatorLogin}
            className="p-2 rounded-lg bg-white/10 text-white border border-white/10 hover:bg-white/20 transition-colors text-[11px]"
          >
            Influencer Doldur
          </button>
        </div>
      </div>

      {/* Tabs */}
      <div className="flex bg-black p-1 rounded-xl border border-white/10 text-xs font-bold">
        <button
          type="button"
          onClick={() => setTab("login")}
          className={`w-1/2 py-2 rounded-lg transition-colors ${tab === "login" ? "ee-btn-primary text-white" : "text-gray-400 hover:text-white"}`}
        >
          Giriş Yap
        </button>
        <button
          type="button"
          onClick={() => setTab("register")}
          className={`w-1/2 py-2 rounded-lg transition-colors ${tab === "register" ? "ee-btn-primary text-white" : "text-gray-400 hover:text-white"}`}
        >
          Kayıt Ol
        </button>
      </div>

      {/* Form Container */}
      <div className="ee-card border border-white/15 rounded-2xl p-6 space-y-4">
        {error && (
          <div className="p-3 bg-red-500/10 border border-red-500/30 rounded-lg text-red-400 text-xs font-medium">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4 text-xs">
          {tab === "register" && (
            <>
              {/* Role Selector */}
              <div className="space-y-1">
                <label className="block text-gray-300 font-semibold">Hesap Türünüz</label>
                <div className="grid grid-cols-2 gap-2">
                  <button
                    type="button"
                    onClick={() => setRole("brand")}
                    className={`p-3 rounded-xl border flex items-center justify-center gap-2 font-bold transition-colors ${
                      role === "brand" ? "border-[#9541e0] bg-[#9541e0]/20 text-[#c793ff]" : "bg-black/60 border-white/10 text-gray-400 hover:bg-white/10"
                    }`}
                  >
                    <Building2 className="w-4 h-4" />
                    <span>E-Ticaret Markası</span>
                  </button>

                  <button
                    type="button"
                    onClick={() => setRole("creator")}
                    className={`p-3 rounded-xl border flex items-center justify-center gap-2 font-bold transition-colors ${
                      role === "creator" ? "border-[#9541e0] bg-[#9541e0]/20 text-[#c793ff]" : "bg-black/60 border-white/10 text-gray-400 hover:bg-white/10"
                    }`}
                  >
                    <UserCheck className="w-4 h-4" />
                    <span>İçerik Üreticisi</span>
                  </button>
                </div>
              </div>

              <div>
                <label className="block text-gray-300 font-semibold mb-1">Ad Soyad</label>
                <input
                  type="text"
                  required
                  value={fullName}
                  onChange={(e) => setFullName(e.target.value)}
                  placeholder="Selin Yılmaz"
                  className="w-full p-3 rounded-xl bg-black border border-white/10 text-white focus:border-[#9541e0] focus:outline-none"
                />
              </div>

              <div>
                <label className="block text-gray-300 font-semibold mb-1">
                  {role === "brand" ? "Şirket veya Marka Adı" : "Instagram veya TikTok Kullanıcı Adı"}
                </label>
                <input
                  type="text"
                  required
                  value={handleOrCompany}
                  onChange={(e) => setHandleOrCompany(e.target.value)}
                  placeholder={role === "brand" ? "LuxeCosmetics TR" : "@selin.style"}
                  className="w-full p-3 rounded-xl bg-black border border-white/10 text-white focus:border-[#9541e0] focus:outline-none"
                />
              </div>
            </>
          )}

          <div>
            <label className="block text-gray-300 font-semibold mb-1">E-Posta Adresi</label>
            <input
              type="email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="ornek@domain.com"
              className="w-full p-3 rounded-xl bg-black border border-white/10 text-white focus:border-[#9541e0] focus:outline-none"
            />
          </div>

          <div>
            <label className="block text-gray-300 font-semibold mb-1">Şifre</label>
            <input
              type="password"
              required
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="••••••••"
              className="w-full p-3 rounded-xl bg-black border border-white/10 text-white focus:border-[#9541e0] focus:outline-none"
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            className="ee-btn-primary w-full py-3.5 rounded-xl text-white font-bold text-xs transition-all flex items-center justify-center gap-2"
          >
            <span>{loading ? "Lütfen Bekleyin..." : tab === "login" ? "Giriş Yap" : "Hesap Oluştur"}</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        </form>
      </div>
    </div>
  );
}

export default function LoginPage() {
  return (
    <Suspense fallback={<div className="py-20 text-center text-xs text-gray-500 font-serif">Yükleniyor...</div>}>
      <AuthFormContent />
    </Suspense>
  );
}
