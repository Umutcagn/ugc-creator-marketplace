"use client";

import { useState, useEffect } from "react";
import { Video, Wallet, Clock, CheckCircle2, Upload, ArrowUpRight, Layers, CreditCard, Check, MessageSquare, Send, PackageCheck } from "lucide-react";
import { API_BASE_URL } from "@/lib/api";

interface Stats {
  total_applications: number;
  accepted_campaigns: number;
  approved_videos: number;
  total_earned_tl: number;
}

interface ApplicationItem {
  id: number;
  campaign_id: number;
  status: string;
  cargo_company?: string;
  cargo_tracking_code?: string;
  video_url?: string;
  campaign?: {
    title: string;
    brand_name: string;
    product_name: string;
    cash_amount: number;
  };
}

export default function CreatorDashboard() {
  const [activeTab, setActiveTab] = useState<"applications" | "videos" | "wallet">("applications");

  const [stats, setStats] = useState<Stats>({ total_applications: 0, accepted_campaigns: 0, approved_videos: 0, total_earned_tl: 0 });
  const [applications, setApplications] = useState<ApplicationItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedAppForUpload, setSelectedAppForUpload] = useState<ApplicationItem | null>(null);
  const [videoLink, setVideoLink] = useState("");
  const [uploadSuccess, setUploadSuccess] = useState(false);

  // Feature 5: Chat/Brief Modal State
  const [selectedAppForChat, setSelectedAppForChat] = useState<ApplicationItem | null>(null);
  const [chatMessages, setChatMessages] = useState<Array<{ sender: string; text: string; time: string }>>([
    { sender: "brand", text: "Merhaba! Başvurunuz kabul edildi. Lütfen videoda ürün kullanım anını yakın planda gösteriniz.", time: "14:20" },
    { sender: "creator", text: "Mesajınız için teşekkürler! Kargo ulaşır ulaşmaz önerdiğiniz konseptte hazırlayacağım.", time: "14:25" }
  ]);
  const [newMessageText, setNewMessageText] = useState("");

  // IBAN payout form state
  const [ibanName, setIbanName] = useState("Selin Yılmaz");
  const [ibanNo, setIbanNo] = useState("TR680006200000000192830192");
  const [bankName, setBankName] = useState("Garanti BBVA");
  const [withdrawSuccess, setWithdrawSuccess] = useState(false);

  useEffect(() => {
    fetchCreatorData();
  }, []);

  const fetchCreatorData = async () => {
    setLoading(true);
    const token = localStorage.getItem("ugc_token");
    if (!token) return;

    try {
      const statsRes = await fetch(`${API_BASE_URL}/api/stats`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      if (statsRes.ok) setStats(await statsRes.json());

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

  const handleUploadVideo = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedAppForUpload) return;
    const token = localStorage.getItem("ugc_token");
    if (!token) return;

    try {
      const res = await fetch(`${API_BASE_URL}/api/applications/${selectedAppForUpload.id}/status`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`
        },
        body: JSON.stringify({
          status: "video_submitted",
          video_url: videoLink || "https://cdn.ugcmarketplace.tr/videos/sample_reels.mp4"
        })
      });

      if (res.ok) {
        setUploadSuccess(true);
        setTimeout(() => {
          setSelectedAppForUpload(null);
          setUploadSuccess(false);
          setVideoLink("");
          fetchCreatorData();
        }, 1200);
      }
    } catch (e) {
      console.error(e);
    }
  };

  const handleSendMessage = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newMessageText.trim()) return;

    const newMsg = {
      sender: "creator",
      text: newMessageText,
      time: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })
    };

    setChatMessages((prev) => [...prev, newMsg]);
    setNewMessageText("");
  };

  const handleWithdraw = (e: React.FormEvent) => {
    e.preventDefault();
    setWithdrawSuccess(true);
    setTimeout(() => setWithdrawSuccess(false), 3000);
  };

  const submittedVideos = applications.filter((a) => a.video_url || ["video_submitted", "approved"].includes(a.status));

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-8 font-serif text-white bg-black">
      {/* Header Bar */}
      <div className="border-b border-white/10 pb-6">
        <h1 className="text-2xl sm:text-3xl font-bold text-white">İçerik Üretici Paneli</h1>
        <p className="text-xs text-gray-400 mt-1">Başvurularınızı, kargo takip kodlarınızı ve yüklediğiniz UGC videoları takip edin.</p>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <div className="ee-card p-4 rounded-2xl space-y-2">
          <div className="text-xs text-gray-400 font-semibold flex items-center justify-between">
            <span>Toplam Başvurularım</span>
            <Clock className="w-4 h-4 text-[#c793ff]" />
          </div>
          <div className="text-2xl font-bold text-white">{stats.total_applications}</div>
        </div>

        <div className="ee-card p-4 rounded-2xl space-y-2">
          <div className="text-xs text-gray-400 font-semibold flex items-center justify-between">
            <span>Kabul Edilen Kampanyalar</span>
            <CheckCircle2 className="w-4 h-4 text-blue-400" />
          </div>
          <div className="text-2xl font-bold text-blue-400">{stats.accepted_campaigns}</div>
        </div>

        <div className="ee-card p-4 rounded-2xl space-y-2">
          <div className="text-xs text-gray-400 font-semibold flex items-center justify-between">
            <span>Onaylanan Videolarım</span>
            <Video className="w-4 h-4 text-emerald-400" />
          </div>
          <div className="text-2xl font-bold text-emerald-400">{stats.approved_videos}</div>
        </div>

        <div className="ee-card p-4 rounded-2xl space-y-2">
          <div className="text-xs text-gray-400 font-semibold flex items-center justify-between">
            <span>Kazandığım Toplam Bakiye</span>
            <Wallet className="w-4 h-4 text-emerald-400" />
          </div>
          <div className="text-2xl font-bold text-emerald-400">{stats.total_earned_tl} ₺</div>
        </div>
      </div>

      {/* Navigation Tabs */}
      <div className="flex bg-black p-1 rounded-xl border border-white/10 text-xs font-bold max-w-xl">
        <button
          onClick={() => setActiveTab("applications")}
          className={`flex-1 py-2 rounded-lg transition-colors flex items-center justify-center gap-2 ${
            activeTab === "applications" ? "ee-btn-primary text-white" : "text-gray-400 hover:text-white"
          }`}
        >
          <Layers className="w-4 h-4" />
          <span>Başvurularım ve Kargo ({applications.length})</span>
        </button>

        <button
          onClick={() => setActiveTab("videos")}
          className={`flex-1 py-2 rounded-lg transition-colors flex items-center justify-center gap-2 ${
            activeTab === "videos" ? "ee-btn-primary text-white" : "text-gray-400 hover:text-white"
          }`}
        >
          <Video className="w-4 h-4" />
          <span>Videolarım ({submittedVideos.length})</span>
        </button>

        <button
          onClick={() => setActiveTab("wallet")}
          className={`flex-1 py-2 rounded-lg transition-colors flex items-center justify-center gap-2 ${
            activeTab === "wallet" ? "ee-btn-primary text-white" : "text-gray-400 hover:text-white"
          }`}
        >
          <Wallet className="w-4 h-4" />
          <span>Cüzdanım ve IBAN</span>
        </button>
      </div>

      {/* Tab 1: Başvurularım & Kargo Takip */}
      {activeTab === "applications" && (
        <div className="space-y-4">
          <h2 className="text-xl font-bold text-white">Aktif Başvurularım ve Süreç</h2>

          {loading ? (
            <div className="text-center py-12 text-gray-500 text-xs">Yükleniyor...</div>
          ) : applications.length === 0 ? (
            <div className="text-center py-12 bg-black/60 rounded-2xl border border-white/10 text-xs text-gray-400">
              Henüz hiçbir kampanyaya başvurmadınız. <a href="/campaigns" className="text-[#c793ff] font-bold hover:underline">Kampanyaları İncele &rarr;</a>
            </div>
          ) : (
            <div className="space-y-4">
              {applications.map((app) => (
                <div key={app.id} className="ee-card p-5 rounded-2xl space-y-5">
                  {/* Header Info */}
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-white/10 pb-3">
                    <div>
                      <span className="text-[10px] font-bold text-[#c793ff] uppercase tracking-wider">{app.campaign?.brand_name}</span>
                      <h3 className="text-base font-bold text-white">{app.campaign?.title}</h3>
                      <div className="text-xs text-gray-400">Gönderilecek Ürün: <span className="text-white font-semibold">{app.campaign?.product_name}</span></div>
                    </div>

                    <div className="flex items-center gap-3">
                      <button
                        onClick={() => setSelectedAppForChat(app)}
                        className="px-3.5 py-1.5 rounded-xl bg-white/10 hover:bg-white/20 text-[#c793ff] hover:text-white border border-white/10 text-xs font-bold transition-colors flex items-center gap-1.5"
                      >
                        <MessageSquare className="w-3.5 h-3.5" />
                        <span>Markaya Mesaj</span>
                      </button>

                      <div className="text-right">
                        <div className="text-xs text-gray-400">Hak Ediş Ödülü</div>
                        <div className="text-base font-bold text-emerald-400">
                          {app.campaign?.cash_amount ? `${app.campaign.cash_amount} ₺ + Hediye` : "Hediye Ürün"}
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Feature 4: Visual Parcel Tracking Progress Timeline */}
                  <div className="bg-black p-4 rounded-xl border border-white/10 space-y-2">
                    <div className="text-xs font-bold text-gray-300 flex items-center justify-between">
                      <span className="flex items-center gap-1.5">
                        <PackageCheck className="w-4 h-4 text-[#c793ff]" />
                        Canlı Kargo ve Teslimat Durumu
                      </span>
                      <span className="text-[11px] text-[#c793ff]">
                        {app.cargo_tracking_code ? `${app.cargo_company}: ${app.cargo_tracking_code}` : "Takip Kodu Bekleniyor"}
                      </span>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-5 gap-2 text-center text-xs pt-1">
                      <div className={`p-2.5 rounded-xl border ${app.status !== "rejected" ? "border-[#9541e0]/40 bg-[#9541e0]/20 text-[#c793ff]" : "bg-black border-white/10 text-gray-500"}`}>
                        <div className="font-bold">1. Başvuruldu</div>
                        <div className="text-[10px] opacity-75 mt-0.5">Onay Bekleniyor</div>
                      </div>

                      <div className={`p-2.5 rounded-xl border ${["accepted", "shipped", "video_submitted", "approved"].includes(app.status) ? "border-blue-500/40 bg-blue-500/20 text-blue-300" : "bg-black border-white/10 text-gray-500"}`}>
                        <div className="font-bold">2. Kabul Edildi</div>
                        <div className="text-[10px] opacity-75 mt-0.5">Kargo Hazırlanıyor</div>
                      </div>

                      <div className={`p-2.5 rounded-xl border ${["shipped", "video_submitted", "approved"].includes(app.status) ? "border-[#9541e0]/40 bg-[#9541e0]/20 text-[#c793ff]" : "bg-black border-white/10 text-gray-500"}`}>
                        <div className="font-bold">3. Ürün Kargoda</div>
                        <div className="text-[10px] opacity-75 mt-0.5">{app.cargo_tracking_code ? `${app.cargo_company}: ${app.cargo_tracking_code}` : "Takip Kodu"}</div>
                      </div>

                      <div className={`p-2.5 rounded-xl border ${["video_submitted", "approved"].includes(app.status) ? "border-amber-500/40 bg-amber-500/20 text-amber-300" : "bg-black border-white/10 text-gray-500"}`}>
                        <div className="font-bold">4. UGC Video</div>
                        <div className="text-[10px] opacity-75 mt-0.5">{app.video_url ? "Yüklendi" : "Bekleniyor"}</div>
                      </div>

                      <div className={`p-2.5 rounded-xl border ${app.status === "approved" ? "border-emerald-500/40 bg-emerald-500/20 text-emerald-400 font-bold" : "bg-black border-white/10 text-gray-500"}`}>
                        <div className="font-bold">5. Tamamlandı</div>
                        <div className="text-[10px] opacity-75 mt-0.5">Ödeme Cüzdanda</div>
                      </div>
                    </div>
                  </div>

                  {/* Upload Video Button */}
                  {["shipped", "accepted"].includes(app.status) && (
                    <div className="pt-2 flex justify-end">
                      <button
                        onClick={() => setSelectedAppForUpload(app)}
                        className="ee-btn-primary px-4 py-2 rounded-xl text-white font-bold text-xs transition-all flex items-center gap-1.5"
                      >
                        <Upload className="w-4 h-4" />
                        <span>UGC Video Yükle veya Link Gönder</span>
                      </button>
                    </div>
                  )}
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {/* Tab 2: Yüklenen Videolarım */}
      {activeTab === "videos" && (
        <div className="space-y-4">
          <h2 className="text-xl font-bold text-white">Yüklediğiniz UGC İçerikler</h2>

          {submittedVideos.length === 0 ? (
            <div className="text-center py-12 bg-black/60 rounded-2xl border border-white/10 text-xs text-gray-400">
              Henüz yüklediğiniz bir UGC videosu bulunmuyor. Kargonuz ulaştığında buradan video yükleyebilirsiniz.
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {submittedVideos.map((app) => (
                <div key={app.id} className="ee-card p-5 rounded-2xl space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-bold text-[#c793ff]">{app.campaign?.brand_name}</span>
                    <span className={`px-2.5 py-0.5 rounded-md text-[10px] font-bold border ${app.status === "approved" ? "bg-emerald-500/10 text-emerald-400 border-emerald-500/20" : "bg-amber-500/10 text-amber-400 border-amber-500/20"}`}>
                      {app.status === "approved" ? "Onaylandı ve Ödendi" : "Marka İncelemesinde"}
                    </span>
                  </div>

                  <div className="space-y-1">
                    <h3 className="font-bold text-white text-sm">{app.campaign?.title}</h3>
                    <p className="text-xs text-gray-400">Ürün: {app.campaign?.product_name}</p>
                  </div>

                  {app.video_url && (
                    <a
                      href={app.video_url}
                      target="_blank"
                      rel="noreferrer"
                      className="p-3 bg-black rounded-xl border border-white/10 flex items-center justify-between text-xs text-[#c793ff] font-bold hover:underline"
                    >
                      <span className="flex items-center gap-2">Yüklenen Video Bağlantısı</span>
                      <ArrowUpRight className="w-4 h-4" />
                    </a>
                  )}
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {/* Tab 3: Cüzdanım & IBAN */}
      {activeTab === "wallet" && (
        <div className="space-y-6">
          <h2 className="text-xl font-bold text-white">Cüzdan Bakiyeniz ve Banka Hesabınız</h2>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {/* Balance Card */}
            <div className="p-6 rounded-2xl ee-card-glow text-white space-y-4">
              <div className="text-xs text-gray-300 font-semibold flex items-center justify-between">
                <span>Çekilebilir Bakiye</span>
                <Wallet className="w-5 h-5 text-emerald-400" />
              </div>
              <div className="text-3xl font-bold text-white">{stats.total_earned_tl} ₺</div>
              <div className="text-[10px] text-[#c793ff]">Minimum Çekim Tutar: 250 ₺ (Komisyonsuz EFT)</div>
            </div>

            {/* IBAN Form */}
            <div className="md:col-span-2 p-6 ee-card border border-white/10 rounded-2xl space-y-4">
              <h3 className="text-sm font-bold text-white flex items-center gap-2">
                <CreditCard className="w-4 h-4 text-[#c793ff]" />
                <span>Banka ve IBAN Bilgileriniz</span>
              </h3>

              {withdrawSuccess && (
                <div className="p-3 bg-emerald-500/10 border border-emerald-500/30 rounded-xl text-emerald-400 text-xs font-bold flex items-center gap-2">
                  <Check className="w-4 h-4 text-emerald-400" />
                  <span>Para çekim talebiniz alındı! Bakiyeniz en geç 24 saat içinde hesabınıza aktarılacaktır.</span>
                </div>
              )}

              <form onSubmit={handleWithdraw} className="space-y-3 text-xs">
                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block text-gray-300 mb-1 font-semibold">Hesap Sahibi Adı</label>
                    <input
                      type="text"
                      required
                      value={ibanName}
                      onChange={(e) => setIbanName(e.target.value)}
                      className="w-full p-3 rounded-xl bg-black border border-white/10 text-white focus:border-[#9541e0] focus:outline-none"
                    />
                  </div>

                  <div>
                    <label className="block text-gray-300 mb-1 font-semibold">Banka Adı</label>
                    <input
                      type="text"
                      required
                      value={bankName}
                      onChange={(e) => setBankName(e.target.value)}
                      className="w-full p-3 rounded-xl bg-black border border-white/10 text-white focus:border-[#9541e0] focus:outline-none"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-gray-300 mb-1 font-semibold">IBAN Numarası</label>
                  <input
                    type="text"
                    required
                    value={ibanNo}
                    onChange={(e) => setIbanNo(e.target.value)}
                    className="w-full p-3 rounded-xl bg-black border border-white/10 text-white font-mono focus:border-[#9541e0] focus:outline-none"
                  />
                </div>

                <button
                  type="submit"
                  disabled={stats.total_earned_tl <= 0}
                  className="ee-btn-primary px-6 py-2.5 rounded-xl disabled:opacity-50 text-white font-bold text-xs transition-all"
                >
                  Bakiyeyi IBAN Hesabıma Aktar ({stats.total_earned_tl} ₺)
                </button>
              </form>
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
              <div className="text-xs font-bold text-[#c793ff]">Marka İletişim & Brief Kanalı</div>
              <h3 className="text-lg font-bold text-white">{selectedAppForChat.campaign?.brand_name} ({selectedAppForChat.campaign?.title})</h3>
            </div>

            {/* Chat History Box */}
            <div className="bg-black border border-white/10 rounded-xl p-4 h-64 overflow-y-auto space-y-3 text-xs">
              {chatMessages.map((msg, idx) => (
                <div
                  key={idx}
                  className={`flex flex-col ${msg.sender === "creator" ? "items-end" : "items-start"}`}
                >
                  <div
                    className={`max-w-[80%] p-3 rounded-2xl ${
                      msg.sender === "creator"
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
                placeholder="Markaya mesaj yazın..."
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

      {/* Upload Video Modal */}
      {selectedAppForUpload && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="ee-card border border-white/20 rounded-2xl max-w-md w-full p-6 space-y-4">
            <h3 className="text-lg font-bold text-white">UGC Videonu Gönder</h3>
            <p className="text-xs text-gray-400">Ürünle çektiğin 9:16 dikey Reels / TikTok video linkini veya Cloudflare R2 doğrudan yükleme linkini gir.</p>

            {uploadSuccess ? (
              <div className="p-4 bg-emerald-500/10 border border-emerald-500/30 rounded-xl text-emerald-400 text-xs font-bold text-center">
                Videonuz Başarıyla İletildi! Marka İnceledikten Sonra Hak Edişiniz Aktarılacaktır.
              </div>
            ) : (
              <form onSubmit={handleUploadVideo} className="space-y-4 text-xs">
                <div>
                  <label className="block text-gray-300 font-semibold mb-1">Video Linki (Drive / Cloudflare R2 / Reels Linki)</label>
                  <input
                    type="url"
                    required
                    value={videoLink}
                    onChange={(e) => setVideoLink(e.target.value)}
                    placeholder="https://instagram.com/reels/..."
                    className="w-full p-3 rounded-xl bg-black border border-white/10 text-white focus:border-[#9541e0] focus:outline-none"
                  />
                </div>

                <div className="flex gap-2">
                  <button
                    type="button"
                    onClick={() => setSelectedAppForUpload(null)}
                    className="w-1/2 py-2.5 rounded-xl bg-white/10 text-white font-bold border border-white/10 hover:bg-white/20 transition-colors"
                  >
                    İptal
                  </button>
                  <button
                    type="submit"
                    className="ee-btn-primary w-1/2 py-2.5 rounded-xl text-white font-bold transition-all"
                  >
                    Gönder
                  </button>
                </div>
              </form>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
