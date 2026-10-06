interface HeroNavbarProps {
  onNavigateLogin?: () => void;
  onNavigateRegister?: () => void;
  onNavigateHome?: () => void;
}

export function HeroNavbar({ onNavigateLogin, onNavigateRegister, onNavigateHome }: HeroNavbarProps) {
  return (
    <header className="fixed top-0 left-0 right-0 z-[9999] h-[78px] bg-spell-bg/95 backdrop-blur-2xl border-b border-spell-border/60 shadow-sm flex-shrink-0">
      <div className="mx-auto h-full max-w-[1440px] px-6 lg:px-10 flex items-center justify-between">

        {/* Logo */}
        <button
          type="button"
          onClick={onNavigateHome}
          className="flex items-center gap-2.5 text-[21px] font-extrabold tracking-[-0.05em] text-spell-main cursor-pointer group border-0 bg-transparent p-0"
        >
          <div className="relative flex size-10 items-center justify-center rounded-[11px] border-2 border-spell-main bg-spell-bg p-1 shadow-[3px_3px_0_#171513] group-hover:scale-105 transition-transform overflow-hidden">
            <img src="/mascot.png" alt="SpellBinder Logo" className="w-full h-full object-contain" />
          </div>
          <span>SpellBinder</span>
        </button>

        {/* Links Centrais */}
        <nav aria-label="Navegação principal" className="hidden lg:flex items-center gap-2 p-1 rounded-full bg-spell-surface-alt border border-spell-border">
          <a href="#inicio" className="px-3.5 py-1.5 bg-spell-surface text-spell-main font-bold text-xs rounded-full shadow-xs">
            Início
          </a>
          <a href="#colecao" className="px-3.5 py-1.5 text-xs text-spell-muted hover:text-spell-main transition-colors font-medium">
            Coleção Física
          </a>
          <a href="#deckbuilder" className="px-3.5 py-1.5 text-xs text-spell-muted hover:text-spell-main transition-colors font-medium">
            Deckbuilder
          </a>
          <a href="#como-funciona" className="px-3.5 py-1.5 text-xs text-spell-muted hover:text-spell-main transition-colors font-medium">
            Como funciona
          </a>
        </nav>

        {/* Botões da Direita */}
        <div className="flex items-center gap-4">
          <button
            type="button"
            onClick={onNavigateRegister}
            className="hidden sm:block text-[14px] font-medium text-spell-muted transition-colors hover:text-spell-main cursor-pointer"
          >
            Registre-se
          </button>

          <button
            type="button"
            onClick={onNavigateLogin}
            className="group inline-flex h-11 items-center gap-3 rounded-full bg-spell-dark pl-5 pr-2 text-[14px] font-semibold text-white shadow-[0_4px_0_#d8d4cc,0_10px_24px_rgba(36,33,31,0.12)] transition-all hover:-translate-y-0.5 hover:bg-spell-dark-hover cursor-pointer"
          >
            <span>Entrar</span>
            <span aria-hidden="true" className="flex size-7 items-center justify-center rounded-full bg-white text-spell-dark transition-transform group-hover:translate-x-0.5">
              →
            </span>
          </button>
        </div>

      </div>
    </header>
  );
}

export default HeroNavbar;