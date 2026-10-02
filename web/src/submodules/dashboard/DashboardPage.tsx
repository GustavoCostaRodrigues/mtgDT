import { useState, useEffect } from 'react';

interface ManaPip {
    text: string;
    bg: string;
    fg: string;
}

interface DeckData {
    id: string;
    key: string;
    title: string;
    commander: string;
    art: string;
    archetype: string;
    badge: string;
    status: string;
    pt: string;
    stats: string;
    desc: string;
    winrate: string;
    games: string;
    cmc: string;
    value: string;
    pips: ManaPip[];
    curve: { label: string; count: number; pct: number }[];
    keyCards: string[];
}

interface CollectionCard {
    rank: string;
    name: string;
    type: string;
    price: string;
    rarity: string;
    usage: string;
    img: string;
    foil?: boolean;
}

const DECK_DATABASE: Record<string, DeckData> = {
    atraxa: {
        id: '0',
        key: 'atraxa',
        title: 'Atraxa, Grand Unifier',
        commander: 'Atraxa, Grand Unifier',
        art: 'https://lh3.googleusercontent.com/aida-public/AB6AXuCRWZCALhd3GE1oEJOUdWBfN7TVeJK1O45NJN-gKb_e7HfrvG1kOzQsqdIbJk312hMwQsmBcanh_m3jGvJNQzF-MvNhTDS5nT9ljRpv29yiAjFc6u15lpGMgdKsRzrovxjZiUv5CagFbLOxWPCCZTx-xRfPQdbgfzhC9-ur8e98Tia3730L12CBoADjVEqmI4u6orfAswmtImn5GreZTjxeKi3erx56dShinKTjljXR1Yw2BuMzY9iP',
        archetype: 'Sliver & Superfriends • cEDH',
        badge: 'cEDH TIER 1',
        status: 'Pronto para Torneio',
        pt: '7/7',
        stats: '100/100 Cards • Foil Deck',
        desc: 'Deck dominante em torneios cEDH baseado em recursão, controle absoluto de pilha e geração maciça de card advantage com ativação de sinergia de proliferação estendida.',
        winrate: '74%',
        games: '42 partidas',
        cmc: '2.14',
        value: '$3,180.00',
        pips: [
            { text: 'W', bg: 'bg-amber-100', fg: 'text-slate-900' },
            { text: 'U', bg: 'bg-sky-500', fg: 'text-white' },
            { text: 'B', bg: 'bg-neutral-800', fg: 'text-white' },
            { text: 'G', bg: 'bg-emerald-600', fg: 'text-white' },
        ],
        curve: [
            { label: '1', count: 18, pct: 60 },
            { label: '2', count: 24, pct: 90 },
            { label: '3', count: 14, pct: 55 },
            { label: '4', count: 6, pct: 28 },
            { label: '5', count: 3, pct: 15 },
            { label: '6+', count: 2, pct: 10 },
        ],
        keyCards: ['Force of Will', 'Demonic Consultation', "Thassa's Oracle", 'Teferi, Hero of Dominaria'],
    },
    urza: {
        id: '1',
        key: 'urza',
        title: 'Urza, Lord High Artificer',
        commander: 'Urza, Lord High Artificer',
        art: 'https://lh3.googleusercontent.com/aida-public/AB6AXuBJKbCHbXDgqcNnVZpjmo2Yt28yciTuKVLm1j6SI5zre0PFm0_CXUj5l8SzhqChLHjHNwSCDTgR4xFR8DgEtWiOB7EgLXw9o2Y9CAX0DEIqptUE73M8YmN6lxzLkn5O5EDAeeHeDITcjCSjsImC2sl0J2x0APE_u2tTBhy4W89zQXY5rXukloMf8oLNu_Wf1rJn2SnDQNVpdaJU8tWcFScP_EXsJR4dDySA_1J27oYy-Zvqp3See1fd',
        archetype: 'Fast Artifact Combo',
        badge: 'INFINITE LOCK',
        status: 'Lock T3 Ativo',
        pt: '1/4',
        stats: '100/100 Cards • Mono Blue',
        desc: 'Capaz de gerar mana infinita de artefatos com Isochron Scepter ou Hullbreaker Horror para jogar todo o deck de graça instantaneamente.',
        winrate: '81%',
        games: '31 partidas',
        cmc: '1.82',
        value: '$1,850.00',
        pips: [{ text: 'U', bg: 'bg-sky-500', fg: 'text-white' }],
        curve: [
            { label: '0-1', count: 26, pct: 95 },
            { label: '2', count: 22, pct: 80 },
            { label: '3', count: 11, pct: 40 },
            { label: '4', count: 5, pct: 20 },
            { label: '5', count: 2, pct: 10 },
            { label: '6+', count: 1, pct: 5 },
        ],
        keyCards: ['Mana Vault', 'Grim Monolith', 'Hullbreaker Horror', 'Fierce Guardianship'],
    },
    sheoldred: {
        id: '2',
        key: 'sheoldred',
        title: 'Sheoldred, the Apocalypse',
        commander: 'Sheoldred, the Apocalypse',
        art: 'https://lh3.googleusercontent.com/aida-public/AB6AXuC-v6RuG37JxSx906GAkAokXtdRWUfxwAy9e5Tbag3qpnxFzeV11T2qzDmL2CRSL9cpk--FUV_E52IQcQfxBDK-XfojBAdeWosqK1RwOFcZi-BWwCfcx1S_ZfkHMrXbmC9OfCJSQB-uJGoBZto2kaV75MJHmjpf8hILwba9YW9jHmxmc4KGTqSmCoMbKbB3HpdATOk2mpJwFO_rBFgTZsdGySO1ljBIEpsmtYPNxXlzuUmLM7ObLOyn',
        archetype: 'Mono Black Rack',
        badge: 'MODERN • 60+15',
        status: 'Sideboard em Calibração',
        pt: '4/5',
        stats: '60/60 + 15 Sideboard',
        desc: 'Penaliza compras adversárias com dano cumulativo implacável enquanto drena a vida do oponente a cada etapa de manutenção.',
        winrate: '62%',
        games: '26 partidas',
        cmc: '2.60',
        value: '$890.00',
        pips: [{ text: 'B', bg: 'bg-neutral-800', fg: 'text-white' }],
        curve: [
            { label: '1', count: 16, pct: 75 },
            { label: '2', count: 14, pct: 70 },
            { label: '3', count: 10, pct: 50 },
            { label: '4', count: 8, pct: 40 },
            { label: '5', count: 2, pct: 10 },
            { label: '6+', count: 0, pct: 0 },
        ],
        keyCards: ['Thoughtseize', 'Orcish Bowmasters', 'Fatal Push', 'Liliana of the Veil'],
    },
    krenko: {
        id: '3',
        key: 'krenko',
        title: 'Krenko, Mob Boss',
        commander: 'Krenko, Mob Boss',
        art: 'https://lh3.googleusercontent.com/aida-public/AB6AXuDIF4UlQIVAu95w0tsoeUs_CEGMGxELkrysKnFQfc9VdeaaT9ueBRgq_c0XI093Orq_c2901xTAkCcCFGkGfHm6Oj0ffDBlXMKGPggELtkugicvpqxuHyvt4S066TH-lb8-BPqPvsK2Lx9Hn4yyUl4zXOG7RI2l9URsDjvJqVsb7kXMi_gn9AXfk9GXpqS2HAThNdi-V7dszy_KqulDk1HfTz0eObIv-gnNPwsk4bPKop6lcR6iDYrj',
        archetype: 'Aggro / Tokens',
        badge: 'GOBLIN CANNON',
        status: 'Pronto para Partida',
        pt: '3/3',
        stats: '100/100 Cards • Mono Red',
        desc: 'Multiplica tokens goblins exponencialmente com artefatos de desvirar gerando vitória por impacto de haste ou dano direto de purphoros.',
        winrate: '59%',
        games: '19 partidas',
        cmc: '2.85',
        value: '$340.00',
        pips: [{ text: 'R', bg: 'bg-red-600', fg: 'text-white' }],
        curve: [
            { label: '1', count: 12, pct: 45 },
            { label: '2', count: 20, pct: 85 },
            { label: '3', count: 16, pct: 70 },
            { label: '4', count: 8, pct: 35 },
            { label: '5', count: 4, pct: 15 },
            { label: '6+', count: 1, pct: 5 },
        ],
        keyCards: ['Goblin Chieftain', 'Purphoros, God of the Forge', 'Thornbite Staff', 'Shared Animosity'],
    },
    edgar: {
        id: '4',
        key: 'edgar',
        title: 'Edgar Markov',
        commander: 'Edgar Markov',
        art: 'https://lh3.googleusercontent.com/aida/AEtjO1Ur1XB7NG4k0Mmnfu6mdAmqhnSBqgosOUQ00b2wmOpNew1JAHhi0SoCbtck3cfBdX-2etlSnk-QuBR6qDHrG2l0bkTfcfPxZvhkw7npbus3VW0qOtGRPjSNFCXyGVbGw_33Vx54IIjKsSrym6jBe7DPSNRvf7j6h_p9KmYGy7a-kLfQGb0aA6jQERzV5eoQTsrXXd8Q4EYvaTlzB9SWwTvGsgZnqTOjg4scEKO-KijTR4UhZdqLyQAgAjE',
        archetype: 'Mardu Vampires',
        badge: 'EMINENCE',
        status: 'Pronto para Torneio',
        pt: '4/4',
        stats: '100/100 Cards • Mardu',
        desc: 'Cria tokens de vampiro gratuitos da zona de comando a cada conjuração, escalando pressão rápida com sacrifício aristocrata.',
        winrate: '68%',
        games: '35 partidas',
        cmc: '2.45',
        value: '$1,420.00',
        pips: [
            { text: 'W', bg: 'bg-amber-100', fg: 'text-slate-900' },
            { text: 'B', bg: 'bg-neutral-800', fg: 'text-white' },
            { text: 'R', bg: 'bg-red-600', fg: 'text-white' },
        ],
        curve: [
            { label: '1', count: 18, pct: 75 },
            { label: '2', count: 22, pct: 90 },
            { label: '3', count: 12, pct: 50 },
            { label: '4', count: 7, pct: 30 },
            { label: '5', count: 3, pct: 15 },
            { label: '6+', count: 2, pct: 10 },
        ],
        keyCards: ['Vampiric Tutor', 'Cordials of the Night', 'Captivating Vampire', 'Skullclamp'],
    },
};

