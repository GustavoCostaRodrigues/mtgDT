import { useState, useRef, useEffect } from 'react';

interface DeckOptionsMenuProps {
  deckName: string;
  onExport?: (format: string) => void;
  onDuplicate?: () => void;
  onEditDetails?: () => void;
  onDelete?: () => void;
}

const exportOptions = [
  'Magic Arena (MTGA)',
  'Magic Online (MTGO)',
  'Magic Workstation (MWS)',
  'Cockatrice',
  'Arquivo de Texto (TXT)',
  'CSV Spreadsheet',
];

export function DeckOptionsMenu({
  deckName,
  onExport,
  onDuplicate,
  onEditDetails,
  onDelete,
}: DeckOptionsMenuProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [isExportOpen, setIsExportOpen] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
        setIsOpen(false);
        setIsExportOpen(false);
      }
    }
    function handleKeyDown(event: KeyboardEvent) {
      if (event.key === 'Escape') {
        setIsOpen(false);
        setIsExportOpen(false);
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
    <div className="deck-options-wrap relative inline-block" ref={menuRef}>
      <button
        aria-label={`Mais opções para ${deckName}`}
        aria-expanded={isOpen}
        onClick={(e) => {
          e.stopPropagation();
          setIsOpen((prev) => !prev);
        }}
        className="deck-options-button w-7 h-7 rounded-full flex items-center justify-center text-sm font-bold text-[#8b847c] hover:bg-[#e9e1cf] hover:text-[#171513] transition-colors border-none bg-transparent cursor-pointer"
        type="button"
      >
        ···
      </button>

      {isOpen && (
        <div
          className="deck-options-menu absolute right-0 top-8 z-50 w-48 rounded-2xl border border-black/10 bg-[#f8f5ee] dark:bg-[#1c1917] p-1.5 shadow-2xl animate-scaleIn"
          role="menu"
        >
          {/* Submenu Exportar com área de ponte de hover contínua */}
          <div
            className="deck-export-item relative"
            onMouseEnter={() => setIsExportOpen(true)}
            onMouseLeave={() => setIsExportOpen(false)}
          >
            <button
              type="button"
              className="deck-menu-item deck-export-trigger w-full flex items-center justify-between p-2 rounded-xl text-xs font-semibold text-[#24211f] dark:text-zinc-200 hover:bg-[#e9e1cf] dark:hover:bg-white/10 transition-colors text-left border-none bg-transparent cursor-pointer"
            >
              <span>Exportar</span>
              <span className="text-[10px] text-[#9b7130]">›</span>
            </button>

            {isExportOpen && (
              <div
                className="deck-export-submenu absolute left-[calc(100%-4px)] top-[-6px] z-[60] w-52 rounded-2xl border border-black/10 bg-[#f8f5ee] dark:bg-[#1c1917] p-1.5 shadow-2xl animate-fadeIn"
                onClick={(e) => e.stopPropagation()}
              >
                {exportOptions.map((option) => (
                  <button
                    type="button"
                    key={option}
                    className="w-full flex items-center justify-between p-2 rounded-xl text-xs font-semibold text-[#24211f] dark:text-zinc-200 hover:bg-[#e9e1cf] dark:hover:bg-white/10 transition-colors text-left border-none bg-transparent cursor-pointer"
                    onClick={() => {
                      setIsOpen(false);
                      setIsExportOpen(false);
                      if (onExport) onExport(option);
                    }}
                  >
                    <span>{option}</span>
                  </button>
                ))}
                <div className="my-1 border-t border-black/10 dark:border-white/10" />
                <button
                  type="button"
                  className="deck-export-image w-full flex items-center justify-between p-2 rounded-xl text-xs font-bold text-red-600 dark:text-red-400 hover:bg-red-500/10 transition-colors text-left border-none bg-transparent cursor-pointer"
                  onClick={() => {
                    setIsOpen(false);
                    setIsExportOpen(false);
                    if (onExport) onExport('Gerar Imagem');
                  }}
                >
                  <span>Gerar Imagem</span>
                </button>
              </div>
            )}
          </div>

          <button
            type="button"
            className="deck-menu-item w-full flex items-center justify-between p-2 rounded-xl text-xs font-semibold text-[#24211f] dark:text-zinc-200 hover:bg-[#e9e1cf] dark:hover:bg-white/10 transition-colors text-left border-none bg-transparent cursor-pointer"
            onClick={() => {
              setIsOpen(false);
              if (onDuplicate) onDuplicate();
            }}
          >
            <span>Duplicar deck</span>
          </button>

          <button
            type="button"
            className="deck-menu-item w-full flex items-center justify-between p-2 rounded-xl text-xs font-semibold text-[#24211f] dark:text-zinc-200 hover:bg-[#e9e1cf] dark:hover:bg-white/10 transition-colors text-left border-none bg-transparent cursor-pointer"
            onClick={() => {
              setIsOpen(false);
              if (onEditDetails) onEditDetails();
            }}
          >
            <span>Editar detalhes</span>
          </button>

          {onDelete && (
            <>
              <div className="my-1 border-t border-black/10 dark:border-white/10" />
              <button
                type="button"
                className="deck-menu-item w-full flex items-center justify-between p-2 rounded-xl text-xs font-bold text-red-600 dark:text-red-400 hover:bg-red-500/10 transition-colors text-left border-none bg-transparent cursor-pointer"
                onClick={() => {
                  setIsOpen(false);
                  onDelete();
                }}
              >
                <span>Excluir deck</span>
              </button>
            </>
          )}
        </div>
      )}
    </div>
  );
}

export default DeckOptionsMenu;
