import React from 'react';
import { ShoppingBag, MapPin, Search, X, Clock, Phone } from 'lucide-react';
import { STORE_INFO, formatAOA } from '../data/menu';

interface HeaderProps {
  cartItemCount: number;
  cartTotal: number;
  onOpenCart: () => void;
  searchQuery: string;
  onSearchChange: (query: string) => void;
  onOpenStoreInfo: () => void;
}

export const Header: React.FC<HeaderProps> = ({
  cartItemCount,
  cartTotal,
  onOpenCart,
  searchQuery,
  onSearchChange,
  onOpenStoreInfo,
}) => {
  return (
    <header className="sticky top-0 z-30 bg-stone-900 text-white shadow-md border-b border-stone-800">
      {/* Top micro bar for store status & location */}
      <div className="bg-stone-950 px-4 py-1.5 text-xs border-b border-stone-800/80">
        <div className="max-w-6xl mx-auto flex items-center justify-between gap-3 text-stone-300">
          <button
            onClick={onOpenStoreInfo}
            className="flex items-center gap-1.5 hover:text-white transition-colors truncate text-left focus:outline-none"
            title="Ver detalhes de localização"
          >
            <MapPin className="w-3.5 h-3.5 text-red-500 shrink-0" />
            <span className="font-medium text-stone-200">Zango 2</span>
            <span className="text-stone-400 hidden sm:inline">· Paragem da ZAP, Luanda</span>
          </button>

          <div className="flex items-center gap-3 shrink-0 text-stone-400">
            <span className="hidden md:flex items-center gap-1 text-[11px]">
              <Clock className="w-3 h-3 text-emerald-400" />
              17h - 23h30
            </span>
            <a
              href={`https://wa.me/${STORE_INFO.whatsappRaw}`}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-1 hover:text-emerald-400 text-stone-300 transition-colors"
            >
              <Phone className="w-3 h-3 text-emerald-400" />
              <span className="text-[11px] font-mono">{STORE_INFO.whatsappNumber}</span>
            </a>
          </div>
        </div>
      </div>

      {/* Main Brand & Action Bar */}
      <div className="max-w-6xl mx-auto px-4 py-3">
        <div className="flex items-center justify-between gap-4">
          {/* Brand Logo & Subtitle */}
          <div className="flex items-center gap-3">
            <div className="relative shrink-0">
              <img
                src={STORE_INFO.logoUrl}
                alt="Pizzaria Italiana Sabor & Cozinha"
                className="w-11 h-11 sm:w-12 sm:h-12 rounded-xl object-cover border border-stone-700 shadow-md"
              />
              <div className="absolute -bottom-1 -right-1 flex gap-0.5">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-600"></span>
                <span className="w-1.5 h-1.5 rounded-full bg-stone-100"></span>
                <span className="w-1.5 h-1.5 rounded-full bg-red-600"></span>
              </div>
            </div>

            <div>
              <div className="flex items-center gap-1.5">
                <h1 className="text-lg sm:text-xl font-extrabold tracking-tight font-serif-italian text-white">
                  PIZZARIA ITALIANA
                </h1>
                <span className="text-[9px] sm:text-[10px] px-1.5 py-0.5 bg-red-950/80 border border-red-800 text-red-400 rounded font-semibold uppercase tracking-wider hidden xs:inline">
                  Sabor & Cozinha
                </span>
              </div>
              <p className="text-[10px] sm:text-[11px] tracking-widest uppercase font-semibold text-stone-400">
                MASSAS ARTESANAIS <span className="text-red-500">•</span> ZANGO 2
              </p>
            </div>
          </div>

          {/* Quick Cart Trigger on Header */}
          <div className="flex items-center gap-2">
            <button
              onClick={onOpenCart}
              aria-label="Abrir carrinho de compras"
              className="min-h-[44px] px-3 py-2 rounded-xl bg-red-600 hover:bg-red-700 active:scale-95 text-white flex items-center gap-2.5 transition-all shadow-md shadow-red-950/40 cursor-pointer"
            >
              <div className="relative">
                <ShoppingBag className="w-5 h-5" />
                {cartItemCount > 0 && (
                  <span className="absolute -top-2 -right-2 bg-emerald-500 text-stone-950 text-[10px] font-bold w-4 h-4 rounded-full flex items-center justify-center shadow-sm">
                    {cartItemCount}
                  </span>
                )}
              </div>
              <div className="text-left hidden sm:block">
                <div className="text-[10px] uppercase font-semibold leading-none text-red-100">Carrinho</div>
                <div className="text-xs font-bold leading-tight font-mono tabular-nums">
                  {cartItemCount > 0 ? formatAOA(cartTotal) : '0 Kz'}
                </div>
              </div>
            </button>
          </div>
        </div>

        {/* Search input with quick clear and filters */}
        <div className="mt-3 relative">
          <div className="relative flex items-center">
            <Search className="w-4 h-4 text-stone-400 absolute left-3.5 pointer-events-none" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => onSearchChange(e.target.value)}
              placeholder="Pesquisar pizza, fahita, hambúrguer, bebidas..."
              className="w-full bg-stone-800/90 text-stone-100 placeholder-stone-400 text-sm rounded-xl pl-10 pr-9 py-2.5 border border-stone-700/70 focus:border-red-500 focus:bg-stone-800 focus:outline-none transition-all shadow-inner"
            />
            {searchQuery && (
              <button
                onClick={() => onSearchChange('')}
                className="absolute right-3 p-1 text-stone-400 hover:text-white rounded-full transition-colors"
                title="Limpar pesquisa"
              >
                <X className="w-3.5 h-3.5" />
              </button>
            )}
          </div>
        </div>
      </div>
    </header>
  );
};
