import React, { useState } from 'react';
import { Gift, Sparkles, CheckCircle2, ArrowRight, Flame, Clock, Calendar } from 'lucide-react';
import { PROMOTIONS_DATA } from '../data/menu';

interface PromotionsSectionProps {
  onSelectCategory: (category: 'pizzas' | 'hamburgueres' | 'fahita') => void;
}

export const PromotionsSection: React.FC<PromotionsSectionProps> = ({ onSelectCategory }) => {
  // Determine if today is weekday (Mon-Thu) or weekend (Fri-Sun)
  // getDay(): 0 is Sunday, 1 is Monday, 2 is Tuesday, 3 is Wednesday, 4 is Thursday, 5 is Friday, 6 is Saturday
  const currentDay = new Date().getDay();
  const isWeekendNow = currentDay === 0 || currentDay === 5 || currentDay === 6;

  const [activeTab, setActiveTab] = useState<'weekday' | 'weekend'>(isWeekendNow ? 'weekend' : 'weekday');

  const currentPromo = PROMOTIONS_DATA[activeTab];

  return (
    <section id="promo-section" className="max-w-6xl mx-auto px-4 py-8">
      {/* Section Header */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 mb-6">
        <div>
          <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-red-600 mb-1">
            <Gift className="w-4 h-4 text-red-600" />
            <span>CAMPANHAS DE OFERTAS & DESCONTOS</span>
          </div>
          <h2 className="text-2xl sm:text-3xl font-extrabold font-serif-italian text-stone-900">
            Promoções Exclusivas no Zango 2
          </h2>
          <p className="text-xs sm:text-sm text-stone-600 mt-1">
            Peça as suas pizzas, hambúrgueres e fahitas favoritas e receba ofertas especiais diretamente no seu pedido!
          </p>
        </div>

        {/* Tab switch */}
        <div className="flex items-center gap-1.5 p-1 bg-stone-200/80 rounded-xl shrink-0 self-start md:self-auto">
          <button
            onClick={() => setActiveTab('weekday')}
            className={`min-h-[40px] px-3.5 py-1.5 rounded-lg text-xs font-bold flex items-center gap-1.5 transition-all cursor-pointer ${
              activeTab === 'weekday'
                ? 'bg-stone-900 text-white shadow-xs'
                : 'text-stone-700 hover:text-stone-900'
            }`}
          >
            <Calendar className="w-3.5 h-3.5" />
            <span>Seg a Qui</span>
            {!isWeekendNow && (
              <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse ml-0.5" title="Ativo hoje" />
            )}
          </button>

          <button
            onClick={() => setActiveTab('weekend')}
            className={`min-h-[40px] px-3.5 py-1.5 rounded-lg text-xs font-bold flex items-center gap-1.5 transition-all cursor-pointer ${
              activeTab === 'weekend'
                ? 'bg-red-600 text-white shadow-xs'
                : 'text-stone-700 hover:text-stone-900'
            }`}
          >
            <Sparkles className="w-3.5 h-3.5" />
            <span>Sex a Dom (FDS)</span>
            {isWeekendNow && (
              <span className="w-2 h-2 rounded-full bg-amber-300 animate-pulse ml-0.5" title="Ativo hoje" />
            )}
          </button>
        </div>
      </div>

      {/* Active Day Banner */}
      <div className="mb-6 p-4 rounded-2xl bg-stone-900 text-white border border-stone-800 flex flex-col sm:flex-row sm:items-center justify-between gap-3 shadow-md">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-red-600/20 text-red-500 border border-red-500/30 flex items-center justify-center shrink-0">
            <Clock className="w-5 h-5 text-red-500" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="font-bold text-sm text-stone-100">{currentPromo.period}</span>
              {((!isWeekendNow && activeTab === 'weekday') || (isWeekendNow && activeTab === 'weekend')) && (
                <span className="px-2 py-0.5 bg-emerald-950 border border-emerald-700 text-emerald-400 text-[10px] font-bold rounded uppercase tracking-wider">
                  Promoção Ativa Hoje
                </span>
              )}
            </div>
            <p className="text-xs text-stone-400 mt-0.5">
              {currentPromo.subtitle}
            </p>
          </div>
        </div>

        <div className="text-right shrink-0">
          <span className="text-[11px] text-stone-400 block sm:inline">
            Adicionado automaticamente no WhatsApp
          </span>
        </div>
      </div>

      {/* Promotion Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {currentPromo.offers.map((offer, idx) => (
          <div
            key={offer.id || idx}
            className="group relative bg-white rounded-2xl p-5 border border-stone-200/90 shadow-xs hover:shadow-md transition-all flex flex-col justify-between overflow-hidden"
          >
            {/* Top Tag */}
            <div>
              <div className="flex items-center justify-between mb-3">
                <span className="text-[10px] uppercase font-extrabold tracking-wider px-2 py-0.5 rounded bg-red-100 text-red-800">
                  {offer.tag}
                </span>
                <Gift className="w-4 h-4 text-red-600" />
              </div>

              {/* Offer Trigger */}
              <h3 className="font-bold text-stone-900 text-base mb-1.5 group-hover:text-red-600 transition-colors">
                {offer.trigger}
              </h3>

              {/* Offer Reward */}
              <div className="p-3 rounded-xl bg-amber-50/70 border border-amber-200/80 mb-4">
                <div className="flex items-start gap-2">
                  <CheckCircle2 className="w-4 h-4 text-amber-600 shrink-0 mt-0.5" />
                  <p className="text-xs font-bold text-stone-900 leading-snug">
                    {offer.reward}
                  </p>
                </div>
              </div>
            </div>

            {/* Quick Action */}
            <div className="pt-2 border-t border-stone-100 flex items-center justify-between">
              <span className="text-[11px] text-stone-500 font-medium">
                Válido para pedidos online
              </span>
              <button
                onClick={() => {
                  if (offer.minBurgers) {
                    onSelectCategory('hamburgueres');
                  } else {
                    onSelectCategory('pizzas');
                  }
                }}
                className="text-xs font-bold text-red-600 hover:text-red-700 flex items-center gap-1 transition-colors cursor-pointer"
              >
                <span>Aproveitar</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
};
