import { useState } from 'react';
import { AppNav } from '../../components/navbar/AppNav';
import { DeckOptionsMenu } from '../../components/dashboard/DeckOptionsMenu';
import { colors } from '../../styles/colors'; // Ajuste o caminho se necessário para o seu projeto

interface DashboardPageProps {
  onLogout?: () => void;
  onNavigateDeckbuilder?: () => void;
  onNavigateColecao?: () => void;
  onNavigateAcervo?: () => void;
  onNavigateMercado?: () => void;
  onSearch?: (query: string) => void;
}

export { AppNav as DashboardNav };

const deckCards = [
  {
    name: 'Atraxa, Grand Unifier',
    format: 'Commander',
    status: 'Em construção',
    progress: 72,
    cards: '95/100',
    manaCurve: [4, 8, 13, 11, 7, 3, 1],
    image: 'https://cards.scryfall.io/normal/front/8/2/82c7f3a1-3d25-4e6f-8e0f-10bd30d7e4f2.jpg',
  },
  {
    name: 'Mono Red Burn',
    format: 'Pauper',
    status: 'Pronto para jogar',
    progress: 100,
    cards: '60/60',
    manaCurve: [8, 14, 16, 12, 6, 3, 1],
    image: 'https://cards.scryfall.io/normal/front/3/7/37c2d1b0-4f12-4f48-8ee5-e7f1e5e33b91.jpg',
  },
  {
    name: 'Mardu Energy',
    format: 'Modern',
    status: 'Faltam 8 cartas',
    progress: 84,
    cards: '52/60',
    manaCurve: [5, 12, 15, 10, 6, 2, 1],
    image: 'https://cards.scryfall.io/normal/front/0/1/01f4b3dc-7da0-4b1a-89bb-8c5c00db92a0.jpg',
  },
];

const wishes = [
  { name: 'Rhystic Study', price: 'R$ 184,90', mana: '3U', image: 'https://cards.scryfall.io/normal/front/5/6/56a8f5a9-0f71-4f2e-a4a1-2b5dd9a2c912.jpg' },
  { name: 'The One Ring', price: 'R$ 312,00', mana: '4', image: 'https://cards.scryfall.io/normal/front/4/8/48b2c0a5-fc16-4fc8-86f8-6bd1f6fc5e6d.jpg' },
  { name: 'Orcish Bowmasters', price: 'R$ 96,50', mana: '1B', image: 'https://cards.scryfall.io/normal/front/1/4/14c5f4dc-9b45-4a6f-8fd7-0e4201c800de.jpg' },
];

const topCards = [
  { name: 'Sol Ring', meta: 'Alocada em 4 decks', value: 'R$ 42,00', mana: '1', image: 'https://cards.scryfall.io/normal/front/3/3/33c8f0dc-2c16-4ee1-84c0-cf83aa6a1d09.jpg' },
  { name: 'Lightning Bolt', meta: 'Adicionada há 2 dias', value: 'R$ 18,90', mana: 'R', image: 'https://cards.scryfall.io/normal/front/5/6/56b4f5c7-4e95-4be4-8f31-73515f0bb7f0.jpg' },
  { name: 'Swords to Plowshares', meta: 'Alocada em 3 decks', value: 'R$ 24,50', mana: 'W', image: 'https://cards.scryfall.io/normal/front/7/8/78f7f8ec-7090-4fd3-892a-7c0f1ef2a73d.jpg' },
];

function Mana({ value }: { value: string }) {
  return (
    <span className="flex items-center gap-1 text-xs font-bold" style={{ color: colors.light['text-muted'] }}>
      {value.split('').map((char, index) => (
        <span key={`${char}-${index}`} className={`mana-dot mana-${char.toLowerCase()}`}>
          {char}
        </span>
      ))}
    </span>
  );
}

function ManaCurve({ values }: { values: number[] }) {
  const max = Math.max(...values);
  return (
    <div className="mana-curve" aria-label="Curva de mana">
      <span className="sr-only">Curva de mana por custo de 0 a 6</span>
      {values.map((value, index) => (
        <span className="mana-bar-wrap" key={index}>
          <span
            className="mana-bar"
            style={{
              height: `${Math.max(12, (value / max) * 100)}%`,
              backgroundColor: colors.light.bronze
            }}
          />
          <small>{index}</small>
        </span>
      ))}
    </div>
  );
}

