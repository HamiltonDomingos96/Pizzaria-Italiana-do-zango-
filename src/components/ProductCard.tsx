import React, { useState } from 'react';
import { Plus, Star, Check } from 'lucide-react';
import { Product } from '../types';
import { formatAOA } from '../data/menu';

interface ProductCardProps {
  product: Product;
  onSelect: (product: Product) => void;
  onQuickAdd: (product: Product) => void;
}

export const ProductCard: React.FC<ProductCardProps> = ({
  product,
  onSelect,
  onQuickAdd,
}) => {
  const [imageLoaded, setImageLoaded] = useState(false);
  const [justAdded, setJustAdded] = useState(false);

  const handlePlusClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (product.hasSizes) {
      // Open customizer modal for size/crust choices
      onSelect(product);
    } else {
      // Direct quick add
      onQuickAdd(product);
      setJustAdded(true);
      setTimeout(() => setJustAdded(false), 1200);
    }
  };

  const getBadgeStyle = (badge?: string) => {
    switch (badge) {
      case 'MAIS VENDIDA':
        return 'bg-amber-500 text-stone-950 font-bold';
      case 'RECOMENDAÇÃO DO CHEFE':
        return 'bg-red-600 text-white font-bold';
      case 'NOVIDADE':
        return 'bg-emerald-600 text-white font-bold';
      case 'VEGETARIANA':
        return 'bg-emerald-800 text-emerald-100 font-bold';
      default:
        return 'bg-stone-800 text-stone-200';
    }
  };

  return (
    <div
      onClick={() => onSelect(product)}
      className="group bg-white rounded-2xl border border-stone-200/80 shadow-xs hover:shadow-md transition-all duration-200 overflow-hidden flex flex-col justify-between cursor-pointer active:scale-[0.99]"
    >
      <div>
        {/* Image Container with Badges */}
        <div className="relative aspect-[4/3] w-full bg-stone-100 overflow-hidden">
          {product.badge && (
            <div className="absolute top-2.5 left-2.5 z-10">
              <span className={`text-[10px] uppercase px-2.5 py-1 rounded-md tracking-wider shadow-sm ${getBadgeStyle(product.badge)}`}>
                {product.badge}
              </span>
            </div>
          )}

          {/* Rating tag */}
          <div className="absolute bottom-2.5 left-2.5 z-10 bg-stone-950/80 backdrop-blur-xs text-white text-[11px] font-medium px-2 py-0.5 rounded-md flex items-center gap-1 shadow-sm">
            <Star className="w-3 h-3 text-amber-400 fill-amber-400" />
            <span className="font-semibold">{product.rating.toFixed(1)}</span>
            <span className="text-stone-400 text-[10px]">({product.ratingCount})</span>
          </div>

          {/* Image with graceful fallback */}
          <img
            src={product.image}
            alt={product.name}
            referrerPolicy="no-referrer"
            onLoad={() => setImageLoaded(true)}
            className={`w-full h-full object-cover object-center group-hover:scale-105 transition-transform duration-500 ${
              imageLoaded ? 'opacity-100' : 'opacity-80'
            }`}
          />
        </div>

        {/* Content */}
        <div className="p-4">
          <div className="flex items-start justify-between gap-2 mb-1.5">
            <h3 className="font-bold text-stone-900 text-base leading-snug group-hover:text-red-600 transition-colors">
              {product.name}
            </h3>
          </div>

          <p className="text-stone-500 text-xs leading-relaxed line-clamp-2 mb-3">
            {product.description}
          </p>
        </div>
      </div>

      {/* Footer: Price & Add Button */}
      <div className="px-4 pb-4 pt-1 border-t border-stone-100 flex items-center justify-between gap-2">
        <div>
          {product.hasSizes && (
            <span className="block text-[10px] text-stone-400 font-medium">A partir de</span>
          )}
          <span className="text-base sm:text-lg font-extrabold text-stone-900 font-mono tabular-nums">
            {formatAOA(product.basePrice)}
          </span>
        </div>

        <button
          onClick={handlePlusClick}
          aria-label={`Adicionar ${product.name} ao carrinho`}
          className={`min-h-[44px] min-w-[44px] rounded-xl flex items-center justify-center transition-all cursor-pointer ${
            justAdded
              ? 'bg-emerald-600 text-white shadow-md'
              : 'bg-red-600 hover:bg-red-700 active:scale-95 text-white shadow-sm shadow-red-600/30'
          }`}
        >
          {justAdded ? (
            <Check className="w-5 h-5 animate-scale" />
          ) : (
            <Plus className="w-5 h-5 stroke-[2.5]" />
          )}
        </button>
      </div>
    </div>
  );
};
