import { useState } from 'react';
import { colors } from '../../styles/colors';

export interface WishlistCardItem {
  name: string;
  type: string;
  set: string;
  rarity: string;
  price: string;
  color: string;
  art: string;
  slug: string;
  image_url?: string;
}

interface WishlistPanelProps {
  wishlist: WishlistCardItem[];
  onSelectCardDetail?: (slug: string) => void;
}

export function WishlistPanel({ wishlist, onSelectCardDetail }: WishlistPanelProps) {
  const [selectedWish, setSelectedWish] = useState<WishlistCardItem>(wishlist[0] || null);

  if (!wishlist || wishlist.length === 0) {
    return (
      <aside className="collection-detail wishlist-panel border-l border-black/10 pl-6">
        <div className="wishlist-heading flex items-end justify-between gap-3 border-b border-black/10 pb-3.5 whitespace-nowrap">
          <div>
            <p className="eyebrow text-[10px] font-black uppercase tracking-widest whitespace-nowrap" style={{ color: colors.light.bronze }}>Próximas aquisições</p>
            <h2 className="text-xl font-black tracking-tight whitespace-nowrap mt-1" style={{ color: colors.light['text-main'] }}>Lista de desejos</h2>
          </div>
          <span className="text-xs font-bold whitespace-nowrap" style={{ color: colors.light.bronze }}>0 cartas</span>
        </div>
        <p className="text-xs mt-6" style={{ color: colors.light['text-muted'] }}>Sua lista de desejos está vazia.</p>
      </aside>
    );
  }

  const currentSelected = selectedWish || wishlist[0];
  const orderedWishlist = [
    currentSelected,
    ...wishlist.filter((card) => card.name !== currentSelected.name),
  ];

  return (
    <aside className="collection-detail wishlist-panel border-l border-black/10 pl-6">
      <div className="wishlist-heading flex items-end justify-between gap-3 border-b border-black/10 pb-3.5 whitespace-nowrap">
        <div>
          <p className="eyebrow text-[10px] font-black uppercase tracking-widest whitespace-nowrap" style={{ color: colors.light.bronze }}>Próximas aquisições</p>
          <h2 className="text-xl font-black tracking-tight whitespace-nowrap mt-1" style={{ color: colors.light['text-main'] }}>Lista de desejos</h2>
        </div>
        <span className="text-xs font-bold whitespace-nowrap" style={{ color: colors.light.bronze }}>{wishlist.length} cartas</span>
      </div>

      <div className="wishlist-list flex flex-col gap-2.5 mt-4">
        {orderedWishlist.map((card, index) => (
          <div className="wishlist-entry flex flex-col" key={card.name}>
            <button
              type="button"
              className={`wishlist-item group relative flex items-center gap-3 w-full p-2 rounded-xl border border-transparent text-left transition-all ${
                currentSelected.name === card.name ? 'selected bg-[#e9e1cf] border-[#9b7130]/40' : 'hover:bg-[#e9e1cf]/50'
              }`}
              onClick={() => setSelectedWish(card)}
            >
              {card.image_url ? (
                <img
                  src={card.image_url}
                  alt={card.name}
                  className="w-[42px] h-[58px] object-contain rounded-lg shrink-0 bg-[#1c1815] p-0.5 border border-black/10 transition-transform group-hover:scale-105"
                />
              ) : (
                <div className={`collection-card-art art-${card.art} w-[42px] h-[58px] rounded-lg shrink-0 transition-transform group-hover:scale-105`} />
              )}
              <span className="min-w-0 flex-1">
                <strong className="block text-xs font-extrabold truncate" style={{ color: colors.light['text-main'] }}>{card.name}</strong>
                <small className="block text-[10px] mt-0.5 truncate" style={{ color: colors.light['text-muted'] }}>{card.set}</small>
                <small className="block text-[10px] font-bold mt-0.5" style={{ color: colors.light.bronze }}>{card.price}</small>
              </span>

              {/* Imagem Ampliada Suspensa no Hover */}
              {card.image_url && (
                <div className="pointer-events-none absolute right-full top-1/2 -translate-y-1/2 mr-3 z-50 opacity-0 scale-95 group-hover:opacity-100 group-hover:scale-100 transition-all duration-200 ease-out">
                  <div className="w-52 p-2 rounded-2xl bg-[#1c1815] border border-white/20 shadow-[0_20px_50px_rgba(0,0,0,0.5)] backdrop-blur-md">
                    <img
                      src={card.image_url}
                      alt={card.name}
                      className="w-full h-auto object-contain rounded-xl shadow-md"
                    />
                    <div className="mt-1.5 px-1 text-center">
                      <p className="text-[11px] font-extrabold text-white truncate">{card.name}</p>
                      <p className="text-[9px] text-[#e6c66d] font-bold mt-0.5">{card.set} · {card.price}</p>
                    </div>
                  </div>
                </div>
              )}
            </button>

            {/* Quando é o item selecionado (primeiro na ordenação), exibe os detalhes logo abaixo dele */}
            {index === 0 && (
              <div className="wishlist-selected my-2 border-b border-black/10 pb-4 pt-2 px-1 animate-fadeIn">
                <p className="eyebrow text-[9px] font-black uppercase tracking-widest" style={{ color: colors.light.bronze }}>Detalhes da carta</p>
                <h3 className="text-base font-black tracking-tight mt-1" style={{ color: colors.light['text-main'] }}>{currentSelected.name}</h3>
                <p className="text-xs mt-0.5" style={{ color: colors.light['text-muted'] }}>{currentSelected.type} · {currentSelected.rarity}</p>

                <div className="detail-facts grid grid-cols-3 gap-2 my-3.5">
                  <div>
                    <span className="block text-[9px]" style={{ color: colors.light['text-muted'] }}>Valor</span>
                    <strong className="block text-xs font-black mt-0.5" style={{ color: colors.light['text-main'] }}>{currentSelected.price}</strong>
                  </div>
                  <div>
                    <span className="block text-[9px]" style={{ color: colors.light['text-muted'] }}>Cor</span>
                    <strong className="block text-xs font-black mt-0.5" style={{ color: colors.light['text-main'] }}>{currentSelected.color}</strong>
                  </div>
                  <div>
                    <span className="block text-[9px]" style={{ color: colors.light['text-muted'] }}>Edição</span>
                    <strong className="block text-xs font-black mt-0.5 truncate" style={{ color: colors.light['text-main'] }}>{currentSelected.set}</strong>
                  </div>
                </div>

                <button
                  type="button"
                  className="detail-action w-full py-2.5 px-4 rounded-xl text-white text-xs font-extrabold transition-colors cursor-pointer"
                  style={{ backgroundColor: colors.light.dark }}
                  onClick={() => {
                    if (onSelectCardDetail) onSelectCardDetail(currentSelected.slug);
                  }}
                >
                  Ver detalhes da carta →
                </button>
              </div>
            )}
          </div>
        ))}
      </div>
    </aside>
  );
}

export default WishlistPanel;
