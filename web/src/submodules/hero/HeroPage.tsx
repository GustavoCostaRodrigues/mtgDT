import { useState } from 'react';
import { HeroNavbar } from './components/HeroNavbar';
import { HeroCardShowcase } from './components/HeroCardShowcase';
import { HeroFooter } from './components/HeroFooter';
import { BackgroundBeams } from '../../components/ui/background-beams';

type FormatKey = 'commander' | 'cedh' | 'modern' | 'legacy' | 'standard';

interface HeroPageProps {
  onNavigateLogin?: () => void;
  onNavigateRegister?: () => void;
}

export function HeroPage({ onNavigateLogin, onNavigateRegister }: HeroPageProps) {
  const [selectedFormat, setSelectedFormat] = useState<FormatKey>('commander');

  const formats: { id: FormatKey; label: string }[] = [
    { id: 'commander', label: 'Commander / EDH' },
    { id: 'cedh', label: 'cEDH (Otimizado)' },
    { id: 'modern', label: 'Modern' },
    { id: 'legacy', label: 'Legacy' },
    { id: 'standard', label: 'Padrão' },
  ];

  return (
    <div className="h-screen max-h-screen w-full bg-[#09090b] text-[#e4e1e6] flex flex-col justify-between overflow-hidden relative selection:bg-[#8083ff] selection:text-[#0d0096]">

      {/* Background Beams */}
      <BackgroundBeams />

      {/* Navbar com os callbacks conectados */}
      <HeroNavbar
        onNavigateLogin={onNavigateLogin}
        onNavigateRegister={onNavigateRegister}
      />

      {/* Grid 50/50 */}
      <main className="w-full flex-1 flex items-center justify-center px-8 lg:px-14 relative z-10 min-h-0">
        <div className="w-full max-w-[1600px] grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-14 items-center">

          {/* Lado Esquerdo */}
          <div className="flex flex-col items-start gap-4 xl:gap-5 min-w-0 w-full pr-0 lg:pr-6">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#1b1b1e]/90 border border-white/10 shadow-sm backdrop-blur-xl">
              <span className="relative flex h-2 w-2">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-[#7bd0ff] opacity-75" />
                <span className="relative inline-flex rounded-full h-2 w-2 bg-[#7bd0ff]" />
              </span>
              <span className="font-mono text-[10px] uppercase tracking-wider text-[#e4e1e6]">Sincronização Scryfall Ativa</span>
              <span className="text-[#908fa0] text-xs">•</span>
              <span className="text-[10px] font-bold uppercase text-[#7bd0ff]">Telemetria EDH Avançada</span>
            </div>

            <h1 className="text-3xl sm:text-4xl xl:text-5xl font-extrabold tracking-tight leading-[1.08] text-[#e4e1e6]">
              Domine Cada Turno.<br />
              <span className="bg-gradient-to-r from-[#c0c1ff] via-[#ddb7ff] to-[#7bd0ff] bg-clip-text text-transparent">
                Construído para Arquitetos de Decks.
              </span>
            </h1>

            <p className="text-sm xl:text-base text-[#c7c4d7] max-w-xl leading-relaxed">
              Telemetria tática de alta densidade para planeswalkers competitivos. Aproveite consultas em submilisegundos, sequenciamento hipergeométrico de turnos, síntese dinâmica de base de mana e validação autônoma de curva em qualquer formato sancionado.
            </p>

            <div className="flex flex-wrap items-center gap-3 pt-1">
              <button
                type="button"
                onClick={onNavigateRegister || onNavigateLogin}
                className="px-5 py-3 rounded-xl bg-[#e4e1e6] text-[#0e0e11] font-bold text-xs shadow-lg hover:bg-[#c0c1ff] transition-all flex items-center gap-1.5 cursor-pointer"
              >
                <span>Começar Gratuitamente</span>
                <span>→</span>
              </button>
              <button
                type="button"
                className="px-4 py-3 rounded-xl bg-[#1b1b1e]/80 hover:bg-[#2a2a2d] text-[#e4e1e6] font-semibold text-xs border border-white/10 backdrop-blur-md transition-all flex items-center gap-1.5 cursor-pointer"
              >
                <svg className="w-3.5 h-3.5 text-[#c0c1ff]" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M8 5v14l11-7z" />
                </svg>
                <span>Ver Demonstração de 1 Min</span>
              </button>
            </div>

            <div className="grid grid-cols-3 gap-2.5 pt-1.5 w-full max-w-lg">
              <div className="p-2.5 rounded-xl bg-[#141418]/80 border border-white/5 flex flex-col gap-0.5">
                <span className="font-mono text-xs font-bold text-[#e4e1e6]">90.482 Cartas</span>
                <span className="text-[10px] text-[#908fa0]">Oracle em cache</span>
              </div>
              <div className="p-2.5 rounded-xl bg-[#141418]/80 border border-white/5 flex flex-col gap-0.5">
                <span className="font-mono text-xs font-bold text-[#7bd0ff]">0ms Latência Local</span>
                <span className="text-[10px] text-[#908fa0]">Motor no navegador</span>
              </div>
              <div className="p-2.5 rounded-xl bg-[#141418]/80 border border-white/5 flex flex-col gap-0.5">
                <span className="font-mono text-xs font-bold text-[#ddb7ff]">Válido no EDH</span>
                <span className="text-[10px] text-[#908fa0]">Validador de banimentos</span>
              </div>
            </div>

            <div className="flex flex-col gap-1.5 pt-1">
              <span className="text-[9px] font-bold uppercase tracking-wider text-[#908fa0]">Matrizes por Formato</span>
              <div className="flex flex-wrap items-center gap-1.5">
                {formats.map((fmt) => (
                  <button
                    key={fmt.id}
                    onClick={() => setSelectedFormat(fmt.id)}
                    className={`px-3 py-1 rounded-full font-mono text-[11px] transition-all cursor-pointer ${selectedFormat === fmt.id
                        ? 'bg-[#c0c1ff] text-[#1000a9] font-bold shadow-sm'
                        : 'bg-[#1b1b1e] hover:bg-[#2a2a2d] text-[#c7c4d7]'
                      }`}
                  >
                    {fmt.label}
                  </button>
                ))}
              </div>
            </div>
          </div>

          {/* Lado Direito */}
          <div className="flex items-center justify-center w-full min-w-0 py-2">
            <HeroCardShowcase />
          </div>

        </div>
      </main>

      <HeroFooter />
    </div>
  );
}