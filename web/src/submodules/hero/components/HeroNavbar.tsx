interface HeroNavbarProps {
  onNavigateLogin?: () => void;
  onNavigateRegister?: () => void;
}

export function HeroNavbar({ onNavigateLogin, onNavigateRegister }: HeroNavbarProps) {
  return (
    <header className="z-50 w-full h-14 bg-[#0e0e11]/85 backdrop-blur-2xl border-b border-white/5 flex-shrink-0">
      <div className="w-full h-full px-6 flex items-center justify-between">
        {/* Logo */}
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 flex items-center justify-center flex-shrink-0">
            <img src="/logo.png" alt="DeckTracker Logo" className="w-full h-full object-contain filter drop-shadow-[0_0_8px_rgba(128,131,255,0.4)]" />
          </div>
          <span className="font-bold text-base tracking-wider text-[#e4e1e6]">DECKTRACKER</span>
          <span className="text-[10px] font-bold px-1.5 py-0.5 rounded bg-[#2a2a2d] text-[#c0c1ff]">MTG</span>
        </div>

        {/* Links Centrais */}
        <nav className="hidden lg:flex items-center gap-2 p-1 rounded-full bg-[#1b1b1e]/70 border border-white/5">
          <a href="#matrix" className="px-3 py-1 bg-[#2a2a2d] text-[#e4e1e6] font-medium text-xs rounded-full">
            Matriz de Comandantes
          </a>
          <a href="#meta" className="px-3 py-1 text-xs text-[#c7c4d7] hover:text-white transition-colors">
            Panorama do Meta
          </a>
          <a href="#scryfall" className="px-3 py-1 text-xs text-[#c7c4d7] hover:text-white transition-colors">
            Motor Scryfall
          </a>
          <a href="#pricing" className="px-3 py-1 text-xs text-[#c7c4d7] hover:text-white transition-colors">
            Planos
          </a>
        </nav>

        {/* Botões da Direita */}
        <div className="flex items-center gap-3">
          <button
            type="button"
            onClick={onNavigateRegister}
            className="text-xs font-semibold text-[#c7c4d7] hover:text-white px-2 py-1 transition-colors cursor-pointer"
          >
            Criar conta
          </button>

          <button
            type="button"
            onClick={onNavigateLogin}
            className="inline-flex items-center gap-1.5 text-xs font-bold bg-[#c0c1ff] text-[#1000a9] px-4 py-1.5 rounded-full hover:bg-white transition-all shadow-sm cursor-pointer"
          >
            Entrar →
          </button>
        </div>
      </div>
    </header>
  );
}