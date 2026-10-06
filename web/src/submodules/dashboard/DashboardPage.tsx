import { useState, useEffect } from 'react';
import { AppNav } from '../../components/navbar/AppNav';
import { DeckOptionsMenu } from '../../components/dashboard/DeckOptionsMenu';
import { colors } from '../../styles/colors';
import { getStoredUser, type UserProfile } from '../auth/authStorage';

interface DashboardPageProps {
  onLogout?: () => void;
  onNavigateDeckbuilder?: () => void;
  onNavigateColecao?: () => void;
  onNavigateAcervo?: () => void;
  onNavigateMercado?: () => void;
  onSearch?: (query: string) => void;
  onNavigate?: (href: string) => void;
}

export { AppNav as DashboardNav };

function ManaItem({ symbol, raw }: { symbol: string; raw: string }) {
  const [hasError, setHasError] = useState(false);
  const svgUrl = `https://svgs.scryfall.io/card-symbols/${symbol}.svg`;

  if (hasError) {
    return (
      <span
        title={raw}
        className="w-4 h-4 rounded-full text-[10px] font-black flex items-center justify-center shrink-0 border text-center leading-none"
        style={{
          backgroundColor: colors.light.background,
          borderColor: colors.light.border,
          color: colors.light.dark,
        }}
      >
        {symbol}
      </span>
    );
  }

  return (
    <img
      src={svgUrl}
      alt={raw}
      title={raw}
      loading="lazy"
      onError={() => setHasError(true)}
      className="w-4 h-4 inline-block align-middle shrink-0"
    />
  );
}

// Componente para renderizar custos de mana reais do Magic via Scryfall SVGs
export function RealManaCost({ value, className = '' }: { value: string; className?: string }) {
  if (!value) return null;

  // Extrai símbolos no formato {2}{U} ou quebra valores como '2U', '1B', '4', 'R', 'W', 'WUBG'
  let symbols: string[] = [];
  const braceMatches = value.match(/\{([^}]+)\}/g);
  if (braceMatches && braceMatches.length > 0) {
    symbols = braceMatches;
  } else {
    const rawMatches = value.match(/(\d+|[WUBRGCX])/gi);
    if (rawMatches && rawMatches.length > 0) {
      symbols = rawMatches.map((m) => `{${m}}`);
    } else {
      symbols = [value];
    }
  }

  return (
    <span className={`inline-flex items-center gap-1 flex-wrap ${className}`}>
      {symbols.map((sym, index) => {
        const clean = sym.replace(/[{}]/g, '').toUpperCase();
        return <ManaItem key={`${clean}-${index}`} symbol={clean} raw={sym} />;
      })}
    </span>
  );
}

// Mantido para compatibilidade onde Mana é importado
export { RealManaCost as Mana };

interface DeckItem {
  id?: string;
  name: string;
  format: string;
  mana?: string;
  status: string;
  progress: number;
  cards: string;
  manaCurve: number[];
  image: string;
}

interface WishItem {
  name: string;
  price: string;
  mana: string;
  image: string;
}

