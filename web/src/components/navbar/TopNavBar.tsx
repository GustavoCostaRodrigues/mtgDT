import { useState, useRef, useEffect } from 'react';

export type NavScreenId = 'dashboard' | 'decks' | 'collection' | 'analytics';

interface TopNavBarProps {
  currentScreen?: NavScreenId;
  onNavigate?: (screen: NavScreenId) => void;
  onProfileClick?: () => void;
  onLogout?: () => void;
  userName?: string;
  userAvatarUrl?: string;
}

export function TopNavBar({
  currentScreen = 'dashboard',
  onNavigate,
  onProfileClick,
  onLogout,
  userName = 'Kaelen Vance',
  userAvatarUrl,
}: TopNavBarProps) {
  const [isDarkMode, setIsDarkMode] = useState(true);
  const [isUserMenuOpen, setIsUserMenuOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  // Close dropdown menu when clicking outside
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsUserMenuOpen(false);
      }
    }
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const navItems: { id: NavScreenId; label: string }[] = [
    { id: 'dashboard', label: 'Dashboard' },
    { id: 'decks', label: 'Meus Decks' },
    { id: 'collection', label: 'Coleção' },
    { id: 'analytics', label: 'Meta Analytics' },
  ];

  // Modos de Jogo / Formatos
  const gameModes = [
    { id: 'commander', name: 'Commander (cEDH / Casual)', active: true },
    { id: 'modern', name: 'Modern', active: false },
    { id: 'pioneer', name: 'Pioneer', active: false },
    { id: 'standard', name: 'Standard', active: false },
    { id: 'pauper', name: 'Pauper', active: false },
  ];

  return (
    <header className="sticky top-0 z-50 w-full h-14 bg-[#09090b]/95 backdrop-blur-md border-b border-zinc-800 transition-colors select-none">
      <div className="max-w-[1780px] h-full mx-auto px-6 flex items-center justify-between gap-4">

        {/* A. Seção Esquerda (Identidade) */}
        <div className="flex items-center gap-3 shrink-0">
          <button
            type="button"
            onClick={() => onNavigate?.('dashboard')}
            className="w-8 h-8 rounded-lg bg-zinc-900 border border-zinc-700/80 flex items-center justify-center text-white shadow-xs hover:border-zinc-500 transition-colors group cursor-pointer"
            title="Ir para Dashboard"
          >
            <img src="/logo.png" alt="DeckTracker" className="w-5 h-5 object-contain group-hover:scale-105 transition-transform" />
          </button>

          <div className="flex items-center gap-2">
            <span className="font-sans font-semibold tracking-tight text-white text-base">DeckTracker</span>
            <span className="px-1.5 py-0.5 text-[10px] font-mono font-medium tracking-wider uppercase rounded bg-indigo-500/10 text-indigo-400 border border-indigo-500/20">
              PRO
            </span>
          </div>
        </div>

        {/* B. Seção Central (Navegação em Pílula) */}
        <nav className="hidden md:flex items-center gap-1 p-1 rounded-full bg-zinc-900/90 border border-zinc-800 shadow-inner">
          {navItems.map((item) => {
            const isActive = currentScreen === item.id;
            return (
              <button
                key={item.id}
                type="button"
                onClick={() => onNavigate?.(item.id)}
                className={`nav-tab relative px-4 py-1.5 text-xs font-medium rounded-full transition-all duration-150 flex items-center gap-1.5 cursor-pointer ${isActive
                    ? 'bg-zinc-800 text-white font-semibold shadow-xs'
                    : 'text-zinc-400 hover:text-zinc-200 hover:bg-zinc-800/40'
                  }`}
              >
                {isActive && <span className="w-1.5 h-1.5 rounded-full bg-indigo-400 shrink-0" />}
                {item.label}
              </button>
            );
          })}
        </nav>

        {/* C. Seção Direita (Ações e Perfil) */}
        <div className="flex items-center gap-3 shrink-0">
          {/* Alternador de Tema */}
          <button
            type="button"
            onClick={() => setIsDarkMode(!isDarkMode)}
            aria-label="Alternar tema"
            className="w-8 h-8 rounded-lg border border-zinc-800 bg-zinc-900/60 hover:bg-zinc-800 text-zinc-400 hover:text-zinc-200 transition-colors flex items-center justify-center cursor-pointer"
            title={isDarkMode ? 'Modo Escuro Ativo' : 'Modo Claro Ativo'}
          >
            {isDarkMode ? (
              <svg className="w-4 h-4 text-amber-300" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <circle cx="12" cy="12" r="5" />
                <line x1="12" y1="1" x2="12" y2="3" />
                <line x1="12" y1="21" x2="12" y2="23" />
                <line x1="4.22" y1="4.22" x2="5.64" y2="5.64" />
                <line x1="18.36" y1="18.36" x2="19.78" y2="19.78" />
                <line x1="1" y1="12" x2="3" y2="12" />
                <line x1="21" y1="12" x2="23" y2="12" />
                <line x1="4.22" y1="19.78" x2="5.64" y2="18.36" />
                <line x1="18.36" y1="5.64" x2="19.78" y2="4.22" />
              </svg>
            ) : (
              <svg className="w-4 h-4 text-indigo-400" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z" />
              </svg>
            )}
          </button>

          {/* Card de Perfil com Menu Suspenso */}
          <div className="relative" ref={dropdownRef}>
            <button
              type="button"
              onClick={() => setIsUserMenuOpen(!isUserMenuOpen)}
              aria-expanded={isUserMenuOpen}
              className="flex items-center gap-2.5 p-1 pr-2.5 rounded-lg border border-zinc-800 bg-zinc-900/60 hover:bg-zinc-800/80 transition-colors group select-none text-left cursor-pointer"
            >
              <div className="w-6 h-6 rounded-md bg-gradient-to-tr from-indigo-600 to-violet-500 border border-indigo-400/40 flex items-center justify-center text-[11px] font-bold text-white shrink-0 shadow-xs">
                {userAvatarUrl ? (
                  <img src={userAvatarUrl} alt={userName} className="w-full h-full object-cover rounded-md" />
                ) : (
                  userName.charAt(0).toUpperCase()
                )}
              </div>
              <span className="text-xs font-medium text-zinc-300 group-hover:text-white max-w-[120px] truncate">
                {userName}
              </span>
              <svg
                className={`w-3.5 h-3.5 text-zinc-500 group-hover:text-zinc-300 transition-transform duration-150 ${isUserMenuOpen ? 'rotate-180 text-white' : ''
                  }`}
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <polyline points="6 9 12 15 18 9" />
              </svg>
            </button>

            {/* Dropdown Menu */}
            {isUserMenuOpen && (
              <div className="absolute right-0 mt-2 w-64 rounded-xl border border-zinc-800 bg-[#0c0d10]/95 backdrop-blur-xl p-1.5 shadow-2xl z-50 animate-fadeIn">
                {/* Header do Usuário */}
                <div className="px-3 py-2 border-b border-zinc-800/70 mb-1">
                  <p className="text-xs font-semibold text-white">{userName}</p>
                  <p className="text-[10px] font-mono text-zinc-400 mt-0.5 flex items-center gap-1.5">
                    <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 inline-block" />
                    cEDH Architect • Niv. 24
                  </p>
                </div>

                {/* Seção de Modos de Jogo / Formatos */}
                <div className="px-2 py-1.5">
                  <span className="text-[10px] font-mono uppercase tracking-wider text-zinc-500 px-1 mb-1 block">
                    Modos de Jogo / Formatos
                  </span>
                  <div className="space-y-1">
                    {gameModes.map((mode) => {
                      const isLocked = !mode.active || mode.id !== 'commander';
                      return (
                        <div
                          key={mode.id}
                          className={`group relative w-full flex items-center justify-between px-2.5 py-1.5 text-xs rounded-lg transition-all ${
                            !isLocked
                              ? 'text-white bg-zinc-800/80 font-medium cursor-pointer hover:bg-zinc-700/80 border border-zinc-700/40 shadow-xs'
                              : 'text-zinc-500 bg-zinc-900/40 border border-zinc-800/20 cursor-not-allowed select-none opacity-60 hover:opacity-90'
                          }`}
                          onClick={(e) => {
                            if (isLocked) {
                              e.preventDefault();
                              e.stopPropagation();
                            }
                          }}
                        >
                          <span className="flex items-center gap-2">
                            <span
                              className={`w-1.5 h-1.5 rounded-full ${
                                !isLocked ? 'bg-emerald-400 shadow-[0_0_6px_rgba(52,211,153,0.5)]' : 'bg-zinc-600'
                              }`}
                            />
                            {mode.name}
                          </span>

                          {isLocked ? (
                            <div className="flex items-center gap-1.5 relative">
                              {/* Ícone de Cadeado */}
                              <svg
                                className="w-3.5 h-3.5 text-zinc-500 group-hover:text-amber-400 transition-colors shrink-0"
                                viewBox="0 0 24 24"
                                fill="none"
                                stroke="currentColor"
                                strokeWidth="2"
                                strokeLinecap="round"
                                strokeLinejoin="round"
                              >
                                <rect x="3" y="11" width="18" height="11" rx="2" ry="2" />
                                <path d="M7 11V7a5 5 0 0 1 10 0v4" />
                              </svg>

                              {/* Custom Hover Tooltip */}
                              <div className="absolute right-0 bottom-full mb-1.5 pointer-events-none opacity-0 group-hover:opacity-100 transition-all duration-200 transform translate-y-1 group-hover:translate-y-0 z-50">
                                <div className="bg-zinc-900/95 backdrop-blur-md text-zinc-200 border border-zinc-750 text-[10px] font-medium px-2 py-1 rounded-md shadow-xl whitespace-nowrap flex items-center gap-1">
                                  <span className="text-amber-400">🔒</span>
                                  <span>Lançado em breve</span>
                                </div>
                              </div>
                            </div>
                          ) : (
                            <span className="text-[10px] font-mono px-1.5 py-0.5 rounded bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 font-semibold">
                              Ativo
                            </span>
                          )}
                        </div>
                      );
                    })}
                  </div>
                </div>

                <div className="my-1 border-t border-zinc-800/70" />

                {/* Itens do Menu */}
                <button
                  type="button"
                  onClick={() => {
                    setIsUserMenuOpen(false);
                    onProfileClick?.();
                  }}
                  className="w-full flex items-center gap-2.5 px-3 py-2 text-xs rounded-lg text-zinc-300 hover:text-white hover:bg-zinc-800/60 transition-colors text-left cursor-pointer"
                >
                  <svg className="w-3.5 h-3.5 text-zinc-400" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" />
                    <circle cx="12" cy="7" r="4" />
                  </svg>
                  <span>Meu Perfil</span>
                </button>

                <button
                  type="button"
                  onClick={() => {
                    setIsUserMenuOpen(false);
                    onProfileClick?.();
                  }}
                  className="w-full flex items-center gap-2.5 px-3 py-2 text-xs rounded-lg text-zinc-300 hover:text-white hover:bg-zinc-800/60 transition-colors text-left cursor-pointer"
                >
                  <svg className="w-3.5 h-3.5 text-zinc-400" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <circle cx="12" cy="12" r="3" />
                    <path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 0 1 0 2.83 2 2 0 0 1-2.83 0l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-2 2 2 2 0 0 1-2-2v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 0 1-2.83 0 2 2 0 0 1 0-2.83l.06-.06a1.65 1.65 0 0 0 .33-1.82 1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1-2-2 2 2 0 0 1 2-2h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 0 1 0-2.83 2 2 0 0 1 2.83 0l.06.06a1.65 1.65 0 0 0 1.82.33H9a1.65 1.65 0 0 0 1-1.51V3a2 2 0 0 1 2-2 2 2 0 0 1 2 2v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 0 1 2.83 0 2 2 0 0 1 0 2.83l-.06-.06a1.65 1.65 0 0 0-.33 1.82V9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 0 1 2 2 2 2 0 0 1-2 2h-.09a1.65 1.65 0 0 0-1.51 1z" />
                  </svg>
                  <span>Configurações</span>
                </button>

                <div className="my-1 border-t border-zinc-800/70" />

                <button
                  type="button"
                  onClick={() => {
                    setIsUserMenuOpen(false);
                    onLogout?.();
                  }}
                  className="w-full flex items-center gap-2.5 px-3 py-2 text-xs rounded-lg text-rose-400 hover:text-rose-300 hover:bg-rose-500/10 transition-colors font-medium text-left cursor-pointer"
                >
                  <svg className="w-3.5 h-3.5 text-rose-400" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4" />
                    <polyline points="16 17 21 12 16 7" />
                    <line x1="21" y1="12" x2="9" y2="12" />
                  </svg>
                  <span>Sair / Logoff</span>
                </button>
              </div>
            )}
          </div>
        </div>

      </div>
    </header>
  );
}

export default TopNavBar;