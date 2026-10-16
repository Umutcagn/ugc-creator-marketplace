import Link from "next/link";
import { Home, Compass } from "lucide-react";

export default function NotFound() {
  return (
    <div className="min-h-[70vh] flex items-center justify-center px-4 py-16 font-serif bg-black text-white">
      <div className="max-w-md w-full text-center space-y-6 ee-card border border-white/20 p-8 rounded-2xl">
        <div className="w-16 h-16 bg-gradient-to-br from-[#9541e0] to-[#7c30c7] border border-white/20 rounded-xl flex items-center justify-center mx-auto text-white font-bold text-2xl shadow-lg shadow-[#9541e0]/30">
          404
        </div>

        <div className="space-y-2">
          <h1 className="text-2xl font-bold text-white">Sayfa Bulunamadı</h1>
          <p className="text-xs text-gray-400 leading-relaxed">
            Aradığınız sayfa kaldırılmış, adı değiştirilmiş veya geçici olarak erişilemiyor olabilir.
          </p>
        </div>

        <div className="pt-2 flex flex-col sm:flex-row items-center justify-center gap-3">
          <Link
            href="/"
            className="ee-btn-primary w-full sm:w-auto px-5 py-2.5 text-white rounded-xl text-xs font-semibold flex items-center justify-center gap-2 transition-all"
          >
            <Home className="w-4 h-4" />
            <span>Ana Sayfaya Dön</span>
          </Link>

          <Link
            href="/campaigns"
            className="w-full sm:w-auto px-5 py-2.5 bg-white/10 hover:bg-white/20 text-white border border-white/20 rounded-xl text-xs font-semibold flex items-center justify-center gap-2 transition-colors"
          >
            <Compass className="w-4 h-4 text-[#c793ff]" />
            <span>Kampanyaları Gez</span>
          </Link>
        </div>
      </div>
    </div>
  );
}
