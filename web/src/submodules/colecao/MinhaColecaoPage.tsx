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
  setCode?: string;
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
  const [currentSrc, setCurrentSrc] = useState<string | undefined>(card.image_url);
  const [hasError, setHasError] = useState(false);

  useEffect(() => {
    setCurrentSrc(card.image_url);
    setHasError(false);
  }, [card.image_url]);

  const handleError = () => {
    const code = card.setCode || (card.set && card.set.length <= 5 ? card.set : '');
    const cleanSet = code ? `&set=${encodeURIComponent(code.toLowerCase())}` : '';
    const apiFallback = `https://api.scryfall.com/cards/named?exact=${encodeURIComponent(card.name)}${cleanSet}&format=image&version=normal`;
    if (card.name && currentSrc !== apiFallback) {
      setCurrentSrc(apiFallback);
    } else {
      setHasError(true);
    }
  };

  if (currentSrc && !hasError) {
    return (
      <div className={`relative w-full aspect-[2.5/3.5] overflow-hidden rounded-t-xl bg-[#1c1815] flex items-center justify-center p-1.5`}>
        <img
          src={currentSrc}
          alt={card.name}
          className="w-full h-full object-contain rounded-lg shadow-sm"
          loading="lazy"
          referrerPolicy="no-referrer"
          onError={handleError}
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

  // Inicia rigorosamente vazio para refletir unicamente o banco de dados real
  const [cardsList, setCardsList] = useState<CardItem[]>([]);
  const [selectedCard, setSelectedCard] = useState<CardItem | null>(null);
  const [view, setView] = useState<'grid' | 'list'>('grid');
  const [loading, setLoading] = useState(false);

  const fetchCardsFromApi = useCallback(async (searchTerm: string) => {
    setLoading(true);
    try {
      const token = localStorage.getItem('spellbinder_token');
      if (!token) {
        setCardsList([]);
        setSelectedCard(null);
        setLoading(false);
        return;
      }

      const url = `http://localhost:3333/api/collection${searchTerm.trim() ? `?search=${encodeURIComponent(searchTerm.trim())}` : ''}`;

      const response = await fetch(url, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (response.ok) {
        const rawData = await response.json();
        if (Array.isArray(rawData)) {
          const mappedCards: CardItem[] = rawData.map((c: any, index: number) => {
            const cardInfo = c.cards || c.card || c.scryfall_cards_cache || c;
            const setCode = cardInfo.set_code || c.set_code || '';
            const setName = cardInfo.set_name || c.set_name || setCode.toUpperCase() || '';

            const rawPrice =
              cardInfo.prices?.usd ||
              cardInfo.prices?.usd_foil ||
              cardInfo.price ||
              c.prices?.usd ||
              c.price;

            const usd = typeof rawPrice === 'number' ? rawPrice : parseFloat(rawPrice || '0');
            const priceFormatted = usd > 0 ? `US$ ${usd.toFixed(2)}` : '';

            const cardId = String(c.id || cardInfo.id || cardInfo.scryfall_id || index);

            const img =
              cardInfo.image_url ||
              cardInfo.image_uri ||
              cardInfo.image_uris?.normal ||
              cardInfo.image_uris?.large ||
              cardInfo.image ||
              c.image_url ||
              c.image_uri ||
              '';

            return {
              id: cardId,
              name: cardInfo.name || c.name || '',
              type: cardInfo.type_line || c.type_line || '',
              set: setName,
              setCode: setCode,
              rarity: formatRarity(cardInfo.rarity || c.rarity),
              price: priceFormatted,
              priceNum: usd,
              color: formatColor(cardInfo.colors || c.colors, cardInfo.type_line || c.type_line),
              quantity: typeof c.quantity === 'number' && c.quantity > 0 ? c.quantity : 1,
              used: 0,
              art: 'gold',
              slug: cardInfo.scryfall_id || cardInfo.id || (cardInfo.name || c.name || '').toLowerCase().replace(/[^a-z0-9]+/g, '-'),
              image_url: img,
            };
          });
          setCardsList(mappedCards);
          setSelectedCard(mappedCards.length > 0 ? mappedCards[0] : null);
        } else {
          setCardsList([]);
          setSelectedCard(null);
        }
      } else {
        setCardsList([]);
        setSelectedCard(null);
      }
    } catch (err) {
      console.warn('Erro ao carregar coleção da API:', err);
      setCardsList([]);
      setSelectedCard(null);
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
                placeholder="Buscar por nome na sua coleção..."
                className="w-full bg-transparent border-none outline-none text-xs font-medium"
                style={{ color: colors.light['text-main'] }}
              />
            </label>
            <div className="collection-view-toggle flex items-center gap-1 border p-1 rounded-full bg-white" style={{ borderColor: colors.light.border }}>
              <button
                className={`px-3 py-1 rounded-full text-xs font-bold transition-colors cursor-pointer border-0 ${view === 'grid' ? 'text-white' : ''
                  }`}
                style={{ backgroundColor: view === 'grid' ? colors.light.dark : 'transparent', color: view === 'grid' ? '#fff' : colors.light['text-muted'] }}
                onClick={() => setView('grid')}
                aria-label="Visualização em grade"
                type="button"
              >
                ▦
              </button>
              <button
                className={`px-3 py-1 rounded-full text-xs font-bold transition-colors cursor-pointer border-0 ${view === 'list' ? 'text-white' : ''
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
                  Consultando base de dados...
                </div>
              ) : filtered.length === 0 ? (
                <div className="rounded-3xl border border-dashed p-12 text-center flex flex-col items-center justify-center my-4 shadow-sm" style={{ borderColor: colors.light.border, backgroundColor: colors.light.surface }}>
                  <div className="w-12 h-12 rounded-2xl flex items-center justify-center mb-3 shadow-2xs" style={{ backgroundColor: colors.light['surface-alt'], border: `1px solid ${colors.light.border}` }}>
                    <span className="text-xl">📦</span>
                  </div>
                  <h3 className="text-sm font-black tracking-tight" style={{ color: colors.light['text-main'] }}>
                    Nenhuma carta catalogada
                  </h3>
                  <p className="text-xs mt-1 max-w-sm" style={{ color: colors.light['text-muted'] }}>
                    {query ? `Nenhum resultado encontrado para "${query}".` : 'Você ainda não possui cartas registradas na sua coleção física.'}
                  </p>
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