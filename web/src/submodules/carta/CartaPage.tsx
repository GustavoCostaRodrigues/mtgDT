import { useState } from 'react';
import { AppNav } from '../../components/navbar/AppNav';
import { Toast } from '../../components/ui/Toast';

export function CartaPage({
  slug = 'rhystic-study',
  onBack,
  onNavigate,
  onLogout,
  onSearch,
}: {
  slug?: string;
  onBack?: () => void;
  onNavigate?: (href: string) => void;
  onLogout?: () => void;
  onSearch?: (query: string) => void;
}) {
  const [quantity, setQuantity] = useState(1);
  const [condition, setCondition] = useState('Near Mint (NM)');
  const [language, setLanguage] = useState('Português');
  const [isFoil, setIsFoil] = useState(false);
  const [assignedDeck, setAssignedDeck] = useState('Atraxa, Grand Unifier');
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  const name = slug
    .split('-')
    .map((part) => part.charAt(0).toUpperCase() + part.slice(1))
    .join(' ');

  const handleSave = () => {
    setToastMessage(`Alterações de "${name}" salvas com sucesso!`);
  };

  return (
    <main className="dashboard-shell min-h-screen bg-[#f2efe8] dark:bg-[#121316] text-[#24211f] dark:text-white">
      <section className="dashboard-content">
        <AppNav activeNav="/minha-colecao" onNavigate={onNavigate} onLogout={onLogout} onSearch={onSearch} />
        <div className="card-detail-page max-w-6xl mx-auto px-8 py-10">
          <button
            type="button"
            className="eyebrow cursor-pointer bg-transparent border-none text-left p-0 mb-6 flex items-center gap-2 text-xs font-bold text-[#9b7130] hover:underline"
            onClick={onBack}
          >
            ← Voltar para minha coleção
          </button>

          <div className="card-detail-layout grid grid-cols-1 md:grid-cols-12 gap-10 bg-white dark:bg-[#18191c] p-8 rounded-3xl border border-black/10 dark:border-white/10 shadow-sm">
            {/* Card Art Preview */}
            <div className="md:col-span-4 flex flex-col items-center">
              <div className="collection-card-art art-blue large w-full aspect-[0.72] rounded-2xl p-6 flex flex-col justify-between shadow-2xl text-white relative">
                <span className="self-end text-xs font-bold px-2.5 py-1 rounded-full bg-black/60 backdrop-blur-xs">
                  Rara
                </span>
                <div>
                  <strong className="block text-2xl font-black leading-tight drop-shadow-md">{name}</strong>
                  <small className="block text-xs opacity-80 mt-1">Commander Masters (CMM)</small>
                </div>
              </div>
              <p className="text-[11px] text-[#817970] dark:text-zinc-400 mt-4 text-center">
                Ilustração por Magali Villeneuve • #089/361
              </p>
            </div>

            {/* Card Specs and Controls */}
            <div className="md:col-span-8 space-y-6">
              <div>
                <p className="eyebrow text-[10px] font-black text-[#9b7130] uppercase tracking-widest">Detalhes da carta</p>
                <h1 className="text-3xl md:text-4xl font-black text-[#171513] dark:text-white mt-1">{name}</h1>
                <p className="card-detail-copy text-sm text-[#817970] dark:text-zinc-300 mt-2">
                  Visualize os detalhes, organize sua cópia física e selecione em quais decks esta carta estará alocada.
                </p>
              </div>

              {/* Stats Bar */}
              <div className="detail-facts grid grid-cols-3 gap-4 bg-[#f8f5ee] dark:bg-[#202227] p-4 rounded-2xl border border-black/5 dark:border-white/5">
                <div>
                  <span className="block text-[11px] font-bold text-[#817970] dark:text-zinc-400">Quantidade</span>
                  <strong className="block text-xl font-black text-[#171513] dark:text-white">{quantity}x</strong>
                </div>
                <div>
                  <span className="block text-[11px] font-bold text-[#817970] dark:text-zinc-400">Condição</span>
                  <strong className="block text-xl font-black text-[#171513] dark:text-white">{condition.split(' ')[0]}</strong>
                </div>
                <div>
                  <span className="block text-[11px] font-bold text-[#817970] dark:text-zinc-400">Valor Estimado</span>
                  <strong className="block text-xl font-black text-[#9b7130]">R$ 184,90</strong>
                </div>
              </div>

              {/* Form Controls */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-[#625d59] dark:text-zinc-300 mb-1.5">
                    Quantidade em acervo
                  </label>
                  <div className="flex items-center gap-3">
                    <button
                      type="button"
                      onClick={() => setQuantity(Math.max(0, quantity - 1))}
                      className="w-10 h-10 rounded-xl border border-black/15 dark:border-white/15 bg-white dark:bg-[#121316] font-bold text-lg hover:border-[#9b7130] cursor-pointer"
                    >
                      -
                    </button>
                    <span className="font-extrabold text-base w-8 text-center">{quantity}</span>
                    <button
                      type="button"
                      onClick={() => setQuantity(quantity + 1)}
                      className="w-10 h-10 rounded-xl border border-black/15 dark:border-white/15 bg-white dark:bg-[#121316] font-bold text-lg hover:border-[#9b7130] cursor-pointer"
                    >
                      +
                    </button>
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-bold text-[#625d59] dark:text-zinc-300 mb-1.5">
                    Alocação em Deck
                  </label>
                  <select
                    value={assignedDeck}
                    onChange={(e) => setAssignedDeck(e.target.value)}
                    className="w-full h-10 px-3 rounded-xl border border-black/15 dark:border-white/15 bg-white dark:bg-[#121316] text-xs font-bold text-[#24211f] dark:text-white outline-none cursor-pointer"
                  >
                    <option value="Nenhum">Nenhum (Disponível)</option>
                    <option value="Atraxa, Grand Unifier">Atraxa, Grand Unifier</option>
                    <option value="Mono Red Burn">Mono Red Burn</option>
                    <option value="Mardu Energy">Mardu Energy</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-bold text-[#625d59] dark:text-zinc-300 mb-1.5">
                    Condição da carta
                  </label>
                  <select
                    value={condition}
                    onChange={(e) => setCondition(e.target.value)}
                    className="w-full h-10 px-3 rounded-xl border border-black/15 dark:border-white/15 bg-white dark:bg-[#121316] text-xs font-bold text-[#24211f] dark:text-white outline-none cursor-pointer"
                  >
                    <option value="Near Mint (NM)">Near Mint (NM)</option>
                    <option value="Slightly Played (SP)">Slightly Played (SP)</option>
                    <option value="Moderately Played (MP)">Moderately Played (MP)</option>
                    <option value="Heavily Played (HP)">Heavily Played (HP)</option>
                    <option value="Damaged (DMG)">Damaged (DMG)</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-bold text-[#625d59] dark:text-zinc-300 mb-1.5">
                    Idioma & Acabamento
                  </label>
                  <div className="flex items-center gap-2">
                    <select
                      value={language}
                      onChange={(e) => setLanguage(e.target.value)}
                      className="flex-1 h-10 px-3 rounded-xl border border-black/15 dark:border-white/15 bg-white dark:bg-[#121316] text-xs font-bold text-[#24211f] dark:text-white outline-none cursor-pointer"
                    >
                      <option value="Português">Português</option>
                      <option value="Inglês">Inglês</option>
                      <option value="Japonês">Japonês</option>
                    </select>

                    <button
                      type="button"
                      onClick={() => setIsFoil(!isFoil)}
                      className={`h-10 px-3 rounded-xl text-xs font-extrabold border transition-colors cursor-pointer ${isFoil
                        ? 'bg-amber-500/20 text-amber-700 dark:text-amber-300 border-amber-500/40'
                        : 'border-black/15 dark:border-white/15 text-[#817970]'
                        }`}
                    >
                      {isFoil ? '✨ Foil' : 'Normal'}
                    </button>
                  </div>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="pt-4 flex items-center gap-4">
                <button
                  onClick={handleSave}
                  className="detail-action px-6 py-3 rounded-2xl bg-[#9b7130] text-white font-extrabold text-sm hover:bg-[#855f26] transition-colors cursor-pointer shadow-md"
                  type="button"
                >
                  Salvar alterações
                </button>
                <button
                  onClick={onBack}
                  className="px-6 py-3 rounded-2xl border border-black/15 dark:border-white/15 text-xs font-bold text-[#625d59] dark:text-zinc-300 hover:border-[#9b7130] transition-colors cursor-pointer"
                  type="button"
                >
                  Cancelar
                </button>
              </div>
            </div>
          </div>
        </div>
      </section>

      {toastMessage && <Toast message={toastMessage} onClose={() => setToastMessage(null)} />}
    </main>
  );
}

export default CartaPage;
