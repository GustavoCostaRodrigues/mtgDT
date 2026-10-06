import { colors } from '../../../styles/colors'; // Ajuste o caminho se necessário para o seu projeto

export function HeroFooter() {
  return (
    <footer
      className="w-full h-10 border-t px-6 flex items-center justify-between text-[11px] flex-shrink-0 z-10"
      style={{
        backgroundColor: colors.dark.surface,
        borderColor: colors.dark.border,
        color: colors.dark['text-muted'],
      }}
    >
      <div className="flex items-center gap-2">
        <span className="px-1.5 py-0.5 rounded uppercase text-[9px]" style={{ backgroundColor: colors.dark['surface-alt'], color: colors.dark['text-light'] }}>Padrão</span>
        <span className="px-1.5 py-0.5 rounded uppercase text-[9px]" style={{ backgroundColor: colors.dark['surface-alt'], color: colors.dark['text-light'] }}>Moderno</span>
        <span className="px-1.5 py-0.5 rounded uppercase text-[9px]" style={{ backgroundColor: colors.dark['surface-alt'], color: colors.dark.gold }}>Comandante</span>
        <span className="px-1.5 py-0.5 rounded uppercase text-[9px]" style={{ backgroundColor: colors.dark['surface-alt'], color: colors.dark['text-light'] }}>Legado</span>
      </div>
      <div className="flex items-center gap-1.5 font-mono text-[10px]">
        <span className="w-1.5 h-1.5 rounded-full inline-block animate-pulse" style={{ backgroundColor: colors.dark.success }} />
        <span>Ao Vivo • 11ms Sincronização Scryfall</span>
      </div>
      <div style={{ color: colors.dark['text-light'] }}>© 2026 SpellBinder. Telemetria tática para planeswalkers.</div>
    </footer>
  );
}

export default HeroFooter;