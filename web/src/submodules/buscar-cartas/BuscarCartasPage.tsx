import { useState } from 'react';
import { AppNav } from '../../components/navbar/AppNav';
import { Toast } from '../../components/ui/Toast';
import { LoadingState } from '../../components/ui/LoadingState';
import { EmptyState } from '../../components/ui/EmptyState';

const catalogCards = [
  { id: '1', name: 'Sol Ring', set: 'Commander Masters', type: 'Artefato', rarity: 'Rara', price: 'R$ 42,00', color: 'Incolor', inCollection: true, inWishlist: false, art: 'gold', slug: 'sol-ring' },
  { id: '2', name: 'Rhystic Study', set: 'Commander Masters', type: 'Encantamento', rarity: 'Rara', price: 'R$ 184,90', color: 'Azul', inCollection: false, inWishlist: true, art: 'blue', slug: 'rhystic-study' },
  { id: '3', name: 'Lightning Bolt', set: 'Modern Horizons', type: 'Instantânea', rarity: 'Incomum', price: 'R$ 18,90', color: 'Vermelho', inCollection: true, inWishlist: false, art: 'red', slug: 'lightning-bolt' },
  { id: '4', name: 'Swords to Plowshares', set: 'The List', type: 'Instantânea', rarity: 'Incomum', price: 'R$ 24,50', color: 'Branco', inCollection: true, inWishlist: false, art: 'cream', slug: 'swords-to-plowshares' },
  { id: '5', name: 'Orcish Bowmasters', set: 'Tales of Middle-earth', type: 'Criatura', rarity: 'Rara', price: 'R$ 96,50', color: 'Preto', inCollection: false, inWishlist: true, art: 'purple', slug: 'orcish-bowmasters' },
  { id: '6', name: 'Birds of Paradise', set: 'Ravnica Remastered', type: 'Criatura', rarity: 'Rara', price: 'R$ 38,00', color: 'Verde', inCollection: false, inWishlist: false, art: 'green', slug: 'birds-of-paradise' },
  { id: '7', name: 'Command Tower', set: 'Commander Legends', type: 'Terreno', rarity: 'Comum', price: 'R$ 3,50', color: 'Incolor', inCollection: true, inWishlist: false, art: 'stone', slug: 'command-tower' },
  { id: '8', name: 'The One Ring', set: 'The Lord of the Rings', type: 'Artefato', rarity: 'Mítica', price: 'R$ 312,00', color: 'Incolor', inCollection: false, inWishlist: true, art: 'dark', slug: 'the-one-ring' },
  { id: '9', name: 'Cyclonic Rift', set: 'Commander Masters', type: 'Instantânea', rarity: 'Rara', price: 'R$ 142,00', color: 'Azul', inCollection: false, inWishlist: false, art: 'blue', slug: 'cyclonic-rift' },
  { id: '10', name: 'Demonic Tutor', set: 'Ultimate Masters', type: 'Feitiço', rarity: 'Mítica', price: 'R$ 210,00', color: 'Preto', inCollection: false, inWishlist: false, art: 'purple', slug: 'demonic-tutor' },
];

