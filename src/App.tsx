import React, { useState, useMemo, useEffect } from 'react';
import { Header } from './components/Header';
import { HeroBanner } from './components/HeroBanner';
import { CategoryCarousel } from './components/CategoryCarousel';
import { PromoCard } from './components/PromoCard';
import { ProductCard } from './components/ProductCard';
import { ProductCustomizerModal } from './components/ProductCustomizerModal';
import { CartDrawer } from './components/CartDrawer';
import { BottomNavBar, TabType } from './components/BottomNavBar';
import { StoreInfoModal } from './components/StoreInfoModal';
import { MENU_PRODUCTS, STORE_INFO, formatAOA } from './data/menu';
import { Product, CartItem, CategoryId, PizzaSize, PizzaCrust } from './types';
import { 
  Flame, 
  Sparkles, 
  Search, 
  MapPin, 
  ShoppingBag, 
  ArrowRight, 
  Check, 
  Phone,
  Clock,
  Heart
} from 'lucide-react';

export default function App() {
  // Navigation & Category states
  const [currentTab, setCurrentTab] = useState<TabType>('home');
  const [selectedCategory, setSelectedCategory] = useState<CategoryId>('todos');
  const [searchQuery, setSearchQuery] = useState('');

  // Cart state
  const [cartItems, setCartItems] = useState<CartItem[]>(() => {
    try {
      const saved = localStorage.getItem('pizzaria_cart');
      return saved ? JSON.parse(saved) : [];
    } catch {
      return [];
    }
  });
  const [appliedCoupon, setAppliedCoupon] = useState<string>('PRIMEIRAFATIA');
  const [isCartOpen, setIsCartOpen] = useState(false);

  // Modals
  const [customizingProduct, setCustomizingProduct] = useState<Product | null>(null);
  const [isStoreInfoOpen, setIsStoreInfoOpen] = useState(false);
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  // Save cart to local storage
  useEffect(() => {
    try {
      localStorage.setItem('pizzaria_cart', JSON.stringify(cartItems));
    } catch {
      // ignore
    }
  }, [cartItems]);

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 2500);
  };

  // Cart calculations
  const cartItemCount = useMemo(() => {
    return cartItems.reduce((acc, item) => acc + item.quantity, 0);
  }, [cartItems]);

  const cartTotal = useMemo(() => {
    return cartItems.reduce((acc, item) => acc + item.itemPrice * item.quantity, 0);
  }, [cartItems]);

  // Handle adding product to cart
  const handleAddToCart = (
    product: Product,
    quantity: number,
    size?: PizzaSize,
    crust?: PizzaCrust,
    extras?: string[],
    notes?: string,
    calculatedPrice?: number
  ) => {
    const itemPrice = calculatedPrice || product.basePrice;
    const cartItemId = `${product.id}-${size || 'default'}-${crust || 'none'}-${(extras || []).sort().join(',')}-${notes || ''}`;

    setCartItems((prev) => {
      const existingIndex = prev.findIndex((item) => item.cartItemId === cartItemId);
      if (existingIndex > -1) {
        const updated = [...prev];
        updated[existingIndex].quantity += quantity;
        return updated;
      } else {
        return [
          ...prev,
          {
            cartItemId,
            product,
            quantity,
            size,
            crust,
            extras,
            notes,
            itemPrice,
          },
        ];
      }
    });

    showToast(`Adicionado: ${quantity}x ${product.name}`);
  };

  // Quick add without customization (defaults to base product)
  const handleQuickAdd = (product: Product) => {
    handleAddToCart(product, 1, undefined, undefined, undefined, undefined, product.basePrice);
  };

  const handleUpdateQuantity = (cartItemId: string, newQuantity: number) => {
    if (newQuantity <= 0) {
      handleRemoveItem(cartItemId);
      return;
    }
    setCartItems((prev) =>
      prev.map((item) => (item.cartItemId === cartItemId ? { ...item, quantity: newQuantity } : item))
    );
  };

  const handleRemoveItem = (cartItemId: string) => {
    setCartItems((prev) => prev.filter((item) => item.cartItemId !== cartItemId));
  };

  const handleClearCart = () => {
    setCartItems([]);
  };

  // Filtered products list based on category & search
  const filteredProducts = useMemo(() => {
    return MENU_PRODUCTS.filter((product) => {
      // Category match
      if (selectedCategory === 'promocoes') {
        const isPromo = product.category === 'combos' || product.badge === 'OFERTA ESPECIAL';
        if (!isPromo) return false;
      } else if (selectedCategory !== 'todos' && product.category !== selectedCategory) {
        return false;
      }

      // Search match
      if (searchQuery.trim()) {
        const query = searchQuery.toLowerCase().trim();
        const matchName = product.name.toLowerCase().includes(query);
        const matchDesc = product.description.toLowerCase().includes(query);
        const matchCat = product.category.toLowerCase().includes(query);
        return matchName || matchDesc || matchCat;
      }

      return true;
    });
  }, [selectedCategory, searchQuery]);

  // Popular pizzas for the showcase
  const popularPizzas = useMemo(() => {
    return MENU_PRODUCTS.filter((p) => p.isPopular && p.category === 'pizzas');
  }, []);

  // Handle tab switching
  const handleSelectTab = (tab: TabType) => {
    setCurrentTab(tab);
    if (tab === 'home') {
      setSelectedCategory('todos');
      window.scrollTo({ top: 0, behavior: 'smooth' });
    } else if (tab === 'menu') {
      const menuElem = document.getElementById('menu-section');
      menuElem?.scrollIntoView({ behavior: 'smooth' });
    } else if (tab === 'offers') {
      setSelectedCategory('promocoes');
      const menuElem = document.getElementById('menu-section');
      menuElem?.scrollIntoView({ behavior: 'smooth' });
    } else if (tab === 'cart') {
      setIsCartOpen(true);
    } else if (tab === 'info') {
      setIsStoreInfoOpen(true);
    }
  };

  const scrollToMenu = () => {
    const menuElem = document.getElementById('menu-section');
    menuElem?.scrollIntoView({ behavior: 'smooth' });
  };

  return (
    <div className="min-h-screen bg-stone-100 text-stone-900 pb-24 sm:pb-12 selection:bg-red-500 selection:text-white">
      {/* Toast Notification */}
      {toastMessage && (
        <div className="fixed top-20 left-1/2 -translate-x-1/2 z-50 bg-stone-900 text-white px-4 py-2.5 rounded-xl shadow-xl border border-stone-800 text-xs font-semibold flex items-center gap-2 animate-bounce">
          <Check className="w-4 h-4 text-emerald-400" />
          <span>{toastMessage}</span>
        </div>
      )}

      {/* Header */}
      <Header
        cartItemCount={cartItemCount}
        cartTotal={cartTotal}
        onOpenCart={() => setIsCartOpen(true)}
        searchQuery={searchQuery}
        onSearchChange={setSearchQuery}
        onOpenStoreInfo={() => setIsStoreInfoOpen(true)}
      />

      {/* Main Content Feed */}
      <main>
        {/* Hero Banner Section */}
        {!searchQuery && (
          <HeroBanner
            onCtaClick={scrollToMenu}
            onOpenPromo={() => setIsCartOpen(true)}
          />
        )}

        {/* Promo Voucher Banner */}
        {!searchQuery && (
          <PromoCard
            onApplyCoupon={(code) => {
              setAppliedCoupon(code);
              showToast(`Cupão ${code} ativado!`);
            }}
          />
        )}

        {/* Category Carousel Navigation */}
        <CategoryCarousel
          selectedCategory={selectedCategory}
          onSelectCategory={(cat) => {
            setSelectedCategory(cat);
            if (searchQuery) setSearchQuery('');
          }}
        />

        {/* Section 1: Pizzas Populares (Visible when not actively searching) */}
        {!searchQuery && selectedCategory === 'todos' && (
          <section className="max-w-6xl mx-auto px-4 pt-8 pb-4">
            <div className="flex items-end justify-between mb-4">
              <div>
                <div className="flex items-center gap-1.5 text-xs font-bold uppercase tracking-wider text-red-600">
                  <Flame className="w-4 h-4 fill-red-600" />
                  <span>Destaques da Casa</span>
                </div>
                <h2 className="text-xl sm:text-2xl font-extrabold font-serif-italian text-stone-900 mt-0.5">
                  Pizzas Populares no Zango
                </h2>
              </div>
              <button
                onClick={() => setSelectedCategory('pizzas')}
                className="text-xs font-bold text-red-600 hover:text-red-700 flex items-center gap-1 transition-colors cursor-pointer"
              >
                <span>Ver Todas</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </button>
            </div>

            {/* Popular Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
              {popularPizzas.map((product) => (
                <ProductCard
                  key={product.id}
                  product={product}
                  onSelect={setCustomizingProduct}
                  onQuickAdd={handleQuickAdd}
                />
              ))}
            </div>
          </section>
        )}

        {/* Section 2: Full Menu Grid */}
        <section id="menu-section" className="max-w-6xl mx-auto px-4 py-8">
          <div className="flex items-center justify-between mb-6 pb-2 border-b border-stone-200">
            <div>
              <h2 className="text-xl sm:text-2xl font-extrabold font-serif-italian text-stone-900">
                {searchQuery
                  ? `Resultados para "${searchQuery}"`
                  : selectedCategory === 'todos'
                  ? 'Nosso Cardápio Completo'
                  : selectedCategory === 'promocoes'
                  ? 'Promoções & Combos Familiares'
                  : `Cardápio: ${selectedCategory.charAt(0).toUpperCase() + selectedCategory.slice(1)}`}
              </h2>
              <p className="text-xs text-stone-500 mt-0.5">
                {filteredProducts.length} {filteredProducts.length === 1 ? 'opção disponível' : 'opções disponíveis'}
              </p>
            </div>

            {searchQuery && (
              <button
                onClick={() => setSearchQuery('')}
                className="text-xs font-semibold text-red-600 hover:underline cursor-pointer"
              >
                Limpar busca
              </button>
            )}
          </div>

          {/* Empty Search State */}
          {filteredProducts.length === 0 ? (
            <div className="bg-white rounded-2xl p-10 text-center border border-stone-200/80 shadow-xs max-w-md mx-auto my-6">
              <div className="w-12 h-12 bg-stone-100 rounded-full flex items-center justify-center mx-auto text-stone-400 mb-3">
                <Search className="w-6 h-6" />
              </div>
              <h3 className="font-bold text-stone-800 text-base">Nenhum prato encontrado</h3>
              <p className="text-xs text-stone-500 mt-1 mb-4">
                Não encontramos itens correspondentes à sua pesquisa. Tente buscar por Margherita, Calabresa, refrigerante ou combos.
              </p>
              <button
                onClick={() => {
                  setSearchQuery('');
                  setSelectedCategory('todos');
                }}
                className="px-4 py-2 bg-red-600 text-white rounded-xl text-xs font-bold hover:bg-red-700 transition-colors"
              >
                Ver Cardápio Completo
              </button>
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
              {filteredProducts.map((product) => (
                <ProductCard
                  key={product.id}
                  product={product}
                  onSelect={setCustomizingProduct}
                  onQuickAdd={handleQuickAdd}
                />
              ))}
            </div>
          )}
        </section>

        {/* Value Proposition Strip */}
        <section className="bg-stone-900 text-white py-10 mt-12 border-t border-stone-800">
          <div className="max-w-6xl mx-auto px-4">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 text-center md:text-left">
              <div className="flex items-start gap-3.5 p-4 rounded-xl bg-stone-800/40 border border-stone-800">
                <div className="w-10 h-10 rounded-xl bg-red-600/20 text-red-500 flex items-center justify-center shrink-0">
                  <Flame className="w-5 h-5 fill-red-500" />
                </div>
                <div>
                  <h4 className="font-bold text-sm text-stone-100">Fermentação Lenta de 48h</h4>
                  <p className="text-xs text-stone-400 mt-1">
                    Massas leves, crocantes e de fácil digestão feitas no estilo napolitano tradicional.
                  </p>
                </div>
              </div>

              <div className="flex items-start gap-3.5 p-4 rounded-xl bg-stone-800/40 border border-stone-800">
                <div className="w-10 h-10 rounded-xl bg-emerald-600/20 text-emerald-400 flex items-center justify-center shrink-0">
                  <MapPin className="w-5 h-5" />
                </div>
                <div>
                  <h4 className="font-bold text-sm text-stone-100">Entrega Ágil no Zango</h4>
                  <p className="text-xs text-stone-400 mt-1">
                    Atendemos do Zango 0 ao 8.000, Viana e arredores com embalagens térmicas que mantêm o calor.
                  </p>
                </div>
              </div>

              <div className="flex items-start gap-3.5 p-4 rounded-xl bg-stone-800/40 border border-stone-800">
                <div className="w-10 h-10 rounded-xl bg-amber-600/20 text-amber-400 flex items-center justify-center shrink-0">
                  <Sparkles className="w-5 h-5" />
                </div>
                <div>
                  <h4 className="font-bold text-sm text-stone-100">WhatsApp Direto & Sem Falhas</h4>
                  <p className="text-xs text-stone-400 mt-1">
                    Pedido estruturado enviado em 1 clique direto para o nosso balcão com atendimento imediato.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </section>
      </main>

      {/* Footer */}
      <footer className="bg-stone-950 text-stone-400 pt-10 pb-20 sm:pb-10 border-t border-stone-800 text-xs">
        <div className="max-w-6xl mx-auto px-4">
          <div className="flex flex-col md:flex-row items-center justify-between gap-6 pb-8 border-b border-stone-800">
            <div>
              <div className="flex items-center gap-2">
                <span className="text-lg font-bold font-serif-italian text-white">PIZZARIA ITALIANA</span>
                <span className="text-red-500 font-bold">•</span>
                <span className="text-stone-300">LUANDA</span>
              </div>
              <p className="text-stone-500 text-[11px] mt-1">
                Zango 2 - Paragem da ZAP, Município de Viana, Luanda - Angola
              </p>
            </div>

            <div className="flex items-center gap-4">
              <a
                href={`https://wa.me/${STORE_INFO.whatsappRaw}`}
                target="_blank"
                rel="noopener noreferrer"
                className="px-4 py-2 rounded-xl bg-emerald-700/30 text-emerald-400 border border-emerald-700/50 hover:bg-emerald-700/50 flex items-center gap-2 transition-colors"
              >
                <Phone className="w-3.5 h-3.5" />
                <span className="font-mono">{STORE_INFO.whatsappNumber}</span>
              </a>
              <button
                onClick={() => setIsStoreInfoOpen(true)}
                className="px-4 py-2 rounded-xl bg-stone-800 text-stone-200 hover:bg-stone-700 transition-colors"
              >
                Horários & Localização
              </button>
            </div>
          </div>

          <div className="pt-6 flex flex-col sm:flex-row items-center justify-between gap-3 text-stone-500 text-[11px]">
            <p>© {new Date().getFullYear()} Pizzaria Italiana Luanda. Todos os direitos reservados.</p>
            <p className="flex items-center gap-1">
              Feito com paixão italiana & sabor angolano
            </p>
          </div>
        </div>
      </footer>

      {/* Floating Cart Peek on Mobile (When cart has items) */}
      {cartItemCount > 0 && !isCartOpen && (
        <div className="fixed bottom-18 left-4 right-4 z-30 sm:hidden">
          <button
            onClick={() => setIsCartOpen(true)}
            className="w-full bg-red-600 hover:bg-red-700 active:scale-98 text-white p-3.5 rounded-2xl shadow-xl flex items-center justify-between gap-3 transition-transform"
          >
            <div className="flex items-center gap-2.5">
              <div className="w-7 h-7 rounded-lg bg-stone-900 flex items-center justify-center text-xs font-bold">
                {cartItemCount}
              </div>
              <span className="text-xs font-bold uppercase tracking-wider">Ver Carrinho</span>
            </div>
            <div className="flex items-center gap-1 font-mono font-bold text-sm tabular-nums">
              <span>{formatAOA(cartTotal)}</span>
              <ArrowRight className="w-4 h-4 ml-1" />
            </div>
          </button>
        </div>
      )}

      {/* Mobile Fixed Bottom Navigation Bar */}
      <BottomNavBar
        currentTab={currentTab}
        onSelectTab={handleSelectTab}
        cartCount={cartItemCount}
        onOpenOrderModal={() => {
          setSelectedCategory('pizzas');
          scrollToMenu();
        }}
      />

      {/* Product Customizer Modal */}
      <ProductCustomizerModal
        product={customizingProduct}
        onClose={() => setCustomizingProduct(null)}
        onAddToCart={handleAddToCart}
      />

      {/* Shopping Cart Drawer */}
      <CartDrawer
        isOpen={isCartOpen}
        onClose={() => setIsCartOpen(false)}
        items={cartItems}
        onUpdateQuantity={handleUpdateQuantity}
        onRemoveItem={handleRemoveItem}
        onClearCart={handleClearCart}
        appliedCoupon={appliedCoupon}
        onApplyCoupon={setAppliedCoupon}
        onRemoveCoupon={() => setAppliedCoupon('')}
        onOpenStoreInfo={() => {
          setIsCartOpen(false);
          setIsStoreInfoOpen(true);
        }}
      />

      {/* Store Location and Schedule Info Modal */}
      <StoreInfoModal
        isOpen={isStoreInfoOpen}
        onClose={() => setIsStoreInfoOpen(false)}
      />
    </div>
  );
}
