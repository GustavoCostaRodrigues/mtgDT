interface LoadingStateProps {
  count?: number;
  type?: 'card' | 'list' | 'detail';
}

export function LoadingState({ count = 4, type = 'card' }: LoadingStateProps) {
  if (type === 'list') {
    return (
      <div className="space-y-3 w-full animate-pulse" aria-busy="true" aria-label="Carregando itens">
        {Array.from({ length: count }).map((_, index) => (
          <div key={index} className="h-14 rounded-xl bg-black/5 dark:bg-white/5 w-full flex items-center px-4 gap-4">
            <div className="w-10 h-10 rounded-lg bg-black/10 dark:bg-white/10 shrink-0" />
            <div className="flex-1 space-y-2">
              <div className="h-3 rounded bg-black/10 dark:bg-white/10 w-1/3" />
              <div className="h-2 rounded bg-black/10 dark:bg-white/10 w-1/4" />
            </div>
          </div>
        ))}
      </div>
    );
  }

  if (type === 'detail') {
    return (
      <div className="grid grid-cols-1 md:grid-cols-[300px_1fr] gap-8 w-full animate-pulse" aria-busy="true" aria-label="Carregando detalhes">
        <div className="aspect-[0.72] rounded-2xl bg-black/10 dark:bg-white/10 w-full" />
        <div className="space-y-4">
          <div className="h-4 rounded bg-black/10 dark:bg-white/10 w-24" />
          <div className="h-10 rounded bg-black/10 dark:bg-white/10 w-3/4" />
          <div className="h-16 rounded bg-black/5 dark:bg-white/5 w-full" />
          <div className="grid grid-cols-3 gap-4 py-4">
            <div className="h-12 rounded bg-black/5 dark:bg-white/5" />
            <div className="h-12 rounded bg-black/5 dark:bg-white/5" />
            <div className="h-12 rounded bg-black/5 dark:bg-white/5" />
          </div>
          <div className="h-12 rounded-xl bg-black/10 dark:bg-white/10 w-full" />
        </div>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4 w-full animate-pulse" aria-busy="true" aria-label="Carregando cartas">
      {Array.from({ length: count }).map((_, index) => (
        <div key={index} className="rounded-2xl border border-black/5 bg-[#f8f5ee]/60 p-2 space-y-3">
          <div className="aspect-[0.7] rounded-xl bg-black/10 dark:bg-white/10 w-full" />
          <div className="space-y-2 px-1 pb-1">
            <div className="h-3 rounded bg-black/10 dark:bg-white/10 w-3/4" />
            <div className="h-2 rounded bg-black/10 dark:bg-white/10 w-1/2" />
          </div>
        </div>
      ))}
    </div>
  );
}

export default LoadingState;
