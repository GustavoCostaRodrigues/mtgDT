interface CollectionFiltersProps {
  color: string;
  type: string;
  rarity: string;
  onColorChange: (color: string) => void;
  onTypeChange: (type: string) => void;
  onRarityChange: (rarity: string) => void;
  onClearFilters: () => void;
}

export function CollectionFilters({
  color,
  type,
  rarity,
  onColorChange,
  onTypeChange,
  onRarityChange,
  onClearFilters,
}: CollectionFiltersProps) {
  return (
    <div className="collection-filter-header flex items-center gap-6 py-3 border-b border-black/10 dark:border-white/10 flex-wrap">
      <span className="eyebrow text-[10px] font-black tracking-widest text-[#9b7130] uppercase">
        Filtrar coleção
      </span>

      <label className="flex items-center gap-2 text-xs font-bold text-[#817970] dark:text-zinc-400 whitespace-nowrap">
        Cor
        <select
          value={color}
          onChange={(e) => onColorChange(e.target.value)}
          className="bg-transparent border-b border-black/20 dark:border-white/20 px-2 py-1 text-xs font-bold text-[#24211f] dark:text-white outline-none cursor-pointer"
        >
          <option value="Todas">Todas</option>
          <option value="Incolor">Incolor</option>
          <option value="Azul">Azul</option>
          <option value="Preto">Preto</option>
          <option value="Vermelho">Vermelho</option>
          <option value="Verde">Verde</option>
          <option value="Branco">Branco</option>
        </select>
      </label>

      <label className="flex items-center gap-2 text-xs font-bold text-[#817970] dark:text-zinc-400 whitespace-nowrap">
        Tipo
        <select
          value={type}
          onChange={(e) => onTypeChange(e.target.value)}
          className="bg-transparent border-b border-black/20 dark:border-white/20 px-2 py-1 text-xs font-bold text-[#24211f] dark:text-white outline-none cursor-pointer"
        >
          <option value="Todos os tipos">Todos os tipos</option>
          <option value="Criatura">Criatura</option>
          <option value="Artefato">Artefato</option>
          <option value="Instantânea">Instantânea</option>
          <option value="Encantamento">Encantamento</option>
        </select>
      </label>

      <label className="flex items-center gap-2 text-xs font-bold text-[#817970] dark:text-zinc-400 whitespace-nowrap">
        Raridade
        <select
          value={rarity}
          onChange={(e) => onRarityChange(e.target.value)}
          className="bg-transparent border-b border-black/20 dark:border-white/20 px-2 py-1 text-xs font-bold text-[#24211f] dark:text-white outline-none cursor-pointer"
        >
          <option value="Todas">Todas</option>
          <option value="Comum">Comum</option>
          <option value="Incomum">Incomum</option>
          <option value="Rara">Rara</option>
          <option value="Mítica">Mítica</option>
        </select>
      </label>

      <button
        type="button"
        onClick={onClearFilters}
        className="clear-filters ml-auto text-xs font-bold text-[#9b7130] hover:underline bg-transparent border-none cursor-pointer"
      >
        Limpar filtros
      </button>
    </div>
  );
}

export default CollectionFilters;
