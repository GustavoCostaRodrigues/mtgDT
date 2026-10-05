import React, { useEffect, useLayoutEffect, useRef, useState } from 'react';
import { UserMenu } from './UserMenu';
import { CardSearch } from './CardSearch';

const navItems = [
  ['Visão geral', '/dashboard#visao-geral'],
  ['Minha coleção', '/minha-colecao'],
  ['Bancada Virtual', '#deckbuilder'],
  ['Lista de desejos', '#lista-de-desejos'],
] as const;

interface AppNavProps {
  activeNav?: string;
  onNavigate?: (href: string) => void;
  onLogout?: () => void;
  onSearch?: (query: string) => void;
}

export function AppNav({ activeNav: initialActiveNav = '/dashboard#visao-geral', onNavigate, onLogout, onSearch }: AppNavProps) {
  const [activeNav, setActiveNav] = useState(initialActiveNav);
  const [gameFormat, setGameFormat] = useState('Commander');
  const [theme, setTheme] = useState<'light' | 'dark'>('light');
  const navRef = useRef<HTMLElement>(null);
  const linkRefs = useRef<Record<string, HTMLAnchorElement | null>>({});
  const [indicatorLeft, setIndicatorLeft] = useState(0);

  // Sync theme with document element
  useEffect(() => {
    document.documentElement.classList.toggle('light', theme === 'light');
    document.documentElement.classList.toggle('dark', theme === 'dark');
  }, [theme]);

  // Dynamic active link gold dot positioning
  useLayoutEffect(() => {
    const nav = navRef.current;
    const link = linkRefs.current[activeNav];
    if (!nav || !link) return;
    const navBox = nav.getBoundingClientRect();
    const linkBox = link.getBoundingClientRect();
    setIndicatorLeft(linkBox.left - navBox.left + linkBox.width / 2 - 3);
  }, [activeNav]);

  const handleLinkClick = (e: React.MouseEvent<HTMLAnchorElement>, href: string) => {
    e.preventDefault();
    setActiveNav(href);
    if (onNavigate) onNavigate(href);
  };

  return (
    <header className="dashboard-topbar flex items-center justify-between h-[72px] px-8 bg-[#f2efe8]/95 backdrop-blur-md border-b border-black/[0.08] select-none">
      {/* 1. Logo (Symbol Only) & 2. Vertical Separator & 3. Format Selector */}
      <div className="flex items-center gap-4">
        <a
          href="/"
          className="dashboard-brand flex items-center justify-center w-10 h-10 rounded-lg hover:opacity-90 transition-opacity"
          aria-label="SpellBinder"
          onClick={(e) => handleLinkClick(e, '/dashboard#visao-geral')}
        >
          <img src="/spellbinder-logo.png" alt="SpellBinder" className="size-9 object-contain" />
        </a>

        <span className="h-4 w-[1px] bg-black/15" aria-hidden="true" />

        <label className="format-select-wrap flex items-center gap-1 font-bold text-xs text-[#24211f] cursor-pointer">
          <span className="sr-only">Formato de jogo</span>
          <select
            className="format-select appearance-none bg-transparent border-none font-bold text-xs text-[#24211f] cursor-pointer pr-4 focus:outline-none"
            value={gameFormat}
            onChange={(event) => setGameFormat(event.target.value)}
          >
            <option>Commander</option>
            <option>Modern</option>
            <option>Pioneer</option>
            <option>Pauper</option>
            <option>Legacy</option>
          </select>
          <span aria-hidden="true" className="text-[10px] text-[#8b847c] -ml-3 pointer-events-none">
            ⌄
          </span>
        </label>
      </div>

      {/* 4. Search Bar */}
      <CardSearch onSearch={onSearch} />

      {/* 5. Navigation Links & Active Gold Dot Indicator */}
      <nav ref={navRef} className="dashboard-topnav relative flex items-center gap-7" aria-label="Navegação do dashboard">
        <span
          aria-hidden="true"
          className="dashboard-topnav-indicator absolute -bottom-2.5 w-1.5 h-1.5 rounded-full bg-[#9b7130] transition-all duration-300 pointer-events-none"
          style={{ left: indicatorLeft }}
        />
        {navItems.map(([label, href]) => (
          <a
            ref={(element) => {
              linkRefs.current[href] = element;
            }}
            href={href}
            className={`text-xs transition-colors ${activeNav === href ? 'active font-extrabold text-[#171513]' : 'font-semibold text-[#625d59] hover:text-[#171513]'}`}
            onClick={(e) => handleLinkClick(e, href)}
            aria-current={activeNav === href ? 'page' : undefined}
            key={label}
          >
            {label}
          </a>
        ))}
      </nav>

      {/* 6. User Avatar & Menu */}
      <div className="dashboard-user-actions flex items-center gap-3">
        <UserMenu
          theme={theme}
          onThemeToggle={() => setTheme(theme === 'dark' ? 'light' : 'dark')}
          onLogout={onLogout}
          onNavigateProfile={() => {
            if (onNavigate) onNavigate('/perfil');
          }}
          onNavigateSettings={() => {
            if (onNavigate) onNavigate('/configuracoes');
          }}
        />
      </div>
    </header>
  );
}

export default AppNav;
