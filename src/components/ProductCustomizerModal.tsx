import React, { useState } from 'react';
import { X, Plus, Minus, Star, Check } from 'lucide-react';
import { Product, PizzaSize, PizzaCrust } from '../types';
import { SIZE_PRICES, CRUST_OPTIONS, EXTRA_TOPPINGS, formatAOA } from '../data/menu';

interface ProductCustomizerModalProps {
  product: Product | null;
  onClose: () => void;
  onAddToCart: (
    product: Product,
    quantity: number,
    size?: PizzaSize,
    crust?: PizzaCrust,
    extras?: string[],
    notes?: string,
    calculatedPrice?: number
  ) => void;
}

export const ProductCustomizerModal: React.FC<ProductCustomizerModalProps> = ({
  product,
  onClose,
  onAddToCart,
}) => {
  if (!product) return null;

  const [quantity, setQuantity] = useState(1);
  const [size, setSize] = useState<PizzaSize>('grande');
  const [crust, setCrust] = useState<PizzaCrust>('tradicional');
  const [selectedExtras, setSelectedExtras] = useState<string[]>([]);
  const [notes, setNotes] = useState('');

  // Calculate single item price
  const calculateItemPrice = () => {
    let price = product.basePrice;

    if (product.hasSizes) {
      const multiplier = SIZE_PRICES[size]?.priceMultiplier || 1;
      price = Math.round(product.basePrice * multiplier / 100) * 100;

      // Add crust fee
      const crustObj = CRUST_OPTIONS.find((c) => c.id === crust);
      if (crustObj) {
        price += crustObj.price;
      }
    }

    // Add extra toppings
    selectedExtras.forEach((extraId) => {
      const extraObj = EXTRA_TOPPINGS.find((e) => e.id === extraId);
      if (extraObj) {
        price += extraObj.price;
      }
    });

    return price;
  };

  const itemPrice = calculateItemPrice();
  const totalPrice = itemPrice * quantity;

  const handleToggleExtra = (extraId: string) => {
    setSelectedExtras((prev) =>
      prev.includes(extraId) ? prev.filter((id) => id !== extraId) : [...prev, extraId]
    );
  };

  const handleConfirm = () => {
    onAddToCart(
      product,
      quantity,
      product.hasSizes ? size : undefined,
      product.hasSizes ? crust : undefined,
      selectedExtras.length > 0 ? selectedExtras : undefined,
      notes.trim() || undefined,
      itemPrice
    );
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center p-0 sm:p-4 bg-stone-950/70 backdrop-blur-xs transition-opacity animate-fade-in">
      {/* Modal / Bottom Sheet */}
      <div
        className="w-full sm:max-w-xl bg-white rounded-t-3xl sm:rounded-2xl max-h-[90vh] flex flex-col shadow-2xl overflow-hidden border border-stone-200"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Mobile drag handle */}
        <div className="sm:hidden w-12 h-1 bg-stone-300 rounded-full mx-auto my-2 shrink-0" />

        {/* Header / Hero Media */}
        <div className="relative aspect-[16/9] w-full bg-stone-900 shrink-0">
          <img
            src={product.image}
            alt={product.name}
            referrerPolicy="no-referrer"
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-stone-950/80 via-transparent to-black/30"></div>

          <button
            onClick={onClose}
            aria-label="Fechar janela"
            className="absolute top-3 right-3 w-9 h-9 rounded-full bg-black/60 hover:bg-black text-white flex items-center justify-center transition-colors"
          >
            <X className="w-5 h-5" />
          </button>

          <div className="absolute bottom-3 left-4 right-4 text-white">
            <div className="flex items-center gap-2 mb-1">
              <span className="bg-red-600 text-white text-[10px] uppercase font-bold px-2 py-0.5 rounded">
                {product.category}
              </span>
              <div className="flex items-center gap-1 text-xs text-amber-300 font-semibold">
                <Star className="w-3.5 h-3.5 fill-amber-400 text-amber-400" />
                <span>{product.rating.toFixed(1)}</span>
                <span className="text-stone-300">({product.ratingCount} avaliações)</span>
              </div>
            </div>
            <h2 className="text-xl sm:text-2xl font-bold font-serif-italian leading-tight">
              {product.name}
            </h2>
          </div>
        </div>

        {/* Scrollable Configuration Options */}
        <div className="p-4 sm:p-6 overflow-y-auto space-y-6 flex-1 text-stone-800">
          <p className="text-xs sm:text-sm text-stone-600 leading-relaxed">
            {product.description}
          </p>

          {/* Size Selection (for pizzas) */}
          {product.hasSizes && (
            <div className="space-y-2.5">
              <div className="flex items-center justify-between">
                <label className="text-xs font-bold uppercase tracking-wider text-stone-900">
                  1. Escolha o Tamanho
                </label>
                <span className="text-[11px] font-semibold text-red-600">Obrigatório</span>
              </div>

              <div className="grid grid-cols-3 gap-2">
                {(['media', 'grande', 'familia'] as PizzaSize[]).map((s) => {
                  const sizeInfo = SIZE_PRICES[s];
                  const calculatedSizePrice = Math.round(product.basePrice * sizeInfo.priceMultiplier / 100) * 100;
                  const isSelected = size === s;

                  return (
                    <button
                      type="button"
                      key={s}
                      onClick={() => setSize(s)}
                      className={`p-3 rounded-xl border text-left flex flex-col justify-between transition-all cursor-pointer ${
                        isSelected
                          ? 'border-red-600 bg-red-50/50 shadow-xs ring-1 ring-red-600'
                          : 'border-stone-200 bg-white hover:bg-stone-50'
                      }`}
                    >
                      <div>
                        <div className="font-bold text-xs sm:text-sm text-stone-900">{sizeInfo.label}</div>
                        <div className="text-[10px] text-stone-500 mt-0.5">{sizeInfo.slices}</div>
                      </div>
                      <div className="text-xs font-bold text-red-600 font-mono mt-2 tabular-nums">
                        {formatAOA(calculatedSizePrice)}
                      </div>
                    </button>
                  );
                })}
              </div>
            </div>
          )}

          {/* Crust Selection (for pizzas) */}
          {product.hasSizes && (
            <div className="space-y-2.5">
              <div className="flex items-center justify-between">
                <label className="text-xs font-bold uppercase tracking-wider text-stone-900">
                  2. Tipo de Borda
                </label>
                <span className="text-[11px] text-stone-500">Opcional</span>
              </div>

              <div className="space-y-2">
                {CRUST_OPTIONS.map((c) => {
                  const isSelected = crust === c.id;

                  return (
                    <label
                      key={c.id}
                      onClick={() => setCrust(c.id as PizzaCrust)}
                      className={`flex items-center justify-between p-3 rounded-xl border cursor-pointer transition-all ${
                        isSelected
                          ? 'border-red-600 bg-red-50/40'
                          : 'border-stone-200 hover:bg-stone-50'
                      }`}
                    >
                      <div className="flex items-center gap-2.5">
                        <div
                          className={`w-4 h-4 rounded-full border flex items-center justify-center ${
                            isSelected ? 'border-red-600 bg-red-600' : 'border-stone-300'
                          }`}
                        >
                          {isSelected && <div className="w-1.5 h-1.5 bg-white rounded-full"></div>}
                        </div>
                        <span className="text-xs sm:text-sm font-medium text-stone-800">{c.name}</span>
                      </div>
                      <span className="text-xs font-mono font-bold text-stone-700">
                        {c.price === 0 ? 'Grátis' : `+${formatAOA(c.price)}`}
                      </span>
                    </label>
                  );
                })}
              </div>
            </div>
          )}

          {/* Extras / Adicionais */}
          <div className="space-y-2.5">
            <div className="flex items-center justify-between">
              <label className="text-xs font-bold uppercase tracking-wider text-stone-900">
                {product.hasSizes ? '3. Ingredientes Adicionais' : 'Personalizar Ingredientes'}
              </label>
              <span className="text-[11px] text-stone-500">Opcional</span>
            </div>

            <div className="space-y-2">
              {EXTRA_TOPPINGS.map((extra) => {
                const isSelected = selectedExtras.includes(extra.id);

                return (
                  <label
                    key={extra.id}
                    onClick={() => handleToggleExtra(extra.id)}
                    className={`flex items-center justify-between p-3 rounded-xl border cursor-pointer transition-all ${
                      isSelected
                        ? 'border-red-600 bg-red-50/40'
                        : 'border-stone-200 hover:bg-stone-50'
                    }`}
                  >
                    <div className="flex items-center gap-2.5">
                      <div
                        className={`w-4 h-4 rounded-md border flex items-center justify-center ${
                          isSelected ? 'border-red-600 bg-red-600 text-white' : 'border-stone-300'
                        }`}
                      >
                        {isSelected && <Check className="w-3 h-3 stroke-[3]" />}
                      </div>
                      <span className="text-xs sm:text-sm font-medium text-stone-800">{extra.name}</span>
                    </div>
                    <span className="text-xs font-mono font-bold text-stone-700">
                      +{formatAOA(extra.price)}
                    </span>
                  </label>
                );
              })}
            </div>
          </div>

          {/* Notes for kitchen */}
          <div className="space-y-1.5">
            <label className="text-xs font-bold uppercase tracking-wider text-stone-900">
              Observações do Pedido
            </label>
            <input
              type="text"
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              placeholder="Ex: sem cebola, massa bem crocante, fatiar em 8..."
              className="w-full text-xs sm:text-sm px-3.5 py-2.5 rounded-xl border border-stone-200 focus:outline-none focus:border-red-600 focus:ring-1 focus:ring-red-600"
            />
          </div>
        </div>

        {/* Footer: Quantity & Add Button */}
        <div className="p-4 sm:p-5 bg-stone-50 border-t border-stone-200 flex items-center justify-between gap-3 shrink-0">
          {/* Quantity Controls */}
          <div className="flex items-center bg-white border border-stone-200 rounded-xl p-1 shadow-2xs">
            <button
              type="button"
              onClick={() => setQuantity((q) => Math.max(1, q - 1))}
              disabled={quantity <= 1}
              aria-label="Diminuir quantidade"
              className="min-h-[40px] min-w-[40px] rounded-lg hover:bg-stone-100 disabled:opacity-30 flex items-center justify-center transition-colors cursor-pointer"
            >
              <Minus className="w-4 h-4 text-stone-700" />
            </button>
            <span className="w-8 text-center font-bold text-sm font-mono tabular-nums text-stone-900">
              {quantity}
            </span>
            <button
              type="button"
              onClick={() => setQuantity((q) => q + 1)}
              aria-label="Aumentar quantidade"
              className="min-h-[40px] min-w-[40px] rounded-lg hover:bg-stone-100 flex items-center justify-center transition-colors cursor-pointer"
            >
              <Plus className="w-4 h-4 text-stone-700" />
            </button>
          </div>

          {/* Add CTA */}
          <button
            type="button"
            onClick={handleConfirm}
            className="flex-1 min-h-[48px] px-5 py-3 rounded-xl bg-red-600 hover:bg-red-700 active:scale-98 text-white font-bold text-sm flex items-center justify-between shadow-md shadow-red-950/20 transition-all cursor-pointer"
          >
            <span>Adicionar ao Pedido</span>
            <span className="font-mono tabular-nums text-red-100 font-extrabold">
              {formatAOA(totalPrice)}
            </span>
          </button>
        </div>
      </div>
    </div>
  );
};
