import React from 'react';
import { Home, UtensilsCrossed, Tag, ShoppingBag, Info, Flame } from 'lucide-react';

export type TabType = 'home' | 'menu' | 'offers' | 'cart' | 'info';

interface BottomNavBarProps {
  currentTab: TabType;
  onSelectTab: (tab: TabType) => void;
  cartCount: number;
  onOpenOrderModal: () => void;
}

export const BottomNavBar: React.FC<BottomNavBarProps> = ({
  currentTab,
  onSelectTab,
  cartCount,
  onOpenOrderModal,
}) => {
  return (
    <nav className="fixed bottom-0 left-0 right-0 z-40 bg-stone-900/95 backdrop-blur-md border-t border-stone-800 text-stone-400 sm:hidden">
      <div className="grid grid-cols-5 items-center h-16 max-w-md mx-auto px-1">
        {/* Home */}
        <button
          onClick={() => onSelectTab('home')}
          className={`min-h-[44px] flex flex-col items-center justify-center transition-colors cursor-pointer ${
            currentTab === 'home' ? 'text-red-500 font-bold' : 'hover:text-stone-200'
          }`}
        >
          <Home className="w-5 h-5" />
          <span className="text-[10px] mt-1 font-medium">Início</span>
        </button>

        {/* Menu */}
        <button
          onClick={() => onSelectTab('menu')}
          className={`min-h-[44px] flex flex-col items-center justify-center transition-colors cursor-pointer ${
            currentTab === 'menu' ? 'text-red-500 font-bold' : 'hover:text-stone-200'
          }`}
        >
          <UtensilsCrossed className="w-5 h-5" />
          <span className="text-[10px] mt-1 font-medium">Cardápio</span>
        </button>

        {/* Order Now Center Floating Action Button */}
        <div className="flex justify-center -mt-5">
          <button
            onClick={onOpenOrderModal}
            aria-label="Pedir Agora"
            className="w-13 h-13 rounded-full bg-red-600 hover:bg-red-500 active:scale-95 text-white flex flex-col items-center justify-center shadow-lg shadow-red-900/60 ring-4 ring-stone-900 transition-all cursor-pointer"
          >
            <Flame className="w-5 h-5 fill-white" />
            <span className="text-[9px] font-extrabold tracking-tighter uppercase leading-none mt-0.5">
              Pedir
            </span>
          </button>
        </div>

        {/* Offers / Promoções */}
        <button
          onClick={() => onSelectTab('offers')}
          className={`min-h-[44px] flex flex-col items-center justify-center transition-colors cursor-pointer ${
            currentTab === 'offers' ? 'text-red-500 font-bold' : 'hover:text-stone-200'
          }`}
        >
          <Tag className="w-5 h-5" />
          <span className="text-[10px] mt-1 font-medium">Ofertas</span>
        </button>

        {/* Cart */}
        <button
          onClick={() => onSelectTab('cart')}
          className={`min-h-[44px] flex flex-col items-center justify-center relative transition-colors cursor-pointer ${
            currentTab === 'cart' ? 'text-red-500 font-bold' : 'hover:text-stone-200'
          }`}
        >
          <div className="relative">
            <ShoppingBag className="w-5 h-5" />
            {cartCount > 0 && (
              <span className="absolute -top-1.5 -right-2 bg-emerald-500 text-stone-950 text-[10px] font-black w-4 h-4 rounded-full flex items-center justify-center">
                {cartCount}
              </span>
            )}
          </div>
          <span className="text-[10px] mt-1 font-medium">Carrinho</span>
        </button>
      </div>
    </nav>
  );
};