const HAND_DECKS: DeckData[] = [
    DECK_DATABASE.atraxa,
    DECK_DATABASE.urza,
    DECK_DATABASE.sheoldred,
    DECK_DATABASE.krenko,
    DECK_DATABASE.edgar,
];

const TOP_CARDS: CollectionCard[] = [
    {
        rank: '#1',
        name: 'Sol Ring',
        type: 'Artefato • Rampa Universal',
        price: '$1.40',
        rarity: 'Incomum',
        usage: '12 Decks',
        img: 'https://lh3.googleusercontent.com/aida-public/AB6AXuAiD_SwEstyEowKBPpNXhjh_3U8gTzuOYscuJ4ugIfF8LAcUNrtqqZsZZ6fG7my1QmQzy2R65OoDo7lGHnf2kqOEAaZ-Pr06dRxWzvXReLhXoMSfo3RngozM4eS1f3NDCjQ6qhsgjtRewt1s87oZu3yG9AQ9OKao4qt-wUz-7Ge-MHbRyuyPg1op5-HF4w9XLCsGiwlj9qfZrsIclxQiQ61z3hkbxHv4HRTP6P-Hw2i8vPbYJRSdBzv',
    },
    {
        rank: '#2',
        name: 'The One Ring',
        type: 'Lendário • Compra Contínua',
        price: '$118.50',
        rarity: 'Mítica',
        usage: '8 Decks',
        img: 'https://lh3.googleusercontent.com/aida-public/AB6AXuAiD_SwEstyEowKBPpNXhjh_3U8gTzuOYscuJ4ugIfF8LAcUNrtqqZsZZ6fG7my1QmQzy2R65OoDo7lGHnf2kqOEAaZ-Pr06dRxWzvXReLhXoMSfo3RngozM4eS1f3NDCjQ6qhsgjtRewt1s87oZu3yG9AQ9OKao4qt-wUz-7Ge-MHbRyuyPg1op5-HF4w9XLCsGiwlj9qfZrsIclxQiQ61z3hkbxHv4HRTP6P-Hw2i8vPbYJRSdBzv',
        foil: true,
    },
    {
        rank: '#3',
        name: 'Mana Crypt',
        type: 'Fast Mana • Aceleração T1',
        price: '$192.00',
        rarity: 'Mítica',
        usage: '7 Decks',
        img: 'https://lh3.googleusercontent.com/aida-public/AB6AXuBJKbCHbXDgqcNnVZpjmo2Yt28yciTuKVLm1j6SI5zre0PFm0_CXUj5l8SzhqChLHjHNwSCDTgR4xFR8DgEtWiOB7EgLXw9o2Y9CAX0DEIqptUE73M8YmN6lxzLkn5O5EDAeeHeDITcjCSjsImC2sl0J2x0APE_u2tTBhy4W89zQXY5rXukloMf8oLNu_Wf1rJn2SnDQNVpdaJU8tWcFScP_EXsJR4dDySA_1J27oYy-Zvqp3See1fd',
    },
    {
        rank: '#4',
        name: 'Rhystic Study',
        type: 'Encantamento • Taxa Azul',
        price: '$52.00',
        rarity: 'Rara',
        usage: '6 Decks',
        img: 'https://lh3.googleusercontent.com/aida-public/AB6AXuASxFbNf4MA1mfPyyocCWrz58TIrCaXlKzy-vAsm98KBx6d4gfGIUTw0tIl5VvW4IWpW8_V2HiuKq8oGJM4a7sTcogGz3Q6EsHIg2ra_U-bji3jDAFLwP68NF8R022Qb1vM4G1zoYc_B9dwXnr64zRIeW7Gad3rWui2n9tsOlK565MTh71uZ9Ri3lCA8S1l_lgJ46w_Pa9sd5TDF6jp9HihAIOJHjcxgeRDk57O9IvKUzea7pWmK91a',
    },
    {
        rank: '#5',
        name: 'Demonic Tutor',
        type: 'Feitiço • Busca Absoluta',
        price: '$45.00',
        rarity: 'Rara',
        usage: '6 Decks',
        img: 'https://lh3.googleusercontent.com/aida-public/AB6AXuC-v6RuG37JxSx906GAkAokXtdRWUfxwAy9e5Tbag3qpnxFzeV11T2qzDmL2CRSL9cpk--FUV_E52IQcQfxBDK-XfojBAdeWosqK1RwOFcZi-BWwCfcx1S_ZfkHMrXbmC9OfCJSQB-uJGoBZto2kaV75MJHmjpf8hILwba9YW9jHmxmc4KGTqSmCoMbKbB3HpdATOk2mpJwFO_rBFgTZsdGySO1ljBIEpsmtYPNxXlzuUmLM7ObLOyn',
    },
];

