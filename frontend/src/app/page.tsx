"use client";

import Link from "next/link";
import { useState } from "react";
import { Sparkles, ArrowRight, Play, ShieldCheck, Truck, Video, Award, ChevronDown, ChevronUp, Flame, Heart, Eye, Check, Signal, Users, X, Volume2, VolumeX, Star, Zap, DollarSign, ArrowUpRight, TrendingUp } from "lucide-react";

export default function Home() {
  const [openFaq, setOpenFaq] = useState<number | null>(0);
  const [calculatorBudget, setCalculatorBudget] = useState(7500);
  
  // Video Modal State
  const [activeVideoModal, setActiveVideoModal] = useState<typeof sampleVideos[0] | null>(null);
  const [isMuted, setIsMuted] = useState(true);

  const brandLogos = [
    "Trendyol", "Shopify", "Hepsiburada", "Amazon TR", "WooCommerce", 
    "N11", "Boyner", "DeFacto", "LC Waikiki", "Koton", "Morhipo", "Çiçeksepeti"
  ];

  const sampleVideos = [
    {
      brand: "LuxeCosmetics",
      product: "Hyaluronic Glow Serum",
      creator: "@selin.style",
      views: "34.2K",
      likes: "4.8K",
      roas: "5.4x ROAS",
      image: "https://images.unsplash.com/photo-1620916566398-39f1143ab7be?w=500&q=80",
      avatar: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=100&q=80",
      videoUrl: "https://assets.mixkit.co/videos/preview/mixkit-woman-applying-skincare-cream-41557-large.mp4"
    },
    {
      brand: "Nordic Wear TR",
      product: "Heavyweight Oversize Hoodie",
      creator: "@caner.style",
      views: "28.9K",
      likes: "3.6K",
      roas: "4.8x ROAS",
      image: "https://images.unsplash.com/photo-1556905055-8f358a7a47b2?w=500&q=80",
      avatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=100&q=80",
      videoUrl: "https://assets.mixkit.co/videos/preview/mixkit-young-man-wearing-a-hoodie-standing-outdoors-42289-large.mp4"
    },
    {
      brand: "FitBites Nutrition",
      product: "Protein Peanut Butter",
      creator: "@ezgi.fit",
      views: "51.4K",
      likes: "7.2K",
      roas: "6.1x ROAS",
      image: "https://images.unsplash.com/photo-1584308666744-24d5c474f2ae?w=500&q=80",
      avatar: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=100&q=80",
      videoUrl: "https://assets.mixkit.co/videos/preview/mixkit-woman-preparing-a-healthy-smoothie-42630-large.mp4"
    }
  ];

  // Top Creators Showcase
  const topCreators = [
    {
      handle: "@selin.style",
      name: "Selin Yılmaz",
      category: "Kozmetik & Güzellik",
      followers: "42.5K",
      engagement: "%8.4",
      videosDone: 34,
      badge: "Süper Üretici",
      avatar: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=200&q=80"
    },
    {
      handle: "@caner.style",
      name: "Caner Öztürk",
      category: "Moda & Stil",
      followers: "28.1K",
      engagement: "%6.9",
      videosDone: 29,
      badge: "Hızlı Kargo",
      avatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=200&q=80"
    },
    {
      handle: "@ezgi.fit",
      name: "Ezgi Aksoy",
      category: "Gıda & Yaşam",
      followers: "54.0K",
      engagement: "%9.2",
      videosDone: 51,
      badge: "Yüksek Dönüşüm",
      avatar: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=200&q=80"
    },
    {
      handle: "@merve.tech",
      name: "Merve Kaya",
      category: "Teknoloji",
      followers: "19.8K",
      engagement: "%7.5",
      videosDone: 18,
      badge: "Star Üretici",
      avatar: "https://images.unsplash.com/photo-1517841905240-472988babdf9?w=200&q=80"
    }
  ];

  const faqs = [
    {
      q: "UGC (User Generated Content) Nedir ve Reklamlarda Neden Daha Yüksek Dönüşüm Sağlar?",
      a: "UGC, gerçek tüketicilerin ve micro-influencer'ların hediye ürününüzü denerken kendi telefonlarıyla çektiği doğal, samimi 9:16 Reels ve TikTok videolarıdır. Yapay ajans reklamlarına kıyasla izleyicide %38 daha yüksek güven uyandırır ve Meta/TikTok reklamlarında tıklama başına maliyeti (CPC) ciddi oranda düşürür."
    },
    {
      q: "Escrow Güvenli Ödeme Altyapısı Bütçemi Nasıl Korur?",
      a: "Kampanya oluşturduğunuzda bütçeniz InfMarket güvenli havuz hesabında kilitlenir. Ürün influencer'a ulaşır, içerik üreticisi videoyu çekip panelinize yükler ve siz onay verene kadar para aktarılmaz. Memnun kalınmayan durumlarda revizyon talep etme hakkınız saklıdır."
    },
    {
      q: "Kargo ve Ürün Gönderim Süreci Nasıl Yönetiliyor?",
      a: "Başvuruyu onayladığınız anda sistem üzerinde otomatik kargo bülteni oluşur. Ürünü kargoladıktan sonra kargo firması (Yurtiçi, Aras, HepsiJet vb.) ve takip kodunu panelden girersiniz. Influencer'a SMS ve WhatsApp bildirimi iletilir ve teslimat anlık takip edilebilir."
    },
    {
      q: "Üretilen UGC Videolarının Kullanım ve Reklam Hakları Kime Aittir?",
      a: "Video onaylanıp ödeme tamamlandıktan sonra 9:16 dikey videonun tüm yayın, süresiz kullanım ve Meta/TikTok sponsorlu reklam hakları tamamen markanıza devredilir."
    }
  ];

  return (
    <div className="space-y-24 pb-24 bg-[#0a0b0e] font-serif text-white">
      
      {/* Signature Hero Section */}
      <section className="relative pt-16 pb-20 overflow-hidden bg-grid-pattern border-b border-white/10">
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full max-w-7xl h-[500px] bg-gradient-to-b from-[#6366f1]/15 via-[#8b5cf6]/5 to-transparent blur-3xl pointer-events-none -z-10" />

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8 relative z-10">
          
          {/* Live System Ticker Pill */}
          <div className="flex justify-center">
            <div className="ee-pill-badge inline-flex items-center gap-2.5 px-4 py-2 rounded-full text-xs font-bold tracking-wide">
              <span className="w-2 h-2 rounded-full bg-emerald-400 animate-ping" />
              <span className="text-gray-200">Canlı İşlem Akışı:</span>
              <span className="text-[#a78bfa]">LuxeCosmetics markası 5 yeni UGC videosunu onayladı</span>
            </div>
          </div>

          {/* Main Hero Thesis Headline */}
          <div className="text-center space-y-6 max-w-4xl mx-auto">
            <h1 className="text-4xl sm:text-6xl lg:text-7xl font-bold tracking-tight text-white leading-[1.1]">
              E-Ticaret Satışlarınızı <br />
              <span className="bg-gradient-to-r from-[#8b5cf6] via-[#a78bfa] to-[#ec4899] bg-clip-text text-transparent">
                Doğal UGC Reklam Videolarıyla
              </span> Uçuşa Geçirin
            </h1>

            <p className="text-base sm:text-lg text-gray-400 max-w-2xl mx-auto leading-relaxed">
              Hediye ürün gönderin, doğrulanmış micro-influencer&apos;lar ürününüz için yüksek dönüşümlü 9:16 Reels ve TikTok içerikleri üretsin. Ajans maliyetlerini ortadan kaldırın.
            </p>

            {/* Main Primary CTA Buttons */}
            <div className="flex flex-col sm:flex-row items-center justify-center gap-4 pt-4">
              <Link
                href="/login?tab=register&role=brand"
                className="ee-btn-primary w-full sm:w-auto px-9 py-4 text-sm font-bold text-white rounded-2xl flex items-center justify-center gap-2.5 group cursor-pointer"
              >
                <span>Marka Olarak Kampanya Başlat</span>
                <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
              </Link>

              <Link
                href="/campaigns"
                className="w-full sm:w-auto px-8 py-4 text-sm font-semibold text-gray-200 bg-white/5 hover:bg-white/10 border border-white/15 rounded-2xl transition-all flex items-center justify-center gap-2 cursor-pointer"
              >
                <Video className="w-4 h-4 text-[#a78bfa]" />
                <span>Aktif Kampanyaları İncele</span>
              </Link>
            </div>
          </div>

          {/* Verified Guarantee Markers */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 max-w-3xl mx-auto pt-6 text-xs font-semibold text-gray-300">
            <div className="p-3.5 rounded-xl bg-[#12141c]/60 border border-white/10 flex items-center justify-center gap-2.5">
              <Check className="w-4 h-4 text-emerald-400 shrink-0" />
              <span>+850 Doğrulanmış Micro-Influencer</span>
            </div>
            <div className="p-3.5 rounded-xl bg-[#12141c]/60 border border-white/10 flex items-center justify-center gap-2.5">
              <ShieldCheck className="w-4 h-4 text-[#a78bfa] shrink-0" />
              <span>%100 Escrow Güvenli Ödeme Koruması</span>
            </div>
            <div className="p-3.5 rounded-xl bg-[#12141c]/60 border border-white/10 flex items-center justify-center gap-2.5">
              <TrendingUp className="w-4 h-4 text-emerald-400 shrink-0" />
              <span>Ortalama 4.8x Reklam ROAS Artışı</span>
            </div>
          </div>
        </div>
      </section>

      {/* Brand Logos Marquee Strip */}
      <section className="border-y border-white/10 bg-[#0c0d12] py-6 overflow-hidden relative">
        <div className="absolute left-0 top-0 bottom-0 w-24 bg-gradient-to-r from-[#0a0b0e] to-transparent z-10 pointer-events-none" />
        <div className="absolute right-0 top-0 bottom-0 w-24 bg-gradient-to-l from-[#0a0b0e] to-transparent z-10 pointer-events-none" />

        <div className="max-w-7xl mx-auto px-4 mb-3 text-center">
          <p className="text-[11px] font-bold uppercase tracking-widest text-[#a78bfa]">
            1.000+ E-Ticaret Markası ve Mağazası Tarafından Tercih Ediliyor
          </p>
        </div>

        <div className="flex items-center overflow-hidden">
          <div className="animate-marquee flex items-center gap-12 sm:gap-16">
            {[...brandLogos, ...brandLogos].map((logo, idx) => (
              <div
                key={idx}
                className="flex items-center gap-2 text-sm sm:text-base font-bold text-gray-400 hover:text-white transition-colors cursor-pointer whitespace-nowrap"
              >
                <div className="w-2 h-2 rounded-full bg-[#8b5cf6]" />
                <span>{logo}</span>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Signature Element: Interactive 9:16 Video Showcase */}
      <section className="relative max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="ee-card-glow rounded-3xl p-4 sm:p-6 space-y-6">
          
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 px-4 py-3 bg-[#0a0b0e]/80 border border-white/10 rounded-2xl text-xs font-bold text-white">
            <span className="flex items-center gap-2.5">
              <span className="w-2.5 h-2.5 rounded-full bg-[#8b5cf6] animate-ping" />
              <span>InfMarket Canlı UGC Video Akışı (Önizlemek İçin Videoya Tıklayın)</span>
            </span>
            <span className="text-[#a78bfa] font-mono text-[11px]">9:16 Reels / TikTok Vitrini</span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
            {sampleVideos.map((item, idx) => (
              <div
                key={idx}
                onClick={() => setActiveVideoModal(item)}
                className="group relative rounded-2xl overflow-hidden bg-[#0c0d12] border border-white/10 cursor-pointer hover:border-[#8b5cf6] transition-all duration-300 shadow-xl"
              >
                <div className="relative aspect-[9/16] overflow-hidden bg-slate-900">
                  <img src={item.image} alt={item.product} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/20 to-transparent" />
                  
                  {/* Play Button Overlay */}
                  <div className="absolute inset-0 flex items-center justify-center">
                    <div className="w-14 h-14 rounded-full bg-[#8b5cf6]/90 text-white flex items-center justify-center border border-white/20 shadow-lg shadow-[#8b5cf6]/50 group-hover:scale-110 transition-transform">
                      <Play className="w-6 h-6 fill-white ml-0.5" />
                    </div>
                  </div>

                  {/* Top Badges */}
                  <div className="absolute top-3 left-3 right-3 flex items-center justify-between">
                    <span className="px-2.5 py-1 rounded-lg bg-black/75 backdrop-blur-md text-[11px] font-bold text-white border border-white/10">
                      {item.brand}
                    </span>
                    <span className="px-2.5 py-1 rounded-lg bg-emerald-600/90 text-[11px] font-bold text-white flex items-center gap-1 shadow-md">
                      <TrendingUp className="w-3 h-3 text-white" />
                      {item.roas}
                    </span>
                  </div>

                  {/* Bottom Creator Bar */}
                  <div className="absolute bottom-3 left-3 right-3">
                    <div className="flex items-center justify-between bg-black/85 backdrop-blur-md p-3 rounded-xl border border-white/10">
                      <div className="flex items-center gap-2.5">
                        <img src={item.avatar} alt={item.creator} className="w-8 h-8 rounded-full border border-[#a78bfa]" />
                        <div>
                          <div className="text-xs font-bold text-white">{item.creator}</div>
                          <div className="text-[10px] text-gray-400 line-clamp-1">{item.product}</div>
                        </div>
                      </div>
                      <div className="flex items-center gap-1 text-[11px] font-bold text-[#a78bfa]">
                        <Eye className="w-3.5 h-3.5" />
                        {item.views}
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Top Performing Micro Influencers */}
      <section id="creators" className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 border-b border-white/10 pb-4">
          <div>
            <div className="text-[#a78bfa] font-bold text-xs uppercase tracking-wider flex items-center gap-1.5 mb-1">
              <Star className="w-4 h-4 text-amber-400 fill-amber-400" />
              Doğrulanmış İçerik Üreticileri
            </div>
            <h2 className="text-2xl sm:text-4xl font-bold text-white">Yüksek Dönüşümlü Micro-Influencer Vitrini</h2>
          </div>
          <Link href="/login?tab=register&role=creator" className="text-xs font-bold text-[#a78bfa] hover:underline flex items-center gap-1">
            İçerik Üretici Başvurusu Yap &rarr;
          </Link>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {topCreators.map((c, idx) => (
            <div key={idx} className="ee-card p-5 rounded-2xl space-y-4 hover:border-[#8b5cf6]/60 transition-all duration-300 group">
              <div className="flex items-center gap-3">
                <img src={c.avatar} alt={c.name} className="w-12 h-12 rounded-full border-2 border-[#8b5cf6] object-cover" />
                <div>
                  <div className="text-sm font-bold text-white group-hover:text-[#a78bfa] transition-colors">{c.name}</div>
                  <div className="text-[11px] text-gray-400">{c.handle}</div>
                </div>
              </div>

              <div className="flex items-center justify-between text-xs pt-1 border-t border-white/10">
                <span className="px-2.5 py-0.5 rounded-md border border-[#8b5cf6]/40 bg-[#8b5cf6]/15 text-[#a78bfa] text-[10px] font-bold">
                  {c.badge}
                </span>
                <span className="text-[11px] text-gray-400">{c.category}</span>
              </div>

              <div className="grid grid-cols-2 gap-2 text-center text-xs bg-[#0a0b0e] p-3 rounded-xl border border-white/10">
                <div>
                  <div className="text-[10px] text-gray-500">Takipçi</div>
                  <div className="font-bold text-white mt-0.5">{c.followers}</div>
                </div>
                <div>
                  <div className="text-[10px] text-gray-500">Etkileşim</div>
                  <div className="font-bold text-emerald-400 mt-0.5">{c.engagement}</div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* ROI & Campaign Budget Calculator */}
      <section id="brands" className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
        <div className="p-8 sm:p-10 rounded-3xl ee-card space-y-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-10 items-center">
            <div className="space-y-4">
              <span className="px-3 py-1 rounded-md border border-[#8b5cf6]/40 bg-[#8b5cf6]/15 text-[#a78bfa] text-xs font-bold uppercase tracking-wider">
                Marka Avantajları & ROAS Simülatörü
              </span>
              <h2 className="text-3xl sm:text-4xl font-bold text-white">Neden UGC Reklam Videoları?</h2>
              <p className="text-gray-300 text-xs sm:text-sm leading-relaxed">
                Tüketiciler artık stüdyo ajans reklamlarına inanmıyor. Gerçek insan deneyimini yansıtan samimi 9:16 Reels videoları, Trendyol ve Shopify mağaza dönüşümlerinizi ortalama %40 artırır.
              </p>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2">
                <div className="p-4 rounded-xl bg-[#0a0b0e] border border-white/10 space-y-1">
                  <ShieldCheck className="w-5 h-5 text-[#a78bfa]" />
                  <div className="font-bold text-white text-xs">Escrow Koruması</div>
                  <div className="text-[11px] text-gray-400">Siz videoyu onaylamadan ödeme aktarılmaz.</div>
                </div>

                <div className="p-4 rounded-xl bg-[#0a0b0e] border border-white/10 space-y-1">
                  <Truck className="w-5 h-5 text-emerald-400" />
                  <div className="font-bold text-white text-xs">Canlı Kargo Takibi</div>
                  <div className="text-[11px] text-gray-400">Ürün kargo teslimatı adım adım izlenir.</div>
                </div>
              </div>
            </div>

            {/* Interactive ROI Calculator Box */}
            <div className="p-6 rounded-2xl bg-[#0a0b0e] border border-white/15 space-y-5">
              <div className="flex items-center justify-between text-xs text-gray-300 font-bold">
                <span>Tahmini Kampanya Bütçeniz:</span>
                <span className="text-[#a78bfa] text-xl font-mono font-bold">{calculatorBudget.toLocaleString()} ₺</span>
              </div>

              <input
                type="range"
                min={2500}
                max={50000}
                step={2500}
                value={calculatorBudget}
                onChange={(e) => setCalculatorBudget(Number(e.target.value))}
                className="w-full accent-[#8b5cf6] cursor-pointer"
              />

              <div className="pt-4 border-t border-white/10 grid grid-cols-2 gap-4 text-center text-xs">
                <div className="p-3 bg-[#12141c] rounded-xl border border-white/10">
                  <div className="text-gray-400 text-[10px]">Üretilecek UGC Video</div>
                  <div className="text-xl font-bold text-white mt-1">{Math.floor(calculatorBudget / 750)} Adet Video</div>
                </div>
                <div className="p-3 bg-[#12141c] rounded-xl border border-white/10">
                  <div className="text-gray-400 text-[10px]">Tahmini Reklam ROAS</div>
                  <div className="text-xl font-bold text-emerald-400 mt-1">4.5x - 6.2x</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* SSS (FAQ) Section */}
      <section id="faq" className="max-w-4xl mx-auto px-4 space-y-6">
        <div className="text-center space-y-2">
          <h2 className="text-2xl sm:text-4xl font-bold text-white">Sıkça Sorulan Sorular</h2>
          <p className="text-xs text-gray-400">Kampanya ve ödeme süreçleri hakkında merak edilenler</p>
        </div>

        <div className="space-y-3">
          {faqs.map((faq, idx) => (
            <div key={idx} className="bg-[#12141c] border border-white/10 rounded-2xl px-6">
              <button
                onClick={() => setOpenFaq(openFaq === idx ? null : idx)}
                className="w-full py-5 text-left font-bold text-white hover:text-[#a78bfa] text-sm flex items-center justify-between gap-4 transition-colors"
              >
                <span>{faq.q}</span>
                {openFaq === idx ? <ChevronUp className="w-5 h-5 text-[#a78bfa]" /> : <ChevronDown className="w-5 h-5 text-gray-400" />}
              </button>
              {openFaq === idx && (
                <div className="pb-5 text-xs text-gray-300 leading-relaxed border-t border-white/10 pt-3">
                  {faq.a}
                </div>
              )}
            </div>
          ))}
        </div>
      </section>

      {/* Video Preview Modal */}
      {activeVideoModal && (
        <div className="fixed inset-0 z-50 bg-black/90 backdrop-blur-md flex items-center justify-center p-4">
          <div className="relative w-full max-w-sm bg-[#0c0d12] border border-white/20 rounded-3xl overflow-hidden shadow-2xl space-y-3">
            
            <div className="flex items-center justify-between p-4 bg-black/80 border-b border-white/10">
              <div className="flex items-center gap-2.5">
                <img src={activeVideoModal.avatar} alt={activeVideoModal.creator} className="w-7 h-7 rounded-full border border-[#a78bfa]" />
                <div>
                  <div className="text-xs font-bold text-white">{activeVideoModal.creator}</div>
                  <div className="text-[10px] text-[#a78bfa]">{activeVideoModal.brand}</div>
                </div>
              </div>

              <div className="flex items-center gap-2">
                <button
                  onClick={() => setIsMuted(!isMuted)}
                  className="p-2 rounded-full bg-white/10 hover:bg-white/20 text-white transition-colors"
                  title={isMuted ? "Sesi Aç" : "Sesi Kapat"}
                >
                  {isMuted ? <VolumeX className="w-4 h-4" /> : <Volume2 className="w-4 h-4 text-[#a78bfa]" />}
                </button>

                <button
                  onClick={() => setActiveVideoModal(null)}
                  className="p-2 rounded-full bg-white/10 hover:bg-white/20 text-white font-bold transition-colors"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>
            </div>

            <div className="relative aspect-[9/16] bg-slate-950 overflow-hidden">
              <video
                src={activeVideoModal.videoUrl}
                autoPlay
                loop
                muted={isMuted}
                playsInline
                className="w-full h-full object-cover"
              />

              <div className="absolute bottom-4 left-4 right-4 space-y-3 bg-black/85 backdrop-blur-md p-4 rounded-2xl border border-white/10">
                <div className="flex items-center justify-between text-xs">
                  <span className="font-bold text-white">{activeVideoModal.product}</span>
                  <span className="text-xs text-emerald-400 font-bold">{activeVideoModal.roas}</span>
                </div>

                <Link
                  href="/login?tab=register&role=brand"
                  className="ee-btn-primary w-full py-3 rounded-xl text-white text-xs font-bold flex items-center justify-center gap-1.5"
                >
                  <span>Bu Tarz UGC Video Siparişi Ver</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </Link>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Community Banner */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="rounded-3xl border border-[#8b5cf6]/30 p-8 sm:p-10 bg-gradient-to-br from-[#8b5cf6]/20 via-[#0a0b0e] to-[#0a0b0e] shadow-2xl flex flex-col sm:flex-row items-center justify-between gap-6">
          <div className="space-y-2 max-w-xl text-center sm:text-left">
            <h2 className="text-2xl sm:text-3xl font-bold text-white">
              E-Ticaret Reklamlarınızı UGC İçeriklerle Güçlendirin
            </h2>
            <p className="text-gray-300 text-xs sm:text-sm">
              İlk kampanyanızı 5 dakikada oluşturun. Komisyonsuz eşleşme fırsatını kaçırmayın.
            </p>
          </div>
          <Link
            href="/login?tab=register"
            className="ee-btn-primary px-8 py-3.5 font-bold text-white text-xs rounded-xl transition-all whitespace-nowrap"
          >
            Hemen Ücretsiz Katıl
          </Link>
        </div>
      </section>

    </div>
  );
}
