import { useEffect, useState } from 'react';
import { colors } from '../../../styles/colors'; // Ajuste o caminho se necessário para o seu projeto

export function HeroCardShowcase() {
  const [cardImage, setCardImage] = useState<string>('');

  useEffect(() => {
    fetch('/api/cards/2')
      .then((res) => {
        if (!res.ok) throw new Error('Falha ao obter carta');
        return res.json();
      })
      .then((data) => {
        const url = data.image_url || data.imageUrl;
        if (url) {
          setCardImage(url);
        } else {
          const scryfallId = data.scryfall_id || data.scryfallId;
          setCardImage(`https://api.scryfall.com/cards/${scryfallId}?format=image&version=art_crop`);
        }
      })
      .catch((err) => {
        console.error('Erro na requisição da carta:', err);
      });
  }, []);

  return (
    <div className="relative w-full max-w-[620px] min-w-[460px] mx-auto select-none my-auto">

      {/* 1. HUD DA CURVA DE IDENTIDADE DE MANA */}
      <div
        className="absolute -top-12 -left-10 z-30 w-72 p-3.5 rounded-2xl border backdrop-blur-2xl shadow-[0_16px_36px_rgba(0,0,0,0.85)] flex flex-col gap-2"
        style={{
          backgroundColor: '#0e0e11f2',
          borderColor: 'rgba(255, 255, 255, 0.1)',
        }}
      >
        <div className="flex justify-between items-center text-xs text-[#c7c4d7]">
          <span className="font-bold uppercase tracking-wider text-[11px]">Curva de Identidade de Mana</span>
          <span className="font-mono font-bold text-xs" style={{ color: colors.light.gold }}>CMC 2.14</span>
        </div>

        {/* Barras de Mana WUBRG */}
        <div className="grid grid-cols-5 gap-2 items-end h-14 pt-1">
          <div className="flex flex-col items-center gap-1 h-full justify-end">
            <div className="w-full bg-[#2a2a2d] rounded-t-sm h-[70%] relative overflow-hidden">
              <div className="absolute inset-0 bg-[#c0c1ff]/80" />
            </div>
            <span className="font-mono text-[10px] text-[#c7c4d7] font-semibold">W</span>
          </div>
          <div className="flex flex-col items-center gap-1 h-full justify-end">
            <div className="w-full bg-[#2a2a2d] rounded-t-sm h-[92%] relative overflow-hidden">
              <div className="absolute inset-0 bg-[#7bd0ff]" />
            </div>
            <span className="font-mono text-[10px] text-[#7bd0ff] font-bold">U</span>
          </div>
          <div className="flex flex-col items-center gap-1 h-full justify-end">
            <div className="w-full bg-[#2a2a2d] rounded-t-sm h-[84%] relative overflow-hidden">
              <div className="absolute inset-0 bg-[#ddb7ff]" />
            </div>
            <span className="font-mono text-[10px] text-[#c7c4d7] font-semibold">B</span>
          </div>
          <div className="flex flex-col items-center gap-1 h-full justify-end">
            <div className="w-full bg-[#2a2a2d] rounded-t-sm h-[18%] relative overflow-hidden">
              <div className="absolute inset-0 bg-[#ffb4ab]/60" />
            </div>
            <span className="font-mono text-[10px] text-[#c7c4d7] opacity-40 font-semibold">R</span>
          </div>
          <div className="flex flex-col items-center gap-1 h-full justify-end">
            <div className="w-full bg-[#2a2a2d] rounded-t-sm h-[80%] relative overflow-hidden">
              <div className="absolute inset-0 bg-[#009bd1]" />
            </div>
            <span className="font-mono text-[10px] text-[#c7c4d7] font-semibold">G</span>
          </div>
        </div>

        <div className="pt-1.5 flex items-center justify-between font-mono text-[11px] text-[#908fa0] border-t border-white/5">
          <span>34 Terrenos</span>
          <span>•</span>
          <span>12 Pedras de Mana</span>
          <span>•</span>
          <span className="font-bold" style={{ color: colors.light.gold }}>98.2% Manter</span>
        </div>
      </div>

      {/* 2. CARD CENTRAL DA ATRAXA */}
      <div
        className="relative z-20 w-full rounded-2xl p-4 sm:p-5 border backdrop-blur-2xl shadow-[0_24px_64px_rgba(0,0,0,0.95)] flex flex-col gap-3"
        style={{
          backgroundColor: '#141418f2',
          borderColor: 'rgba(255, 255, 255, 0.1)',
        }}
      >

        {/* Cabeçalho do Card */}
        <div className="flex items-center justify-between px-1">
          <div>
            <h3 className="font-bold text-base text-[#e4e1e6] tracking-tight">Atraxa, Grande Unificadora</h3>
            <p className="text-[11px] uppercase font-semibold text-[#908fa0]">Criatura Lendária — Phyrexiano Anjo</p>
          </div>
          <div className="flex items-center gap-1">
            {['R', 'G', 'W', 'U', 'B'].map((symbol) => (
              <img
                key={symbol}
                src={`https://svgs.scryfall.io/card-symbols/${symbol}.svg`}
                alt={`Mana {${symbol}}`}
                className="w-5 h-5 drop-shadow-[0_2px_4px_rgba(0,0,0,0.6)] rounded-full hover:scale-110 transition-transform"
                loading="eager"
              />
            ))}
          </div>
        </div>

        {/* Imagem do Cockpit / Arte */}
        <div className="relative w-full h-64 sm:h-76 md:h-80 rounded-xl overflow-hidden bg-neutral-900 border border-white/5 shadow-inner">
          <img
            src="https://lh3.googleusercontent.com/aida-public/AB6AXuDs_lSk66n4AZMdrFuBkHkRRsbN4v2IdMU9g7h2g0QOoD0z8wO3jiHfeZp-cNHFv1v5Afe6GslwjbtnG1H51K5Lyz1o2hEaKezLOpCqTF5w2fK80NCq8lfSfnjg7e3aUE-WQRt-AMzWyL5RlSnKEZS81-wvBcnfcvrjf-1UFGLNu5o8AxS_bZz2rxdJgAWMApFAs7W6-aMid2FpOejqnHjWCPW9DFxdPgv928CxnB1VUVsBEAqQPYSF"
            alt="Atraxa Showcase"
            className="w-full h-full object-cover object-center"
          />
          <div className="absolute bottom-3 left-3 flex items-center gap-2">
            <span className="px-2.5 py-1 rounded-full bg-[#0e0e11]/90 backdrop-blur-md text-[10px] uppercase font-bold text-[#ddb7ff] border border-white/5">
              Rara Mítica
            </span>
            <span className="px-2.5 py-1 rounded-full bg-[#0e0e11]/90 backdrop-blur-md text-[10px] uppercase font-bold text-[#7bd0ff] border border-white/5">
              Válida: EDH
            </span>
          </div>
        </div>

        {/* Caixa de Texto das Habilidades */}
        <div className="p-3.5 rounded-xl bg-[#1b1b1e]/75 text-xs text-[#c7c4d7] flex flex-col gap-1.5 border border-white/5">
          <div className="font-mono text-[#c0c1ff] text-[11px] font-bold tracking-wide">
            Voar • Vigilância • Toque Mortífero • Vínculo com a Vida
          </div>
          <p className="leading-relaxed text-[11.5px]">
            Quando Atraxa entra no campo de batalha, revele os dez cards do topo do seu grimório. Para cada tipo de card, você pode colocar um card daquele tipo em sua mão.
          </p>
        </div>
      </div>

      {/* 3. WIDGET TOAST DO ANEL SOLAR (SOL RING) */}
      <div className="absolute -bottom-8 -right-8 z-30 w-80 p-3.5 rounded-2xl bg-[#0e0e11]/95 border border-white/10 backdrop-blur-2xl shadow-[0_20px_40px_rgba(0,0,0,0.9)] flex items-center gap-3.5">
        <div className="w-16 h-20 rounded-xl bg-neutral-900 border border-white/15 overflow-hidden flex-shrink-0 relative flex items-center justify-center shadow-lg">
          {cardImage ? (
            <img
              src={cardImage}
              alt="Sol Ring"
              referrerPolicy="no-referrer"
              className="w-full h-full object-cover"
            />
          ) : (
            <div className="w-full h-full bg-[#1b1b1e] animate-pulse" />
          )}
        </div>
        <div className="flex-1 min-w-0 flex flex-col gap-1">
          <div className="flex items-center gap-1.5">
            <p className="text-sm font-bold text-[#e4e1e6] truncate">Sol Ring</p>
            <svg className="w-4 h-4 text-[#7bd0ff] flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M5 13l4 4L19 7" />
            </svg>
          </div>
          <p className="text-xs text-[#c7c4d7]">Adicionado ao Deck Principal</p>
          <div className="flex items-center gap-2 mt-1">
            <span className="font-mono text-[10px] px-2 py-0.5 rounded bg-[#1b1b1e] text-[#7bd0ff] font-bold border border-white/5">
              R$ 8,50 NM Foil
            </span>
            <span className="font-mono text-[10px] text-[#908fa0]">0.02s</span>
          </div>
        </div>
      </div>

      {/* 4. HUD DE CÁLCULO HIPERGEOMÉTRICO */}
      <div className="absolute -bottom-8 -left-8 z-30 p-3.5 rounded-2xl bg-[#0e0e11]/95 border border-white/10 backdrop-blur-2xl shadow-2xl flex flex-col gap-1">
        <span className="text-[10px] uppercase tracking-wider font-bold text-[#908fa0]">Cálculo Hipergeométrico</span>
        <div className="flex items-center gap-3.5 pt-0.5">
          <div>
            <span className="font-mono text-sm font-bold text-[#e4e1e6]">11.6%</span>
            <span className="text-[10px] text-[#908fa0] ml-1.5 font-medium">T1 Anel Solar</span>
          </div>
          <div className="w-px h-5 bg-white/10" />
          <div>
            <span className="font-mono text-sm font-bold text-[#7bd0ff]">88.4%</span>
            <span className="text-[10px] text-[#908fa0] ml-1.5 font-medium">T3 Comandante</span>
          </div>
        </div>
      </div>

    </div>
  );
}

export default HeroCardShowcase;