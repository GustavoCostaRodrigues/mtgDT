export function HeroFooter() {
  return (
    <footer className="w-full h-10 bg-[#0e0e11] border-t border-white/5 px-6 flex items-center justify-between text-[11px] text-[#908fa0] flex-shrink-0 z-10">
      <div className="flex items-center gap-2">
        <span className="px-1.5 py-0.5 rounded bg-[#1b1b1e] uppercase text-[9px]">Padrão</span>
        <span className="px-1.5 py-0.5 rounded bg-[#1b1b1e] uppercase text-[9px]">Moderno</span>
        <span className="px-1.5 py-0.5 rounded bg-[#1b1b1e] uppercase text-[9px]">Comandante</span>
        <span className="px-1.5 py-0.5 rounded bg-[#1b1b1e] uppercase text-[9px]">Legado</span>
      </div>
      <div className="flex items-center gap-1.5 font-mono text-[10px]">
        <span className="w-1.5 h-1.5 rounded-full bg-[#7bd0ff] inline-block animate-pulse" />
        <span>Ao Vivo • 11ms Sincronização Scryfall</span>
      </div>
      <div>© 2026 MTG DeckTracker. Telemetria tática para planeswalkers.</div>
    </footer>
  );
}