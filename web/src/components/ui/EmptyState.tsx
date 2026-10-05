import React from 'react';

interface EmptyStateProps {
  title?: string;
  description?: string;
  actionLabel?: string;
  onAction?: () => void;
  icon?: React.ReactNode;
}

export function EmptyState({
  title = 'Nenhum item encontrado',
  description = 'Não encontramos nenhuma carta correspondente aos seus critérios de busca.',
  actionLabel,
  onAction,
  icon,
}: EmptyStateProps) {
  return (
    <div className="flex flex-col items-center justify-center p-12 text-center border border-dashed border-black/10 dark:border-white/10 rounded-3xl bg-[#f8f5ee]/40 dark:bg-black/20 my-6">
      <div className="w-14 h-14 rounded-2xl bg-[#9b7130]/10 flex items-center justify-center text-[#9b7130] mb-4 text-2xl">
        {icon || '🃁'}
      </div>
      <h3 className="text-lg font-extrabold text-[#171513] dark:text-white tracking-tight">{title}</h3>
      <p className="text-xs text-[#817970] dark:text-zinc-400 max-w-sm mt-1.5 leading-relaxed">{description}</p>
      {actionLabel && onAction && (
        <button
          type="button"
          onClick={onAction}
          className="mt-5 px-5 py-2.5 rounded-xl bg-[#24211f] text-white text-xs font-bold hover:bg-[#9b7130] transition-colors cursor-pointer"
        >
          {actionLabel}
        </button>
      )}
    </div>
  );
}

export default EmptyState;
