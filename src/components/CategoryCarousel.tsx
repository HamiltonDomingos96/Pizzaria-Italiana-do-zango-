import React from 'react';
import { 
  Pizza, 
  Sandwich, 
  Users, 
  GlassWater, 
  CakeSlice, 
  Sparkles, 
  UtensilsCrossed 
} from 'lucide-react';
import { CATEGORIES } from '../data/menu';
import { CategoryId } from '../types';

interface CategoryCarouselProps {
  selectedCategory: CategoryId;
  onSelectCategory: (id: CategoryId) => void;
}

const ICON_MAP: Record<string, React.ElementType> = {
  UtensilsCrossed,
  Pizza,
  Sandwich,
  Users,
  GlassWater,
  CakeSlice,
  Sparkles,
};

export const CategoryCarousel: React.FC<CategoryCarouselProps> = ({
  selectedCategory,
  onSelectCategory,
}) => {
  return (
    <section className="bg-white border-b border-stone-200 sticky top-[108px] z-20 shadow-xs">
      <div className="max-w-6xl mx-auto px-4 py-3">
        <div className="flex items-center gap-2 overflow-x-auto no-scrollbar py-1">
          {CATEGORIES.map((cat) => {
            const Icon = ICON_MAP[cat.icon] || UtensilsCrossed;
            const isSelected = selectedCategory === cat.id;

            return (
              <button
                key={cat.id}
                onClick={() => onSelectCategory(cat.id as CategoryId)}
                className={`min-h-[44px] px-3.5 py-2 rounded-xl text-xs font-semibold whitespace-nowrap shrink-0 flex items-center gap-2 transition-all cursor-pointer ${
                  isSelected
                    ? 'bg-red-600 text-white shadow-md shadow-red-600/20 scale-[1.02]'
                    : 'bg-stone-100 text-stone-700 hover:bg-stone-200/80 hover:text-stone-900 border border-stone-200/60'
                }`}
              >
                <Icon className={`w-4 h-4 ${isSelected ? 'text-white' : 'text-stone-500'}`} />
                <span>{cat.label}</span>
              </button>
            );
          })}
        </div>
      </div>
    </section>
  );
};