export function BuscarCartasPage({
  initialQuery = '',
  onNavigate,
  onLogout,
  onSearch,
  onSelectCard,
}: {
  initialQuery?: string;
  onNavigate?: (href: string) => void;
  onLogout?: () => void;
  onSearch?: (query: string) => void;
  onSelectCard?: (slug: string) => void;
}) {
  const [query, setQuery] = useState(initialQuery);
  const [colorFilter, setColorFilter] = useState('Todas');
  const [typeFilter, setTypeFilter] = useState('Todos');
  const [rarityFilter, setRarityFilter] = useState('Todas');
  const [cards, setCards] = useState(catalogCards);
  const [toastMessage, setToastMessage] = useState<string | null>(null);
  const [loading] = useState(false);

  const handleAddCollection = (cardName: string) => {
    setCards((prev) =>
      prev.map((c) => (c.name === cardName ? { ...c, inCollection: true } : c))
    );
    setToastMessage(`"${cardName}" adicionada à sua coleção!`);
  };

  const handleAddWishlist = (cardName: string) => {
    setCards((prev) =>
      prev.map((c) => (c.name === cardName ? { ...c, inWishlist: true } : c))
    );
    setToastMessage(`"${cardName}" adicionada à sua lista de desejos!`);
  };

  const filtered = cards.filter((card) => {
    const matchesQuery = `${card.name} ${card.type} ${card.set}`.toLowerCase().includes(query.toLowerCase());
    const matchesColor = colorFilter === 'Todas' || card.color === colorFilter;
    const matchesType = typeFilter === 'Todos' || card.type === typeFilter;
    const matchesRarity = rarityFilter === 'Todas' || card.rarity === rarityFilter;
    return matchesQuery && matchesColor && matchesType && matchesRarity;
  });

  return (
    <main className="dashboard-shell min-h-screen bg-[#f2efe8] dark:bg-[#121316] text-[#24211f] dark:text-white">
      <section className="dashboard-content">
        <AppNav activeNav="/buscar-cartas" onNavigate={onNavigate} onLogout={onLogout} onSearch={onSearch} />

        <div className="collection-main max-w-7xl mx-auto px-8 py-10">
          <header className="mb-8">
            <p className="eyebrow text-[10px] font-black text-[#9b7130] uppercase tracking-widest">Catálogo Global MTG</p>
            <h1 className="text-4xl md:text-5xl font-black tracking-tight text-[#171513] dark:text-white mt-1">
              Pesquisar cartas
            </h1>
            <p className="text-sm text-[#817970] dark:text-zinc-400 mt-2 max-w-xl">
              Explore toda a base de cartas de Magic: The Gathering. Adicione à sua coleção física ou à lista de desejos.
            </p>

            {/* Campo de busca grande com filtros em destaque */}
            <div className="mt-6 flex flex-col md:flex-row items-center gap-4">
              <div className="flex-1 w-full flex items-center gap-3 h-12 rounded-2xl border border-black/15 dark:border-white/15 bg-white dark:bg-[#18191c] px-4 shadow-sm focus-within:border-[#9b7130] focus-within:ring-2 focus-within:ring-[#9b7130]/20">
                <svg className="w-4 h-4 text-[#8b847c] shrink-0" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <circle cx="10.8" cy="10.8" r="6.8" />
                  <path d="m16 16 4.5 4.5" />
                </svg>
                <input
                  type="text"
                  placeholder="Busque por nome, tipo, edição ou texto da carta..."
                  value={query}
                  onChange={(e) => setQuery(e.target.value)}
                  className="w-full bg-transparent border-none outline-none text-sm text-[#24211f] dark:text-white placeholder:text-[#a19a91]"
                />
              </div>

              <div className="flex items-center gap-3 w-full md:w-auto">
                <select
                  value={colorFilter}
                  onChange={(e) => setColorFilter(e.target.value)}
                  className="h-12 px-4 rounded-2xl border border-black/10 dark:border-white/10 bg-white dark:bg-[#18191c] text-xs font-bold text-[#24211f] dark:text-white outline-none cursor-pointer"
                >
                  <option value="Todas">Todas as Cores</option>
                  <option value="Incolor">Incolor</option>
                  <option value="Azul">Azul</option>
                  <option value="Preto">Preto</option>
                  <option value="Vermelho">Vermelho</option>
                  <option value="Verde">Verde</option>
                  <option value="Branco">Branco</option>
                </select>

                <select
                  value={typeFilter}
                  onChange={(e) => setTypeFilter(e.target.value)}
                  className="h-12 px-4 rounded-2xl border border-black/10 dark:border-white/10 bg-white dark:bg-[#18191c] text-xs font-bold text-[#24211f] dark:text-white outline-none cursor-pointer"
                >
                  <option value="Todos">Todos os Tipos</option>
                  <option value="Criatura">Criatura</option>
                  <option value="Artefato">Artefato</option>
                  <option value="Encantamento">Encantamento</option>
                  <option value="Instantânea">Instantânea</option>
                  <option value="Feitiço">Feitiço</option>
                  <option value="Terreno">Terreno</option>
                </select>

                <select
                  value={rarityFilter}
                  onChange={(e) => setRarityFilter(e.target.value)}
                  className="h-12 px-4 rounded-2xl border border-black/10 dark:border-white/10 bg-white dark:bg-[#18191c] text-xs font-bold text-[#24211f] dark:text-white outline-none cursor-pointer"
                >
                  <option value="Todas">Todas as Raridades</option>
                  <option value="Comum">Comum</option>
                  <option value="Incomum">Incomum</option>
                  <option value="Rara">Rara</option>
                  <option value="Mítica">Mítica</option>
                </select>
              </div>
            </div>
          </header>

          {/* Resultados Grid */}
          <div className="mb-4 text-xs font-bold text-[#817970] dark:text-zinc-400">
            {filtered.length} cartas encontradas
          </div>

          {loading ? (
            <LoadingState count={8} type="card" />
          ) : filtered.length === 0 ? (
            <EmptyState
              title="Nenhuma carta encontrada"
              description={`Não encontramos resultados para "${query}". Tente buscar por termos mais genéricos.`}
              actionLabel="Limpar busca"
              onAction={() => {
                setQuery('');
                setColorFilter('Todas');
                setRarityFilter('Todas');
              }}
            />
          ) : (
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
              {filtered.map((card) => (
                <div
                  key={card.id}
                  className="group rounded-2xl border border-black/10 dark:border-white/10 bg-[#f8f5ee] dark:bg-[#18191c] overflow-hidden hover:border-[#9b7130] transition-all duration-200 hover:-translate-y-1 shadow-sm flex flex-col justify-between"
                >
                  <div
                    className="cursor-pointer"
                    onClick={() => {
                      if (onSelectCard) onSelectCard(card.slug);
                    }}
                  >
                    <div className={`collection-card-art art-${card.art} aspect-[0.72] w-full p-3 flex flex-col justify-between text-white relative`}>
                      <span className="self-end text-[10px] font-bold px-2 py-0.5 rounded-full bg-black/60 backdrop-blur-xs">
                        {card.rarity}
                      </span>
                      <div>
                        <strong className="block text-sm font-black leading-tight drop-shadow-md">{card.name}</strong>
                        <small className="block text-[10px] opacity-80 mt-0.5">{card.set}</small>
                      </div>
                    </div>

                    <div className="p-3">
                      <div className="flex items-center justify-between">
                        <span className="text-xs font-black text-[#171513] dark:text-white">{card.price}</span>
                        <span className="text-[10px] font-bold text-[#817970] dark:text-zinc-400">{card.type}</span>
                      </div>
                    </div>
                  </div>

                  {/* Ações Rápidas */}
                  <div className="p-3 pt-0 space-y-1.5 border-t border-black/5 dark:border-white/5 mt-auto">
                    <button
                      type="button"
                      disabled={card.inCollection}
                      onClick={() => handleAddCollection(card.name)}
                      className={`w-full py-2 px-3 rounded-xl text-[11px] font-bold transition-colors cursor-pointer ${
                        card.inCollection
                          ? 'bg-emerald-500/10 text-emerald-700 dark:text-emerald-400 border border-emerald-500/20 cursor-default'
                          : 'bg-[#24211f] text-white hover:bg-[#9b7130]'
                      }`}
                    >
                      {card.inCollection ? '✓ Na coleção' : '+ Adicionar à coleção'}
                    </button>

                    <button
                      type="button"
                      disabled={card.inWishlist}
                      onClick={() => handleAddWishlist(card.name)}
                      className={`w-full py-1.5 px-3 rounded-xl text-[10px] font-bold transition-colors cursor-pointer ${
                        card.inWishlist
                          ? 'bg-amber-500/10 text-amber-700 dark:text-amber-400 border border-amber-500/20 cursor-default'
                          : 'border border-black/15 dark:border-white/15 text-[#625d59] dark:text-zinc-300 hover:border-[#9b7130] hover:text-[#9b7130]'
                      }`}
                    >
                      {card.inWishlist ? '★ Na wishlist' : '★ Desejo'}
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </section>

      {toastMessage && <Toast message={toastMessage} onClose={() => setToastMessage(null)} />}
    </main>
  );
}

export default BuscarCartasPage;
