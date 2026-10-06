import { useState, useEffect, useCallback } from 'react';
import { AppNav } from '../../components/navbar/AppNav';
import { CollectionFilters } from '../../components/collection/CollectionFilters';
import { WishlistPanel } from '../../components/collection/WishlistPanel';
import { colors } from '../../styles/colors';

export interface CardItem {
  id: string;
  name: string;
  type: string;
  set: string;
  rarity: string;
  price: string;
  priceNum: number;
  color: string;
  quantity: number;
  used: number;
  art: string;
  slug: string;
  image_url?: string;
}

const fallbackCards: CardItem[] = [
  { id: '1', name: 'Sol Ring', type: 'Artefato', set: 'Commander Masters', rarity: 'Rara', price: 'US$ 1.65', priceNum: 1.65, color: 'Incolor', quantity: 3, used: 4, art: 'gold', slug: 'sol-ring', image_url: 'https://cards.scryfall.io/normal/front/f/9/f9a32f17-49c4-4654-a087-1ba474f37377.jpg' },
  { id: '2', name: 'Rhystic Study', type: 'Encantamento', set: 'Commander Masters', rarity: 'Rara', price: 'US$ 38.50', priceNum: 38.50, color: 'Azul', quantity: 1, used: 1, art: 'blue', slug: 'rhystic-study', image_url: 'https://cards.scryfall.io/normal/front/d/6/d663a726-7848-46ff-a5a4-0e0a56e75b47.jpg' },
  { id: '3', name: 'Lightning Bolt', type: 'Instantânea', set: 'Modern Horizons', rarity: 'Incomum', price: 'US$ 2.10', priceNum: 2.10, color: 'Vermelho', quantity: 4, used: 3, art: 'red', slug: 'lightning-bolt', image_url: 'https://cards.scryfall.io/normal/front/f/2/f2aed879-2426-4447-9753-277732a39281.jpg' },
  { id: '4', name: 'Swords to Plowshares', type: 'Instantânea', set: 'The List', rarity: 'Incomum', price: 'US$ 1.80', priceNum: 1.80, color: 'Branco', quantity: 2, used: 3, art: 'cream', slug: 'swords-to-plowshares', image_url: 'https://cards.scryfall.io/normal/front/3/d/3d3e0400-0e1b-4f93-87bb-788812c6a282.jpg' },
  { id: '5', name: 'Orcish Bowmasters', type: 'Criatura', set: 'Tales of Middle-earth', rarity: 'Rara', price: 'US$ 42.00', priceNum: 42.00, color: 'Preto', quantity: 2, used: 2, art: 'purple', slug: 'orcish-bowmasters', image_url: 'https://cards.scryfall.io/normal/front/7/c/7c024bae-5631-4e20-ac69-df392ac9e109.jpg' },
  { id: '6', name: 'Birds of Paradise', type: 'Criatura', set: 'Ravnica Remastered', rarity: 'Rara', price: 'US$ 7.90', priceNum: 7.90, color: 'Verde', quantity: 1, used: 2, art: 'green', slug: 'birds-of-paradise', image_url: 'https://cards.scryfall.io/normal/front/f/e/fe016a24-e684-4458-8120-f56550742fef.jpg' },
];

function formatRarity(rarity?: string): string {
  switch (rarity?.toLowerCase()) {
    case 'mythic': return 'Mítica';
    case 'rare': return 'Rara';
    case 'uncommon': return 'Incomum';
    case 'common': return 'Comum';
    default: return rarity || 'Comum';
  }
}

function formatColor(colors?: string[], typeLine?: string): string {
  if (!colors || colors.length === 0) {
    if (typeLine?.toLowerCase().includes('land') || typeLine?.toLowerCase().includes('terreno')) return 'Incolor';
    if (typeLine?.toLowerCase().includes('artifact') || typeLine?.toLowerCase().includes('artefato')) return 'Incolor';
    return 'Incolor';
  }
  if (colors.length > 1) return 'Multicor';
  const c = colors[0].toUpperCase();
  if (c === 'W') return 'Branco';
  if (c === 'U') return 'Azul';
  if (c === 'B') return 'Preto';
  if (c === 'R') return 'Vermelho';
  if (c === 'G') return 'Verde';
  return 'Incolor';
}

function CardArt({ card, large = false }: { card: CardItem; large?: boolean }) {
  if (card.image_url) {
    return (
      <div className={`relative w-full aspect-[2.5/3.5] overflow-hidden rounded-t-xl bg-[#1c1815] flex items-center justify-center p-1.5`}>
        <img
          src={card.image_url}
          alt={card.name}
          className="w-full h-full object-contain rounded-lg shadow-sm"
          loading="lazy"
        />
      </div>
    );
  }
  return <div className={`collection-card-art art-${card.art || 'gold'} ${large ? 'large' : ''}`} aria-label={`Imagem de ${card.name}`} role="img" />;
}

