import { useEffect, useLayoutEffect, useRef, useState } from 'react';

interface HeroPageProps {
  onNavigateLogin?: () => void;
  onNavigateRegister?: () => void;
  onNavigateDashboard?: () => void;
}

const navigationItems = [
  ['Início', '#inicio'],
  ['Coleção Física', '#colecao'],
  ['Deckbuilder', '#deckbuilder'],
  ['Explorar Base MTG', '#como-funciona'],
];

const catalogCards = [
  {
    name: 'Black Lotus',
    set: 'Alpha · 1993',
    image: 'https://cards.scryfall.io/normal/front/b/0/b0faa7f2-b547-42c4-a810-839da50dadfe.jpg?1783948669',
  },
  {
    name: 'Swords to Plowshares',
    set: 'Ice Age · 1995',
    image: 'https://cards.scryfall.io/normal/front/3/7/375fd2cb-443b-4be4-ad60-6d1a8e74f510.jpg?1783947519',
  },
  {
    name: 'Sol Ring',
    set: 'Commander',
    image: 'https://cards.scryfall.io/normal/front/7/1/71357a3d-9a9f-4ec6-8e01-1966b220206c.jpg?1783941155',
  },
  {
    name: 'Birds of Paradise',
    set: 'Ravnica',
    image: 'https://cards.scryfall.io/normal/front/9/0/90a4396a-0f22-482b-ad1d-4d9b68a1ed96.jpg?1783943642',
  },
];

const deckbuilderCards = [
  {
    name: 'Atraxa, Grand Unifier',
    image: 'https://cards.scryfall.io/normal/front/4/a/4a1f905f-1d55-4d02-9d24-e58070793d3f.jpg?1783918003',
  },
  {
    name: 'Rhystic Study',
    image: 'https://cards.scryfall.io/normal/front/9/f/9f37c5b6-a59c-45cd-9a99-e9357fe9ea1b.jpg?1783919146',
  },
  {
    name: 'Demonic Tutor',
    image: 'https://cards.scryfall.io/normal/front/a/2/a24b4cb6-cebb-428b-8654-74347a6a8d63.jpg?1783915679',
  },
  {
    name: 'Doubling Season',
    image: 'https://cards.scryfall.io/normal/front/f/2/f2c4f80e-84a0-463b-82c3-5c6503809351.jpg?1783909062',
  },
  {
    name: "Teferi's Protection",
    image: 'https://cards.scryfall.io/normal/front/4/8/483fa1cb-1e35-44f2-a143-98c0f107f5ca.jpg?1783921926',
  },
  {
    name: 'Cyclonic Rift',
    image: 'https://cards.scryfall.io/normal/front/d/f/dfb7c4b9-f2f4-4d4e-baf2-86551c8150fe.jpg?1783913339',
  },
  {
    name: 'Smothering Tithe',
    image: 'https://cards.scryfall.io/normal/front/8/6/861b5889-0183-4bee-afeb-a4b2aa700a8e.jpg?1783915712',
  },
  {
    name: 'Mana Crypt',
    image: 'https://cards.scryfall.io/normal/front/4/d/4d960186-4559-4af0-bd22-63baa15f8939.jpg?1783930103',
  },
  {
    name: 'Force of Will',
    image: 'https://cards.scryfall.io/normal/front/8/9/89f612d6-7c59-4a7b-a87d-45f789e88ba5.jpg?1789015964',
  },
  {
    name: 'Vampiric Tutor',
    image: 'https://cards.scryfall.io/normal/front/3/4/34a0203f-9cce-43a4-9cb7-8ce6647895cd.jpg?1783918468',
  },
];


const formats = ['Commander', 'Pauper', 'Modern', 'Standard'];

