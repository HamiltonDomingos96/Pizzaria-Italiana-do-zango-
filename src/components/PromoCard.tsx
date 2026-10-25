import React, { useState } from 'react';
import { Tag, Check, Copy, Sparkles, ArrowRight } from 'lucide-react';

interface PromoCardProps {
  onApplyCoupon: (code: string) => void;
}

export const PromoCard: React.FC<PromoCardProps> = ({ onApplyCoupon }) => {
  const [copied, setCopied] = useState(false);
  const couponCode = 'PRIMEIRAFATIA';

  const handleCopy = () => {
    navigator.clipboard.writeText(couponCode);
    setCopied(true);
    onApplyCoupon(couponCode);
    setTimeout(() => setCopied(false), 3000);
  };

  return (
    <div className="max-w-6xl mx-auto px-4 my-6">
      <div className="relative overflow-hidden rounded-2xl bg-gradient-to-r from-stone-900 via-stone-900 to-red-950 text-white p-5 sm:p-6 border border-stone-800 shadow-lg">
        {/* Decorative corner accent */}
        <div className="absolute top-0 right-0 w-32 h-32 bg-red-600/10 rounded-full blur-2xl pointer-events-none"></div>

        <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div className="space-y-1.5">
            <div className="flex items-center gap-2 text-xs font-bold text-amber-400 uppercase tracking-wider">
              <Sparkles className="w-4 h-4 fill-amber-400" />
              <span>OFERTA DE BOAS-VINDAS NO ZANGO</span>
            </div>

            <h3 className="text-lg sm:text-xl font-bold font-serif-italian text-white">
              Entrega Grátis no 1º Pedido para o Zango 0 ao 8.000
            </h3>

            <p className="text-xs sm:text-sm text-stone-300 max-w-xl">
              Experimente a autêntica massa artesanal italiana sem pagar taxa de entrega. Válido para pedidos a partir de 5.000 Kz.
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-2.5 shrink-0 pt-2 md:pt-0">
            {/* Coupon Code Pill */}
            <div className="flex items-center bg-stone-950/90 border border-stone-700/80 rounded-xl px-3.5 py-2 font-mono text-sm tracking-wider font-bold text-amber-400 select-all">
              <Tag className="w-4 h-4 mr-2 text-red-500" />
              <span>{couponCode}</span>
            </div>

            <button
              onClick={handleCopy}
              className={`min-h-[44px] px-4 py-2 rounded-xl text-xs sm:text-sm font-bold flex items-center gap-1.5 transition-all cursor-pointer ${
                copied
                  ? 'bg-emerald-600 text-white shadow-md'
                  : 'bg-red-600 hover:bg-red-500 active:scale-95 text-white shadow-md shadow-red-950/40'
              }`}
            >
              {copied ? (
                <>
                  <Check className="w-4 h-4" />
                  <span>Cupão Aplicado!</span>
                </>
              ) : (
                <>
                  <Copy className="w-4 h-4" />
                  <span>Copiar & Aplicar</span>
                  <ArrowRight className="w-3.5 h-3.5 ml-0.5" />
                </>
              )}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
