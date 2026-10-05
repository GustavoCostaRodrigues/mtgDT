import { useState, useRef, useEffect } from 'react';
import { ThemeSwitch } from './ThemeSwitch';

interface UserMenuProps {
  userName?: string;
  userPlan?: string;
  avatarUrl?: string;
  theme?: 'light' | 'dark';
  onThemeToggle?: () => void;
  onLogout?: () => void;
  onNavigateProfile?: () => void;
  onNavigateSettings?: () => void;
}

export function UserMenu({
  userName = 'Marina Costa',
  userPlan = 'Plano gratuito',
  avatarUrl = '/spellbinder-logo.png',
  theme = 'light',
  onThemeToggle,
  onLogout,
  onNavigateProfile,
  onNavigateSettings,
}: UserMenuProps) {
  const [isOpen, setIsOpen] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);

  // Close on outside click or Escape key
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    }
    function handleKeyDown(event: KeyboardEvent) {
      if (event.key === 'Escape') {
        setIsOpen(false);
      }
    }
    document.addEventListener('mousedown', handleClickOutside);
    document.addEventListener('keydown', handleKeyDown);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
      document.removeEventListener('keydown', handleKeyDown);
    };
  }, []);

  return (
    <div className="dashboard-user-menu-wrap relative" ref={menuRef}>
      <button
        className="dashboard-user-card flex items-center gap-2.5 bg-transparent border-none p-0 cursor-pointer"
        onClick={() => setIsOpen((open) => !open)}
        aria-expanded={isOpen}
        aria-haspopup="menu"
        aria-label={`Menu de ${userName}`}
        type="button"
      >
        <span className="dashboard-profile flex items-center justify-center w-8 h-8 rounded-full bg-[#1c1917] overflow-hidden">
          <img src={avatarUrl} alt="" className="w-6 h-6 object-contain" />
        </span>
        <span className="dashboard-user-name text-xs font-extrabold text-[#171513]">{userName}</span>
        <span className="dashboard-user-chevron text-xs text-[#8b847c]" aria-hidden="true">
          ⌄
        </span>
      </button>

      {isOpen && (
        <div className="dashboard-user-menu shadow-xl border border-black/10 rounded-2xl bg-[#f8f5ee] p-2 z-50 absolute right-0 top-[calc(100%+8px)] w-[270px] animate-fadeIn" role="menu">
          <div
            className="dashboard-user-menu-heading p-3 border-b border-black/[0.08] mb-1 relative flex items-center justify-between"
          >
            <div>
              <strong className="block text-sm font-extrabold text-[#171513]">{userName}</strong>
              <small className="block text-xs font-semibold text-[#9b7130] mt-0.5">{userPlan}</small>
            </div>
            {onThemeToggle && (
              <ThemeSwitch
                theme={theme}
                onToggle={onThemeToggle}
                style={{ position: 'absolute', right: 14, left: 'auto', top: '50%', transform: 'translateY(-50%)' }}
              />
            )}
          </div>

          <button
            type="button"
            role="menuitem"
            className="w-full flex items-center justify-between p-2.5 rounded-xl text-xs font-bold text-[#625d59] hover:bg-[#e9e1cf] hover:text-[#171513] transition-colors text-left border-none bg-transparent cursor-pointer"
            onClick={() => {
              setIsOpen(false);
              if (onNavigateProfile) onNavigateProfile();
            }}
          >
            <span>Meu perfil</span>
            <span className="text-[#9b7130]">→</span>
          </button>

          <button
            type="button"
            role="menuitem"
            className="w-full flex items-center justify-between p-2.5 rounded-xl text-xs font-bold text-[#625d59] hover:bg-[#e9e1cf] hover:text-[#171513] transition-colors text-left border-none bg-transparent cursor-pointer"
            onClick={() => {
              setIsOpen(false);
              if (onNavigateSettings) onNavigateSettings();
            }}
          >
            <span>Configurações</span>
            <span className="text-[#9b7130]">→</span>
          </button>

          <button
            type="button"
            role="menuitem"
            className="w-full flex items-center justify-between p-2.5 rounded-xl text-xs font-bold text-[#625d59] hover:bg-[#e9e1cf] hover:text-[#171513] transition-colors text-left border-none bg-transparent cursor-pointer"
            onClick={() => {
              setIsOpen(false);
              if (onLogout) onLogout();
            }}
          >
            <span>Sair</span>
            <span className="text-[#9b7130]">↗</span>
          </button>
        </div>
      )}
    </div>
  );
}

export default UserMenu;