export function HeroPage({ onNavigateLogin, onNavigateRegister, onNavigateDashboard }: HeroPageProps) {
  const [activeFormat, setActiveFormat] = useState('Commander');
  const [activeSection, setActiveSection] = useState('#inicio');
  const navRef = useRef<HTMLDivElement>(null);
  const linkRefs = useRef<Record<string, HTMLAnchorElement | null>>({});
  const [indicator, setIndicator] = useState({ left: 0, width: 6, visible: false });

  useLayoutEffect(() => {
    const nav = navRef.current;
    const link = linkRefs.current[activeSection];
    if (!nav || !link) return;
    const navBox = nav.getBoundingClientRect();
    const linkBox = link.getBoundingClientRect();
    setIndicator({ left: linkBox.left - navBox.left + linkBox.width / 2 - 3, width: 6, visible: true });
  }, [activeSection]);

  useEffect(() => {
    const sections = navigationItems
      .map(([, href]) => document.querySelector(href))
      .filter((section): section is Element => Boolean(section));

    const observer = new IntersectionObserver(
      (entries) => {
        const visibleSection = entries
          .filter((entry) => entry.isIntersecting)
          .sort((a, b) => b.intersectionRatio - a.intersectionRatio)[0];
        if (visibleSection) setActiveSection(`#${visibleSection.target.id}`);
      },
      { rootMargin: '-18% 0px -62% 0px', threshold: [0.1, 0.35, 0.7] },
    );

    sections.forEach((section) => observer.observe(section));
    return () => observer.disconnect();
  }, []);

  const handleStartCollection = () => {
    if (onNavigateRegister) {
      onNavigateRegister();
    } else if (onNavigateDashboard) {
      onNavigateDashboard();
    }
  };

  return (
    <div className="relative min-h-screen bg-[#faf9f5] text-[#24211f] overflow-x-hidden w-full">
      {/* Header Bar - Fixed Top Navbar */}
      <header className="fixed top-0 left-0 right-0 z-[9999] border-b border-black/[0.08] bg-[#faf9f5]/95 backdrop-blur-2xl shadow-sm w-full">
        <nav aria-label="Navegação principal" className="w-full grid h-[78px] grid-cols-[1fr_auto_1fr] items-center px-6 lg:px-10">
          <a href="#inicio" className="flex items-center gap-2.5 justify-self-start text-[21px] font-extrabold tracking-[-0.05em] text-black group">
            <div className="relative flex size-10 items-center justify-center rounded-[11px] border-2 border-black bg-[#faf9f5] p-1 shadow-[3px_3px_0_#171513] group-hover:scale-105 transition-transform overflow-hidden">
              <img src="/mascot.png" alt="SpellBinder Logo" className="w-full h-full object-contain" />
            </div>
            SpellBinder
          </a>

          {/* Desktop Nav Items */}
          <div ref={navRef} className="relative hidden items-center justify-self-center gap-7 lg:flex">
            <span
              aria-hidden="true"
              className="pointer-events-none absolute bottom-0 size-1.5 rounded-full bg-[#9b7130] transition-[left] duration-500 ease-[cubic-bezier(0.22,1,0.36,1)]"
              style={{ left: indicator.left, opacity: indicator.visible ? 1 : 0 }}
            />
            {navigationItems.map(([item, href]) => (
              <a
                key={item}
                ref={(element) => { linkRefs.current[href] = element; }}
                href={href}
                onClick={() => setActiveSection(href)}
                aria-current={activeSection === href ? 'page' : undefined}
                className={`relative whitespace-nowrap pb-2 text-[14px] transition-colors duration-300 hover:text-black ${activeSection === href ? 'font-bold text-black' : 'font-medium text-[#625d59]'
                  }`}
              >
                {item}
              </a>
            ))}
          </div>

          {/* Actions */}
          <div className="flex items-center justify-self-end gap-4">
            <button
              type="button"
              onClick={onNavigateRegister}
              className="hidden whitespace-nowrap text-[14px] font-medium text-[#625d59] transition-colors hover:text-black sm:block cursor-pointer"
            >
              Registre-se
            </button>
            <button
              type="button"
              onClick={onNavigateLogin}
              className="group inline-flex h-11 items-center gap-3 rounded-full bg-[#171513] pl-5 pr-2 text-[14px] font-semibold text-white shadow-[0_4px_0_#d8d4cc,0_10px_24px_rgba(36,33,31,0.12)] transition-all hover:-translate-y-0.5 hover:bg-[#2a2623] hover:shadow-[0_4px_0_#d8d4cc,0_13px_26px_rgba(36,33,31,0.18)] cursor-pointer"
            >
              <span>Entrar</span>
              <span aria-hidden="true" className="flex size-7 items-center justify-center rounded-full bg-white text-[#171513] transition-transform group-hover:translate-x-0.5">
                →
              </span>
            </button>
          </div>
        </nav>
      </header>

      {/* Main Content Area */}
      <main className="min-h-screen w-full bg-[#faf9f5] pt-[78px] text-[#24211f]">
        {/* Seção Início com largura total */}
        <section id="inicio" className="relative w-full overflow-hidden px-6 pb-20 pt-20 lg:px-10 lg:pb-28 lg:pt-28">
          <div aria-hidden="true" className="hero-grid pointer-events-none absolute inset-0 opacity-50 w-full" />
          <div aria-hidden="true" className="hero-orb hero-orb-one pointer-events-none absolute left-0 top-20 size-[380px] rounded-full bg-[#e9e0c7]/45 blur-3xl" />
          <div aria-hidden="true" className="hero-orb hero-orb-two pointer-events-none absolute right-0 top-[28%] size-[300px] rounded-full bg-[#e6c66d]/20 blur-3xl" />

          <div className="relative z-10 mx-auto max-w-5xl text-center">
            <div className="mb-7 inline-flex items-center gap-2 rounded-full border border-[#ded9ce] bg-white/70 px-4 py-2 text-[11px] font-bold uppercase tracking-[0.16em] text-[#746d67] shadow-xs">
              <span className="size-1.5 rounded-full bg-[#9b7130]" /> Feito de jogador para jogador
            </div>
            <h1 className="mx-auto max-w-4xl text-5xl font-black leading-[0.98] tracking-[-0.065em] text-black sm:text-7xl lg:text-[92px]">
              Sua coleção física.<br />
              <span className="text-[#77726f]">Seus decks. Seu jogo.</span>
            </h1>
            <p className="mx-auto mt-8 max-w-2xl text-base leading-7 text-[#625d59] sm:text-lg">
              O lugar onde todas as suas cartas de Magic finalmente fazem sentido. Organize o fichário, monte decks melhores e nunca mais perca uma carta na gaveta.
            </p>
            <div className="mt-9 flex flex-col items-center justify-center gap-3 sm:flex-row">
              <button
                type="button"
                onClick={handleStartCollection}
                className="group inline-flex h-14 items-center gap-8 rounded-full bg-[#171513] px-6 pl-7 text-[15px] font-semibold text-white shadow-[0_5px_0_#d8d4cc,0_14px_28px_rgba(36,33,31,0.14)] transition-all hover:-translate-y-1 hover:bg-[#2a2623] hover:shadow-[0_5px_0_#d8d4cc,0_18px_32px_rgba(36,33,31,0.2)] cursor-pointer"
              >
                <span>Começar minha coleção</span>
                <span className="flex size-9 items-center justify-center rounded-full bg-[#e6c66d] text-xl text-black transition-transform group-hover:translate-x-1">
                  →
                </span>
              </button>
              <a
                href="#como-funciona"
                className="inline-flex h-14 items-center gap-2 rounded-full border border-[#ded9ce] bg-white px-6 text-[15px] font-semibold text-[#3d3936] transition-colors hover:border-[#aaa39b] hover:bg-[#f2efe8]"
              >
                <span className="flex size-7 items-center justify-center rounded-full border border-[#373330] text-[10px]">▶</span> Ver como funciona
              </a>
            </div>
          </div>

          {/* Dashboard Catalog Mockup */}
          <div className="relative mx-auto mt-16 max-w-[1060px] overflow-hidden rounded-[28px] border-[10px] border-white bg-[#d6d0c4] shadow-[0_20px_70px_rgba(70,57,39,0.16)] lg:mt-20">
            <div className="flex h-10 items-center gap-2 border-b border-black/10 bg-[#f7f4ed] px-4">
              <span className="size-2 rounded-full bg-[#d4a09a]" />
              <span className="size-2 rounded-full bg-[#d6bd7d]" />
              <span className="size-2 rounded-full bg-[#9db49a]" />
              <span className="ml-5 h-5 w-48 rounded bg-[#ebe7df]" />
            </div>
            <div className="grid min-h-[355px] grid-cols-[150px_1fr] bg-[#eeeae1] sm:grid-cols-[190px_1fr]">
              <aside className="border-r border-black/10 bg-[#f8f5ee] p-4">
                <div className="mb-7 h-5 w-24 rounded bg-[#25211d]" />
                <div className="space-y-4 text-[11px] text-[#777069]">
                  <div className="rounded-lg bg-[#e9e1cf] px-3 py-2 font-bold text-[#3a332b]">Minha coleção</div>
                  <div>Todos os cards</div>
                  <div>Pastas</div>
                  <div>Listas de desejos</div>
                </div>
              </aside>
              <div className="p-5 sm:p-8">
                <div className="mb-6 flex items-end justify-between">
                  <div>
                    <p className="text-[10px] font-bold uppercase tracking-[0.15em] text-[#918a81]">Minha coleção física</p>
                    <h3 className="mt-1 text-2xl font-black tracking-[-0.05em] text-[#201d1a]">Cartas catalogadas</h3>
                  </div>
                  <span className="rounded-full bg-white px-3 py-2 text-[10px] font-bold text-[#5d5750] shadow-xs">1.248 cartas</span>
                </div>
                <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
                  {catalogCards.map((card) => (
                    <div key={card.name} className="group rounded-xl border border-black/10 bg-white p-2 shadow-xs transition-transform hover:-translate-y-1">
                      <div className="relative aspect-[0.72] w-full overflow-hidden rounded-lg bg-[#201d1a]/5">
                        <img
                          src={card.image}
                          alt={card.name}
                          loading="lazy"
                          className="h-full w-full object-cover rounded-lg transition-transform duration-300 group-hover:scale-105"
                        />
                      </div>
                      <p className="mt-2 truncate text-[10px] font-bold text-[#36312d]">{card.name}</p>
                      <p className="text-[9px] text-[#948c83]">{card.set}</p>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Feature Banner Bar - Largura total 100vw */}
        <section className="w-full border-y border-black/[0.06] bg-[#f1eee7] px-6 py-8">
          <div className="w-full flex flex-wrap items-center justify-center gap-x-10 gap-y-4 text-sm text-[#625d59]">
            <span className="font-bold text-[#24211f]">Tudo o que você precisa para jogar melhor</span>
            <span>32.000+ cartas</span>
            <span>Todos os formatos</span>
            <span>Exportação para Arena e SpellTable</span>
          </div>
        </section>

        {/* Section 01: Coleção Física */}
        <section id="colecao" className="w-full grid max-w-[1440px] mx-auto gap-14 px-6 py-24 lg:grid-cols-2 lg:items-center lg:px-10 lg:py-32">
          <div>
            <p className="mb-5 text-xs font-bold uppercase tracking-[0.18em] text-[#9b7130]">01 · Sua coleção</p>
            <h2 className="max-w-lg text-4xl font-black leading-[1.02] tracking-[-0.06em] text-black sm:text-6xl">
              Do fichário para a tela. Sem complicação.
            </h2>
            <p className="mt-6 max-w-lg text-base leading-7 text-[#625d59]">
              Registre las cartas que você realmente possui, organize por pasta, edição ou deck e saiba exatamente o que está disponível antes de comprar um novo booster.
            </p>
            <button
              type="button"
              onClick={handleStartCollection}
              className="mt-8 inline-flex items-center gap-2 border-b-2 border-[#24211f] pb-1 text-sm font-bold text-[#24211f] hover:text-[#9b7130] transition-colors cursor-pointer"
            >
              <span>Conhecer minha coleção</span>
              <span>→</span>
            </button>
          </div>
          <div className="relative rounded-[28px] bg-[#24211f] p-5 shadow-[0_20px_50px_rgba(36,33,31,0.18)] sm:p-8">
            <div className="absolute -right-4 -top-5 rounded-xl border border-[#d8c99e] bg-[#eee0ad] px-4 py-3 text-xs font-bold text-[#55451f] shadow-lg">
              Coleção sincronizada
            </div>
            <div className="mb-7 flex items-center justify-between text-white">
              <span className="text-sm font-bold">Resumo da coleção</span>
              <span className="text-xs text-white/50">Atualizado agora</span>
            </div>
            <div className="grid grid-cols-2 gap-3">
              <div className="rounded-2xl bg-white/[0.08] p-4">
                <p className="text-3xl font-black text-white">1.248</p>
                <p className="mt-1 text-xs text-white/50">cartas catalogadas</p>
              </div>
              <div className="rounded-2xl bg-white/[0.08] p-4">
                <p className="text-3xl font-black text-[#e6c66d]">86%</p>
                <p className="mt-1 text-xs text-white/50">da coleção organizada</p>
              </div>
            </div>
            <div className="mt-4 rounded-2xl bg-white/[0.08] p-4">
              <div className="mb-3 flex justify-between text-xs text-white/60">
                <span>Valor estimado</span>
                <span className="font-bold text-white">R$ 8.420,00</span>
              </div>
              <div className="h-2 overflow-hidden rounded-full bg-white/10">
                <div className="h-full w-[72%] rounded-full bg-[#e6c66d]" />
              </div>
            </div>
          </div>
        </section>

        {/* Section 02: Deckbuilder - Largura total */}
        <section id="deckbuilder" className="w-full bg-[#24211f] px-6 py-24 text-white lg:py-32">
          <div className="w-full max-w-[1440px] mx-auto grid gap-14 lg:grid-cols-[0.8fr_1.2fr] lg:items-center px-6 lg:px-10">
            <div>
              <p className="mb-5 text-xs font-bold uppercase tracking-[0.18em] text-[#e6c66d]">02 · Deckbuilder</p>
              <h2 className="max-w-md text-4xl font-black leading-[1.02] tracking-[-0.06em] sm:text-6xl">
                A ideia do deck. O resto a gente organiza.
              </h2>
              <p className="mt-6 max-w-md text-base leading-7 text-white/60">
                Monte seu próximo deck com toda a base do Magic ao seu alcance. Filtre por formato, cor, tipo e sinergia — ou limite a busca ao que você já tem.
              </p>
              <div className="mt-8 flex flex-wrap gap-2">
                {formats.map((format) => (
                  <button
                    key={format}
                    type="button"
                    onClick={() => setActiveFormat(format)}
                    className={`rounded-full px-4 py-2 text-xs font-bold transition-colors cursor-pointer ${activeFormat === format ? 'bg-[#e6c66d] text-[#24211f]' : 'bg-white/10 text-white/60 hover:bg-white/20'
                      }`}
                  >
                    {format}
                  </button>
                ))}
              </div>
            </div>

            <div className="w-full lg:w-[114%] lg:-mr-[14%] rounded-[28px] border border-white/15 bg-[#302c29] p-4 sm:p-5 lg:p-6 shadow-[0_25px_60px_rgba(0,0,0,0.65)] transition-all">
              <div className="mb-3.5 flex items-center justify-between sm:mb-4">
                <div>
                  <p className="text-[10px] sm:text-xs font-bold uppercase tracking-[0.16em] text-white/40">Novo deck</p>
                  <h3 className="text-lg sm:text-xl lg:text-2xl font-black tracking-tight text-white">Atraxa, Grand Unifier</h3>
                </div>
                <span className="rounded-full border border-[#e6c66d]/30 bg-[#e6c66d]/15 px-3 py-1 text-xs font-bold text-[#e6c66d] shadow-xs">{activeFormat}</span>
              </div>
              <div className="grid grid-cols-2 sm:grid-cols-5 gap-2 sm:gap-2.5 lg:gap-3">
                {deckbuilderCards.map((card) => (
                  <div
                    key={card.name}
                    title={card.name}
                    className="group relative aspect-[0.714] overflow-hidden rounded-xl border border-white/15 bg-[#24211f] shadow-lg transition-all duration-300 hover:-translate-y-2 hover:border-[#e6c66d] hover:shadow-[0_16px_36px_rgba(0,0,0,0.75)] cursor-pointer"
                  >
                    <img
                      src={card.image}
                      alt={card.name}
                      loading="lazy"
                      className="h-full w-full object-cover transition-transform duration-300 group-hover:scale-108"
                    />
                    <div className="pointer-events-none absolute inset-x-0 bottom-0 bg-gradient-to-t from-black/95 via-black/60 to-transparent p-1.5 sm:p-2 opacity-0 transition-opacity duration-200 group-hover:opacity-100">
                      <p className="truncate text-[10px] sm:text-xs font-bold text-white drop-shadow-md">{card.name}</p>
                    </div>
                  </div>
                ))}
              </div>
              <div className="mt-3.5 sm:mt-4 grid grid-cols-3 gap-2 sm:gap-3 text-center">
                <div className="rounded-xl border border-white/5 bg-white/[0.05] p-2 sm:p-2.5 transition-colors hover:bg-white/[0.08]">
                  <strong className="block text-base sm:text-lg font-black text-white">38</strong>
                  <span className="text-[10px] sm:text-xs font-medium text-white/50">cartas</span>
                </div>
                <div className="rounded-xl border border-white/5 bg-white/[0.05] p-2 sm:p-2.5 transition-colors hover:bg-white/[0.08]">
                  <strong className="block text-base sm:text-lg font-black text-white">4</strong>
                  <span className="text-[10px] sm:text-xs font-medium text-white/50">cores</span>
                </div>
                <div className="rounded-xl border border-white/5 bg-white/[0.05] p-2 sm:p-2.5 transition-colors hover:bg-white/[0.08]">
                  <strong className="block text-base sm:text-lg font-black text-[#e6c66d]">72%</strong>
                  <span className="text-[10px] sm:text-xs font-medium text-white/50">na coleção</span>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Como funciona */}
        <section id="como-funciona" className="w-full max-w-[1440px] mx-auto px-6 py-24 lg:px-10 lg:py-32">
          <div className="mx-auto max-w-2xl text-center">
            <p className="mb-5 text-xs font-bold uppercase tracking-[0.18em] text-[#9b7130]">Como funciona</p>
            <h2 className="text-4xl font-black tracking-[-0.06em] text-black sm:text-6xl">
              Menos tempo catalogando.<br />Mais tempo jogando.
            </h2>
          </div>
          <div className="mt-16 grid gap-8 md:grid-cols-3">
            {[
              ['01', 'Crie sua conta', 'Tudo começa com um espaço só seu para suas cartas e seus decks.'],
              ['02', 'Adicione suas cartas', 'Busque na base do Scryfall e marque as cartas que vivem no seu fichário.'],
              ['03', 'Monte e jogue', 'Crie decks com o que tem — ou descubra o que falta para sua próxima lista.'],
            ].map(([number, title, text]) => (
              <div key={number} className="border-t-2 border-[#24211f] pt-5">
                <span className="text-sm font-bold text-[#9b7130]">{number}</span>
                <h3 className="mt-10 text-xl font-black tracking-[-0.03em]">{title}</h3>
                <p className="mt-3 text-sm leading-6 text-[#746d67]">{text}</p>
              </div>
            ))}
          </div>
        </section>

        {/* Final Call to Action */}
        <section id="registrar" className="w-full max-w-[1440px] mx-auto px-6 mb-8">
          <div className="overflow-hidden rounded-[30px] bg-[#e6c66d] px-6 py-16 text-center sm:px-10 lg:py-24 w-full">
            <p className="mb-5 text-xs font-bold uppercase tracking-[0.18em] text-[#6b5424]">Sua próxima jogada começa aqui</p>
            <h2 className="mx-auto max-w-3xl text-4xl font-black leading-[1] tracking-[-0.06em] text-[#24211f] sm:text-6xl">
              Sua coleção merece<br />um lugar à altura.
            </h2>
            <p className="mx-auto mt-6 max-w-lg text-base leading-7 text-[#655126]">
              Junte-se a quem está deixando o caos do fichário para trás.
            </p>
            <button
              type="button"
              onClick={handleStartCollection}
              className="mt-8 inline-flex h-14 items-center gap-8 rounded-full bg-[#171513] px-6 pl-7 text-[15px] font-semibold text-white shadow-[0_5px_0_rgba(36,33,31,0.18)] transition-transform hover:-translate-y-1 cursor-pointer"
            >
              <span>Começar gratuitamente</span>
              <span className="flex size-9 items-center justify-center rounded-full bg-white text-xl text-black">→</span>
            </button>
          </div>
        </section>

        {/* Footer */}
        <footer className="w-full max-w-[1440px] mx-auto flex flex-col gap-4 px-6 pb-10 pt-2 text-xs text-[#8b847c] sm:flex-row sm:items-center sm:justify-between lg:px-10">
          <span className="font-bold text-[#24211f]">SpellBinder</span>
          <span>Feito para jogadores, por jogadores. · Base de cartas via Scryfall.</span>
        </footer>
      </main>
    </div>
  );
}

export default HeroPage;