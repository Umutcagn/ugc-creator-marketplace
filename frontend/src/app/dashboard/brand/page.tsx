"use client";

import { useState, useEffect } from "react";
import { PlusCircle, ShoppingBag, Video, Truck, Clock, Wallet, Layers, FileText, MessageSquare, Send, CheckCircle2, PackageCheck } from "lucide-react";
import { API_BASE_URL } from "@/lib/api";

interface Stats {
  active_campaigns: number;
  pending_applications: number;
  approved_videos: number;
  total_budget_locked: number;
}

interface CampaignItem {
  id: number;
  title: string;
  product_name: string;
  cash_amount: number;
  max_creators: number;
  category: string;
  status: string;
  created_at: string;
}

interface ApplicationItem {
  id: number;
  campaign_id: number;
  creator_id: number;
  creator_name: string;
  creator_handle: string;
  status: string;
  cargo_company?: string;
  cargo_tracking_code?: string;
  video_url?: string;
  video_notes?: string;
  campaign?: {
    title: string;
    product_name: string;
    cash_amount: number;
  };
}

export default function BrandDashboard() {
  const [activeTab, setActiveTab] = useState<"campaigns" | "applications" | "escrow">("campaigns");

  const [stats, setStats] = useState<Stats>({ active_campaigns: 0, pending_applications: 0, approved_videos: 0, total_budget_locked: 0 });
  const [campaigns, setCampaigns] = useState<CampaignItem[]>([]);
  const [applications, setApplications] = useState<ApplicationItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [showCreateModal, setShowCreateModal] = useState(false);

  // New Campaign Form state
  const [newTitle, setNewTitle] = useState("");
  const [newDesc, setNewDesc] = useState("");
  const [newProdName, setNewProdName] = useState("");
  const [newRewardType, setNewRewardType] = useState("cash_and_gift");
  const [newCashAmount, setNewCashAmount] = useState(750);
  const [newMaxCreators, setNewMaxCreators] = useState(5);
  const [newCategory, setNewCategory] = useState("Kozmetik");
  const [createSuccess, setCreateSuccess] = useState(false);

  // Cargo modal state
  const [selectedAppForCargo, setSelectedAppForCargo] = useState<ApplicationItem | null>(null);
  const [cargoCompany, setCargoCompany] = useState("Yurtiçi Kargo");
  const [cargoCode, setCargoCode] = useState("");

  // Feature 5: Chat/Brief Modal State
  const [selectedAppForChat, setSelectedAppForChat] = useState<ApplicationItem | null>(null);
  const [chatMessages, setChatMessages] = useState<Array<{ sender: string; text: string; time: string }>>([
    { sender: "brand", text: "Merhaba! Başvurunuzu kabul ettik. Lütfen videoda ürün kapağının açılış anını 9:16 formatta yakın çekim yapınız.", time: "14:20" },
    { sender: "creator", text: "Harika! Ürünü teslim alır almaz brief uyarınca çekime başlıyorum, teşekkürler!", time: "14:22" }
  ]);
  const [newMessageText, setNewMessageText] = useState("");

  useEffect(() => {
    fetchDashboardData();
  }, []);

  const fetchDashboardData = async () => {
    setLoading(true);
    const token = localStorage.getItem("ugc_token");
    if (!token) return;

    try {
      const statsRes = await fetch(`${API_BASE_URL}/api/stats`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      if (statsRes.ok) setStats(await statsRes.json());

      const campRes = await fetch(`${API_BASE_URL}/api/campaigns`);
      if (campRes.ok) setCampaigns(await campRes.json());

      const appsRes = await fetch(`${API_BASE_URL}/api/applications/my`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      if (appsRes.ok) setApplications(await appsRes.json());
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  const handleCreateCampaign = async (e: React.FormEvent) => {
    e.preventDefault();
    const token = localStorage.getItem("ugc_token");
    if (!token) return;

    try {
      const res = await fetch(`${API_BASE_URL}/api/campaigns`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`
        },
        body: JSON.stringify({
          title: newTitle,
          description: newDesc,
          product_name: newProdName,
          reward_type: newRewardType,
          cash_amount: Number(newCashAmount),
          max_creators: Number(newMaxCreators),
          category: newCategory
        })
      });

      if (res.ok) {
        setCreateSuccess(true);
        setTimeout(() => {
          setShowCreateModal(false);
          setCreateSuccess(false);
          fetchDashboardData();
        }, 1200);
      }
    } catch (e) {
      console.error(e);
    }
  };

  const handleUpdateStatus = async (appId: number, statusStr: string, extraData: any = {}) => {
    const token = localStorage.getItem("ugc_token");
    if (!token) return;

    try {
      const res = await fetch(`${API_BASE_URL}/api/applications/${appId}/status`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`
        },
        body: JSON.stringify({ status: statusStr, ...extraData })
      });

      if (res.ok) {
        setSelectedAppForCargo(null);
        fetchDashboardData();
      }
    } catch (e) {
      console.error(e);
    }
  };

  const handleSendMessage = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newMessageText.trim()) return;

    const newMsg = {
      sender: "brand",
      text: newMessageText,
      time: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })
    };

    setChatMessages((prev) => [...prev, newMsg]);
    setNewMessageText("");
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-8 font-serif text-white bg-black">
      {/* Header Bar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-white/10 pb-6">
        <div>
          <h1 className="text-2xl sm:text-3xl font-bold text-white">Marka Yönetim Paneli</h1>
          <p className="text-xs text-gray-400 mt-1">UGC kampanyalarınızı, başvuruları ve kargo süreçlerini tek ekrandan yönetin.</p>
        </div>

        <button
          onClick={() => setShowCreateModal(true)}
          className="ee-btn-primary px-4 py-2.5 rounded-xl text-white text-xs font-semibold flex items-center gap-2 transition-all cursor-pointer"
        >
          <PlusCircle className="w-4 h-4" />
          <span>Yeni Kampanya Oluştur</span>
        </button>
      </div>

      {/* Metrics Grid */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <div className="ee-card p-4 rounded-2xl space-y-2">
          <div className="text-xs text-gray-400 font-semibold flex items-center justify-between">
            <span>Aktif Kampanyalar</span>
            <ShoppingBag className="w-4 h-4 text-[#c793ff]" />
          </div>
          <div className="text-2xl font-bold text-white">{stats.active_campaigns}</div>
        </div>

        <div className="ee-card p-4 rounded-2xl space-y-2">
          <div className="text-xs text-gray-400 font-semibold flex items-center justify-between">
            <span>Bekleyen Başvurular</span>
            <Clock className="w-4 h-4 text-amber-400" />
          </div>
          <div className="text-2xl font-bold text-amber-400">{stats.pending_applications}</div>
        </div>

        <div className="ee-card p-4 rounded-2xl space-y-2">
          <div className="text-xs text-gray-400 font-semibold flex items-center justify-between">
            <span>Onaylanan Videolar</span>
            <Video className="w-4 h-4 text-emerald-400" />
          </div>
          <div className="text-2xl font-bold text-emerald-400">{stats.approved_videos}</div>
        </div>

        <div className="ee-card p-4 rounded-2xl space-y-2">
          <div className="text-xs text-gray-400 font-semibold flex items-center justify-between">
            <span>Bloke Escrow Bütçe</span>
            <Wallet className="w-4 h-4 text-[#c793ff]" />
          </div>
          <div className="text-2xl font-bold text-[#c793ff]">{stats.total_budget_locked} ₺</div>
        </div>
      </div>

      {/* Navigation Tabs */}
      <div className="flex bg-black p-1 rounded-xl border border-white/10 text-xs font-bold max-w-xl">
        <button
          onClick={() => setActiveTab("campaigns")}
          className={`flex-1 py-2 rounded-lg transition-colors flex items-center justify-center gap-2 ${
            activeTab === "campaigns" ? "ee-btn-primary text-white" : "text-gray-400 hover:text-white"
          }`}
        >
          <Layers className="w-4 h-4" />
          <span>Kampanyalarım ({campaigns.length})</span>
        </button>

        <button
          onClick={() => setActiveTab("applications")}
          className={`flex-1 py-2 rounded-lg transition-colors flex items-center justify-center gap-2 ${
            activeTab === "applications" ? "ee-btn-primary text-white" : "text-gray-400 hover:text-white"
          }`}
        >
          <Video className="w-4 h-4" />
          <span>Başvurular ve Videolar ({applications.length})</span>
        </button>

        <button
          onClick={() => setActiveTab("escrow")}
          className={`flex-1 py-2 rounded-lg transition-colors flex items-center justify-center gap-2 ${
            activeTab === "escrow" ? "ee-btn-primary text-white" : "text-gray-400 hover:text-white"
          }`}
        >
          <Wallet className="w-4 h-4" />
          <span>Escrow ve Fatura</span>
        </button>
      </div>

      {/* Tab 1: Kampanyalarım */}
      {activeTab === "campaigns" && (
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="text-xl font-bold text-white">Yayınlanan Kampanyalarınız</h2>
            <button
              onClick={() => setShowCreateModal(true)}
              className="text-xs font-bold text-[#c793ff] hover:underline flex items-center gap-1"
            >
              + Yeni Kampanya Ekle
            </button>
          </div>

          {loading ? (
            <div className="text-center py-12 text-gray-500 text-xs">Yükleniyor...</div>
          ) : campaigns.length === 0 ? (
            <div className="text-center py-12 bg-black/60 rounded-2xl border border-white/10 text-xs text-gray-400">
              Henüz oluşturulmuş kampanya bulunmuyor.
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {campaigns.map((c) => (
                <div key={c.id} className="ee-card p-5 rounded-2xl space-y-4">
                  <div className="flex items-center justify-between">
                    <span className="px-2.5 py-0.5 rounded-md border border-[#9541e0]/40 bg-[linear-gradient(to_bottom,rgba(149,65,224,0.24),rgba(124,48,199,0.14))] text-[#c793ff] text-[10px] font-bold">
                      {c.category}
                    </span>
                    <span className="px-2 py-0.5 rounded-md bg-emerald-500/10 text-emerald-400 text-[10px] font-bold border border-emerald-500/20">
                      Yayında
                    </span>
                  </div>

                  <div className="space-y-1">
                    <h3 className="font-bold text-white text-base leading-snug line-clamp-1">{c.title}</h3>
                    <p className="text-xs text-gray-400">Ürün: <span className="text-white font-semibold">{c.product_name}</span></p>
                  </div>

                  <div className="pt-3 border-t border-white/10 flex items-center justify-between text-xs">
                    <div>
                      <div className="text-gray-400 text-[10px]">Ödül veya Bütçe</div>
                      <div className="font-bold text-emerald-400">{c.cash_amount} ₺ / Yayıncı</div>
                    </div>
                    <div className="text-right">
                      <div className="text-gray-400 text-[10px]">Kota</div>
                      <div className="font-bold text-white">{c.max_creators} Influencer</div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {/* Tab 2: Başvurular, Görsel Kargo Zaman Çizelgesi ve Mesajlaşma */}
      {activeTab === "applications" && (
        <div className="space-y-6">
          <h2 className="text-xl font-bold text-white">Gelen Başvurular, Canlı Kargo Takibi & Brief Mesajları</h2>

          {loading ? (
            <div className="text-center py-12 text-gray-500 text-xs">Yükleniyor...</div>
          ) : applications.length === 0 ? (
            <div className="text-center py-12 bg-black/60 rounded-2xl border border-white/10 text-xs text-gray-400">
              Henüz gelen başvuru bulunmuyor.
            </div>
          ) : (
            <div className="space-y-4">
              {applications.map((app) => (
                <div key={app.id} className="ee-card p-5 rounded-2xl space-y-4 border border-white/10">
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-white/10 pb-3">
                    <div>
                      <div className="flex items-center gap-2">
                        <span className="font-bold text-white text-base">{app.creator_name}</span>
                        <span className="text-xs text-[#c793ff]">{app.creator_handle}</span>
                      </div>
                      <div className="text-xs text-gray-400 mt-0.5">
                        Kampanya: <span className="text-white font-semibold">{app.campaign?.title}</span> ({app.campaign?.product_name})
                      </div>
                    </div>

                    <div className="flex items-center gap-2">
                      <button
                        onClick={() => setSelectedAppForChat(app)}
                        className="px-3.5 py-1.5 rounded-xl bg-white/10 hover:bg-white/20 text-[#c793ff] hover:text-white border border-white/10 text-xs font-bold transition-colors flex items-center gap-1.5"
                      >
                        <MessageSquare className="w-3.5 h-3.5" />
                        <span>Brief ve Mesaj</span>
                      </button>

                      {app.status === "pending" && (
                        <>
                          <button
                            onClick={() => handleUpdateStatus(app.id, "accepted")}
                            className="px-3.5 py-1.5 rounded-xl bg-emerald-600/20 text-emerald-300 hover:bg-emerald-600 hover:text-white font-bold text-xs transition-colors"
                          >
                            Kabul Et
                          </button>
                          <button
                            onClick={() => handleUpdateStatus(app.id, "rejected")}
                            className="px-3.5 py-1.5 rounded-xl bg-red-600/20 text-red-400 hover:bg-red-600 hover:text-white font-bold text-xs transition-colors"
                          >
                            Reddet
                          </button>
                        </>
                      )}

                      {app.status === "accepted" && (
                        <button
                          onClick={() => setSelectedAppForCargo(app)}
                          className="px-3.5 py-1.5 rounded-xl bg-[#9541e0]/20 text-[#c793ff] hover:bg-[#9541e0] hover:text-white border border-[#9541e0]/40 font-bold text-xs transition-all flex items-center gap-1"
                        >
                          <Truck className="w-3.5 h-3.5" />
                          <span>Kargo Kodu Gir</span>
                        </button>
                      )}

                      {app.status === "video_submitted" && (
                        <button
                          onClick={() => handleUpdateStatus(app.id, "approved")}
                          className="ee-btn-primary px-4 py-1.5 rounded-xl text-white font-bold text-xs transition-all"
                        >
                          Videoyu Onayla ve Öde
                        </button>
                      )}
                    </div>
                  </div>

                  {/* Feature 4: Visual Parcel Tracking Progress Timeline */}
                  <div className="bg-black p-4 rounded-xl border border-white/10 space-y-2">
                    <div className="text-xs font-bold text-gray-300 flex items-center justify-between">
                      <span className="flex items-center gap-1.5">
                        <PackageCheck className="w-4 h-4 text-[#c793ff]" />
                        Canlı Kargo ve Teslimat Zaman Çizelgesi
                      </span>
                      <span className="text-[11px] text-[#c793ff]">
                        {app.cargo_tracking_code ? `${app.cargo_company}: ${app.cargo_tracking_code}` : "Takip Kodu Bekleniyor"}
                      </span>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-5 gap-2 text-center text-xs pt-2">
                      <div className={`p-2.5 rounded-xl border ${app.status !== "rejected" ? "border-[#9541e0]/40 bg-[#9541e0]/20 text-[#c793ff]" : "bg-black border-white/10 text-gray-500"}`}>
                        <div className="font-bold">1. Onaylandı</div>
                        <div className="text-[10px] opacity-75 mt-0.5">Hazırlanıyor</div>
                      </div>

                      <div className={`p-2.5 rounded-xl border ${["shipped", "video_submitted", "approved"].includes(app.status) ? "border-blue-500/40 bg-blue-500/20 text-blue-300" : "bg-black border-white/10 text-gray-500"}`}>
                        <div className="font-bold">2. Kargoya Verildi</div>
                        <div className="text-[10px] opacity-75 mt-0.5">Yolda</div>
                      </div>

                      <div className={`p-2.5 rounded-xl border ${["shipped", "video_submitted", "approved"].includes(app.status) ? "border-amber-500/40 bg-amber-500/20 text-amber-300" : "bg-black border-white/10 text-gray-500"}`}>
                        <div className="font-bold">3. Dağıtımda</div>
                        <div className="text-[10px] opacity-75 mt-0.5">Teslimat Şubesi</div>
                      </div>

                      <div className={`p-2.5 rounded-xl border ${["video_submitted", "approved"].includes(app.status) ? "border-purple-500/40 bg-purple-500/20 text-purple-300" : "bg-black border-white/10 text-gray-500"}`}>
                        <div className="font-bold">4. Teslim Edildi</div>
                        <div className="text-[10px] opacity-75 mt-0.5">Adrese Ulaştı</div>
                      </div>

                      <div className={`p-2.5 rounded-xl border ${app.status === "approved" ? "border-emerald-500/40 bg-emerald-500/20 text-emerald-400 font-bold" : "bg-black border-white/10 text-gray-500"}`}>
                        <div className="font-bold">5. Video Onaylandı</div>
                        <div className="text-[10px] opacity-75 mt-0.5">Ödeme Tamam</div>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {/* Tab 3: Escrow & Fatura */}
      {activeTab === "escrow" && (
        <div className="space-y-4">
          <h2 className="text-xl font-bold text-white">Escrow Bütçe ve Fatura Geçmişiniz</h2>

          <div className="ee-card rounded-2xl p-6 space-y-6">
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <div className="p-4 bg-black rounded-xl border border-white/10 space-y-1">
                <div className="text-xs text-gray-400">Havuzda Kilitli Escrow Tutar</div>
                <div className="text-2xl font-bold text-[#c793ff]">{stats.total_budget_locked} ₺</div>
              </div>
              <div className="p-4 bg-black rounded-xl border border-white/10 space-y-1">
                <div className="text-xs text-gray-400">Serbest Bırakılan Ödemeler</div>
                <div className="text-2xl font-bold text-emerald-400">{stats.approved_videos * 750} ₺</div>
              </div>
              <div className="p-4 bg-black rounded-xl border border-white/10 space-y-1">
                <div className="text-xs text-gray-400">Kesilen Otomatik E-Fatura</div>
                <div className="text-2xl font-bold text-white">{campaigns.length} Adet</div>
              </div>
            </div>

            <div className="space-y-3 text-xs">
              <h3 className="font-bold text-white text-sm">Son Finansal İşlemler</h3>
              <div className="space-y-2">
                <div className="p-4 bg-black rounded-xl border border-white/10 flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <Wallet className="w-5 h-5 text-[#c793ff]" />
                    <div>
                      <div className="font-bold text-white">Kampanya Bütçesi Escrow Blokesi (İyzico)</div>
                      <div className="text-[10px] text-gray-400">Luxe Hyaluronic Acid Glow Serum</div>
                    </div>
                  </div>
                  <div className="text-right">
                    <div className="font-bold text-[#c793ff]">- 3.750 ₺</div>
                    <div className="text-[10px] text-emerald-400 font-semibold">Tamamlandı</div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Feature 5: Direct Brief & Chat Modal */}
      {selectedAppForChat && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="ee-card border border-white/20 rounded-2xl max-w-lg w-full p-6 space-y-4 relative">
            <button onClick={() => setSelectedAppForChat(null)} className="absolute top-4 right-4 text-gray-400 hover:text-white font-bold">✕</button>

            <div className="space-y-1">
              <div className="text-xs font-bold text-[#c793ff]">Influencer Brief ve Mesajlaşma Kanalı</div>
              <h3 className="text-lg font-bold text-white">{selectedAppForChat.creator_name} ({selectedAppForChat.creator_handle})</h3>
            </div>

            {/* Chat History Box */}
            <div className="bg-black border border-white/10 rounded-xl p-4 h-64 overflow-y-auto space-y-3 text-xs">
              {chatMessages.map((msg, idx) => (
                <div
                  key={idx}
                  className={`flex flex-col ${msg.sender === "brand" ? "items-end" : "items-start"}`}
                >
                  <div
                    className={`max-w-[80%] p-3 rounded-2xl ${
                      msg.sender === "brand"
                        ? "bg-[#9541e0] text-white rounded-br-none"
                        : "bg-white/10 text-gray-200 rounded-bl-none border border-white/10"
                    }`}
                  >
                    <p className="leading-relaxed">{msg.text}</p>
                    <span className="text-[9px] opacity-75 block text-right mt-1">{msg.time}</span>
                  </div>
                </div>
              ))}
            </div>

            {/* Send Input */}
            <form onSubmit={handleSendMessage} className="flex gap-2">
              <input
                type="text"
                value={newMessageText}
                onChange={(e) => setNewMessageText(e.target.value)}
                placeholder="Influencer'a özel brief veya mesaj yazın..."
                className="flex-1 p-3 rounded-xl bg-black border border-white/10 text-white text-xs focus:border-[#9541e0] focus:outline-none"
              />
              <button
                type="submit"
                className="ee-btn-primary px-4 py-3 rounded-xl text-white font-bold text-xs flex items-center justify-center"
              >
                <Send className="w-4 h-4" />
              </button>
            </form>
          </div>
        </div>
      )}

      {/* Cargo Entry Modal */}
      {selectedAppForCargo && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="ee-card border border-white/20 rounded-2xl max-w-md w-full p-6 space-y-4">
            <h3 className="text-lg font-bold text-white">Kargo Takip Bilgisi Gir</h3>
            <p className="text-xs text-gray-400">Ürünü kargoya verdiğiniz firmanın adını ve takip kodunu giriniz.</p>

            <div className="space-y-3 text-xs">
              <div>
                <label className="block text-gray-300 mb-1 font-semibold">Kargo Firması</label>
                <select
                  value={cargoCompany}
                  onChange={(e) => setCargoCompany(e.target.value)}
                  className="w-full p-3 rounded-xl bg-black border border-white/10 text-white focus:border-[#9541e0] focus:outline-none"
                >
                  <option value="Yurtiçi Kargo">Yurtiçi Kargo</option>
                  <option value="Aras Kargo">Aras Kargo</option>
                  <option value="HepsiJet">HepsiJet</option>
                  <option value="Trendyol Express">Trendyol Express</option>
                  <option value="MNG Kargo">MNG Kargo</option>
                </select>
              </div>

              <div>
                <label className="block text-gray-300 mb-1 font-semibold">Kargo Takip Kodu</label>
                <input
                  type="text"
                  value={cargoCode}
                  onChange={(e) => setCargoCode(e.target.value)}
                  placeholder="Örn: 9283019284"
                  className="w-full p-3 rounded-xl bg-black border border-white/10 text-white focus:border-[#9541e0] focus:outline-none"
                />
              </div>
            </div>

            <div className="flex gap-2 pt-2">
              <button
                onClick={() => setSelectedAppForCargo(null)}
                className="w-1/2 py-2.5 rounded-xl bg-white/10 text-white text-xs font-bold border border-white/10 hover:bg-white/20 transition-colors"
              >
                İptal
              </button>
              <button
                onClick={() => handleUpdateStatus(selectedAppForCargo.id, "shipped", { cargo_company: cargoCompany, cargo_tracking_code: cargoCode })}
                className="ee-btn-primary w-1/2 py-2.5 rounded-xl text-white text-xs font-bold transition-all"
              >
                Kaydet ve Bildir
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Create Campaign Modal */}
      {showCreateModal && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="ee-card border border-white/20 rounded-2xl max-w-xl w-full p-6 space-y-5 relative max-h-[90vh] overflow-y-auto">
            <button onClick={() => setShowCreateModal(false)} className="absolute top-4 right-4 text-gray-400 hover:text-white font-bold">✕</button>

            <h2 className="text-xl font-bold text-white">Yeni UGC Kampanyası Oluştur</h2>

            {createSuccess ? (
              <div className="p-4 bg-emerald-500/10 border border-emerald-500/30 rounded-xl text-emerald-400 text-xs font-bold text-center">
                Kampanya ve Escrow Bütçe Blokesi Başarıyla Oluşturuldu!
              </div>
            ) : (
              <form onSubmit={handleCreateCampaign} className="space-y-4 text-xs">
                <div>
                  <label className="block text-gray-300 font-semibold mb-1">Kampanya Başlığı</label>
                  <input
                    type="text"
                    required
                    value={newTitle}
                    onChange={(e) => setNewTitle(e.target.value)}
                    placeholder="Örn: Yaz Sezonu Kumaş Şort İnceleme Videosu"
                    className="w-full p-3 rounded-xl bg-black border border-white/10 text-white focus:border-[#9541e0] focus:outline-none"
                  />
                </div>

                <div>
                  <label className="block text-gray-300 font-semibold mb-1">Gönderilecek Ürün Adı</label>
                  <input
                    type="text"
                    required
                    value={newProdName}
                    onChange={(e) => setNewProdName(e.target.value)}
                    placeholder="Örn: Luxe Summer Linen Shorts"
                    className="w-full p-3 rounded-xl bg-black border border-white/10 text-white focus:border-[#9541e0] focus:outline-none"
                  />
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-gray-300 font-semibold mb-1">Kategori</label>
                    <select
                      value={newCategory}
                      onChange={(e) => setNewCategory(e.target.value)}
                      className="w-full p-3 rounded-xl bg-black border border-white/10 text-white focus:border-[#9541e0] focus:outline-none"
                    >
                      <option value="Kozmetik">Kozmetik</option>
                      <option value="Moda">Moda</option>
                      <option value="Teknoloji">Teknoloji</option>
                      <option value="Gıda">Gıda</option>
                      <option value="Lifestyle">Lifestyle</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-gray-300 font-semibold mb-1">Influencer Başı Nakit Ödül (₺)</label>
                    <input
                      type="number"
                      value={newCashAmount}
                      onChange={(e) => setNewCashAmount(Number(e.target.value))}
                      className="w-full p-3 rounded-xl bg-black border border-white/10 text-white focus:border-[#9541e0] focus:outline-none"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-gray-300 font-semibold mb-1">Kampanya Açıklaması ve Brief</label>
                  <textarea
                    rows={3}
                    required
                    value={newDesc}
                    onChange={(e) => setNewDesc(e.target.value)}
                    placeholder="Influencer'ların videoda vurgulamasını istediğiniz noktalar..."
                    className="w-full p-3 rounded-xl bg-black border border-white/10 text-white focus:border-[#9541e0] focus:outline-none"
                  />
                </div>

                <button
                  type="submit"
                  className="ee-btn-primary w-full py-3.5 rounded-xl text-white font-bold text-xs transition-all"
                >
                  Kampanyayı Yayınla ve Bütçeyi Kilitle
                </button>
              </form>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
