import React, { useState } from 'react';

interface CardSearchProps {
  onSearch?: (query: string) => void;
  className?: string;
  placeholder?: string;
}

export function CardSearch({ onSearch, className = '', placeholder = 'Buscar cartas...' }: CardSearchProps) {
  const [query, setQuery] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (query.trim() && onSearch) {
      onSearch(query.trim());
    }
  };

  return (
    <form
      className={`dashboard-card-search flex items-center gap-2 h-9 w-[220px] rounded-full border border-black/10 bg-[#faf8f5]/80 px-3.5 text-xs text-[#817970] focus-within:border-[#9b7130] focus-within:bg-white focus-within:ring-2 focus-within:ring-[#9b7130]/20 transition-all ${className}`}
      role="search"
      onSubmit={handleSubmit}
    >
      <label htmlFor="nav-card-search" className="sr-only">
        Buscar cartas
      </label>
      <svg aria-hidden="true" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" className="w-3.5 h-3.5 shrink-0 text-[#8b847c]">
        <circle cx="10.8" cy="10.8" r="6.8" />
        <path d="m16 16 4.5 4.5" />
      </svg>
      <input
        id="nav-card-search"
        type="search"
        placeholder={placeholder}
        value={query}
        onChange={(e) => setQuery(e.target.value)}
        className="w-full bg-transparent border-none outline-none text-xs text-[#24211f] placeholder:text-[#a19a91]"
      />
    </form>
  );
}

export default CardSearch;