function CardThumb({ image, name, large = false }: { image: string; name: string; large?: boolean }) {
  return (
    <div className={`card-thumb group relative overflow-visible ${large ? 'w-[72px]' : 'w-12'}`}>
      <div className="card-art" role="img" aria-label={`Carta ${name}`} style={{ backgroundImage: `url(${image})` }}>
        <span>{name}</span>
      </div>
      <div className="card-preview pointer-events-none absolute bottom-full left-1/2 z-30 mb-3 hidden w-48 -translate-x-1/2 group-hover:block">
        <div className="card-art rounded-xl text-sm shadow-2xl" style={{ backgroundImage: `url(${image})` }}>
          <span>{name}</span>
        </div>
      </div>
    </div>
  );
}

export function DashboardPage({ onLogout, onNavigate, onSearch }: DashboardPageProps & { onNavigate?: (href: string) => void }) {
  const [topFilter, setTopFilter] = useState('Mais usadas');

  return (
    <main
      className="dashboard-shell min-h-screen flex flex-col w-full"
      style={{ backgroundColor: colors.light['surface-alt'], color: colors.light['text-main'] }}
    >
      <AppNav activeNav="#visao-geral" onLogout={onLogout} onNavigate={onNavigate} onSearch={onSearch} />

      <section className="dashboard-content w-full" id="visao-geral">
        <div className="dashboard-main max-w-[1440px] mx-auto w-full px-6 lg:px-10 py-8">

          {/* Quick Actions */}
          <div className="dashboard-section-heading mt-2">
            <div>
              <p className="eyebrow" style={{ color: colors.light.bronze }}>Ações rápidas</p>
              <h2 style={{ color: colors.light['text-main'] }}>Continue de onde parou</h2>
            </div>
          </div>
          <div className="quick-actions">
            <a href="#importar" style={{ backgroundColor: colors.light.surface, borderColor: colors.light.border }}>
              <span style={{ color: colors.light.bronze }}>↥</span>
              <div>
                <strong>Importar decklist</strong>
                <small className="block text-xs" style={{ color: colors.light['text-light'] }}>Cole uma lista do Moxfield, Archidekt ou texto</small>
              </div>
            </a>
            <a href="#exportar" style={{ backgroundColor: colors.light.surface, borderColor: colors.light.border }}>
              <span style={{ color: colors.light.bronze }}>↧</span>
              <div>
                <strong>Exportar coleção</strong>
                <small className="block text-xs" style={{ color: colors.light['text-light'] }}>JSON ou bloco de notas</small>
              </div>
            </a>
            <a href="#novo-deck" style={{ backgroundColor: colors.light.surface, borderColor: colors.light.border }}>
              <span style={{ color: colors.light.bronze }}>＋</span>
              <div>
                <strong>Criar novo deck</strong>
                <small className="block text-xs" style={{ color: colors.light['text-light'] }}>Comece por um formato</small>
              </div>
            </a>
          </div>

          {/* Section Heading */}
          <div id="deckbuilder" className="dashboard-section-heading mt-10 sm:mt-12 scroll-mt-24">
            <div>
              <p className="eyebrow" style={{ color: colors.light.bronze }}>Sua bancada</p>
              <h2 style={{ color: colors.light['text-main'] }}>Decks em andamento</h2>
            </div>
            <a href="#deckbuilder" className="text-sm font-bold hover:underline" style={{ color: colors.light.bronze }}>
              Abrir deckbuilder →
            </a>
          </div>

          {/* Decks Grid */}
          <div className="deck-grid">
            {deckCards.map((deck) => (
              <article
                className="deck-card rounded-2xl overflow-hidden border shadow-sm"
                key={deck.name}
                style={{ backgroundColor: colors.light.surface, borderColor: colors.light.border }}
              >
                <div className="deck-cover" style={{ backgroundImage: `linear-gradient(180deg, rgba(0,0,0,0.4) 0%, rgba(0,0,0,0.85) 100%), url(${deck.image})` }}>
                  <span className="deck-cover-title">{deck.name}</span>
                  <span className={`deck-status ${deck.progress === 100 ? 'ready' : ''}`}>{deck.status}</span>
                </div>
                <div className="p-4">
                  <div className="flex items-start justify-between gap-3">
                    <div>
                      <h3 className="font-black tracking-[-0.03em] text-base" style={{ color: colors.light.dark }}>{deck.name}</h3>
                      <p className="mt-1 text-xs" style={{ color: colors.light['text-light'] }}>{deck.format}</p>
                    </div>
                    <ManaCurve values={deck.manaCurve} />
                    <DeckOptionsMenu deckName={deck.name} />
                  </div>

                  <div className="mt-5 flex items-center justify-between text-[11px] font-bold" style={{ color: colors.light['text-light'] }}>
                    <span>Conclusão</span>
                    <span>
                      {deck.progress}% <strong className="deck-card-count font-black" style={{ color: colors.light.dark }}>{deck.cards}</strong>
                    </span>
                  </div>

                  <div className="mt-2 h-1.5 overflow-hidden rounded-full" style={{ backgroundColor: colors.light['surface-alt'] }}>
                    <div className="h-full rounded-full" style={{ width: `${deck.progress}%`, backgroundColor: colors.light.bronze }} />
                  </div>
                </div>
              </article>
            ))}
          </div>

          {/* Lower Grid Panels */}
          <section className="dashboard-lower-grid mt-10 sm:mt-12">
            {/* Wishlist Panel */}
            <div
              className="dashboard-panel rounded-2xl border p-6 shadow-sm scroll-mt-24"
              id="lista-de-desejos"
              style={{ backgroundColor: colors.light.surface, borderColor: colors.light.border }}
            >
              <div className="panel-heading">
                <div>
                  <p className="eyebrow" style={{ color: colors.light.bronze }}>Próximas aquisições</p>
                  <h2 style={{ color: colors.light['text-main'] }}>Lista de desejos</h2>
                </div>
                <button className="text-sm font-bold cursor-pointer border-0 bg-transparent p-0 hover:underline" type="button" style={{ color: colors.light.bronze }}>
                  Ver tudo →
                </button>
              </div>

              <div className="wishlist-list">
                {wishes.map((card) => (
                  <div className="wishlist-row" key={card.name}>
                    <CardThumb image={card.image} name={card.name} large />
                    <div className="min-w-0 flex-1">
                      <strong className="block truncate text-sm" style={{ color: colors.light.dark }}>{card.name}</strong>
                      <Mana value={card.mana} />
                      <small className="text-xs" style={{ color: colors.light['text-light'] }}>{card.price}</small>
                    </div>
                    <button
                      className="arrived-button px-3 py-1 rounded-full text-xs font-semibold border transition-colors cursor-pointer"
                      type="button"
                      style={{ borderColor: colors.light.border, color: colors.light.dark, backgroundColor: colors.light['surface-alt'] }}
                    >
                      Chegou
                    </button>
                  </div>
                ))}
              </div>
            </div>

            {/* Top Cards Panel */}
            <div
              className="dashboard-panel rounded-2xl border p-6 shadow-sm"
              style={{ backgroundColor: colors.light.surface, borderColor: colors.light.border }}
            >
              <div className="panel-heading">
                <div>
                  <p className="eyebrow" style={{ color: colors.light.bronze }}>Sua coleção física</p>
                  <h2 style={{ color: colors.light['text-main'] }}>Top cards</h2>
                </div>
              </div>

              <div className="filter-tabs">
                {['Mais usadas', 'Mais recentes', 'Mais caras'].map((filter) => (
                  <button
                    key={filter}
                    className={topFilter === filter ? 'active' : ''}
                    onClick={() => setTopFilter(filter)}
                    type="button"
                    style={topFilter === filter ? { backgroundColor: colors.light.dark, color: '#fff' } : {}}
                  >
                    {filter}
                  </button>
                ))}
              </div>

              <div className="top-card-list">
                {topCards.map((card, index) => (
                  <div className="top-card-row" key={card.name}>
                    <span className="rank font-mono text-xs font-bold" style={{ color: colors.light.bronze }}>0{index + 1}</span>
                    <CardThumb image={card.image} name={card.name} />
                    <div className="min-w-0 flex-1">
                      <strong className="block truncate text-sm" style={{ color: colors.light.dark }}>{card.name}</strong>
                      <Mana value={card.mana} />
                      <small className="text-xs" style={{ color: colors.light['text-light'] }}>{card.meta}</small>
                    </div>
                    <span className="font-bold text-xs" style={{ color: colors.light.dark }}>{card.value}</span>
                  </div>
                ))}
              </div>
            </div>
          </section>
        </div>
      </section>
    </main>
  );
}

export default DashboardPage;