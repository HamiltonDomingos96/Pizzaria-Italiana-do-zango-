import React, { useState } from 'react';
import { 
  X, 
  Trash2, 
  Plus, 
  Minus, 
  ShoppingBag, 
  Send, 
  Tag, 
  MapPin, 
  CreditCard, 
  ArrowRight,
  CheckCircle2,
  Bike,
  Store,
  AlertCircle
} from 'lucide-react';
import { CartItem } from '../types';
import { 
  DELIVERY_ZONES, 
  PAYMENT_METHODS, 
  COUPONS, 
  STORE_INFO, 
  SIZE_PRICES, 
  CRUST_OPTIONS, 
  formatAOA 
} from '../data/menu';

interface CartDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  items: CartItem[];
  onUpdateQuantity: (cartItemId: string, newQuantity: number) => void;
  onRemoveItem: (cartItemId: string) => void;
  onClearCart: () => void;
  appliedCoupon: string;
  onApplyCoupon: (code: string) => void;
  onRemoveCoupon: () => void;
  onOpenStoreInfo: () => void;
}

export const CartDrawer: React.FC<CartDrawerProps> = ({
  isOpen,
  onClose,
  items,
  onUpdateQuantity,
  onRemoveItem,
  onClearCart,
  appliedCoupon,
  onApplyCoupon,
  onRemoveCoupon,
  onOpenStoreInfo,
}) => {
  // Checkout form state
  const [customerName, setCustomerName] = useState('');
  const [customerPhone, setCustomerPhone] = useState('');
  const [deliveryType, setDeliveryType] = useState<'delivery' | 'pickup'>('delivery');
  const [selectedZoneId, setSelectedZoneId] = useState('zango-2');
  const [detailedAddress, setDetailedAddress] = useState('');
  const [paymentMethod, setPaymentMethod] = useState('express');
  const [cashChangeFor, setCashChangeFor] = useState('');
  const [orderNotes, setOrderNotes] = useState('');

  // Coupon input
  const [couponInput, setCouponInput] = useState('');
  const [couponError, setCouponError] = useState('');
  const [formError, setFormError] = useState('');

  if (!isOpen) return null;

  // Pricing calculations
  const subtotal = items.reduce((sum, item) => sum + item.itemPrice * item.quantity, 0);

  const selectedZone = DELIVERY_ZONES.find((z) => z.id === selectedZoneId) || DELIVERY_ZONES[0];
  const initialDeliveryFee = deliveryType === 'pickup' ? 0 : selectedZone.fee;

  // Coupon discount logic
  let discountAmount = 0;
  let activeCouponObj = COUPONS.find((c) => c.code.toUpperCase() === appliedCoupon.toUpperCase());

  if (activeCouponObj && subtotal >= activeCouponObj.minOrder) {
    if (activeCouponObj.discountType === 'free_delivery') {
      discountAmount = initialDeliveryFee;
    } else if (activeCouponObj.discountType === 'percentage') {
      discountAmount = Math.round((subtotal * activeCouponObj.discountValue) / 100);
    } else if (activeCouponObj.discountType === 'fixed') {
      discountAmount = activeCouponObj.discountValue;
    }
  }

  const finalDeliveryFee = Math.max(0, initialDeliveryFee - (activeCouponObj?.discountType === 'free_delivery' ? discountAmount : 0));
  const finalTotal = Math.max(0, subtotal + (activeCouponObj?.discountType === 'free_delivery' ? 0 : initialDeliveryFee) - (activeCouponObj?.discountType !== 'free_delivery' ? discountAmount : 0));

  const handleApplyCoupon = (e: React.FormEvent) => {
    e.preventDefault();
    setCouponError('');
    const code = couponInput.trim().toUpperCase();
    if (!code) return;

    const matched = COUPONS.find((c) => c.code === code);
    if (!matched) {
      setCouponError('Cupão inválido. Tente PRIMEIRAFATIA ou ZANGO10.');
      return;
    }
    if (subtotal < matched.minOrder) {
      setCouponError(`Pedido mínimo de ${formatAOA(matched.minOrder)} para este cupão.`);
      return;
    }

    onApplyCoupon(code);
    setCouponInput('');
  };

  const handleCheckoutViaWhatsApp = () => {
    setFormError('');

    if (items.length === 0) {
      setFormError('Seu carrinho está vazio.');
      return;
    }

    if (!customerName.trim()) {
      setFormError('Por favor, informe o seu nome para o pedido.');
      return;
    }

    if (!customerPhone.trim() || customerPhone.trim().length < 9) {
      setFormError('Por favor, informe o seu número de WhatsApp de contacto.');
      return;
    }

    if (deliveryType === 'delivery' && !detailedAddress.trim()) {
      setFormError('Por favor, informe o seu endereço no Zango com ponto de referência.');
      return;
    }

    // Build structured WhatsApp message according to the required format
    let itemsText = '';
    items.forEach((item) => {
      let customDetails: string[] = [];
      if (item.size) {
        customDetails.push(`Tam: ${SIZE_PRICES[item.size]?.label || item.size}`);
      }
      if (item.crust && item.crust !== 'tradicional') {
        const crustObj = CRUST_OPTIONS.find((c) => c.id === item.crust);
        customDetails.push(`Borda: ${crustObj?.name || item.crust}`);
      }
      if (item.notes) {
        customDetails.push(`Obs: ${item.notes}`);
      }

      const detailsStr = customDetails.length > 0 ? ` (${customDetails.join(', ')})` : '';
      itemsText += `- ${item.quantity}x ${item.product.name}${detailsStr} (${formatAOA(item.itemPrice * item.quantity)})\n`;
    });

    const paymentLabel = PAYMENT_METHODS.find((p) => p.id === paymentMethod)?.label || paymentMethod;
    const paymentWithCashChange =
      paymentMethod === 'cash' && cashChangeFor.trim()
        ? `${paymentLabel} (Troco para ${cashChangeFor} Kz)`
        : paymentLabel;

    const deliveryAddressText =
      deliveryType === 'delivery'
        ? `${selectedZone.name} - ${detailedAddress.trim()}`
        : 'Retirada no Balcão (Zango 2 - Paragem da ZAP)';

    const discountText = discountAmount > 0 ? `\n*Desconto:* -${formatAOA(discountAmount)}` : '';
    const notesText = orderNotes.trim() ? `\n*Obs Geral:* ${orderNotes.trim()}` : '';

    const message = 
`🍕 *NOVO PEDIDO - PIZZARIA ITALIANA*
*Cliente:* ${customerName.trim()}
*Telefone:* ${customerPhone.trim()}
*Modalidade:* ${deliveryType === 'delivery' ? 'Entrega ao Domicílio' : 'Retirada na Loja'}
*Endereço:* ${deliveryAddressText}
*Itens:*
${itemsText.trimEnd()}
*Subtotal:* ${formatAOA(subtotal)}
*Taxa de Entrega:* ${formatAOA(initialDeliveryFee)}${discountText}
*Total:* ${formatAOA(finalTotal)}
*Pagamento:* ${paymentWithCashChange}${notesText}
---
_Enviado pelo App Web da Pizzaria Italiana_`;

    const encodedMessage = encodeURIComponent(message);
    const whatsappUrl = `https://wa.me/${STORE_INFO.whatsappRaw}?text=${encodedMessage}`;

    // Open WhatsApp URL
    window.open(whatsappUrl, '_blank');
  };

  return (
    <div className="fixed inset-0 z-50 overflow-hidden bg-stone-950/70 backdrop-blur-xs flex justify-end">
      {/* Backdrop */}
      <div className="absolute inset-0" onClick={onClose} />

      {/* Drawer Container */}
      <div className="relative w-full max-w-lg bg-stone-50 h-full flex flex-col shadow-2xl z-10 overflow-hidden">
        {/* Drawer Header */}
        <div className="bg-stone-900 text-white px-5 py-4 flex items-center justify-between border-b border-stone-800">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-lg bg-red-600 flex items-center justify-center text-white">
              <ShoppingBag className="w-4 h-4" />
            </div>
            <div>
              <h2 className="font-bold text-base font-serif-italian">Seu Pedido</h2>
              <p className="text-[11px] text-stone-400">
                {items.length === 0
                  ? 'Carrinho vazio'
                  : `${items.length} ${items.length === 1 ? 'item' : 'itens'} adicionados`}
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            {items.length > 0 && (
              <button
                onClick={onClearCart}
                className="text-stone-400 hover:text-red-400 text-xs px-2 py-1 transition-colors"
                title="Esvaziar carrinho"
              >
                Limpar
              </button>
            )}
            <button
              onClick={onClose}
              className="w-8 h-8 rounded-full bg-stone-800 hover:bg-stone-700 text-stone-200 flex items-center justify-center transition-colors"
              aria-label="Fechar carrinho"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Drawer Body - Scrollable */}
        <div className="flex-1 overflow-y-auto p-4 space-y-5">
          {items.length === 0 ? (
            <div className="py-16 text-center space-y-4">
              <div className="w-16 h-16 bg-stone-200 rounded-full flex items-center justify-center mx-auto text-stone-400">
                <ShoppingBag className="w-8 h-8" />
              </div>
              <div className="space-y-1">
                <h3 className="font-bold text-stone-800 text-base">O seu carrinho está vazio</h3>
                <p className="text-xs text-stone-500 max-w-xs mx-auto">
                  Adicione as nossas autênticas pizzas artesanais, hambúrgueres suculentos, fajitas ou sumos naturais para começar.
                </p>
              </div>
              <button
                onClick={onClose}
                className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-red-600 text-white font-bold text-xs uppercase tracking-wider shadow-sm hover:bg-red-700 transition-colors"
              >
                <span>Explorar Cardápio</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </button>
            </div>
          ) : (
            <>
              {/* Item List */}
              <div className="space-y-3">
                <span className="text-xs font-bold uppercase tracking-wider text-stone-500">
                  Itens Selecionados
                </span>

                {items.map((item) => (
                  <div
                    key={item.cartItemId}
                    className="bg-white rounded-xl p-3.5 border border-stone-200/90 shadow-2xs flex items-center justify-between gap-3"
                  >
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2">
                        <h4 className="font-bold text-sm text-stone-900 truncate">
                          {item.product.name}
                        </h4>
                      </div>

                      {/* Item configurations */}
                      <div className="text-[11px] text-stone-500 space-y-0.5 mt-0.5">
                        {item.size && (
                          <div>
                            Tamanho: <span className="font-medium text-stone-700">{SIZE_PRICES[item.size]?.label}</span>
                          </div>
                        )}
                        {item.crust && item.crust !== 'tradicional' && (
                          <div>
                            Borda: <span className="font-medium text-stone-700">{CRUST_OPTIONS.find((c) => c.id === item.crust)?.name}</span>
                          </div>
                        )}
                        {item.notes && (
                          <div className="italic text-stone-600">
                            Obs: "{item.notes}"
                          </div>
                        )}
                      </div>

                      <div className="text-xs font-bold text-red-600 font-mono mt-1 tabular-nums">
                        {formatAOA(item.itemPrice * item.quantity)}
                      </div>
                    </div>

                    {/* Quantity & Delete Controls */}
                    <div className="flex items-center gap-2 shrink-0">
                      <div className="flex items-center bg-stone-100 border border-stone-200 rounded-lg p-0.5">
                        <button
                          onClick={() => onUpdateQuantity(item.cartItemId, item.quantity - 1)}
                          className="w-7 h-7 rounded flex items-center justify-center text-stone-700 hover:bg-white transition-colors"
                          aria-label="Diminuir"
                        >
                          <Minus className="w-3 h-3" />
                        </button>
                        <span className="w-6 text-center text-xs font-bold font-mono text-stone-900">
                          {item.quantity}
                        </span>
                        <button
                          onClick={() => onUpdateQuantity(item.cartItemId, item.quantity + 1)}
                          className="w-7 h-7 rounded flex items-center justify-center text-stone-700 hover:bg-white transition-colors"
                          aria-label="Aumentar"
                        >
                          <Plus className="w-3 h-3" />
                        </button>
                      </div>

                      <button
                        onClick={() => onRemoveItem(item.cartItemId)}
                        className="p-1.5 text-stone-400 hover:text-red-600 transition-colors"
                        title="Remover item"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                ))}
              </div>

              {/* Delivery Type Segmented Toggle */}
              <div className="bg-white rounded-xl p-3 border border-stone-200 space-y-2">
                <span className="text-xs font-bold uppercase tracking-wider text-stone-700 block">
                  Tipo de Entrega
                </span>
                <div className="grid grid-cols-2 gap-1.5 p-1 bg-stone-100 rounded-lg">
                  <button
                    type="button"
                    onClick={() => setDeliveryType('delivery')}
                    className={`py-2 px-3 rounded-md text-xs font-bold flex items-center justify-center gap-2 transition-all cursor-pointer ${
                      deliveryType === 'delivery'
                        ? 'bg-red-600 text-white shadow-xs'
                        : 'text-stone-600 hover:text-stone-900'
                    }`}
                  >
                    <Bike className="w-3.5 h-3.5" />
                    <span>Entrega no Zango</span>
                  </button>

                  <button
                    type="button"
                    onClick={() => setDeliveryType('pickup')}
                    className={`py-2 px-3 rounded-md text-xs font-bold flex items-center justify-center gap-2 transition-all cursor-pointer ${
                      deliveryType === 'pickup'
                        ? 'bg-stone-900 text-white shadow-xs'
                        : 'text-stone-600 hover:text-stone-900'
                    }`}
                  >
                    <Store className="w-3.5 h-3.5" />
                    <span>Retirada no Balcão</span>
                  </button>
                </div>
              </div>

              {/* Delivery Zone Selection (if delivery) */}
              {deliveryType === 'delivery' && (
                <div className="bg-white rounded-xl p-3.5 border border-stone-200 space-y-2.5">
                  <div className="flex items-center justify-between">
                    <label className="text-xs font-bold uppercase tracking-wider text-stone-700 flex items-center gap-1.5">
                      <MapPin className="w-3.5 h-3.5 text-red-500" />
                      Zona de Entrega (Zango / Luanda)
                    </label>
                  </div>

                  <select
                    value={selectedZoneId}
                    onChange={(e) => setSelectedZoneId(e.target.value)}
                    className="w-full text-xs sm:text-sm font-medium bg-stone-50 border border-stone-300 rounded-xl p-2.5 text-stone-900 focus:outline-none focus:border-red-600 focus:bg-white"
                  >
                    {DELIVERY_ZONES.map((zone) => (
                      <option key={zone.id} value={zone.id}>
                        {zone.name} — {zone.fee === 0 ? 'Grátis' : formatAOA(zone.fee)} ({zone.timeEstimate})
                      </option>
                    ))}
                  </select>
                </div>
              )}

              {/* Customer Information Form */}
              <div className="bg-white rounded-xl p-3.5 border border-stone-200 space-y-3">
                <span className="text-xs font-bold uppercase tracking-wider text-stone-700 block">
                  Dados para Envio do Pedido
                </span>

                <div className="space-y-2">
                  <div>
                    <label className="text-[11px] font-semibold text-stone-600 block mb-1">
                      Seu Nome Completo *
                    </label>
                    <input
                      type="text"
                      value={customerName}
                      onChange={(e) => setCustomerName(e.target.value)}
                      placeholder="Ex: Hamilton Domingos"
                      className="w-full text-xs sm:text-sm px-3 py-2 rounded-lg border border-stone-300 focus:outline-none focus:border-red-600"
                    />
                  </div>

                  <div>
                    <label className="text-[11px] font-semibold text-stone-600 block mb-1">
                      Número de WhatsApp (+244) *
                    </label>
                    <input
                      type="tel"
                      value={customerPhone}
                      onChange={(e) => setCustomerPhone(e.target.value)}
                      placeholder="Ex: 929 843 000"
                      className="w-full text-xs sm:text-sm px-3 py-2 rounded-lg border border-stone-300 focus:outline-none focus:border-red-600 font-mono"
                    />
                  </div>

                  {deliveryType === 'delivery' && (
                    <div>
                      <label className="text-[11px] font-semibold text-stone-600 block mb-1">
                        Endereço & Ponto de Referência no Zango *
                      </label>
                      <textarea
                        rows={2}
                        value={detailedAddress}
                        onChange={(e) => setDetailedAddress(e.target.value)}
                        placeholder="Ex: Zango 2, Rua das Acácias, casa nº 45, próximo à paragem da ZAP"
                        className="w-full text-xs sm:text-sm px-3 py-2 rounded-lg border border-stone-300 focus:outline-none focus:border-red-600"
                      />
                    </div>
                  )}

                  {/* Payment Method Selector */}
                  <div>
                    <label className="text-[11px] font-semibold text-stone-600 block mb-1">
                      Método de Pagamento *
                    </label>
                    <div className="space-y-1.5">
                      {PAYMENT_METHODS.map((pm) => (
                        <label
                          key={pm.id}
                          className={`flex items-center justify-between p-2.5 rounded-lg border cursor-pointer text-xs transition-colors ${
                            paymentMethod === pm.id
                              ? 'border-red-600 bg-red-50/50 font-bold text-stone-900'
                              : 'border-stone-200 hover:bg-stone-50 text-stone-700'
                          }`}
                        >
                          <div className="flex items-center gap-2">
                            <input
                              type="radio"
                              name="paymentMethod"
                              checked={paymentMethod === pm.id}
                              onChange={() => setPaymentMethod(pm.id)}
                              className="accent-red-600"
                            />
                            <span>{pm.label}</span>
                          </div>
                          <span className="text-[10px] text-stone-400 font-normal">{pm.desc}</span>
                        </label>
                      ))}
                    </div>
                  </div>

                  {/* Cash Change field if Dinheiro is selected */}
                  {paymentMethod === 'cash' && (
                    <div className="pt-1">
                      <label className="text-[11px] font-semibold text-stone-600 block mb-1">
                        Precisa de troco para quanto? (Kz)
                      </label>
                      <input
                        type="text"
                        value={cashChangeFor}
                        onChange={(e) => setCashChangeFor(e.target.value)}
                        placeholder="Ex: 20.000 Kz ou Não preciso"
                        className="w-full text-xs px-3 py-2 rounded-lg border border-stone-300 focus:outline-none focus:border-red-600 font-mono"
                      />
                    </div>
                  )}

                  <div>
                    <label className="text-[11px] font-semibold text-stone-600 block mb-1">
                      Observações do Pedido (Opcional)
                    </label>
                    <input
                      type="text"
                      value={orderNotes}
                      onChange={(e) => setOrderNotes(e.target.value)}
                      placeholder="Ex: Entregar bem quentinha, bater no portão azul..."
                      className="w-full text-xs px-3 py-2 rounded-lg border border-stone-300 focus:outline-none focus:border-red-600"
                    />
                  </div>
                </div>
              </div>

              {/* Coupon Section */}
              <div className="bg-white rounded-xl p-3.5 border border-stone-200 space-y-2">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold uppercase tracking-wider text-stone-700 flex items-center gap-1.5">
                    <Tag className="w-3.5 h-3.5 text-red-500" />
                    Cupão de Desconto
                  </span>
                  {appliedCoupon && (
                    <button
                      onClick={onRemoveCoupon}
                      className="text-[11px] text-red-600 hover:underline font-semibold"
                    >
                      Remover cupão
                    </button>
                  )}
                </div>

                {appliedCoupon ? (
                  <div className="flex items-center justify-between bg-emerald-50 border border-emerald-200 rounded-lg p-2.5 text-xs text-emerald-800">
                    <div className="flex items-center gap-2">
                      <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                      <div>
                        <span className="font-bold">{appliedCoupon}</span> aplicado!
                        <p className="text-[11px] text-emerald-700">{activeCouponObj?.description}</p>
                      </div>
                    </div>
                    <span className="font-bold font-mono">
                      -{formatAOA(discountAmount)}
                    </span>
                  </div>
                ) : (
                  <form onSubmit={handleApplyCoupon} className="flex gap-2">
                    <input
                      type="text"
                      value={couponInput}
                      onChange={(e) => setCouponInput(e.target.value)}
                      placeholder="Digite: PRIMEIRAFATIA"
                      className="flex-1 uppercase font-mono text-xs px-3 py-2 rounded-lg border border-stone-300 focus:outline-none focus:border-red-600"
                    />
                    <button
                      type="submit"
                      className="px-4 py-2 bg-stone-900 hover:bg-stone-800 text-white text-xs font-bold rounded-lg transition-colors cursor-pointer"
                    >
                      Aplicar
                    </button>
                  </form>
                )}

                {couponError && (
                  <p className="text-[11px] text-red-600 font-medium">{couponError}</p>
                )}
              </div>

              {/* Order Summary Breakdown */}
              <div className="bg-stone-100 rounded-xl p-3.5 space-y-2 text-xs border border-stone-200/80">
                <div className="flex justify-between text-stone-600">
                  <span>Subtotal</span>
                  <span className="font-mono tabular-nums font-semibold text-stone-800">
                    {formatAOA(subtotal)}
                  </span>
                </div>

                <div className="flex justify-between text-stone-600">
                  <span>Taxa de Entrega ({deliveryType === 'delivery' ? selectedZone.name.split('(')[0] : 'Retirada'})</span>
                  <span className="font-mono tabular-nums font-semibold text-stone-800">
                    {initialDeliveryFee === 0 ? 'Grátis' : formatAOA(initialDeliveryFee)}
                  </span>
                </div>

                {discountAmount > 0 && (
                  <div className="flex justify-between text-emerald-700 font-medium">
                    <span>Desconto ({appliedCoupon})</span>
                    <span className="font-mono tabular-nums font-semibold">
                      -{formatAOA(discountAmount)}
                    </span>
                  </div>
                )}

                <div className="pt-2 border-t border-stone-300 flex justify-between text-sm sm:text-base font-extrabold text-stone-900">
                  <span>Total a Pagar</span>
                  <span className="font-mono tabular-nums text-red-600">
                    {formatAOA(finalTotal)}
                  </span>
                </div>
              </div>

              {formError && (
                <div className="p-3 rounded-lg bg-red-50 border border-red-200 text-red-700 text-xs flex items-center gap-2">
                  <AlertCircle className="w-4 h-4 shrink-0" />
                  <span>{formError}</span>
                </div>
              )}
            </>
          )}
        </div>

        {/* Drawer Sticky Footer with WhatsApp Checkout CTA */}
        {items.length > 0 && (
          <div className="bg-white p-4 border-t border-stone-200 space-y-2 shadow-lg">
            <button
              onClick={handleCheckoutViaWhatsApp}
              className="w-full min-h-[50px] px-5 py-3 rounded-xl bg-emerald-600 hover:bg-emerald-700 active:scale-98 text-white font-bold text-sm flex items-center justify-center gap-2.5 shadow-md shadow-emerald-900/20 transition-all cursor-pointer"
            >
              <Send className="w-4 h-4" />
              <span>Finalizar Pedido via WhatsApp</span>
            </button>
            <p className="text-[10px] text-center text-stone-500">
              O pedido será formatado e enviado diretamente para o WhatsApp oficial: <span className="font-mono font-bold text-stone-700">{STORE_INFO.whatsappNumber}</span>
            </p>
          </div>
        )}
      </div>
    </div>
  );
};