interface TopCardItem {
  name: string;
  meta: string;
  value: string;
  mana: string;
  image: string;
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
              backgroundColor: colors.light.bronze,
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

export function DashboardPage({
  onLogout,
  onNavigate,
  onSearch,
}: DashboardPageProps) {
  const [currentUser, setCurrentUser] = useState<UserProfile>(getStoredUser());
  const [topFilter, setTopFilter] = useState('Mais usadas');

  // Decks reais do usuário logado (inicia vazio, sem dados mockados)
  const [decks, setDecks] = useState<DeckItem[]>([]);
  const [wishes] = useState<WishItem[]>([]);
  const [topCards] = useState<TopCardItem[]>([]);

  // Sincroniza dados do usuário logado
  useEffect(() => {
    const handleUserChange = (e: any) => {
      const user = e?.detail || getStoredUser();
      setCurrentUser(user);
    };
    window.addEventListener('spellbinder-user-change', handleUserChange);
    return () => {
      window.removeEventListener('spellbinder-user-change', handleUserChange);
    };
  }, []);

  // Busca decks reais do usuário logado na API se houver token
  useEffect(() => {
    const token = localStorage.getItem('spellbinder_token');
    if (!token) {
      setDecks([]);
      return;
    }

    fetch('http://localhost:3333/api/decks', {
      headers: { Authorization: `Bearer ${token}` },
    })
      .then((res) => {
        if (res.ok) return res.json();
        return [];
      })
      .then((data) => {
        if (Array.isArray(data) && data.length > 0) {
          const mapped: DeckItem[] = data.map((d: any) => ({
            id: String(d.id),
            name: d.name,
            format: d.format || 'Commander',
            mana: d.colors ? d.colors.map((c: string) => `{${c}}`).join('') : '{1}',
            status: d.totalCards >= 60 ? 'Pronto para jogar' : 'Em construção',
            progress: Math.min(100, Math.round(((d.totalCards || 0) / 60) * 100)),
            cards: `${d.totalCards || 0}/60`,
            manaCurve: [4, 8, 12, 10, 6, 2, 1],
            image: d.image || 'https://cards.scryfall.io/normal/front/8/2/82c7f3a1-3d25-4e6f-8e0f-10bd30d7e4f2.jpg',
          }));
          setDecks(mapped);
        } else {
          setDecks([]);
        }
      })
      .catch(() => {
        setDecks([]);
      });
  }, [currentUser.id]);

  return (
    <main
      className="dashboard-shell min-h-screen flex flex-col w-full"
      style={{ backgroundColor: colors.light['surface-alt'], color: colors.light['text-main'] }}
    >
      <AppNav activeNav="#visao-geral" onLogout={onLogout} onNavigate={onNavigate} onSearch={onSearch} />

      <section className="dashboard-content w-full" id="visao-geral">
        <div className="dashboard-main max-w-[1440px] mx-auto w-full px-6 lg:px-10 py-8">

          {/* 1. Decks em andamento */}
          <div id="deckbuilder" className="dashboard-section-heading scroll-mt-24">
            <div>
              <p className="eyebrow" style={{ color: colors.light.bronze }}>Sua bancada</p>
              <h2 style={{ color: colors.light['text-main'] }}>Decks em andamento</h2>
            </div>
            <a
              href="#deckbuilder"
              onClick={(e) => {
                e.preventDefault();
                onNavigate?.('/decks');
              }}
              className="text-sm font-bold hover:underline"
              style={{ color: colors.light.bronze }}
            >
              Abrir deckbuilder →
            </a>
          </div>

          {/* Decks Grid com Manas Reais do Magic e Aviso se Vazio */}
          <div className="deck-grid">
            {decks.length === 0 ? (
              <div
                className="col-span-full rounded-2xl border border-dashed p-8 text-center flex flex-col items-center justify-center my-2"
                style={{ borderColor: colors.light.border, backgroundColor: colors.light.surface }}
              >
                <div
                  className="size-12 rounded-full flex items-center justify-center mb-3"
                  style={{ backgroundColor: `${colors.light.bronze}15`, color: colors.light.bronze }}
                >
                  <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
                  </svg>
                </div>
                <h3 className="text-base font-bold" style={{ color: colors.light['text-main'] }}>
                  Nenhum deck construído
                </h3>
                <p className="text-xs mt-1 max-w-md" style={{ color: colors.light['text-muted'] }}>
                  Você ainda não possui nenhum deck em andamento ou construído nesta conta.
                </p>
                <button
                  type="button"
                  onClick={() => onNavigate?.('/decks')}
                  className="mt-4 px-4 py-2 rounded-xl text-xs font-bold text-white shadow-sm cursor-pointer transition-opacity hover:opacity-90"
                  style={{ backgroundColor: colors.light.dark }}
                >
                  ＋ Criar meu primeiro deck
                </button>
              </div>
            ) : (
              decks.map((deck) => (
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
                        <div className="flex items-center gap-2 mt-1">
                          <p className="text-xs font-semibold" style={{ color: colors.light['text-light'] }}>{deck.format}</p>
                          {deck.mana && (
                            <>
                              <span className="text-[10px] opacity-40">•</span>
                              <RealManaCost value={deck.mana} />
                            </>
                          )}
                        </div>
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
              ))
            )}
          </div>

          {/* 2. Ações rápidas */}
          <div className="dashboard-section-heading mt-12">
            <div>
              <p className="eyebrow" style={{ color: colors.light.bronze }}>Ações rápidas</p>
              <h2 style={{ color: colors.light['text-main'] }}>Continue de onde parou</h2>
            </div>
          </div>
          <div className="quick-actions">
            <a
              href="#importar"
              onClick={(e) => {
                e.preventDefault();
                onNavigate?.('/decks');
              }}
              style={{ backgroundColor: colors.light.surface, borderColor: colors.light.border }}
            >
              <span style={{ color: colors.light.bronze }}>↥</span>
              <div>
                <strong>Importar decklist</strong>
                <small className="block text-xs" style={{ color: colors.light['text-light'] }}>Cole uma lista do Moxfield, Archidekt ou texto</small>
              </div>
            </a>
            <a
              href="#exportar"
              onClick={(e) => {
                e.preventDefault();
                onNavigate?.('/colecao');
              }}
              style={{ backgroundColor: colors.light.surface, borderColor: colors.light.border }}
            >
              <span style={{ color: colors.light.bronze }}>↧</span>
              <div>
                <strong>Exportar coleção</strong>
                <small className="block text-xs" style={{ color: colors.light['text-light'] }}>JSON ou bloco de notas</small>
              </div>
            </a>
            <a
              href="#novo-deck"
              onClick={(e) => {
                e.preventDefault();
                onNavigate?.('/decks');
              }}
              style={{ backgroundColor: colors.light.surface, borderColor: colors.light.border }}
            >
              <span style={{ color: colors.light.bronze }}>＋</span>
              <div>
                <strong>Criar novo deck</strong>
                <small className="block text-xs" style={{ color: colors.light['text-light'] }}>Comece por um formato</small>
              </div>
            </a>
          </div>

          {/* 3. Lower Grid Panels */}
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
                <button
                  className="text-sm font-bold cursor-pointer border-0 bg-transparent p-0 hover:underline"
                  type="button"
                  onClick={() => onNavigate?.('/wishlist')}
                  style={{ color: colors.light.bronze }}
                >
                  Ver tudo →
                </button>
              </div>

              <div className="wishlist-list">
                {wishes.length === 0 ? (
                  <div
                    className="rounded-xl border border-dashed p-6 text-center flex flex-col items-center justify-center my-2"
                    style={{ borderColor: colors.light.border, backgroundColor: colors.light['surface-alt'] }}
                  >
                    <div
                      className="size-9 rounded-full flex items-center justify-center mb-2"
                      style={{ backgroundColor: `${colors.light.bronze}15`, color: colors.light.bronze }}
                    >
                      <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
                      </svg>
                    </div>
                    <p className="text-xs font-bold" style={{ color: colors.light['text-main'] }}>
                      Sua lista de desejos está vazia
                    </p>
                    <p className="text-[11px] mt-0.5" style={{ color: colors.light['text-muted'] }}>
                      Nenhuma carta marcada para aquisição futura.
                    </p>
                    <button
                      type="button"
                      onClick={() => onNavigate?.('/buscar-cartas')}
                      className="mt-2.5 px-3 py-1 rounded-full text-[11px] font-bold cursor-pointer transition-colors"
                      style={{ backgroundColor: colors.light.surface, color: colors.light.bronze, border: `1px solid ${colors.light.border}` }}
                    >
                      Buscar cartas →
                    </button>
                  </div>
                ) : (
                  wishes.map((card) => (
                    <div className="wishlist-row" key={card.name}>
                      <CardThumb image={card.image} name={card.name} large />
                      <div className="min-w-0 flex-1">
                        <strong className="block truncate text-sm" style={{ color: colors.light.dark }}>{card.name}</strong>
                        <div className="mt-1 mb-0.5">
                          <RealManaCost value={card.mana} />
                        </div>
                        <small className="text-xs font-semibold" style={{ color: colors.light.bronze }}>{card.price}</small>
                      </div>
                      <button
                        className="arrived-button px-3 py-1 rounded-full text-xs font-semibold border transition-colors cursor-pointer"
                        type="button"
                        style={{ borderColor: colors.light.border, color: colors.light.dark, backgroundColor: colors.light['surface-alt'] }}
                      >
                        Chegou
                      </button>
                    </div>
                  ))
                )}
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
                {topCards.length === 0 ? (
                  <div
                    className="rounded-xl border border-dashed p-6 text-center flex flex-col items-center justify-center my-2"
                    style={{ borderColor: colors.light.border, backgroundColor: colors.light['surface-alt'] }}
                  >
                    <div
                      className="size-9 rounded-full flex items-center justify-center mb-2"
                      style={{ backgroundColor: `${colors.light.bronze}15`, color: colors.light.bronze }}
                    >
                      <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
                      </svg>
                    </div>
                    <p className="text-xs font-bold" style={{ color: colors.light['text-main'] }}>
                      Nenhuma carta catalogada
                    </p>
                    <p className="text-[11px] mt-0.5" style={{ color: colors.light['text-muted'] }}>
                      Você ainda não possui cartas registradas na sua coleção física.
                    </p>
                    <button
                      type="button"
                      onClick={() => onNavigate?.('/colecao')}
                      className="mt-2.5 px-3 py-1 rounded-full text-[11px] font-bold cursor-pointer transition-colors"
                      style={{ backgroundColor: colors.light.surface, color: colors.light.bronze, border: `1px solid ${colors.light.border}` }}
                    >
                      Minha coleção →
                    </button>
                  </div>
                ) : (
                  topCards.map((card, index) => (
                    <div className="top-card-row" key={card.name}>
                      <span className="rank font-mono text-xs font-bold" style={{ color: colors.light.bronze }}>0{index + 1}</span>
                      <CardThumb image={card.image} name={card.name} />
                      <div className="min-w-0 flex-1">
                        <strong className="block truncate text-sm" style={{ color: colors.light.dark }}>{card.name}</strong>
                        <div className="mt-1 mb-0.5">
                          <RealManaCost value={card.mana} />
                        </div>
                        <small className="text-xs" style={{ color: colors.light['text-light'] }}>{card.meta}</small>
                      </div>
                      <span className="font-bold text-xs" style={{ color: colors.light.dark }}>{card.value}</span>
                    </div>
                  ))
                )}
              </div>
            </div>
          </section>
        </div>
      </section>
    </main>
  );
}

export default DashboardPage;