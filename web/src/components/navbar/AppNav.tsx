import React, { useState, useRef, useLayoutEffect } from 'react';
import { colors } from '../../styles/colors';

interface AppNavProps {
  activeNav?: string;
  onLogout?: () => void;
  onNavigate?: (href: string) => void;
  onSearch?: (query: string) => void;
}

export function AppNav({ activeNav = '/dashboard', onLogout, onNavigate, onSearch }: AppNavProps) {
  const [searchQuery, setSearchQuery] = useState('');
  const [formatMenuOpen, setFormatMenuOpen] = useState(false);
  const [selectedFormat, setSelectedFormat] = useState('Commander');
  const [userMenuOpen, setUserMenuOpen] = useState(false);

  const navRef = useRef<HTMLElement>(null);
  const linkRefs = useRef<Record<string, HTMLAnchorElement | null>>({});
  const [indicatorLeft, setIndicatorLeft] = useState<number | null>(null);

  const navItems = [
    { label: 'Visão geral', href: '/dashboard' },
    { label: 'Minha coleção', href: '/minha-colecao' },
    { label: 'Decks', href: '#deckbuilder' },
    { label: 'Lista de desejos', href: '#lista-de-desejos' },
  ];

  const formats = ['Commander', 'Pauper', 'Modern', 'Standard', 'Draft'];

  const isItemActive = (href: string) => {
    if (activeNav === href) return true;
    if (activeNav.includes('colecao') && href.includes('colecao')) return true;
    if ((activeNav.includes('visao-geral') || activeNav.includes('dashboard')) && (href.includes('visao-geral') || href.includes('dashboard'))) return true;
    if (activeNav.includes('deckbuilder') && href.includes('deckbuilder')) return true;
    if (activeNav.includes('desejos') && href.includes('desejos')) return true;
    return false;
  };

  useLayoutEffect(() => {
    const nav = navRef.current;
    if (!nav) return;

    const activeItem = navItems.find((item) => isItemActive(item.href));
    const activeLink = activeItem ? linkRefs.current[activeItem.href] : null;

    if (activeLink) {
      const navBox = nav.getBoundingClientRect();
      const linkBox = activeLink.getBoundingClientRect();
      setIndicatorLeft(linkBox.left - navBox.left + linkBox.width / 2 - 3);
    } else {
      setIndicatorLeft(null);
    }
  }, [activeNav]);

  const handleNavClick = (e: React.MouseEvent<HTMLAnchorElement>, href: string) => {
    e.preventDefault();
    if (onNavigate) {
      onNavigate(href);
    } else {
      window.location.hash = href;
    }
  };

  return (
    <header
      className="sticky top-0 left-0 right-0 z-[9999] h-[78px] bg-white border-b border-[#ded9ce] shadow-[0_4px_20px_rgba(36,33,31,0.04)] flex-shrink-0 w-full"
    >
      <div className="mx-auto h-full max-w-[1440px] px-6 lg:px-10 flex items-center justify-between gap-4">

        {/* Esquerda: Logo e Seletor de Formato */}
        <div className="flex items-center gap-6">
          <a
            href="/dashboard"
            onClick={(e) => handleNavClick(e, '/dashboard')}
            className="flex items-center gap-2.5 text-[21px] font-extrabold tracking-[-0.05em] text-black cursor-pointer group no-underline"
          >
            <div className="relative flex size-10 items-center justify-center rounded-[11px] border-2 border-black bg-white p-1 shadow-[3px_3px_0_#171513] group-hover:scale-105 transition-transform overflow-hidden">
              <img src="/mascot.png" alt="SpellBinder Logo" className="w-full h-full object-contain" />
            </div>
            <span className="hidden sm:inline">SpellBinder</span>
          </a>

          <div className="h-6 w-px bg-[#ded9ce]" />

          {/* Seletor de Formato */}
          <div className="relative">
            <button
              type="button"
              onClick={() => setFormatMenuOpen(!formatMenuOpen)}
              className="flex items-center gap-2 px-3.5 py-2 rounded-full border border-[#ded9ce] bg-[#faf9f5] text-xs font-bold text-[#24211f] hover:bg-[#f2efe8] transition-colors cursor-pointer shadow-2xs"
            >
              <span>{selectedFormat}</span>
              <svg className={`w-3.5 h-3.5 transition-transform ${formatMenuOpen ? 'rotate-180' : ''}`} fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M19 9l-7 7-7-7" />
              </svg>
            </button>

            {formatMenuOpen && (
              <div className="absolute left-0 mt-2 w-44 rounded-2xl bg-white border border-[#ded9ce] shadow-xl py-2 z-50">
                <div className="px-3 py-1 text-[10px] uppercase font-bold tracking-wider text-[#8b847c]">Formato de Jogo</div>
                {formats.map((fmt) => (
                  <button
                    key={fmt}
                    type="button"
                    onClick={() => {
                      setSelectedFormat(fmt);
                      setFormatMenuOpen(false);
                    }}
                    className={`w-full text-left px-4 py-2 text-xs font-semibold transition-colors cursor-pointer ${selectedFormat === fmt ? 'bg-[#f2efe8] text-black font-bold' : 'text-[#625d59] hover:bg-[#faf9f5]'
                      }`}
                  >
                    {fmt}
                  </button>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* Centro: Barra de Pesquisa */}
        <div className="hidden md:flex flex-1 justify-center max-w-sm mx-4">
          <div className="relative w-full max-w-xs">
            <span className="absolute inset-y-0 left-0 flex items-center pl-3.5 pointer-events-none text-[#8b847c]">
              <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
              </svg>
            </span>
            <input
              type="text"
              placeholder="Buscar cartas, decks ou regras..."
              value={searchQuery}
              onChange={(e) => {
                setSearchQuery(e.target.value);
                if (onSearch) onSearch(e.target.value);
              }}
              className="w-full h-10 pl-10 pr-4 rounded-full border border-[#ded9ce] bg-[#faf9f5] text-xs font-medium text-black placeholder:text-[#a29b94] outline-none transition focus:border-[#9b7130] focus:bg-white shadow-2xs"
            />
          </div>
        </div>

        {/* Direita: Links Centrais com Indicador Deslizante & Perfil */}
        <div className="flex items-center gap-6">
          <nav ref={navRef} className="hidden lg:flex items-center gap-1 relative py-2" aria-label="Navegação do app">
            {/* Bolinha dourada indicadora deslisante com animação suave */}
            {indicatorLeft !== null && (
              <span
                aria-hidden="true"
                className="absolute bottom-0 size-1.5 rounded-full transition-all duration-300 ease-out pointer-events-none"
                style={{
                  left: `${indicatorLeft}px`,
                  backgroundColor: colors.light.bronze,
                }}
              />
            )}

            {navItems.map((item) => {
              const active = isItemActive(item.href);
              return (
                <a
                  key={item.href}
                  ref={(el) => {
                    linkRefs.current[item.href] = el;
                  }}
                  href={item.href}
                  onClick={(e) => handleNavClick(e, item.href)}
                  aria-current={active ? 'page' : undefined}
                  className={`px-3.5 py-2 text-xs font-bold transition-colors rounded-lg no-underline ${active ? 'text-black font-extrabold' : 'text-[#625d59] hover:text-black hover:bg-[#faf9f5]'
                    }`}
                >
                  {item.label}
                </a>
              );
            })}
          </nav>

          <div className="h-6 w-px bg-[#ded9ce] hidden lg:block" />

          {/* Avatar / Perfil do Usuário */}
          <div className="relative">
            <button
              type="button"
              onClick={() => setUserMenuOpen(!userMenuOpen)}
              className="flex items-center gap-2.5 p-1.5 pr-3 rounded-full border border-[#ded9ce] bg-[#faf9f5] hover:bg-[#f2efe8] transition-colors cursor-pointer shadow-2xl"
            >
              <div className="size-7 rounded-full bg-[#24211f] flex items-center justify-center text-white overflow-hidden border border-black/10">
                <img src="/mascot.png" alt="Avatar" className="w-full h-full object-contain" />
              </div>
              <span className="text-xs font-bold text-[#24211f] hidden sm:inline">Marina Costa</span>
              <svg className="w-3 h-3 text-[#625d59]" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M19 9l-7 7-7-7" />
              </svg>
            </button>

            {userMenuOpen && (
              <div className="absolute right-0 mt-2 w-48 rounded-2xl bg-white border border-[#ded9ce] shadow-xl py-2 z-50">
                <div className="px-4 py-2 border-b border-[#ded9ce]">
                  <p className="text-xs font-bold text-black">Marina Costa</p>
                  <p className="text-[11px] text-[#8b847c] truncate">marina@spellbinder.app</p>
                </div>
                <a href="#perfil" className="block px-4 py-2 text-xs font-medium text-[#24211f] hover:bg-[#faf9f5]">Meu Perfil</a>
                <a href="#configuracoes" className="block px-4 py-2 text-xs font-medium text-[#24211f] hover:bg-[#faf9f5]">Configurações</a>
                <div className="h-px bg-[#ded9ce] my-1" />
                <button
                  type="button"
                  onClick={() => {
                    setUserMenuOpen(false);
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
  );
}

export default AppNav;