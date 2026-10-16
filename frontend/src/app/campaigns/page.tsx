"use client";

import { useState, useEffect } from "react";
import { ShoppingBag, ArrowUpRight, CheckCircle, Tag, Layers, Search, Filter, DollarSign, Gift } from "lucide-react";
import { API_BASE_URL } from "@/lib/api";

interface Campaign {
  id: number;
  brand_name: string;
  title: string;
  description: string;
  product_name: string;
  product_url?: string;
  product_image?: string;
  reward_type: string;
  cash_amount: number;
  max_creators: number;
  category: string;
}

export default function CampaignsPage() {
  const [campaigns, setCampaigns] = useState<Campaign[]>([]);
  const [selectedCategory, setSelectedCategory] = useState("Tümü");
  const [searchQuery, setSearchQuery] = useState("");
  const [rewardFilter, setRewardFilter] = useState<"all" | "cash" | "product">("all");

  const [loading, setLoading] = useState(true);
  const [selectedCampaign, setSelectedCampaign] = useState<Campaign | null>(null);
  const [applySuccess, setApplySuccess] = useState(false);
  const [applyError, setApplyError] = useState("");

  const categories = ["Tümü", "Kozmetik", "Moda", "Teknoloji", "Gıda", "Lifestyle"];

  useEffect(() => {
    fetchCampaigns(selectedCategory);
  }, [selectedCategory]);

  const fetchCampaigns = async (cat: string) => {
    setLoading(true);
    try {
      const url = cat === "Tümü" 
        ? `${API_BASE_URL}/api/campaigns` 
        : `${API_BASE_URL}/api/campaigns?category=${cat}`;
      const res = await fetch(url);
      if (res.ok) {
        const data = await res.json();
        setCampaigns(data);
      }
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  const handleApply = async (campaignId: number) => {
    setApplyError("");
    setApplySuccess(false);

    const token = localStorage.getItem("ugc_token");
    if (!token) {
      setApplyError("Başvurmak için lütfen Influencer hesabınızla giriş yapın.");
      return;
    }

    try {
      const res = await fetch(`${API_BASE_URL}/api/applications`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ campaign_id: campaignId }),
      });

      const data = await res.json();
      if (res.ok) {
        setApplySuccess(true);
      } else {
        setApplyError(data.detail || "Başvuru yapılamadı.");
      }
    } catch (e) {
      setApplyError("Bağlantı hatası oluştu.");
    }
  };

  // Filter campaigns dynamically based on search query and reward filter
  const filteredCampaigns = campaigns.filter((c) => {
    const matchesSearch =
      c.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      c.brand_name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      c.product_name.toLowerCase().includes(searchQuery.toLowerCase());

    const matchesReward =
      rewardFilter === "all" ||
      (rewardFilter === "cash" && c.cash_amount > 0) ||
      (rewardFilter === "product" && c.cash_amount === 0);

    return matchesSearch && matchesReward;
  });

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 space-y-8 font-serif text-white bg-black">
      {/* Header Banner */}
      <div className="space-y-3 text-center sm:text-left border-b border-white/10 pb-6">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-md border border-[#9541e0]/40 bg-[linear-gradient(to_bottom,rgba(149,65,224,0.24),rgba(124,48,199,0.14))] text-[#c793ff] text-xs font-semibold uppercase tracking-wider">
          <ShoppingBag className="w-4 h-4 text-[#c793ff]" />
          <span>Aktif Ürün ve Hediye Kampanyaları</span>
        </div>
        <h1 className="text-3xl sm:text-4xl font-bold text-white">İçerik Üreticileri İçin Kampanyalar</h1>
        <p className="text-gray-400 text-xs sm:text-sm max-w-2xl">
          Sevdiğin e-ticaret markalarının ürünlerini ücretsiz dene, Reels ve TikTok videosu hazırla ve kazanç elde et.
        </p>
      </div>

      {/* Feature 4: Advanced Search & Filter Controls */}
      <div className="ee-card p-4 rounded-2xl space-y-4">
        <div className="flex flex-col md:flex-row items-center justify-between gap-4">
          
          {/* Live Search Bar */}
          <div className="relative w-full md:w-96">
            <Search className="w-4 h-4 text-gray-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Marka, ürün veya kampanya ara..."
              className="w-full pl-10 pr-4 py-2.5 rounded-xl bg-black border border-white/10 text-white text-xs placeholder:text-gray-500 focus:border-[#9541e0] focus:outline-none"
            />
          </div>

          {/* Reward Type Toggle Pills */}
          <div className="flex items-center gap-2 w-full md:w-auto text-xs font-semibold overflow-x-auto">
            <button
              onClick={() => setRewardFilter("all")}
              className={`px-3.5 py-2 rounded-xl transition-all whitespace-nowrap ${
                rewardFilter === "all"
                  ? "ee-btn-primary text-white"
                  : "bg-black text-gray-400 hover:text-white border border-white/10"
              }`}
            >
              Tüm Ödüller
            </button>
            <button
              onClick={() => setRewardFilter("cash")}
              className={`px-3.5 py-2 rounded-xl transition-all flex items-center gap-1 whitespace-nowrap ${
                rewardFilter === "cash"
                  ? "ee-btn-primary text-white"
                  : "bg-black text-gray-400 hover:text-white border border-white/10"
              }`}
            >
              <DollarSign className="w-3.5 h-3.5 text-emerald-400" />
              <span>Nakit Ödüllüler (+₺)</span>
            </button>
            <button
              onClick={() => setRewardFilter("product")}
              className={`px-3.5 py-2 rounded-xl transition-all flex items-center gap-1 whitespace-nowrap ${
                rewardFilter === "product"
                  ? "ee-btn-primary text-white"
                  : "bg-black text-gray-400 hover:text-white border border-white/10"
              }`}
            >
              <Gift className="w-3.5 h-3.5 text-amber-400" />
              <span>Hediye Ürün</span>
            </button>
          </div>
        </div>

        {/* Categories Bar */}
        <div className="pt-2 border-t border-white/10 flex items-center justify-between gap-4 overflow-x-auto">
          <div className="flex items-center gap-2">
            {categories.map((cat) => (
              <button
                key={cat}
                onClick={() => setSelectedCategory(cat)}
                className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-colors whitespace-nowrap ${
                  selectedCategory === cat
                    ? "bg-[#9541e0]/20 border border-[#9541e0] text-[#c793ff]"
                    : "bg-black text-gray-400 hover:text-white border border-white/10"
                }`}
              >
                {cat}
              </button>
            ))}
          </div>

          <div className="text-xs text-gray-400 font-medium whitespace-nowrap hidden sm:block">
            <span className="text-white font-bold">{filteredCampaigns.length}</span> kampanya listeleniyor
          </div>
        </div>
      </div>

      {/* Campaigns Grid */}
      {loading ? (
        <div className="py-20 text-center text-gray-500 text-sm">Kampanyalar yükleniyor...</div>
      ) : filteredCampaigns.length === 0 ? (
        <div className="py-16 text-center bg-black/60 rounded-2xl border border-white/10 space-y-3">
          <Layers className="w-10 h-10 text-gray-600 mx-auto" />
          <div className="text-white font-bold">Aramanıza uygun kampanya bulunamadı.</div>
          <div className="text-xs text-gray-400">Arama terimini sıfırlayabilir veya farklı bir kategori seçebilirsiniz.</div>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredCampaigns.map((c) => (
            <div
              key={c.id}
              className="ee-card rounded-2xl overflow-hidden flex flex-col justify-between group hover:border-[#9541e0]/50 transition-all duration-300"
            >
              {/* Image & Badges Header */}
              <div className="relative aspect-video overflow-hidden bg-slate-900">
                <img
                  src={c.product_image || "https://images.unsplash.com/photo-1522337360788-8b13dee7a37e?w=500&q=80"}
                  alt={c.title}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                />
                <div className="absolute top-3 left-3 flex gap-2">
                  <span className="px-2.5 py-1 rounded-md bg-black/80 backdrop-blur-md text-[11px] font-bold text-white border border-white/10">
                    {c.category}
                  </span>
                </div>
                <div className="absolute top-3 right-3">
                  <span className="px-2.5 py-1 rounded-md bg-emerald-600 text-white text-xs font-bold shadow-md">
                    {c.cash_amount > 0 ? `+${c.cash_amount} ₺ Nakit` : "Ücretsiz Ürün"}
                  </span>
                </div>
              </div>

              {/* Content Body */}
              <div className="p-5 space-y-4 flex-1 flex flex-col justify-between">
                <div className="space-y-2">
                  <div className="text-xs font-bold text-[#c793ff] flex items-center gap-1">
                    <Tag className="w-3.5 h-3.5" />
                    {c.brand_name}
                  </div>
                  <h3 className="text-base font-bold text-white leading-snug line-clamp-2">{c.title}</h3>
                  <p className="text-xs text-gray-400 line-clamp-2 leading-relaxed">{c.description}</p>
                </div>

                <div className="pt-3 border-t border-white/10 flex items-center justify-between">
                  <div className="text-xs text-gray-400">
                    Ürün: <span className="text-white font-semibold">{c.product_name}</span>
                  </div>
                  <button
                    onClick={() => {
                      setSelectedCampaign(c);
                      setApplySuccess(false);
                      setApplyError("");
                    }}
                    className="px-3.5 py-2 rounded-md bg-white/10 hover:bg-white/20 text-[#c793ff] hover:text-white border border-white/10 text-xs font-semibold transition-colors flex items-center gap-1"
                  >
                    <span>Detay ve Başvur</span>
                    <ArrowUpRight className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Campaign Detail Modal */}
      {selectedCampaign && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="ee-card border border-white/20 rounded-2xl max-w-lg w-full p-6 space-y-5 relative">
            <button
              onClick={() => setSelectedCampaign(null)}
              className="absolute top-4 right-4 text-gray-400 hover:text-white text-lg font-bold"
            >
              ✕
            </button>

            <div className="space-y-2">
              <span className="px-2.5 py-1 rounded-md border border-[#9541e0]/40 bg-[linear-gradient(to_bottom,rgba(149,65,224,0.24),rgba(124,48,199,0.14))] text-[#c793ff] text-[10px] font-bold">
                {selectedCampaign.category}
              </span>
              <h2 className="text-xl font-bold text-white">{selectedCampaign.title}</h2>
              <p className="text-xs text-gray-400 font-semibold">{selectedCampaign.brand_name}</p>
            </div>

            <div className="space-y-2 text-xs text-gray-300 bg-black p-4 rounded-xl border border-white/10">
              <div className="font-bold text-white mb-1">Kampanya Detayı:</div>
              <p className="leading-relaxed text-gray-400">{selectedCampaign.description}</p>
              <div className="pt-2 flex items-center justify-between text-xs border-t border-white/10 mt-2">
                <span>Gönderilecek Ürün:</span>
                <span className="font-bold text-white">{selectedCampaign.product_name}</span>
              </div>
              <div className="flex items-center justify-between text-xs">
                <span>Ödül:</span>
                <span className="font-bold text-emerald-400">
                  {selectedCampaign.cash_amount > 0 ? `${selectedCampaign.cash_amount} ₺ Nakit + Hediye Ürün` : "Hediye Ürün"}
                </span>
              </div>
            </div>

            {applySuccess ? (
              <div className="p-4 bg-emerald-500/10 border border-emerald-500/30 rounded-xl text-emerald-400 text-xs font-semibold flex items-center gap-2">
                <CheckCircle className="w-5 h-5 flex-shrink-0 text-emerald-400" />
                <span>Başvurunuz başarıyla alındı. Marka onayladığında kargo bilgisi panelinize düşecektir.</span>
              </div>
            ) : (
              <>
                {applyError && (
                  <div className="p-3 bg-red-500/10 border border-red-500/30 rounded-xl text-red-400 text-xs">
                    {applyError}
                  </div>
                )}
                <button
                  onClick={() => handleApply(selectedCampaign.id)}
                  className="ee-btn-primary w-full py-3 rounded-xl text-white font-bold text-xs transition-all"
                >
                  Kampanyaya Başvur
                </button>
              </>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
