import { useState, useEffect, useRef } from 'react';
import { colors } from '../../styles/colors';
import { getStoredUser, clearStoredUser, type UserProfile } from '../../submodules/auth/authStorage';

interface CardSuggestion {
  id: string;
  name: string;
  set: string;
  slug: string;
  rarity: string;
  type: string;
  image_url?: string | null;
}

export function AppNav({
  activeNav = '/buscar-cartas',
  onNavigate,
  onLogout,
  onSearch,
  selectedFormat: propSelectedFormat,
  onFormatChange,
}: {
  activeNav?: string;
  onNavigate?: (href: string) => void;
  onLogout?: () => void;
  onSearch?: (query: string) => void;
  selectedFormat?: string;
  onFormatChange?: (format: string) => void;
}) {
  const [currentUser, setCurrentUser] = useState<UserProfile>(getStoredUser());
  const [searchQuery, setSearchQuery] = useState('');
  const [suggestions, setSuggestions] = useState<CardSuggestion[]>([]);
  const [showDropdown, setShowDropdown] = useState(false);
  const [loadingSuggestions, setLoadingSuggestions] = useState(false);
  const [userMenuOpen, setUserMenuOpen] = useState(false);
  const [formatMenuOpen, setFormatMenuOpen] = useState(false);
  const [internalFormat, setInternalFormat] = useState('Commander');

  const selectedFormat = propSelectedFormat || internalFormat;

  // Atualiza dinamicamente se o usuário logado mudar
  useEffect(() => {
    const handleUserChange = (e: any) => {
      if (e?.detail) {
        setCurrentUser(e.detail);
      } else {
        setCurrentUser(getStoredUser());
      }
    };
    window.addEventListener('spellbinder-user-change', handleUserChange);
    return () => {
      window.removeEventListener('spellbinder-user-change', handleUserChange);
    };
  }, []);

  // Estado para o preview flutuante no hover da lista
  const [hoveredCard, setHoveredCard] = useState<CardSuggestion | null>(null);
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });

  const searchContainerRef = useRef<HTMLDivElement>(null);

  const formats = ['Commander', 'Standard', 'Modern', 'Pioneer', 'Legacy', 'Draft'];

  const navItems = [
    { label: 'Visão geral', href: '/dashboard' },
    { label: 'Buscar cartas', href: '/buscar-cartas' },
    { label: 'Minha coleção', href: '/colecao' },
    { label: 'Decks', href: '/decks' },
    { label: 'Lista de desejos', href: '/wishlist' },
  ];

  // Fecha o dropdown ao clicar fora ou apertar Escape
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (searchContainerRef.current && !searchContainerRef.current.contains(event.target as Node)) {
        setShowDropdown(false);
        setHoveredCard(null);
      }
    }

    function handleKeyDown(event: KeyboardEvent) {
      if (event.key === 'Escape') {
        setShowDropdown(false);
        setHoveredCard(null);
        setFormatMenuOpen(false);
        setUserMenuOpen(false);
      }
    }

    document.addEventListener('mousedown', handleClickOutside);
    document.addEventListener('keydown', handleKeyDown);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
      document.removeEventListener('keydown', handleKeyDown);
    };
  }, []);

  // Autocomplete local da Navbar
  useEffect(() => {
    const timer = setTimeout(async () => {
      if (!searchQuery || searchQuery.trim().length < 2) {
        setSuggestions([]);
        setShowDropdown(false);
        setHoveredCard(null);
        return;
      }

      setLoadingSuggestions(true);
      try {
        const res = await fetch(`/api/cards/search?q=${encodeURIComponent(searchQuery.trim())}`);
        if (res.ok) {
          const data = await res.json();
          setSuggestions(data);
          setShowDropdown(true);
        } else {
          setSuggestions([]);
        }
      } catch (err) {
        console.error('Erro ao buscar sugestões na navbar:', err);
        setSuggestions([]);
      } finally {
        setLoadingSuggestions(false);
      }
    }, 300);

    return () => clearTimeout(timer);
  }, [searchQuery]);

  const handleMouseMove = (e: React.MouseEvent) => {
    const previewWidth = 240;
    const previewHeight = 340;

    // Posiciona ao lado direito do cursor; se passar da borda da tela, inverte para o lado esquerdo
    let posX = e.clientX + 20;
    if (posX + previewWidth > window.innerWidth - 10) {
      posX = Math.max(10, e.clientX - previewWidth - 20);
    }

    // Mantém a visualização vertical dentro dos limites da tela
    let posY = e.clientY - 140;
    posY = Math.max(10, Math.min(window.innerHeight - previewHeight - 10, posY));

    setMousePosition({ x: posX, y: posY });
  };

  const handleSelectCardFromDropdown = (slug: string) => {
    setShowDropdown(false);
    setHoveredCard(null);
    setSearchQuery('');

    const targetUrl = `/buscar-cartas?card=${slug}`;

    // 1. Tenta usar a função de navegação passada por props
    if (typeof onNavigate === 'function') {
      onNavigate(targetUrl);
      return;
    }

    // 2. Se não houver onNavigate, dispara um evento customizado que o router pai pode escutar
    window.dispatchEvent(new CustomEvent('app-navigate', { detail: targetUrl }));

    // 3. Fallback final simulando um link limpo caso o router utilize a API de History do HTML5
    window.history.pushState({}, '', targetUrl);
    window.dispatchEvent(new PopStateEvent('popstate'));
  };

  const handleNavClick = (e: React.MouseEvent, href: string) => {
    e.preventDefault();
    if (onNavigate) onNavigate(href);
  };

  return (
    <>
      <header
        className="sticky top-0 left-0 right-0 z-[9999] h-[78px] border-b shadow-[0_4px_20px_rgba(36,33,31,0.04)] flex-shrink-0 w-full"
        style={{
          backgroundColor: colors.light.surface,
          borderColor: colors.light.border,
        }}
      >
        <div className="flex h-full w-full items-center justify-between px-6 lg:px-12">
          {/* Esquerda: Logo, Divisor, Dropdown de Formato e Barra de Pesquisa */}
          <div className="flex items-center gap-5">
            <a
              href="/dashboard"
              onClick={(e) => handleNavClick(e, '/dashboard')}
              className="flex items-center gap-2.5 text-[21px] font-extrabold tracking-[-0.05em] text-black cursor-pointer group no-underline"
            >
              <div className="relative flex size-10 items-center justify-center rounded-[11px] border-2 border-black bg-white p-1 shadow-[3px_3px_0_#171513] group-hover:scale-105 transition-transform overflow-hidden">
                <img src="/mascot.png" alt="SpellBinder Logo" className="w-full h-full object-contain" />
              </div>
              <span className="hidden sm:inline" style={{ color: colors.light['text-main'] }}>SpellBinder</span>
            </a>

            <div className="h-6 w-px" style={{ backgroundColor: colors.light.border }} />

            {/* Seletor de Formato */}
            <div className="relative">
              <button
                type="button"
                onClick={() => setFormatMenuOpen(!formatMenuOpen)}
                className="flex items-center gap-2 px-3.5 py-2 rounded-full border text-xs font-bold transition-colors cursor-pointer shadow-2xs"
                style={{
                  backgroundColor: colors.light.background,
                  borderColor: colors.light.border,
                  color: colors.light['text-main'],
                }}
              >
                <span>{selectedFormat}</span>
                <svg className={`w-3.5 h-3.5 transition-transform ${formatMenuOpen ? 'rotate-180' : ''}`} fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M19 9l-7 7-7-7" />
                </svg>
              </button>

              {formatMenuOpen && (
                <div
                  className="absolute left-0 mt-2 w-44 rounded-2xl border shadow-xl py-2 z-50"
                  style={{ backgroundColor: colors.light.surface, borderColor: colors.light.border }}
                >
                  <div className="px-3 py-1 text-[10px] uppercase font-bold tracking-wider" style={{ color: colors.light['text-faint'] }}>Formato de Jogo</div>
                  {formats.map((fmt) => (
                    <button
                      key={fmt}
                      type="button"
                      onClick={() => {
                        setInternalFormat(fmt);
                        setFormatMenuOpen(false);
                        if (onFormatChange) onFormatChange(fmt);
                        window.dispatchEvent(new CustomEvent('mtg-format-change', { detail: fmt }));
                      }}
                      className={`w-full text-left px-4 py-2 text-xs font-semibold transition-colors cursor-pointer ${selectedFormat === fmt ? 'font-bold' : ''
                        }`}
                      style={{
                        backgroundColor: selectedFormat === fmt ? colors.light.background : 'transparent',
                        color: colors.light['text-main'],
                      }}
                    >
                      {fmt}
                    </button>
                  ))}
                </div>
              )}
            </div>

            {/* Barra de Pesquisa da Navbar */}
            <div className="hidden md:block w-72 lg:w-80 ml-3 relative" ref={searchContainerRef}>
              <div
                className="relative w-full flex items-center h-10 px-3.5 rounded-full border shadow-2xs"
                style={{
                  backgroundColor: colors.light.background,
                  borderColor: colors.light.border,
                }}
              >
                <span className="absolute inset-y-0 left-0 flex items-center pl-3.5 pointer-events-none" style={{ color: colors.light['text-faint'] }}>
                  <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                  </svg>
                </span>
                <input
                  type="text"
                  placeholder="Buscar cartas, decks ou regras..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  onFocus={() => {
                    if (suggestions.length > 0) setShowDropdown(true);
                  }}
                  onKeyDown={(e) => {
                    if (e.key === 'Enter') {
                      if (suggestions.length > 0) {
                        e.preventDefault();
                        handleSelectCardFromDropdown(suggestions[0].slug);
                      } else if (onSearch && searchQuery.trim()) {
                        e.preventDefault();
                        onSearch(searchQuery.trim());
                      }
                    }
                  }}
                  className="w-full h-full pl-7 bg-transparent border-none outline-none text-xs font-medium"
                  style={{ color: colors.light['text-main'] }}
                />
                {loadingSuggestions && (
                  <div className="w-3.5 h-3.5 border-2 border-[#9b7130] border-t-transparent rounded-full animate-spin shrink-0" />
                )}
              </div>

              {/* Dropdown Ampliado de Sugestões com suporte a hover */}
              {showDropdown && suggestions.length > 0 && (
                <div
                  className="absolute top-12 left-0 w-[380px] lg:w-[420px] rounded-3xl border shadow-2xl z-50 overflow-hidden py-2"
                  style={{
                    backgroundColor: colors.light.surface,
                    borderColor: colors.light.border,
                  }}
                >
                  <div className="px-5 py-2 text-[10px] uppercase font-black tracking-widest border-b" style={{ color: colors.light['text-faint'], borderColor: colors.light.border }}>
                    Cartas encontradas
                  </div>
                  <div className="max-h-[380px] overflow-y-auto">
                    {suggestions.map((item) => (
                      <button
                        key={item.id}
                        type="button"
                        onClick={() => handleSelectCardFromDropdown(item.slug)} // Chamando a função correta da Navbar
                        className="w-full text-left px-4 py-3 flex items-center justify-between transition-colors cursor-pointer hover:bg-black/5 dark:hover:bg-white/5 border-b border-black/5 last:border-none"
                      >
                        <div className="flex items-center gap-3.5">
                          {item.image_url ? (
                            <img
                              src={item.image_url}
                              alt={item.name}
                              onMouseEnter={() => setHoveredCard(item)}
                              onMouseMove={handleMouseMove}
                              onMouseLeave={() => setHoveredCard(null)}
                              className="w-10 h-14 object-cover rounded-lg shadow-sm border border-black/10 shrink-0 transition-transform hover:scale-105"
                            />
                          ) : (
                            <div className="w-10 h-14 rounded-lg bg-black/5 border border-black/10 flex items-center justify-center text-[9px] font-bold text-center shrink-0">
                              Sem foto
                            </div>
                          )}
                          <div>
                            <p className="text-sm font-black tracking-tight leading-snug" style={{ color: colors.light['text-main'] }}>{item.name}</p>
                            <p className="text-xs font-medium mt-0.5" style={{ color: colors.light['text-muted'] }}>{item.set}</p>
                            <p className="text-[10px] font-semibold mt-1" style={{ color: colors.light['text-faint'] }}>{item.type}</p>
                          </div>
                        </div>
                        <span className="text-[10px] px-2.5 py-1 rounded-full font-black uppercase tracking-wider shrink-0" style={{ color: colors.light.bronze, backgroundColor: `${colors.light.bronze}1a` }}>
                          {item.rarity}
                        </span>
                      </button>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </div>

          <div className="flex-1" />

          {/* Centro: Links de Navegação */}
          <nav className="hidden lg:flex items-center gap-1 relative py-2 mx-4" aria-label="Navegação do app">
            {navItems.map((item) => {
              const active = activeNav === item.href;
              return (
                <a
                  key={item.href}
                  href={item.href}
                  onClick={(e) => handleNavClick(e, item.href)}
                  aria-current={active ? 'page' : undefined}
                  className={`px-3.5 py-2 text-xs font-bold transition-colors rounded-lg no-underline ${active ? 'font-extrabold' : ''
                    }`}
                  style={{
                    color: active ? colors.light['text-main'] : colors.light['text-muted'],
                    backgroundColor: active ? colors.light.background : 'transparent',
                  }}
                >
                  {item.label}
                </a>
              );
            })}
          </nav>

          <div className="flex-1" />

          {/* Direita: Perfil */}
          <div className="flex items-center">
            <div className="relative">
              <button
                type="button"
                onClick={() => setUserMenuOpen(!userMenuOpen)}
                className="flex items-center gap-2.5 p-1.5 pr-3 rounded-full border transition-colors cursor-pointer shadow-sm"
                style={{
                  backgroundColor: colors.light.background,
                  borderColor: colors.light.border,
                }}
              >
                <div className="size-7 rounded-full bg-[#24211f] flex items-center justify-center text-white overflow-hidden border border-black/10">
                  <img src={currentUser.avatarUrl || '/mascot.png'} alt={currentUser.name} className="w-full h-full object-contain" />
                </div>
                <span className="text-xs font-bold hidden sm:inline" style={{ color: colors.light['text-main'] }}>
                  {currentUser.name}
                </span>
                <svg className="w-3 h-3" style={{ color: colors.light['text-muted'] }} fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M19 9l-7 7-7-7" />
                </svg>
              </button>

              {userMenuOpen && (
                <div
                  className="absolute right-0 mt-2 w-52 rounded-2xl border shadow-xl py-2 z-50"
                  style={{ backgroundColor: colors.light.surface, borderColor: colors.light.border }}
                >
                  <div className="px-4 py-2 border-b" style={{ borderColor: colors.light.border }}>
                    <p className="text-xs font-black" style={{ color: colors.light['text-main'] }}>{currentUser.name}</p>
                    <p className="text-[11px] truncate mt-0.5" style={{ color: colors.light['text-muted'] }}>{currentUser.email}</p>
                    <span className="inline-block mt-1 text-[9px] font-black uppercase tracking-wider px-2 py-0.5 rounded-full" style={{ backgroundColor: `${colors.light.bronze}1a`, color: colors.light.bronze }}>
                      {currentUser.plan || 'Planeswalker'}
                    </span>
                  </div>
                  <a href="#perfil" className="block px-4 py-2 text-xs font-medium hover:bg-black/5" style={{ color: colors.light['text-main'] }}>Meu Perfil</a>
                  <a href="#configuracoes" className="block px-4 py-2 text-xs font-medium hover:bg-black/5" style={{ color: colors.light['text-main'] }}>Configurações</a>
                  <div className="h-px my-1" style={{ backgroundColor: colors.light.border }} />
                  <button
                    type="button"
                    onClick={() => {
                      setUserMenuOpen(false);
                      clearStoredUser();
                      if (onLogout) onLogout();
                    }}
                    className="w-full text-left px-4 py-2 text-xs font-semibold text-[#ba1a1a] hover:bg-[#ffdad6]/30 cursor-pointer"
                  >
                    Sair da conta
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>
      </header>

      {/* Tooltip Flutuante de Preview da Carta no Hover */}
      {hoveredCard && hoveredCard.image_url && (
        <div
          className="fixed z-[99999] pointer-events-none transition-all duration-75 ease-out shadow-2xl rounded-2xl overflow-hidden border-2 border-black/20 bg-black/80 backdrop-blur-sm p-1.5"
          style={{
            top: `${mousePosition.y}px`,
            left: `${mousePosition.x}px`,
            width: '240px',
          }}
        >
          <img
            src={hoveredCard.image_url}
            alt={hoveredCard.name}
            className="w-full h-auto rounded-xl object-contain shadow-inner"
          />
        </div>
      )}
    </>
  );
}

export default AppNav;