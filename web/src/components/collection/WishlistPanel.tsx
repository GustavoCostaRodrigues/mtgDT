import { useState } from 'react';

export interface WishlistCardItem {
  name: string;
  type: string;
  set: string;
  rarity: string;
  price: string;
  color: string;
  art: string;
  slug: string;
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
            <p className="eyebrow text-[10px] font-black text-[#9b7130] uppercase tracking-widest whitespace-nowrap">Próximas aquisições</p>
            <h2 className="text-xl font-black tracking-tight text-[#171513] dark:text-white whitespace-nowrap mt-1">Lista de desejos</h2>
          </div>
          <span className="text-xs font-bold text-[#9b7130] whitespace-nowrap">0 cartas</span>
        </div>
        <p className="text-xs text-[#817970] mt-6">Sua lista de desejos está vazia.</p>
      </aside>
    );
  }

  const currentSelected = selectedWish || wishlist[0];
  const orderedWishlist = [
    currentSelected,
    ...wishlist.filter((card) => card.name !== currentSelected.name),
  ];

  return (
    <aside className="collection-detail wishlist-panel border-l border-black/10 dark:border-white/10 pl-6">
      <div className="wishlist-heading flex items-end justify-between gap-3 border-b border-black/10 dark:border-white/10 pb-3.5 whitespace-nowrap">
        <div>
          <p className="eyebrow text-[10px] font-black text-[#9b7130] uppercase tracking-widest whitespace-nowrap">Próximas aquisições</p>
          <h2 className="text-xl font-black tracking-tight text-[#171513] dark:text-white whitespace-nowrap mt-1">Lista de desejos</h2>
        </div>
        <span className="text-xs font-bold text-[#9b7130] whitespace-nowrap">{wishlist.length} cartas</span>
      </div>

      <div className="wishlist-list flex flex-col gap-2.5 mt-4">
        {orderedWishlist.map((card, index) => (
          <div className="wishlist-entry flex flex-col" key={card.name}>
            <button
              type="button"
              className={`wishlist-item flex items-center gap-3 w-full p-2 rounded-xl border border-transparent text-left transition-all ${
                currentSelected.name === card.name ? 'selected bg-[#e9e1cf] border-[#9b7130]/40' : 'hover:bg-[#e9e1cf]/50'
              }`}
              onClick={() => setSelectedWish(card)}
            >
              <div className={`collection-card-art art-${card.art} w-[42px] h-[58px] rounded-lg shrink-0`} />
              <span className="min-w-0 flex-1">
                <strong className="block text-xs font-extrabold text-[#171513] dark:text-white truncate">{card.name}</strong>
                <small className="block text-[10px] text-[#8b847c] mt-0.5 truncate">{card.set}</small>
                <small className="block text-[10px] font-bold text-[#9b7130] mt-0.5">{card.price}</small>
              </span>
            </button>

            {/* Quando é o item selecionado (primeiro na ordenação), exibe os detalhes logo abaixo dele */}
            {index === 0 && (
              <div className="wishlist-selected my-2 border-b border-black/10 dark:border-white/10 pb-4 pt-2 px-1 animate-fadeIn">
                <p className="eyebrow text-[9px] font-black text-[#9b7130] uppercase tracking-widest">Detalhes da carta</p>
                <h3 className="text-base font-black tracking-tight text-[#171513] dark:text-white mt-1">{currentSelected.name}</h3>
                <p className="text-xs text-[#8b847c] mt-0.5">{currentSelected.type} · {currentSelected.rarity}</p>

                <div className="detail-facts grid grid-cols-3 gap-2 my-3.5">
                  <div>
                    <span className="block text-[9px] text-[#8b847c]">Valor</span>
                    <strong className="block text-xs font-black text-[#171513] dark:text-white mt-0.5">{currentSelected.price}</strong>
                  </div>
                  <div>
                    <span className="block text-[9px] text-[#8b847c]">Cor</span>
                    <strong className="block text-xs font-black text-[#171513] dark:text-white mt-0.5">{currentSelected.color}</strong>
                  </div>
                  <div>
                    <span className="block text-[9px] text-[#8b847c]">Edição</span>
                    <strong className="block text-xs font-black text-[#171513] dark:text-white mt-0.5 truncate">{currentSelected.set}</strong>
                  </div>
                </div>

                <button
                  type="button"
                  className="detail-action w-full py-2.5 px-4 rounded-xl bg-[#24211f] text-white text-xs font-extrabold hover:bg-[#9b7130] transition-colors cursor-pointer"
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