const HAND_BASE_TRANSFORMS = [
    { rotate: -14, translateY: -6, zIndex: 10 },
    { rotate: -7, translateY: 4, zIndex: 20 },
    { rotate: 0, translateY: 10, zIndex: 30 },
    { rotate: 7, translateY: 4, zIndex: 20 },
    { rotate: 14, translateY: -6, zIndex: 10 },
];

export function DashboardPage({ onLogout }: { onLogout?: () => void }) {
    const [hoveredIdx, setHoveredIdx] = useState<number | null>(null);
    const [selectedDeck, setSelectedDeck] = useState<DeckData | null>(null);
    const [activeNav, setActiveNav] = useState('decks');
    const [cardFilter, setCardFilter] = useState('used');

    useEffect(() => {
        const handleKeyDown = (e: KeyboardEvent) => {
            if (e.key === 'Escape') setSelectedDeck(null);
        };
        window.addEventListener('keydown', handleKeyDown);
        return () => window.removeEventListener('keydown', handleKeyDown);
    }, []);

    return (
        <div className="h-screen max-h-screen w-screen bg-[#09090b] text-[#e4e1e6] flex flex-col justify-between overflow-hidden relative select-none antialiased selection:bg-[#8083ff] selection:text-[#0d0096]">

            {/* Luz ambiente de fundo */}
            <div className="absolute -top-16 left-1/4 w-[500px] h-[280px] bg-gradient-to-tr from-[#8083ff]/10 via-[#6f00be]/12 to-[#7bd0ff]/10 blur-[130px] pointer-events-none rounded-full -z-10" />

            {/* Header Fixo Oficial (h-14 proporcional à Hero) */}
            <header className="h-14 w-full bg-[#0e0e11]/80 backdrop-blur-2xl border-b border-white/5 px-6 flex items-center justify-between shrink-0 z-50">
                <div className="flex items-center gap-2 shrink-0">
                    <img alt="DeckTracker Emblem" className="h-7 w-auto object-contain" src="/logo.png" />
                    <div className="flex items-center gap-1.5">
                        <span className="text-sm font-bold uppercase tracking-wider text-white">DeckTracker</span>
                        <span className="px-1.5 py-0.5 rounded bg-[#6f00be] text-[#ddb7ff] text-[9px] font-bold uppercase tracking-wider">Pro</span>
                    </div>
                </div>

                {/* Menu em Pílula Central */}
                <nav className="hidden lg:flex items-center gap-1 bg-[#141418]/90 backdrop-blur-xl border border-white/10 rounded-full p-1 shadow-md">
                    {[
                        { id: 'decks', label: 'Decks' },
                        { id: 'cards', label: 'Cards' },
                        { id: 'biblioteca', label: 'Biblioteca' },
                        { id: 'meta-analytics', label: 'Meta Analytics' },
                    ].map((tab) => {
                        const isActive = activeNav === tab.id;
                        return (
                            <button
                                key={tab.id}
                                type="button"
                                onClick={() => setActiveNav(tab.id)}
                                className={`relative flex items-center gap-2 px-3.5 py-1 rounded-full text-xs font-medium transition-all cursor-pointer ${isActive
                                    ? 'bg-gradient-to-r from-[#c0c1ff]/30 via-indigo-500/20 to-[#c0c1ff]/30 text-white border border-[#c0c1ff]/50 shadow-[0_0_12px_rgba(99,102,241,0.3)]'
                                    : 'text-neutral-400 hover:text-white hover:bg-white/5 border border-transparent'
                                    }`}
                            >
                                {isActive && <span className="w-1.5 h-1.5 rounded-full bg-indigo-400 shadow-[0_0_8px_#818cf8] animate-pulse" />}
                                <span>{tab.label}</span>
                                {isActive && <span className="absolute -bottom-[5px] left-1/2 -translate-x-1/2 w-4 h-[2px] bg-[#c0c1ff] rounded-full shadow-[0_0_6px_#c0c1ff]" />}
                            </button>
                        );
                    })}
                </nav>

                {/* Perfil & Sair */}
                <div className="flex items-center gap-3 shrink-0">
                    <div className="flex items-center gap-2 p-1 rounded-xl bg-[#1b1b1e]/60 border border-white/5">
                        <div className="w-7 h-7 rounded-full overflow-hidden flex items-center justify-center ring-1 ring-[#c0c1ff]/40">
                            <img alt="Avatar" className="w-full h-full object-cover" src="/logo.png" />
                        </div>
                        <div className="hidden sm:flex flex-col pr-1">
                            <span className="text-[11px] leading-tight text-white font-medium">Gustavo Costa</span>
                            <span className="text-[9px] text-[#7bd0ff] font-mono">cEDH Architect</span>
                        </div>
                    </div>
                    <button
                        type="button"
                        onClick={onLogout}
                        className="text-xs text-[#908fa0] hover:text-white transition-colors cursor-pointer"
                    >
                        Sair →
                    </button>
                </div>
            </header>

            {/* Conteúdo Central (sem scroll, preenche 100% da viewport) */}
            <main className="flex-1 w-full max-w-[1720px] mx-auto px-6 py-2 flex flex-col justify-between min-h-0 gap-2">

                {/* Banner Superior Compacto */}
                <section className="relative w-full rounded-xl bg-[#1b1b1e]/50 backdrop-blur-2xl border border-white/10 shadow-lg p-2.5 shrink-0">
                    <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-2">
                        <div className="flex items-center gap-2.5 flex-wrap">
                            <div className="inline-flex items-center gap-1.5 px-2 py-0.5 rounded-full bg-[#c0c1ff]/15 border border-[#c0c1ff]/20 text-[#c0c1ff] text-[10px] font-medium">
                                <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
                                <span>100% atualizada</span>
                            </div>
                            <h1 className="text-sm sm:text-base font-bold text-white tracking-tight">
                                E aí, Gustavo! Qual deck vamos jogar hoje?
                            </h1>
                            <span className="text-[#c7c4d7] text-xs hidden xl:inline">• Escolha seu comandante na mão abaixo</span>
                        </div>

                        <div className="flex items-center gap-2 shrink-0">
                            <button
                                type="button"
                                className="px-3 py-1 rounded-lg bg-gradient-to-r from-[#6366f1] to-[#6f00be] text-white font-medium text-xs hover:opacity-95 transition-all shadow-[0_0_12px_rgba(99,102,241,0.3)] cursor-pointer"
                            >
                                + Criar Deck
                            </button>
                            <button
                                type="button"
                                className="px-3 py-1 rounded-lg bg-[#2a2a2d]/80 hover:bg-[#353438] text-white font-medium text-xs transition-colors border border-white/5 cursor-pointer"
                            >
                                Importar Lista
                            </button>
                        </div>
                    </div>

                    <div className="grid grid-cols-3 gap-2 border-t border-white/5 mt-2 pt-1.5 text-xs">
                        <div className="flex items-center gap-2 px-2 py-0.5 rounded-lg bg-[#0e0e11]/40 border border-white/5">
                            <span className="text-[#c0c1ff]">🎴</span>
                            <span className="font-bold text-white">14 Decks</span>
                            <span className="text-[#c7c4d7] text-[10.5px] truncate">Prontos para jogar</span>
                        </div>
                        <div className="flex items-center gap-2 px-2 py-0.5 rounded-lg bg-[#0e0e11]/40 border border-white/5">
                            <span className="text-[#ddb7ff]">🏆</span>
                            <span className="font-bold text-[#ddb7ff]">68% Vitórias</span>
                            <span className="text-[#c7c4d7] text-[10.5px] truncate">Últimas partidas</span>
                        </div>
                        <div className="flex items-center gap-2 px-2 py-0.5 rounded-lg bg-[#0e0e11]/40 border border-white/5">
                            <span className="text-[#7bd0ff]">📚</span>
                            <span className="font-bold text-white">1.842 Cartas</span>
                            <span className="text-[#c7c4d7] text-[10.5px] truncate">Coleção física</span>
                        </div>
                    </div>
                </section>

                {/* SEÇÃO DA MÃO DE DECKS */}
                <section className="relative w-full flex flex-col justify-end overflow-visible min-h-0 flex-1 py-1">
                    <div className="flex items-center justify-between gap-2 px-1 mb-1 shrink-0">
                        <div className="flex items-center gap-2.5">
                            <h2 className="text-sm sm:text-base font-bold text-white tracking-tight">Meus Decks</h2>
                            <span className="px-2 py-0.5 rounded-full bg-[#353438]/80 text-[#7bd0ff] font-mono text-[10px] border border-white/5 font-semibold">
                                5 Decks na Mão
                            </span>
                        </div>
                        <div className="flex items-center gap-1 text-[11px]">
                            <button type="button" className="px-2 py-0.5 rounded bg-[#c0c1ff]/20 text-[#c0c1ff] font-medium border border-[#c0c1ff]/30">Todos</button>
                            <button type="button" className="px-2 py-0.5 rounded text-[#c7c4d7] hover:text-white transition-colors">Commander</button>
                            <button type="button" className="px-2 py-0.5 rounded text-[#c7c4d7] hover:text-white transition-colors">cEDH</button>
                        </div>
                    </div>

                    {/* Arco da Mão de Cartas Solta */}
                    <div
                        className="flex items-end justify-center relative select-none overflow-visible px-4 pb-1 h-[270px] sm:h-[290px]"
                        onMouseLeave={() => setHoveredIdx(null)}
                    >
                        {HAND_DECKS.map((deck, idx) => {
                            const isHovered = hoveredIdx === idx;
                            const isAnyHovered = hoveredIdx !== null;
                            const base = HAND_BASE_TRANSFORMS[idx] || { rotate: 0, translateY: 0, zIndex: 10 };

                            let shiftX = 0;
                            if (isAnyHovered && !isHovered) {
                                shiftX = idx < (hoveredIdx ?? 0) ? -24 : 24;
                            }

                            const currentRotation = isHovered ? 0 : base.rotate;
                            const currentTranslateY = isHovered ? -50 : base.translateY;
                            const currentScale = isHovered ? 1.1 : isAnyHovered ? 0.96 : 1;
                            const currentZIndex = isHovered ? 50 : base.zIndex;

                            return (
                                <div
                                    key={deck.key}
                                    onClick={() => setSelectedDeck(deck)}
                                    onMouseEnter={() => setHoveredIdx(idx)}
                                    style={{
                                        transform: `translateX(${shiftX}px) rotate(${currentRotation}deg) translateY(${currentTranslateY}px) scale(${currentScale})`,
                                        zIndex: currentZIndex,
                                        transformOrigin: 'bottom center',
                                        borderColor: isHovered ? 'rgba(129, 140, 248, 0.8)' : isAnyHovered ? 'rgba(255, 255, 255, 0.06)' : 'rgba(255, 255, 255, 0.1)',
                                        boxShadow: isHovered ? '0 0 32px rgba(123, 208, 255, 0.45), 0 20px 40px -10px rgba(0, 0, 0, 0.95)' : undefined,
                                    }}
                                    className={`
                    w-[195px] sm:w-[215px] aspect-[5/7] rounded-xl flex-shrink-0 relative cursor-pointer overflow-hidden border shadow-2xl bg-[#353438]
                    transition-all duration-300 ease-[cubic-bezier(0.16,1,0.3,1)] will-change-transform
                    ${idx !== 0 ? '-ml-12 sm:-ml-14' : ''}
                    ${isHovered ? 'opacity-100' : isAnyHovered ? 'opacity-65' : 'opacity-100'}
                  `}
                                >
                                    <div className="absolute inset-x-0 top-0 h-1 bg-gradient-to-r from-transparent via-cyan-400/60 to-transparent z-20 pointer-events-none" />

                                    <img
                                        alt={deck.commander}
                                        className="object-cover w-full h-full rounded-xl pointer-events-none select-none"
                                        src={deck.art}
                                    />

                                    <div className="absolute inset-0 bg-gradient-to-t from-black/95 via-black/70 to-transparent pointer-events-none" />

                                    <div className="absolute top-2 left-2 right-2 flex items-center justify-between z-10 pointer-events-none">
                                        <span className="px-2 py-0.5 rounded-full bg-[#0e0e11]/90 backdrop-blur-md text-[8.5px] uppercase font-semibold text-[#ddb7ff] border border-white/10">
                                            {deck.badge}
                                        </span>
                                        <span className="text-[10px] font-mono text-emerald-400 font-semibold bg-[#0e0e11]/90 px-1.5 py-0.5 rounded-full border border-white/10">
                                            {deck.winrate} WR
                                        </span>
                                    </div>

                                    <div className="absolute bottom-0 inset-x-0 p-3 flex flex-col gap-0.5 z-10 pointer-events-none">
                                        <span className="text-[9.5px] text-[#7bd0ff] uppercase tracking-wider font-semibold font-mono truncate">
                                            {deck.archetype}
                                        </span>
                                        <h3 className="text-xs sm:text-sm font-bold text-white tracking-tight leading-snug truncate">
                                            {deck.commander}
                                        </h3>
                                        <div className="flex items-center justify-between text-[#908fa0] text-[10px] font-mono pt-1 border-t border-white/10">
                                            <span>CMC {deck.cmc} • {deck.value}</span>
                                            <div className="flex items-center gap-0.5">
                                                {deck.pips.map((pip) => (
                                                    <span
                                                        key={pip.text}
                                                        className={`w-3.5 h-3.5 rounded-full ${pip.bg} ${pip.fg} text-[8px] flex items-center justify-center font-bold shadow-sm`}
                                                    >
                                                        {pip.text}
                                                    </span>
                                                ))}
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            );
                        })}
                    </div>
                </section>

                {/* SEÇÃO TOP 5 CARTAS DA COLEÇÃO (100% INTACTA) */}
                <section className="rounded-xl bg-[#1b1b1e]/50 backdrop-blur-2xl border border-white/10 shadow-lg flex flex-col p-3 gap-2 shrink-0">
                    <div className="flex items-center justify-between gap-3">
                        <div>
                            <div className="flex items-center gap-1.5">
                                <span className="text-[#c0c1ff] text-xs">✓</span>
                                <span className="text-[10px] font-mono uppercase text-[#7bd0ff] font-semibold tracking-wider">Seu Acervo Físico</span>
                                <span className="text-xs font-bold text-white tracking-tight ml-2">Top 5 Cartas da Sua Coleção</span>
                            </div>
                        </div>

                        <div className="flex items-center gap-1 flex-wrap text-xs">
                            {[
                                { id: 'used', label: 'Mais Usadas', icon: '🔥' },
                                { id: 'valuable', label: 'Mais Valiosas', icon: '💎' },
                                { id: 'favorite', label: 'Favoritas', icon: '⭐' },
                                { id: 'recent', label: 'Recém Adicionadas', icon: '✨' },
                            ].map((f) => {
                                const isActive = cardFilter === f.id;
                                return (
                                    <button
                                        key={f.id}
                                        type="button"
                                        onClick={() => setCardFilter(f.id)}
                                        className={`px-2 py-0.5 rounded-md transition-all flex items-center gap-1 cursor-pointer text-[11px] ${isActive
                                            ? 'bg-[#c0c1ff]/20 text-[#c0c1ff] border border-[#c0c1ff]/30'
                                            : 'bg-[#0e0e11]/80 text-[#c7c4d7] hover:text-white border border-white/5'
                                            }`}
                                    >
                                        <span>{f.icon}</span>
                                        <span>{f.label}</span>
                                    </button>
                                );
                            })}
                        </div>
                    </div>

                    {/* Grid dos 5 Cards da Coleção */}
                    <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-2">
                        {TOP_CARDS.map((card) => (
                            <div
                                key={card.name}
                                className="flex flex-col rounded-lg bg-[#0e0e11]/70 border border-white/10 hover:border-[#c0c1ff]/40 transition-all group overflow-hidden cursor-pointer shadow-md"
                            >
                                <div className="relative aspect-[5/6] w-full overflow-hidden bg-[#353438] max-h-24 sm:max-h-28">
                                    <img
                                        alt={card.name}
                                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                                        src={card.img}
                                    />

                                    {card.foil && (
                                        <div className="absolute inset-[-100%] bg-gradient-to-r from-transparent via-white/20 to-transparent rotate-25 animate-[shimmer_4s_infinite_linear] pointer-events-none" />
                                    )}

                                    <div className="absolute top-1 left-1 px-1 py-0.2 rounded bg-black/80 text-[#c0c1ff] font-mono text-[9px] font-bold">
                                        {card.rank}
                                    </div>
                                    <div className="absolute top-1 right-1 px-1 py-0.2 rounded bg-black/80 text-emerald-400 font-mono text-[9px] font-semibold">
                                        {card.price}
                                    </div>
                                    <div className="absolute bottom-1 left-1 right-1 flex items-center justify-between text-[7.5px]">
                                        <span className="px-1 rounded bg-[#0e0e11]/90 uppercase text-[#7bd0ff] font-semibold border border-white/10">
                                            {card.rarity}
                                        </span>
                                        <span className="px-1 rounded bg-[#c0c1ff]/20 font-mono text-[#c0c1ff] font-semibold">
                                            {card.usage}
                                        </span>
                                    </div>
                                </div>

                                <div className="p-1.5 flex flex-col gap-0.5">
                                    <span className="text-white font-bold text-xs truncate group-hover:text-[#c0c1ff] transition-colors">
                                        {card.name}
                                    </span>
                                    <span className="text-[#908fa0] text-[9.5px] truncate">
                                        {card.type}
                                    </span>
                                </div>
                            </div>
                        ))}
                    </div>

                    <div className="flex items-center justify-between pt-1.5 border-t border-white/5 text-[10.5px] text-[#908fa0]">
                        <div className="flex items-center gap-1.5">
                            <span className="text-[#7bd0ff]">🗄️</span>
                            <span>Indexação física sincronizada com caixas seladas e binders.</span>
                        </div>
                        <button
                            type="button"
                            className="font-mono text-[#c0c1ff] hover:text-white transition-colors flex items-center gap-1 cursor-pointer"
                        >
                            <span>Ver todas as 1.842 cartas</span>
                            <span>→</span>
                        </button>
                    </div>
                </section>

            </main>

            {/* Footer Compacto Oficial (h-8) */}
            <footer className="w-full h-8 bg-[#0e0e11] border-t border-white/5 px-6 flex items-center justify-between text-[10.5px] text-[#908fa0] shrink-0 font-mono">
                <div className="flex items-center gap-4">
                    <span className="flex items-center gap-1">
                        <span className="w-1.5 h-1.5 rounded-full bg-[#7bd0ff] animate-pulse" />
                        Live Scryfall Sync
                    </span>
                    <span className="hidden sm:inline">WASM Engine: Active</span>
                    <span className="hidden md:inline">Ban-Lists: 2026</span>
                </div>
                <div>© 2026 DECKTRACKER MTG. Precision Tournament Systems.</div>
            </footer>

            {/* MODAL INSPECTOR COMPLETO */}
            {selectedDeck && (
                <div
                    onClick={() => setSelectedDeck(null)}
                    className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/85 backdrop-blur-2xl transition-all"
                >
                    <div
                        onClick={(e) => e.stopPropagation()}
                        className="relative w-full max-w-4xl bg-[#131316]/95 border border-white/15 rounded-2xl p-6 flex flex-col md:flex-row gap-6 max-h-[90vh] overflow-y-auto shadow-2xl"
                    >
                        <button
                            type="button"
                            onClick={() => setSelectedDeck(null)}
                            className="absolute top-4 right-4 w-8 h-8 rounded-lg bg-[#2a2a2d] hover:bg-[#353438] text-white flex items-center justify-center border border-white/10 cursor-pointer font-bold text-xs"
                        >
                            ✕
                        </button>

                        {/* Comandante em Destaque */}
                        <div className="w-full md:w-64 shrink-0 flex flex-col items-center gap-3">
                            <div className="relative w-52 aspect-[2.5/3.5] rounded-xl overflow-hidden shadow-2xl border border-white/20 ring-1 ring-[#c0c1ff]/40">
                                <img alt="Commander Art" className="w-full h-full object-cover" src={selectedDeck.art} />
                                <div className="absolute inset-0 bg-gradient-to-t from-black/85 via-transparent to-transparent pointer-events-none" />
                                <div className="absolute bottom-2 right-2 px-1.5 py-0.5 rounded bg-[#0e0e11]/90 border border-white/15 text-white font-mono font-bold text-xs">
                                    {selectedDeck.pt}
                                </div>
                                <div className="absolute top-2 left-2 px-1.5 py-0.5 rounded-full bg-[#0e0e11]/90 border border-white/15 font-mono text-[8px] text-[#7bd0ff] uppercase font-semibold">
                                    {selectedDeck.badge}
                                </div>
                            </div>
                            <div className="flex items-center gap-1.5">
                                {selectedDeck.pips.map((pip) => (
                                    <span key={pip.text} className={`w-5 h-5 rounded-full ${pip.bg} ${pip.fg} text-[10px] flex items-center justify-center font-bold shadow-md`}>
                                        {pip.text}
                                    </span>
                                ))}
                            </div>
                            <span className="text-xs text-[#908fa0] font-mono">{selectedDeck.stats}</span>
                        </div>

                        {/* Métricas e Histograma */}
                        <div className="flex-1 flex flex-col justify-between gap-4 min-w-0">
                            <div>
                                <div className="flex items-center gap-2 mb-1">
                                    <span className="px-2 py-0.5 rounded-full bg-[#2a2a2d] text-[#ddb7ff] text-xs font-medium">
                                        {selectedDeck.archetype}
                                    </span>
                                    <span className="px-2 py-0.5 rounded-full bg-emerald-500/15 text-emerald-400 text-xs font-semibold">
                                        {selectedDeck.status}
                                    </span>
                                </div>
                                <h2 className="text-xl md:text-2xl font-bold text-white tracking-tight">{selectedDeck.title}</h2>
                                <p className="text-[#c7c4d7] text-xs mt-1 leading-relaxed">{selectedDeck.desc}</p>
                            </div>

                            <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                                <div className="p-2 rounded-xl bg-[#1b1b1e]/70 border border-white/5">
                                    <span className="text-[9px] uppercase text-[#908fa0] block font-mono">Win Rate</span>
                                    <span className="text-base font-bold text-[#7bd0ff]">{selectedDeck.winrate}</span>
                                    <span className="text-[9px] text-[#908fa0] block font-mono">{selectedDeck.games}</span>
                                </div>
                                <div className="p-2 rounded-xl bg-[#1b1b1e]/70 border border-white/5">
                                    <span className="text-[9px] uppercase text-[#908fa0] block font-mono">CMC Médio</span>
                                    <span className="text-base font-mono font-bold text-white">{selectedDeck.cmc}</span>
                                    <span className="text-[9px] text-[#908fa0] block font-mono">Low Curve</span>
                                </div>
                                <div className="p-2 rounded-xl bg-[#1b1b1e]/70 border border-white/5">
                                    <span className="text-[9px] uppercase text-[#908fa0] block font-mono">Valor Mercado</span>
                                    <span className="text-base font-mono font-bold text-[#ddb7ff]">{selectedDeck.value}</span>
                                    <span className="text-[9px] text-[#908fa0] block font-mono">TCGPlayer Mid</span>
                                </div>
                                <div className="p-2 rounded-xl bg-[#1b1b1e]/70 border border-white/5">
                                    <span className="text-[9px] uppercase text-[#908fa0] block font-mono">Consistência</span>
                                    <span className="text-base font-mono font-bold text-emerald-400">92.4%</span>
                                    <span className="text-[9px] text-[#908fa0] block font-mono">Monte Carlo</span>
                                </div>
                            </div>

                            <div className="p-2.5 rounded-xl bg-[#1b1b1e]/50 border border-white/5 flex flex-col gap-1">
                                <div className="flex items-center justify-between text-[11px] text-[#908fa0] uppercase font-mono">
                                    <span>Curva de Mana</span>
                                    <span className="text-[#7bd0ff]">33 Terrenos • 66 Mágicas</span>
                                </div>
                                <div className="flex items-end gap-2 h-12 pt-1 px-1">
                                    {selectedDeck.curve.map((bar) => (
                                        <div key={bar.label} className="flex-1 flex flex-col items-center gap-0.5 h-full justify-end group">
                                            <span className="text-[7.5px] font-mono text-[#908fa0] opacity-0 group-hover:opacity-100 transition-opacity">{bar.count}</span>
                                            <div className="w-full bg-[#6366f1]/70 hover:bg-[#6366f1] rounded-t transition-all" style={{ height: `${bar.pct}%` }} />
                                            <span className="text-[8.5px] font-mono text-[#908fa0]">{bar.label}</span>
                                        </div>
                                    ))}
                                </div>
                            </div>

                            <div className="flex items-center gap-2 pt-2 border-t border-white/10">
                                <button
                                    type="button"
                                    className="px-4 py-2 rounded-xl bg-[#6366f1] hover:bg-[#5254d8] text-white font-bold text-xs shadow-md transition-all cursor-pointer"
                                >
                                    Abrir no Deckbuilder
                                </button>
                                <button
                                    type="button"
                                    className="px-3.5 py-2 rounded-xl bg-[#2a2a2d] hover:bg-[#353438] text-white font-medium text-xs border border-white/5 cursor-pointer"
                                >
                                    Exportar Lista
                                </button>
                                <button
                                    type="button"
                                    onClick={() => setSelectedDeck(null)}
                                    className="ml-auto text-[#908fa0] hover:text-white text-xs font-mono cursor-pointer"
                                >
                                    [ESC] Fechar
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}