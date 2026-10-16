import Link from "next/link";
import { Sparkles, Heart, MessageSquare } from "lucide-react";

export default function Footer() {
  return (
    <footer className="bg-black border-t border-white/10 text-slate-400 text-sm py-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 grid grid-cols-1 md:grid-cols-4 gap-8 mb-8">
        <div className="space-y-4">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-md bg-gradient-to-br from-[#9541e0] to-[#7c30c7] flex items-center justify-center text-white font-bold">
              <Sparkles className="w-4 h-4" />
            </div>
            <span className="text-lg font-bold text-white font-serif">InfMarket</span>
          </div>
          <p className="text-xs text-slate-400 leading-relaxed font-serif">
            E-ticaret markaları ile micro influencer&apos;ları otomatik eşleştiren, ürün gönderimi karşılığında otantik UGC video toplama platformu.
          </p>
        </div>

        <div>
          <h4 className="text-white font-bold font-serif mb-3">Markalar İçin</h4>
          <ul className="space-y-2 text-xs font-serif">
            <li><Link href="/campaigns" className="hover:text-white transition-colors">Kampanya Oluştur</Link></li>
            <li><Link href="/#how-it-works" className="hover:text-white transition-colors">UGC Video Nedir?</Link></li>
            <li><Link href="/#brands" className="hover:text-white transition-colors">Fiyatlandırma ve Escrow</Link></li>
          </ul>
        </div>

        <div>
          <h4 className="text-white font-bold font-serif mb-3">İçerik Üreticileri</h4>
          <ul className="space-y-2 text-xs font-serif">
            <li><Link href="/campaigns" className="hover:text-white transition-colors">Aktif Kampanyalar</Link></li>
            <li><Link href="/login?tab=register" className="hover:text-white transition-colors">Influencer Başvurusu</Link></li>
            <li><Link href="/#creators" className="hover:text-white transition-colors">Nasıl Ödeme Alırım?</Link></li>
          </ul>
        </div>

        <div>
          <h4 className="text-white font-bold font-serif mb-3">İletişim ve Yasal</h4>
          <ul className="space-y-2 text-xs font-serif">
            <li><span className="text-slate-400">İstanbul, Türkiye</span></li>
            <li><span className="text-slate-400">destek@infmarket.com.tr</span></li>
            <li><Link href="#" className="hover:text-white transition-colors">Gizlilik ve KVKK</Link></li>
          </ul>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 border-t border-white/10 pt-6 flex flex-col sm:flex-row items-center justify-between text-xs text-slate-500 font-serif">
        <p>© 2026 InfMarket. Tüm hakları saklıdır.</p>
        <p className="flex items-center gap-1 mt-2 sm:mt-0 text-slate-400">
          Türkiye&apos;deki E-Ticaret Markaları için Sevgiyle Geliştirildi <Heart className="w-3.5 h-3.5 text-rose-500 fill-rose-500" />
        </p>
      </div>
    </footer>
  );
}