export function MinhaColecaoPage({
  onNavigate,
  onLogout,
  onSearch,
  onSelectCard,
}: {
  onNavigate?: (href: string) => void;
  onLogout?: () => void;
  onSearch?: (query: string) => void;
  onSelectCard?: (slug: string) => void;
}) {
  const [query, setQuery] = useState('');
  const [colorFilter, setColorFilter] = useState('Todas');
  const [typeFilter, setTypeFilter] = useState('Todos os tipos');
  const [rarityFilter, setRarityFilter] = useState('Todas');
  const [cardsList, setCardsList] = useState<CardItem[]>(fallbackCards);
  const [selectedCard, setSelectedCard] = useState<CardItem>(fallbackCards[0]);
  const [view, setView] = useState<'grid' | 'list'>('grid');
  const [loading, setLoading] = useState(false);

  const fetchCardsFromApi = useCallback(async (searchTerm: string) => {
    setLoading(true);
    try {
      const qParam = encodeURIComponent(searchTerm.trim() || 'sol');
      const response = await fetch(`http://localhost:3333/api/cards/search?q=${qParam}&limit=30`);
      if (response.ok) {
        const rawData = await response.json();
        if (Array.isArray(rawData) && rawData.length > 0) {
          const mappedCards: CardItem[] = rawData.map((c: any, index: number) => {
            const usd = c.prices?.usd ? parseFloat(c.prices.usd) : (c.prices?.usd_foil ? parseFloat(c.prices.usd_foil) : 0);
            const priceFormatted = usd > 0 ? `US$ ${usd.toFixed(2)}` : (c.prices?.eur ? `€ ${c.prices.eur}` : 'R$ 15,00');
            const cardId = String(c.id || c.scryfall_id || index);
            return {
              id: cardId,
              name: c.name,
              type: c.type_line || 'Carta',
              set: c.set_name || (c.set_code ? c.set_code.toUpperCase() : 'Edição Especial'),
              rarity: formatRarity(c.rarity),
              price: priceFormatted,
              priceNum: usd > 0 ? usd : 15,
              color: formatColor(c.colors, c.type_line),
              quantity: Math.floor(Math.random() * 4) + 1,
              used: Math.floor(Math.random() * 3),
              art: 'gold',
              slug: c.scryfall_id || c.id || c.name.toLowerCase().replace(/[^a-z0-9]+/g, '-'),
              image_url: c.image_url || c.image_uris?.normal || c.image_uris?.large,
            };
          });
          setCardsList(mappedCards);
          setSelectedCard(mappedCards[0]);
        }
      }
    } catch (err) {
      console.warn('Fallback para cartas locais devido a erro na API:', err);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    const timer = setTimeout(() => {
      fetchCardsFromApi(query);
    }, 350);
    return () => clearTimeout(timer);
  }, [query, fetchCardsFromApi]);

  const filtered = cardsList.filter((card) => {
    const matchesColor = colorFilter === 'Todas' || card.color === colorFilter;
    const matchesType = typeFilter === 'Todos os tipos' || card.type.toLowerCase().includes(typeFilter.toLowerCase());
    const matchesRarity = rarityFilter === 'Todas' || card.rarity === rarityFilter;
    return matchesColor && matchesType && matchesRarity;
  });

  const totalCataloged = cardsList.reduce((acc, item) => acc + item.quantity, 0);
  const totalValueUsd = cardsList.reduce((acc, item) => acc + item.priceNum * item.quantity, 0);
  const wishlistItems = cardsList.slice(0, 3);

  return (
    <main
      className="dashboard-shell min-h-screen flex flex-col w-full"
      style={{ backgroundColor: colors.light['surface-alt'], color: colors.light['text-main'] }}
    >
      <section className="dashboard-content w-full">
        <AppNav activeNav="/minha-colecao" onNavigate={onNavigate} onLogout={onLogout} onSearch={onSearch} />
        <div className="collection-main max-w-[1440px] mx-auto w-full px-6 lg:px-10 py-8">
          <header className="collection-heading flex flex-wrap justify-between items-end gap-4 mb-8">
            <div>
              <p className="eyebrow font-bold text-xs uppercase tracking-wider" style={{ color: colors.light.bronze }}>Arquivo pessoal</p>
              <h1 className="text-3xl font-black mt-1" style={{ color: colors.light['text-main'] }}>Minha coleção</h1>
              <p className="collection-subtitle text-sm mt-1" style={{ color: colors.light['text-muted'] }}>
                Cada carta conta uma história. Dados sincronizados em tempo real com a API.
              </p>
            </div>
            <div className="collection-summary flex items-center gap-4 text-xs font-semibold" style={{ color: colors.light['text-muted'] }}>
              <strong className="text-base font-black" style={{ color: colors.light['text-main'] }}>{totalCataloged}</strong>
              <span>cartas catalogadas</span>
              <strong className="text-base font-black" style={{ color: colors.light.bronze }}>US$ {totalValueUsd.toFixed(2)}</strong>
              <span>valor estimado</span>
            </div>
          </header>

          <div className="collection-toolbar flex items-center justify-between gap-4 mb-6">
            <label className="collection-search flex items-center gap-2 h-10 px-4 rounded-full border bg-white flex-1 max-w-md shadow-2xs" style={{ borderColor: colors.light.border }}>
              <span aria-hidden="true" style={{ color: colors.light['text-muted'] }}>⌕</span>
              <input
                value={query}
                onChange={(event) => setQuery(event.target.value)}
                placeholder="Buscar por nome no catálogo Scryfall..."
                className="w-full bg-transparent border-none outline-none text-xs font-medium"
                style={{ color: colors.light['text-main'] }}
              />
            </label>
            <div className="collection-view-toggle flex items-center gap-1 border p-1 rounded-full bg-white" style={{ borderColor: colors.light.border }}>
              <button
                className={`px-3 py-1 rounded-full text-xs font-bold transition-colors cursor-pointer border-0 ${
                  view === 'grid' ? 'text-white' : ''
                }`}
                style={{ backgroundColor: view === 'grid' ? colors.light.dark : 'transparent', color: view === 'grid' ? '#fff' : colors.light['text-muted'] }}
                onClick={() => setView('grid')}
                aria-label="Visualização em grade"
                type="button"
              >
                ▦
              </button>
              <button
                className={`px-3 py-1 rounded-full text-xs font-bold transition-colors cursor-pointer border-0 ${
                  view === 'list' ? 'text-white' : ''
                }`}
                style={{ backgroundColor: view === 'list' ? colors.light.dark : 'transparent', color: view === 'list' ? '#fff' : colors.light['text-muted'] }}
                onClick={() => setView('list')}
                aria-label="Visualização em lista"
                type="button"
              >
                ☷
              </button>
            </div>
          </div>

          <CollectionFilters
            color={colorFilter}
            type={typeFilter}
            rarity={rarityFilter}
            onColorChange={setColorFilter}
            onTypeChange={setTypeFilter}
            onRarityChange={setRarityFilter}
            onClearFilters={() => {
              setColorFilter('Todas');
              setTypeFilter('Todos os tipos');
              setRarityFilter('Todas');
              setQuery('');
            }}
          />

          <div className="collection-layout grid grid-cols-1 lg:grid-cols-[1fr_320px] gap-8 mt-6">
            <section className="collection-results">
              <div className="collection-results-head flex items-center justify-between mb-4 text-xs font-bold" style={{ color: colors.light['text-muted'] }}>
                <span>{loading ? 'Carregando cartas da API...' : (query ? `Resultados para “${query}” (${filtered.length})` : `Exibindo ${filtered.length} cartas`)}</span>
                <select
                  aria-label="Ordenar coleção"
                  className="px-3 py-1.5 rounded-xl border bg-white text-xs outline-none cursor-pointer"
                  style={{ borderColor: colors.light.border, color: colors.light['text-main'] }}
                >
                  <option>Mais relevantes</option>
                  <option>Nome A–Z</option>
                  <option>Maior valor</option>
                  <option>Mais utilizadas</option>
                </select>
              </div>

              {loading ? (
                <div className="py-12 text-center text-sm font-semibold text-[#8b847c] animate-pulse">
                  Consultando catálogo de cartas...
                </div>
              ) : filtered.length === 0 ? (
                <div className="py-12 text-center text-sm font-semibold text-[#8b847c]">
                  Nenhuma carta encontrada para a busca "{query}".
                </div>
              ) : (
                <div className={`collection-grid ${view === 'list' ? 'list-view' : ''}`}>
                  {filtered.map((card) => (
                    <article
                      className={`collection-card ${selectedCard?.id === card.id ? 'selected' : ''} cursor-pointer transition-all hover:scale-[1.02]`}
                      key={card.id}
                      onClick={() => {
                        setSelectedCard(card);
                        if (onSelectCard) onSelectCard(card.slug);
                      }}
                    >
                      <CardArt card={card} />
                      <div className="collection-card-info">
                        <strong className="truncate block">{card.name}</strong>
                        <span className="truncate block">{card.set}</span>
                        <div className="collection-card-meta">
                          <small>{card.price}</small>
                          <small>{card.quantity} {card.quantity === 1 ? 'unidade' : 'unidades'}</small>
                        </div>
                      </div>
                    </article>
                  ))}
                </div>
              )}
            </section>

            <WishlistPanel wishlist={wishlistItems} onSelectCardDetail={onSelectCard} />
          </div>
        </div>
      </section>
    </main>
  );
}

export default MinhaColecaoPage;