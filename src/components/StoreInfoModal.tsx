import React from 'react';
import { X, MapPin, Clock, Phone, MessageSquare, ShieldCheck, Bike, Award } from 'lucide-react';
import { STORE_INFO } from '../data/menu';

interface StoreInfoModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const StoreInfoModal: React.FC<StoreInfoModalProps> = ({ isOpen, onClose }) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-stone-950/70 backdrop-blur-xs animate-fade-in">
      <div
        className="w-full max-w-lg bg-white rounded-2xl shadow-2xl overflow-hidden border border-stone-200"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="bg-stone-900 text-white p-5 flex items-center justify-between border-b border-stone-800">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-red-600 flex items-center justify-center font-serif-italian font-bold text-white text-lg shadow-sm">
              PI
            </div>
            <div>
              <h2 className="text-base font-bold font-serif-italian">{STORE_INFO.name}</h2>
              <p className="text-[11px] text-stone-400">{STORE_INFO.subtitle}</p>
            </div>
          </div>

          <button
            onClick={onClose}
            aria-label="Fechar"
            className="w-8 h-8 rounded-full bg-stone-800 hover:bg-stone-700 text-stone-300 flex items-center justify-center transition-colors"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Content */}
        <div className="p-5 space-y-4 max-h-[80vh] overflow-y-auto text-stone-800 text-sm">
          {/* Location Box */}
          <div className="flex items-start gap-3 p-3.5 rounded-xl bg-stone-50 border border-stone-200">
            <MapPin className="w-5 h-5 text-red-600 shrink-0 mt-0.5" />
            <div>
              <div className="font-bold text-stone-900">Localização no Zango</div>
              <p className="text-xs text-stone-600 mt-0.5">
                {STORE_INFO.address}
              </p>
              <div className="mt-1 text-[11px] text-emerald-700 font-medium">
                Ponto de referência: Logo atrás da Paragem da ZAP, Zango 2
              </div>
            </div>
          </div>

          {/* Opening Hours */}
          <div className="flex items-start gap-3 p-3.5 rounded-xl bg-stone-50 border border-stone-200">
            <Clock className="w-5 h-5 text-emerald-600 shrink-0 mt-0.5" />
            <div>
              <div className="font-bold text-stone-900">Horário de Funcionamento</div>
              <p className="text-xs text-stone-600 mt-0.5">
                {STORE_INFO.schedule}
              </p>
              <p className="text-[11px] text-stone-500 mt-0.5">
                Segunda-feira: Fechado para manutenção e descanso da equipa
              </p>
            </div>
          </div>

          {/* Delivery & Zones */}
          <div className="flex items-start gap-3 p-3.5 rounded-xl bg-stone-50 border border-stone-200">
            <Bike className="w-5 h-5 text-amber-600 shrink-0 mt-0.5" />
            <div>
              <div className="font-bold text-stone-900">Áreas de Entrega</div>
              <p className="text-xs text-stone-600 mt-0.5">
                Zango 0, 1, 2, 3, 4, 5, Zango 8.000 (Vida Pacífica), Pólo Industrial de Viana e Centralidade do Kilamba / Luanda Sul.
              </p>
              <p className="text-[11px] text-stone-500 mt-0.5">
                Tempo médio de entrega: 30 a 50 minutos em motoboys equipados com mochilas térmicas.
              </p>
            </div>
          </div>

          {/* Quality commitment */}
          <div className="flex items-start gap-3 p-3.5 rounded-xl bg-stone-50 border border-stone-200">
            <Award className="w-5 h-5 text-red-600 shrink-0 mt-0.5" />
            <div>
              <div className="font-bold text-stone-900">Tradição & Qualidade</div>
              <p className="text-xs text-stone-600 mt-0.5">
                Massas de fermentação lenta com farinha tipo 00, molho de tomate pelado San Marzano e queijos de alta qualidade selecionados a dedo.
              </p>
            </div>
          </div>

          {/* WhatsApp Direct Action */}
          <div className="pt-2">
            <a
              href={`https://wa.me/${STORE_INFO.whatsappRaw}?text=${encodeURIComponent('Olá Pizzaria Italiana! Gostaria de tirar uma dúvida sobre o cardápio e entregas no Zango.')}`}
              target="_blank"
              rel="noopener noreferrer"
              className="w-full min-h-[46px] rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs sm:text-sm flex items-center justify-center gap-2 shadow-md transition-all cursor-pointer"
            >
              <MessageSquare className="w-4 h-4" />
              <span>Falar no WhatsApp: {STORE_INFO.whatsappNumber}</span>
            </a>
          </div>
        </div>
      </div>
    </div>
  );
};
