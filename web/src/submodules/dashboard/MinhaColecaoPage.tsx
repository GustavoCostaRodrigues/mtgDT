import { useState } from 'react';
import { AppNav } from '../../components/navbar/AppNav';
import { CollectionFilters } from '../../components/collection/CollectionFilters';
import { WishlistPanel } from '../../components/collection/WishlistPanel';

const cards = [
  { name: 'Sol Ring', type: 'Artefato', set: 'Commander Masters', rarity: 'Rara', price: 'R$ 42,00', color: 'Incolor', quantity: 3, used: 4, art: 'gold', slug: 'sol-ring' },
  { name: 'Rhystic Study', type: 'Encantamento', set: 'Commander Masters', rarity: 'Rara', price: 'R$ 184,90', color: 'Azul', quantity: 1, used: 1, art: 'blue', slug: 'rhystic-study' },
  { name: 'Lightning Bolt', type: 'Instantânea', set: 'Modern Horizons', rarity: 'Incomum', price: 'R$ 18,90', color: 'Vermelho', quantity: 4, used: 3, art: 'red', slug: 'lightning-bolt' },
  { name: 'Swords to Plowshares', type: 'Instantânea', set: 'The List', rarity: 'Incomum', price: 'R$ 24,50', color: 'Branco', quantity: 2, used: 3, art: 'cream', slug: 'swords-to-plowshares' },
  { name: 'Orcish Bowmasters', type: 'Criatura', set: 'Tales of Middle-earth', rarity: 'Rara', price: 'R$ 96,50', color: 'Preto', quantity: 2, used: 2, art: 'purple', slug: 'orcish-bowmasters' },
  { name: 'Birds of Paradise', type: 'Criatura', set: 'Ravnica Remastered', rarity: 'Rara', price: 'R$ 38,00', color: 'Verde', quantity: 1, used: 2, art: 'green', slug: 'birds-of-paradise' },
  { name: 'Command Tower', type: 'Terreno', set: 'Commander Legends', rarity: 'Comum', price: 'R$ 3,50', color: 'Incolor', quantity: 6, used: 5, art: 'stone', slug: 'command-tower' },
  { name: 'The One Ring', type: 'Artefato', set: 'The Lord of the Rings', rarity: 'Mítica', price: 'R$ 312,00', color: 'Incolor', quantity: 1, used: 2, art: 'dark', slug: 'the-one-ring' },
];

const wishlistData = [cards[1], cards[4], cards[7]];

type Card = (typeof cards)[number];

function CardArt({ card, large = false }: { card: Card; large?: boolean }) {
  return <div className={`collection-card-art art-${card.art} ${large ? 'large' : ''}`} aria-label={`Imagem de ${card.name}`} role="img" />;
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
  const [selected, setSelected] = useState(cards[0]);
  const [view, setView] = useState<'grid' | 'list'>('grid');

  const filtered = cards.filter((card) => {
    const matchesQuery = `${card.name} ${card.type} ${card.set}`.toLowerCase().includes(query.toLowerCase());
    const matchesColor = colorFilter === 'Todas' || card.color === colorFilter;
    const matchesType = typeFilter === 'Todos os tipos' || card.type === typeFilter;
    const matchesRarity = rarityFilter === 'Todas' || card.rarity === rarityFilter;
    return matchesQuery && matchesColor && matchesType && matchesRarity;
  });

  return (
    <main className="dashboard-shell min-h-screen bg-[#f2efe8] dark:bg-[#121316] text-[#24211f] dark:text-white">
      <section className="dashboard-content">
        <AppNav activeNav="/minha-colecao" onNavigate={onNavigate} onLogout={onLogout} onSearch={onSearch} />
        <div className="collection-main">
          <header className="collection-heading">
            <div>
              <p className="eyebrow">Arquivo pessoal</p>
              <h1>Minha coleção</h1>
              <p className="collection-subtitle">Cada carta conta uma história. Encontre a próxima peça da sua bancada.</p>
            </div>
            <div className="collection-summary">
              <strong>1.248</strong>
              <span>cartas catalogadas</span>
              <strong>R$ 8.420</strong>
              <span>valor estimado</span>
            </div>
          </header>

          <div className="collection-toolbar">
            <label className="collection-search">
              <span aria-hidden="true">⌕</span>
              <input value={query} onChange={(event) => setQuery(event.target.value)} placeholder="Buscar por nome, edição ou tipo..." />
            </label>
            <div className="collection-view-toggle">
              <button className={view === 'grid' ? 'active' : ''} onClick={() => setView('grid')} aria-label="Visualização em grade" type="button">
                ▦
              </button>
              <button className={view === 'list' ? 'active' : ''} onClick={() => setView('list')} aria-label="Visualização em lista" type="button">
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

          <div className="collection-layout">
            <section className="collection-results">
              <div className="collection-results-head">
                <span>{query ? `Resultados para “${query}”` : `Exibindo ${filtered.length} cartas`}</span>
                <select aria-label="Ordenar coleção">
                  <option>Mais relevantes</option>
                  <option>Nome A–Z</option>
                  <option>Maior valor</option>
                  <option>Mais utilizadas</option>
                </select>
              </div>
              <div className={`collection-grid ${view === 'list' ? 'list-view' : ''}`}>
                {filtered.map((card) => (
                  <article
                    className={`collection-card ${selected.name === card.name ? 'selected' : ''}`}
                    key={card.name}
                    onClick={() => {
                      setSelected(card);
                      if (onSelectCard) onSelectCard(card.slug);
                    }}
                  >
                    <CardArt card={card} />
                    <div className="collection-card-info">
                      <strong>{card.name}</strong>
                      <span>{card.set}</span>
                      <div className="collection-card-meta">
                        <small>{card.price}</small>
                        <small>{card.quantity} {card.quantity === 1 ? 'unidade' : 'unidades'}</small>
                      </div>
                    </div>
                  </article>
                ))}
              </div>
            </section>

            <WishlistPanel wishlist={wishlistData} onSelectCardDetail={onSelectCard} />
          </div>
        </div>
      </section>
    </main>
  );
}

export default MinhaColecaoPage;
