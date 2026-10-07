import { useState, useEffect, useRef, useMemo } from 'react';
import { AppNav } from '../../components/navbar/AppNav';
import { Toast } from '../../components/ui/Toast';
import { LoadingState } from '../../components/ui/LoadingState';
import { colors } from '../../styles/colors';

interface CardSuggestion {
  id: string;
  name: string;
  set: string;
  slug: string;
  rarity: string;
  type: string;
  image_url?: string | null;
}

interface CardPrint {
  id?: string;
  set_code: string;
  set_name: string;
  raw_set_name?: string;
  collector_number?: string;
  rarity: string;
  image_url: string;
  price?: string;
}

interface CardDetail extends CardSuggestion {
  mana_cost?: string | null;
  oracle_text?: string | null;
  prices?: Record<string, any>;
  legalities?: Record<string, string>;
  color_identity?: string[];
  colors?: string[];
  price?: string;
  set_name?: string;
  set_code?: string;
  type_line?: string;
  inCollection?: boolean;
  inWishlist?: boolean;
  scryfall_id?: string;
  prints?: CardPrint[];
}

export interface FormatStapleCard {
  id: string;
  name: string;
  set: string;
  set_code: string;
  type: string;
  rarity: string;
  price: string;
  color: 'Branco' | 'Azul' | 'Preto' | 'Vermelho' | 'Verde' | 'Incolor' | 'Multicor';
  mana_cost: string;
  slug: string;
  image_url: string;
  formats: string[];
  isLegendary?: boolean;
}

export const MANA_COLORS = [
  { code: 'W', name: 'Branco', label: 'Branco', svg: 'https://svgs.scryfall.io/card-symbols/W.svg', bg: '#fefce8', border: '#eab308' },
  { code: 'U', name: 'Azul', label: 'Azul', svg: 'https://svgs.scryfall.io/card-symbols/U.svg', bg: '#eff6ff', border: '#3b82f6' },
  { code: 'B', name: 'Preto', label: 'Preto', svg: 'https://svgs.scryfall.io/card-symbols/B.svg', bg: '#f3f4f6', border: '#4b5563' },
  { code: 'R', name: 'Vermelho', label: 'Vermelho', svg: 'https://svgs.scryfall.io/card-symbols/R.svg', bg: '#fef2f2', border: '#ef4444' },
  { code: 'G', name: 'Verde', label: 'Verde', svg: 'https://svgs.scryfall.io/card-symbols/G.svg', bg: '#f0fdf4', border: '#22c55e' },
  { code: 'C', name: 'Incolor', label: 'Incolor', svg: 'https://svgs.scryfall.io/card-symbols/C.svg', bg: '#f8fafc', border: '#94a3b8' },
];

export const TYPE_PILLS = [
  { id: 'Todos', label: 'Todos os Tipos' },
  { id: 'Criatura', label: 'Criaturas' },
  { id: 'Instantânea', label: 'Instantâneas' },
  { id: 'Feitiço', label: 'Feitiços' },
  { id: 'Artefato', label: 'Artefatos' },
  { id: 'Encantamento', label: 'Encantamentos' },
  { id: 'Terreno', label: 'Terrenos' },
  { id: 'Lendárias', label: 'Lendárias' },
];

export const FORMAT_STAPLES: FormatStapleCard[] = [
  // COMMANDER STAPLES
  {
    id: 'cmd-1',
    name: 'Sol Ring',
    set: 'Commander Masters',
    set_code: 'cmm',
    type: 'Artefato',
    rarity: 'Incomum',
    price: 'R$ 42,00',
    color: 'Incolor',
    mana_cost: '{1}',
    slug: 'sol-ring',
    image_url: 'https://cards.scryfall.io/normal/front/f/9/f9a32f17-49c4-4654-a087-1ba474f37377.jpg',
    formats: ['Commander', 'Legacy', 'Draft'],
  },
  {
    id: 'cmd-2',
    name: 'Rhystic Study',
    set: 'Jumpstart 2022',
    set_code: 'j22',
    type: 'Encantamento',
    rarity: 'Rara',
    price: 'R$ 184,90',
    color: 'Azul',
    mana_cost: '{2}{U}',
    slug: 'rhystic-study',
    image_url: 'https://cards.scryfall.io/normal/front/9/f/9f37c5b6-a59c-45cd-9a99-e9357fe9ea1b.jpg',
    formats: ['Commander', 'Legacy'],
  },
  {
    id: 'cmd-3',
    name: 'Demonic Tutor',
    set: 'Commander Masters',
    set_code: 'cmm',
    type: 'Feitiço',
    rarity: 'Rara',
    price: 'R$ 210,00',
    color: 'Preto',
    mana_cost: '{1}{B}',
    slug: 'demonic-tutor',
    image_url: 'https://cards.scryfall.io/normal/front/3/b/3bdbc231-5316-4abd-9d8d-d87cff2c9847.jpg',
    formats: ['Commander', 'Legacy'],
  },
  {
    id: 'cmd-4',
    name: 'Cyclonic Rift',
    set: 'Commander Masters',
    set_code: 'cmm',
    type: 'Instantânea',
    rarity: 'Rara',
    price: 'R$ 175,00',
    color: 'Azul',
    mana_cost: '{1}{U}',
    slug: 'cyclonic-rift',
    image_url: 'https://cards.scryfall.io/normal/front/f/f/ff08e5ed-f47b-4d8e-8b8b-41675dccef8b.jpg',
    formats: ['Commander'],
  },
  {
    id: 'cmd-5',
    name: 'Smothering Tithe',
    set: 'Commander Masters',
    set_code: 'cmm',
    type: 'Encantamento',
    rarity: 'Mítica',
    price: 'R$ 115,00',
    color: 'Branco',
    mana_cost: '{3}{W}',
    slug: 'smothering-tithe',
    image_url: 'https://cards.scryfall.io/normal/front/8/6/861b5889-0183-4bee-afeb-a4b2aa700a8e.jpg',
    formats: ['Commander'],
  },
  {
    id: 'cmd-6',
    name: 'Fierce Guardianship',
    set: 'Commander Masters',
    set_code: 'cmm',
    type: 'Instantânea',
    rarity: 'Rara',
    price: 'R$ 240,00',
    color: 'Azul',
    mana_cost: '{2}{U}',
    slug: 'fierce-guardianship',
    image_url: 'https://cards.scryfall.io/normal/front/f/7/f7f3dd95-bd14-4e0f-a388-444f9cf1b0dc.jpg?1783915698',
    formats: ['Commander'],
  },
  {
    id: 'cmd-7',
    name: 'Arcane Signet',
    set: 'Commander Masters',
    set_code: 'cmm',
    type: 'Artefato',
    rarity: 'Comum',
    price: 'R$ 8,50',
    color: 'Incolor',
    mana_cost: '{2}',
    slug: 'arcane-signet',
    image_url: 'https://cards.scryfall.io/normal/front/c/6/c6b6117c-faab-4bbb-b851-07bd8061ef03.jpg?1789644435',
    formats: ['Commander', 'Draft'],
  },
  {
    id: 'cmd-8',
    name: 'Atraxa, Grand Unifier',
    set: 'Phyrexia: All Will Be One',
    set_code: 'one',
    type: 'Criatura Lendária — Phyrexian Angel',
    rarity: 'Mítica',
    price: 'R$ 98,00',
    color: 'Multicor',
    mana_cost: '{3}{G}{W}{U}{B}',
    slug: 'atraxa-grand-unifier',
    image_url: 'https://cards.scryfall.io/normal/front/4/a/4a1f905f-1d55-4d02-9d24-e58070793d3f.jpg',
    formats: ['Commander', 'Standard', 'Pioneer', 'Modern', 'Legacy'],
    isLegendary: true,
  },
  {
    id: 'cmd-9',
    name: 'Esper Sentinel',
    set: 'Modern Horizons 2',
    set_code: 'mh2',
    type: 'Criatura — Human Soldier',
    rarity: 'Rara',
    price: 'R$ 160,00',
    color: 'Branco',
    mana_cost: '{W}',
    slug: 'esper-sentinel',
    image_url: 'https://cards.scryfall.io/normal/front/f/3/f3537373-ef54-4578-9d05-6216420ee349.jpg',
    formats: ['Commander', 'Modern', 'Legacy'],
  },
  {
    id: 'cmd-10',
    name: 'The Great Henge',
    set: 'Commander Masters',
    set_code: 'cmm',
    type: 'Artefato Lendário',
    rarity: 'Mítica',
    price: 'R$ 260,00',
    color: 'Verde',
    mana_cost: '{7}{G}{G}',
    slug: 'the-great-henge',
    image_url: 'https://cards.scryfall.io/normal/front/6/3/6340e0f3-7f9c-4d71-8daf-e1be5505eb5b.jpg',
    formats: ['Commander', 'Modern'],
    isLegendary: true,
  },
  {
    id: 'cmd-11',
    name: 'Dockside Extortionist',
    set: 'Double Masters 2022',
    set_code: '2x2',
    type: 'Criatura — Goblin Pirate',
    rarity: 'Mítica',
    price: 'R$ 380,00',
    color: 'Vermelho',
    mana_cost: '{1}{R}',
    slug: 'dockside-extortionist',
    image_url: 'https://cards.scryfall.io/normal/front/9/e/9e2e3efb-75cb-430f-b9f4-cb58f3aeb91b.jpg',
    formats: ['Commander', 'Legacy'],
  },
  {
    id: 'cmd-12',
    name: 'Heroic Intervention',
    set: 'Commander Masters',
    set_code: 'cmm',
    type: 'Instantânea',
    rarity: 'Rara',
    price: 'R$ 55,00',
    color: 'Verde',
    mana_cost: '{1}{G}',
    slug: 'heroic-intervention',
    image_url: 'https://cards.scryfall.io/normal/front/e/3/e32c67d1-187f-40df-b3b3-6036f5c92834.jpg?1783915629',
    formats: ['Commander', 'Pioneer', 'Modern'],
  },

  // MODERN STAPLES
  {
    id: 'mod-1',
    name: 'Lightning Bolt',
    set: 'Modern Horizons',
    set_code: 'mh1',
    type: 'Instantânea',
    rarity: 'Incomum',
    price: 'R$ 18,90',
    color: 'Vermelho',
    mana_cost: '{R}',
    slug: 'lightning-bolt',
    image_url: 'https://cards.scryfall.io/normal/front/e/3/e3285e6b-3e79-4d7c-bf96-d920f973b122.jpg',
    formats: ['Modern', 'Commander', 'Legacy', 'Draft'],
  },
  {
    id: 'mod-2',
    name: 'Orcish Bowmasters',
    set: 'Tales of Middle-earth',
    set_code: 'ltr',
    type: 'Criatura — Orc Archer',
    rarity: 'Rara',
    price: 'R$ 96,50',
    color: 'Preto',
    mana_cost: '{1}{B}',
    slug: 'orcish-bowmasters',
    image_url: 'https://cards.scryfall.io/normal/front/7/c/7c024bae-5631-4e20-ac69-df392ac9e109.jpg?1783916299',
    formats: ['Modern', 'Commander', 'Legacy'],
  },
  {
    id: 'mod-3',
    name: 'Ragavan, Nimble Pilferer',
    set: 'Modern Horizons 2',
    set_code: 'mh2',
    type: 'Criatura Lendária — Monkey Pirate',
    rarity: 'Mítica',
    price: 'R$ 230,00',
    color: 'Vermelho',
    mana_cost: '{R}',
    slug: 'ragavan-nimble-pilferer',
    image_url: 'https://cards.scryfall.io/normal/front/a/9/a9738cda-adb1-47fb-9f4c-ecd930228c4d.jpg',
    formats: ['Modern', 'Commander', 'Legacy'],
    isLegendary: true,
  },
  {
    id: 'mod-4',
    name: "Urza's Saga",
    set: 'Modern Horizons 2',
    set_code: 'mh2',
    type: 'Terreno — Urza’s Saga',
    rarity: 'Rara',
    price: 'R$ 195,00',
    color: 'Incolor',
    mana_cost: '',
    slug: 'urza-s-saga',
    image_url: 'https://cards.scryfall.io/normal/front/c/1/c1e0f201-42cb-46a1-901a-65bb4fc18f6c.jpg',
    formats: ['Modern', 'Commander', 'Legacy'],
  },
  {
    id: 'mod-5',
    name: 'Solitude',
    set: 'Modern Horizons 2',
    set_code: 'mh2',
    type: 'Criatura — Elemental Incarnation',
    rarity: 'Mítica',
    price: 'R$ 170,00',
    color: 'Branco',
    mana_cost: '{3}{W}{W}',
    slug: 'solitude',
    image_url: 'https://cards.scryfall.io/normal/front/4/7/47a6234f-309f-4e03-9263-66da48b57153.jpg',
    formats: ['Modern', 'Commander', 'Legacy'],
  },
  {
    id: 'mod-6',
    name: 'Force of Negation',
    set: 'Double Masters 2022',
    set_code: '2x2',
    type: 'Instantânea',
    rarity: 'Rara',
    price: 'R$ 190,00',
    color: 'Azul',
    mana_cost: '{1}{U}{U}',
    slug: 'force-of-negation',
    image_url: 'https://cards.scryfall.io/normal/front/1/8/1825a719-1b2a-4af9-9cd2-7cb497cd0317.jpg',
    formats: ['Modern', 'Commander', 'Legacy'],
  },
  {
    id: 'mod-7',
    name: 'Thoughtseize',
    set: 'Time Spiral Remastered',
    set_code: 'tsr',
    type: 'Feitiço',
    rarity: 'Rara',
    price: 'R$ 85,00',
    color: 'Preto',
    mana_cost: '{B}',
    slug: 'thoughtseize',
    image_url: 'https://cards.scryfall.io/normal/front/b/2/b281a308-ab6b-47b6-bec7-632c9aaecede.jpg',
    formats: ['Modern', 'Pioneer', 'Legacy', 'Commander'],
  },
  {
    id: 'mod-8',
    name: 'Misty Rainforest',
    set: 'Modern Horizons 2',
    set_code: 'mh2',
    type: 'Terreno',
    rarity: 'Rara',
    price: 'R$ 115,00',
    color: 'Incolor',
    mana_cost: '',
    slug: 'misty-rainforest',
    image_url: 'https://cards.scryfall.io/normal/front/8/8/88231c0d-0cc8-44ec-bf95-81d1710ac141.jpg',
    formats: ['Modern', 'Commander', 'Legacy'],
  },

  // STANDARD STAPLES
  {
    id: 'std-1',
    name: 'Sheoldred, the Apocalypse',
    set: 'Dominaria United',
    set_code: 'dmu',
    type: 'Criatura Lendária — Phyrexian Praetor',
    rarity: 'Mítica',
    price: 'R$ 340,00',
    color: 'Preto',
    mana_cost: '{2}{B}{B}',
    slug: 'sheoldred-the-apocalypse',
    image_url: 'https://cards.scryfall.io/normal/front/d/6/d67be074-cdd4-41d9-ac89-0a0456c4e4b2.jpg',
    formats: ['Standard', 'Pioneer', 'Commander'],
    isLegendary: true,
  },
  {
    id: 'std-2',
    name: 'Preacher of the Schism',
    set: 'Lost Caverns of Ixalan',
    set_code: 'lci',
    type: 'Criatura — Vampire Cleric',
    rarity: 'Rara',
    price: 'R$ 38,00',
    color: 'Preto',
    mana_cost: '{2}{B}',
    slug: 'preacher-of-the-schism',
    image_url: 'https://cards.scryfall.io/normal/front/8/9/89345f55-2b32-4356-945a-d56dded39909.jpg?1783913774',
    formats: ['Standard', 'Pioneer'],
  },
  {
    id: 'std-3',
    name: 'Cut Down',
    set: 'Dominaria United',
    set_code: 'dmu',
    type: 'Instantânea',
    rarity: 'Incomum',
    price: 'R$ 9,50',
    color: 'Preto',
    mana_cost: '{B}',
    slug: 'cut-down',
    image_url: 'https://cards.scryfall.io/normal/front/7/5/753db072-5d6a-4f37-8f7d-255572ecd3bd.jpg?1783921335',
    formats: ['Standard', 'Pioneer'],
  },
  {
    id: 'std-4',
    name: 'Monastery Swiftspear',
    set: 'The Brothers’ War',
    set_code: 'bro',
    type: 'Criatura — Human Monk',
    rarity: 'Incomum',
    price: 'R$ 8,00',
    color: 'Vermelho',
    mana_cost: '{R}',
    slug: 'monastery-swiftspear',
    image_url: 'https://cards.scryfall.io/normal/front/d/6/d6bfa227-4309-40ed-952c-279595eab17e.jpg?1783920066',
    formats: ['Standard', 'Pioneer', 'Modern', 'Draft'],
  },
  {
    id: 'std-5',
    name: 'Cavern of Souls',
    set: 'Lost Caverns of Ixalan',
    set_code: 'lci',
    type: 'Terreno',
    rarity: 'Mítica',
    price: 'R$ 195,00',
    color: 'Incolor',
    mana_cost: '',
    slug: 'cavern-of-souls',
    image_url: 'https://cards.scryfall.io/normal/front/3/a/3aad15a2-8a1b-4460-9b06-e85863081878.jpg?1783913719',
    formats: ['Standard', 'Pioneer', 'Modern', 'Commander', 'Legacy'],
  },

  // PIONEER STAPLES
  {
    id: 'pio-1',
    name: 'Fable of the Mirror-Breaker',
    set: 'Kamigawa: Neon Dynasty',
    set_code: 'neo',
    type: 'Encantamento — Saga',
    rarity: 'Rara',
    price: 'R$ 95,00',
    color: 'Vermelho',
    mana_cost: '{2}{R}',
    slug: 'fable-of-the-mirror-breaker',
    image_url: 'https://cards.scryfall.io/normal/front/2/4/24c0d87b-0049-4beb-b9cb-6f813b7aa7dc.jpg',
    formats: ['Pioneer', 'Modern', 'Commander'],
  },
  {
    id: 'pio-2',
    name: 'Fatal Push',
    set: 'Double Masters',
    set_code: '2xm',
    type: 'Instantânea',
    rarity: 'Incomum',
    price: 'R$ 22,00',
    color: 'Preto',
    mana_cost: '{B}',
    slug: 'fatal-push',
    image_url: 'https://cards.scryfall.io/normal/front/6/e/6e9d8fe4-fd9b-4923-92bf-7dd6b8fa02e7.jpg?1783930180',
    formats: ['Pioneer', 'Modern', 'Commander'],
  },
  {
    id: 'pio-3',
    name: 'Treasure Cruise',
    set: 'Ultimate Masters',
    set_code: 'uma',
    type: 'Feitiço',
    rarity: 'Comum',
    price: 'R$ 6,50',
    color: 'Azul',
    mana_cost: '{7}{U}',
    slug: 'treasure-cruise',
    image_url: 'https://cards.scryfall.io/normal/front/4/2/42c45880-15c7-4259-8066-c04d031d8216.jpg?1783903788',
    formats: ['Pioneer', 'Commander'],
  },
  {
    id: 'pio-4',
    name: 'Nykthos, Shrine to Nyx',
    set: 'Theros',
    set_code: 'ths',
    type: 'Terreno Lendário',
    rarity: 'Rara',
    price: 'R$ 180,00',
    color: 'Incolor',
    mana_cost: '',
    slug: 'nykthos-shrine-to-nyx',
    image_url: 'https://cards.scryfall.io/normal/front/8/3/834b27a0-dfd7-4f96-8cde-cacac4b24acc.jpg',
    formats: ['Pioneer', 'Commander'],
    isLegendary: true,
  },

  // LEGACY STAPLES
  {
    id: 'leg-1',
    name: 'Force of Will',
    set: 'Dominaria Remastered',
    set_code: 'dmr',
    type: 'Instantânea',
    rarity: 'Mítica',
    price: 'R$ 380,00',
    color: 'Azul',
    mana_cost: '{3}{U}{U}',
    slug: 'force-of-will',
    image_url: 'https://cards.scryfall.io/normal/front/8/9/89f612d6-7c59-4a7b-a87d-45f789e88ba5.jpg',
    formats: ['Legacy', 'Commander'],
  },
  {
    id: 'leg-2',
    name: 'Brainstorm',
    set: 'Mystical Archive',
    set_code: 'sta',
    type: 'Instantânea',
    rarity: 'Rara',
    price: 'R$ 12,00',
    color: 'Azul',
    mana_cost: '{U}',
    slug: 'brainstorm',
    image_url: 'https://cards.scryfall.io/normal/front/4/8/48070245-1370-4cf1-be15-d4e8a8b92ba8.jpg',
    formats: ['Legacy', 'Commander', 'Draft'],
  },
  {
    id: 'leg-3',
    name: 'Swords to Plowshares',
    set: 'The List',
    set_code: 'plist',
    type: 'Instantânea',
    rarity: 'Incomum',
    price: 'R$ 24,50',
    color: 'Branco',
    mana_cost: '{W}',
    slug: 'swords-to-plowshares',
    image_url: 'https://cards.scryfall.io/normal/front/f/7/f7e12477-d59f-442b-a678-1be746d0b7be.jpg?1789599810',
    formats: ['Legacy', 'Commander', 'Draft'],
  },
  {
    id: 'leg-4',
    name: 'Wasteland',
    set: 'Eternal Masters',
    set_code: 'ema',
    type: 'Terreno',
    rarity: 'Rara',
    price: 'R$ 160,00',
    color: 'Incolor',
    mana_cost: '',
    slug: 'wasteland',
    image_url: 'https://cards.scryfall.io/normal/front/a/a/aaafb9bc-7cea-4624-a227-595544fa42b0.jpg',
    formats: ['Legacy', 'Commander'],
  },
  // STANDARD & MULTI-FORMAT ADDITIONS
  {
    id: 'std-6',
    name: 'Sunfall',
    set: 'March of the Machine',
    set_code: 'mom',
    type: 'Feitiço',
    rarity: 'Rara',
    price: 'R$ 48,00',
    color: 'Branco',
    mana_cost: '{3}{W}{W}',
    slug: 'sunfall',
    image_url: 'https://cards.scryfall.io/normal/front/a/5/a560b9a7-4c00-4c0c-b63d-774d3f6b9aa9.jpg?1789611521',
    formats: ['Standard', 'Pioneer', 'Commander'],
  },
  {
    id: 'std-7',
    name: 'Deep-Cavern Bat',
    set: 'Lost Caverns of Ixalan',
    set_code: 'lci',
    type: 'Criatura — Bat',
    rarity: 'Incomum',
    price: 'R$ 14,00',
    color: 'Preto',
    mana_cost: '{1}{B}',
    slug: 'deep-cavern-bat',
    image_url: 'https://cards.scryfall.io/normal/front/6/9/69c68c95-b788-43b1-9f22-1b22c5a00b25.jpg?1783913780',
    formats: ['Standard', 'Pioneer'],
  },
  {
    id: 'std-8',
    name: 'Slickshot Show-Off',
    set: 'Outlaws of Thunder Junction',
    set_code: 'otj',
    type: 'Criatura — Bird Wizard',
    rarity: 'Rara',
    price: 'R$ 82,00',
    color: 'Vermelho',
    mana_cost: '{1}{R}',
    slug: 'slickshot-show-off',
    image_url: 'https://cards.scryfall.io/normal/front/7/0/7054012b-4f9d-44a0-aaf9-7fd3bddc7b2d.jpg',
    formats: ['Standard', 'Pioneer', 'Modern'],
  },
  {
    id: 'std-9',
    name: 'Three Steps Ahead',
    set: 'Outlaws of Thunder Junction',
    set_code: 'otj',
    type: 'Instantânea — Spree',
    rarity: 'Rara',
    price: 'R$ 35,00',
    color: 'Azul',
    mana_cost: '{U}{U}',
    slug: 'three-steps-ahead',
    image_url: 'https://cards.scryfall.io/normal/front/8/f/8fffd839-2337-4a14-9312-cee085a17f4b.jpg?1783911837',
    formats: ['Standard', 'Pioneer', 'Commander'],
  },
  {
    id: 'std-10',
    name: 'Llanowar Elves',
    set: 'Foundations',
    set_code: 'fdn',
    type: 'Criatura — Elf Druid',
    rarity: 'Comum',
    price: 'R$ 4,50',
    color: 'Verde',
    mana_cost: '{G}',
    slug: 'llanowar-elves',
    image_url: 'https://cards.scryfall.io/normal/front/8/b/8bbcfb77-daa1-4ce5-b5f9-48d0a8edbba9.jpg',
    formats: ['Standard', 'Pioneer', 'Modern', 'Commander', 'Legacy', 'Draft'],
  },
  // PIONEER & MODERN ADDITIONS
  {
    id: 'pio-5',
    name: 'The Wandering Emperor',
    set: 'Kamigawa: Neon Dynasty',
    set_code: 'neo',
    type: 'Planeswalker Lendário',
    rarity: 'Mítica',
    price: 'R$ 110,00',
    color: 'Branco',
    mana_cost: '{2}{W}{W}',
    slug: 'the-wandering-emperor',
    image_url: 'https://cards.scryfall.io/normal/front/f/a/fab2d8a9-ab4c-4225-a570-22636293c17d.jpg',
    formats: ['Pioneer', 'Modern', 'Commander'],
    isLegendary: true,
  },
  {
    id: 'pio-6',
    name: 'Bonecrusher Giant',
    set: 'Throne of Eldraine',
    set_code: 'eld',
    type: 'Criatura — Giant',
    rarity: 'Rara',
    price: 'R$ 16,00',
    color: 'Vermelho',
    mana_cost: '{2}{R}',
    slug: 'bonecrusher-giant',
    image_url: 'https://cards.scryfall.io/normal/front/b/5/b5b71cd2-de35-451f-b16e-2e3936169407.jpg',
    formats: ['Pioneer', 'Modern', 'Commander'],
  },
  {
    id: 'mod-9',
    name: 'Counterspell',
    set: 'Modern Horizons 2',
    set_code: 'mh2',
    type: 'Instantânea',
    rarity: 'Incomum',
    price: 'R$ 12,00',
    color: 'Azul',
    mana_cost: '{U}{U}',
    slug: 'counterspell',
    image_url: 'https://cards.scryfall.io/normal/front/4/f/4f616706-ec97-4923-bb1e-11a69fbaa1f8.jpg',
    formats: ['Modern', 'Commander', 'Legacy', 'Draft'],
  },
  {
    id: 'mod-10',
    name: 'Murktide Regent',
    set: 'Modern Horizons 2',
    set_code: 'mh2',
    type: 'Criatura — Dragon',
    rarity: 'Mítica',
    price: 'R$ 95,00',
    color: 'Azul',
    mana_cost: '{5}{U}{U}',
    slug: 'murktide-regent',
    image_url: 'https://cards.scryfall.io/normal/front/2/0/20c4aae1-7665-4df7-bd51-a1d95bf8a17d.jpg?1783926875',
    formats: ['Modern', 'Legacy'],
  },
  // LEGACY & DRAFT ADDITIONS
  {
    id: 'leg-5',
    name: 'Lotus Petal',
    set: 'Tempest Remastered',
    set_code: 'tpr',
    type: 'Artefato',
    rarity: 'Comum',
    price: 'R$ 85,00',
    color: 'Incolor',
    mana_cost: '{0}',
    slug: 'lotus-petal',
    image_url: 'https://cards.scryfall.io/normal/front/f/8/f85ab5f9-508e-45de-8fa1-ce1f16552ffc.jpg?1783938446',
    formats: ['Legacy', 'Commander'],
  },
  {
    id: 'leg-6',
    name: 'Dark Ritual',
    set: 'Masters 25',
    set_code: 'a25',
    type: 'Instantânea',
    rarity: 'Comum',
    price: 'R$ 15,00',
    color: 'Preto',
    mana_cost: '{B}',
    slug: 'dark-ritual',
    image_url: 'https://cards.scryfall.io/normal/front/9/5/95f27eeb-6f14-4db3-adb9-9be5ed76b34b.jpg',
    formats: ['Legacy', 'Commander', 'Draft'],
  },
  {
    id: 'dft-1',
    name: 'Giant Growth',
    set: 'Foundations',
    set_code: 'fdn',
    type: 'Instantânea',
    rarity: 'Comum',
    price: 'R$ 1,50',
    color: 'Verde',
    mana_cost: '{G}',
    slug: 'giant-growth',
    image_url: 'https://cards.scryfall.io/normal/front/f/d/fd1f95bf-48ea-455a-8a6c-0249b11c8900.jpg?1783902918',
    formats: ['Draft', 'Standard', 'Pioneer', 'Commander'],
  },
  {
    id: 'dft-2',
    name: 'Murder',
    set: 'Foundations',
    set_code: 'fdn',
    type: 'Instantânea',
    rarity: 'Comum',
    price: 'R$ 2,00',
    color: 'Preto',
    mana_cost: '{1}{B}{B}',
    slug: 'murder',
    image_url: 'https://cards.scryfall.io/normal/front/2/c/2c249609-9cf7-46f1-b94c-9329add966bb.jpg?1783909477',
    formats: ['Draft', 'Standard', 'Pioneer', 'Commander'],
  },
];

const catalogCards = [
  {
    id: '1',
    name: 'Sol Ring',
    set: 'Commander Masters',
    type: 'Artefato',
    rarity: 'Rara',
    price: 'R$ 42,00',
    color: 'Incolor',
    inCollection: true,
    inWishlist: false,
    art: 'gold',
    slug: 'sol-ring',
    image_url: 'https://cards.scryfall.io/normal/front/f/9/f9a32f17-49c4-4654-a087-1ba474f37377.jpg',
    set_code: 'cmm',
    prints: [
      { set_code: 'cmm', set_name: 'Commander Masters', rarity: 'rare', image_url: 'https://cards.scryfall.io/normal/front/f/9/f9a32f17-49c4-4654-a087-1ba474f37377.jpg', price: 'R$ 42,00' },
      { set_code: 'fdc', set_name: 'Foundations Commander', rarity: 'uncommon', image_url: 'https://cards.scryfall.io/normal/front/4/f/4f152dd9-2b35-45b2-90fe-8c71d0634226.jpg', price: 'R$ 15,00' },
      { set_code: 'sld', set_name: 'Secret Lair Drop', rarity: 'rare', image_url: 'https://cards.scryfall.io/normal/front/b/f/bf6b187e-5ad0-4731-9c39-638451ac1e30.jpg', price: 'R$ 120,00' },
    ],
  },
  {
    id: '2',
    name: 'Rhystic Study',
    set: 'Jumpstart 2022',
    type: 'Encantamento',
    rarity: 'Rara',
    price: 'R$ 184,90',
    color: 'Azul',
    inCollection: false,
    inWishlist: true,
    art: 'blue',
    slug: 'rhystic-study',
    image_url: 'https://cards.scryfall.io/normal/front/9/f/9f37c5b6-a59c-45cd-9a99-e9357fe9ea1b.jpg',
    set_code: 'j22',
    prints: [
      { set_code: 'j22', set_name: 'Jumpstart 2022', rarity: 'rare', image_url: 'https://cards.scryfall.io/normal/front/9/f/9f37c5b6-a59c-45cd-9a99-e9357fe9ea1b.jpg', price: 'R$ 184,90' },
      { set_code: 'wot', set_name: 'Wilds of Eldraine', rarity: 'mythic', image_url: 'https://cards.scryfall.io/normal/front/8/f/8f7f8d7a-e5ad-4c03-8ab3-e9af9c2927b7.jpg', price: 'R$ 210,00' },
      { set_code: 'pcy', set_name: 'Prophecy', rarity: 'common', image_url: 'https://cards.scryfall.io/normal/front/3/3/3394cefd-a3c6-4917-8f46-234e441ecfb6.jpg', price: 'R$ 170,00' },
    ],
  },
  {
    id: '3',
    name: 'Lightning Bolt',
    set: 'Modern Horizons',
    type: 'Instantânea',
    rarity: 'Incomum',
    price: 'R$ 18,90',
    color: 'Vermelho',
    inCollection: true,
    inWishlist: false,
    art: 'red',
    slug: 'lightning-bolt',
    image_url: 'https://cards.scryfall.io/normal/front/e/3/e3285e6b-3e79-4d7c-bf96-d920f973b122.jpg',
    set_code: 'mh1',
    prints: [
      { set_code: 'mh1', set_name: 'Modern Horizons', rarity: 'uncommon', image_url: 'https://cards.scryfall.io/normal/front/e/3/e3285e6b-3e79-4d7c-bf96-d920f973b122.jpg', price: 'R$ 18,90' },
      { set_code: 'sta', set_name: 'Mystical Archive', rarity: 'rare', image_url: 'https://cards.scryfall.io/normal/front/4/e/4eaac4fd-95f5-4f38-b593-0101e79a20f9.jpg?1783927429', price: 'R$ 35,00' },
    ],
  },
  {
    id: '4',
    name: 'Swords to Plowshares',
    set: 'The List',
    type: 'Instantânea',
    rarity: 'Incomum',
    price: 'R$ 24,50',
    color: 'Branco',
    inCollection: true,
    inWishlist: false,
    art: 'cream',
    slug: 'swords-to-plowshares',
    image_url: 'https://cards.scryfall.io/normal/front/f/7/f7e12477-d59f-442b-a678-1be746d0b7be.jpg?1789599810',
    set_code: 'plist',
    prints: [
      { set_code: 'plist', set_name: 'The List', rarity: 'uncommon', image_url: 'https://cards.scryfall.io/normal/front/f/7/f7e12477-d59f-442b-a678-1be746d0b7be.jpg?1789599810', price: 'R$ 24,50' },
      { set_code: 'sta', set_name: 'Mystical Archive', rarity: 'rare', image_url: 'https://cards.scryfall.io/normal/front/c/c/cc9ece2f-7eda-4fc5-a562-3e16e71560e9.jpg?1783927441', price: 'R$ 40,00' },
    ],
  },
  {
    id: '5',
    name: 'Orcish Bowmasters',
    set: 'Tales of Middle-earth',
    type: 'Criatura',
    rarity: 'Rara',
    price: 'R$ 96,50',
    color: 'Preto',
    inCollection: false,
    inWishlist: true,
    art: 'purple',
    slug: 'orcish-bowmasters',
    image_url: 'https://cards.scryfall.io/normal/front/7/c/7c024bae-5631-4e20-ac69-df392ac9e109.jpg?1783916299',
    set_code: 'ltr',
    prints: [
      { set_code: 'ltr', set_name: 'Tales of Middle-earth', rarity: 'rare', image_url: 'https://cards.scryfall.io/normal/front/7/c/7c024bae-5631-4e20-ac69-df392ac9e109.jpg?1783916299', price: 'R$ 96,50' },
      { set_code: 'ltr-alt', set_name: 'Poster Art Promo', rarity: 'mythic', image_url: 'https://cards.scryfall.io/normal/front/7/c/7c024bae-5631-4e20-ac69-df392ac9e109.jpg?1783916299', price: 'R$ 150,00' },
    ],
  },
];

const findCardFallback = (slug: string) => {
  const c = catalogCards.find((item) => item.slug === slug);
  if (c) return c;
  const s = FORMAT_STAPLES.find((item) => item.slug === slug);
  if (s) {
    return {
      id: s.id,
      name: s.name,
      set: s.set,
      type: s.type,
      rarity: s.rarity,
      price: s.price,
      color: s.color,
      inCollection: false,
      inWishlist: false,
      art: 'gold',
      slug: s.slug,
      image_url: s.image_url,
      set_code: s.set_code,
      mana_cost: s.mana_cost,
      type_line: s.type,
      oracle_text: `Regras e texto oficial para ${s.name}. Formato(s) principais: ${s.formats.join(', ')}.`,
      prints: [
        {
          set_code: s.set_code,
          set_name: s.set,
          rarity: s.rarity.toLowerCase(),
          image_url: s.image_url,
          price: s.price,
        },
      ],
    };
  }
  return undefined;
};

function SafeCardImage({ src, alt, name, className }: { src: string; alt: string; name: string; className?: string }) {
  const [imgSrc, setImgSrc] = useState(src);
  const [hasError, setHasError] = useState(false);

  useEffect(() => {
    setImgSrc(src);
    setHasError(false);
  }, [src]);

  const handleError = () => {
    const apiFallback = `https://api.scryfall.com/cards/named?exact=${encodeURIComponent(name)}&format=image&version=normal`;
    if (imgSrc !== apiFallback) {
      setImgSrc(apiFallback);
    } else {
      setHasError(true);
    }
  };

  if (hasError || !imgSrc) {
    return (
      <div className="w-full h-full flex flex-col items-center justify-center p-4 bg-neutral-900 text-neutral-400 text-center select-none border border-black/10">
        <span className="text-2xl mb-1">🃏</span>
        <span className="text-[10px] font-bold truncate max-w-full">{name}</span>
      </div>
    );
  }

  return (
    <img
      src={imgSrc}
      alt={alt}
      loading="lazy"
      className={className || "w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"}
      onError={handleError}
    />
  );
}

export function BuscarCartasPage({
  initialQuery = '',
  cardSlug = '',
  onClearSelectedCard,
  onNavigate,
  onLogout,
  onSearch,
}: {
  initialQuery?: string;
  cardSlug?: string;
  onClearSelectedCard?: () => void;
  onNavigate?: (href: string) => void;
  onLogout?: () => void;
  onSearch?: (query: string) => void;
}) {
  const [selectedFormat, setSelectedFormat] = useState('Commander');
  const [searchQuery, setSearchQuery] = useState(initialQuery);
  const [colorFilter, setColorFilter] = useState('Todas');
  const [typeFilter, setTypeFilter] = useState('Todos');
  const [rarityFilter, setRarityFilter] = useState('Todas');

  // Inicialização limpa: os dados reais serão carregados dinamicamente da API do Supabase
  const [collectionSlugs, setCollectionSlugs] = useState<Set<string>>(new Set());
  const [wishlistSlugs, setWishlistSlugs] = useState<Set<string>>(new Set());

  const [staplesPage, setStaplesPage] = useState(1);
  const STAPLES_PER_PAGE = 12;
  const [toastMessage, setToastMessage] = useState<string | null>(null);
  const [loading] = useState(false);

  const [suggestions, setSuggestions] = useState<CardSuggestion[]>([]);
  const [showDropdown, setShowDropdown] = useState(false);
  const [loadingSuggestions, setLoadingSuggestions] = useState(false);
  const [selectedCard, setSelectedCard] = useState<CardDetail | null>(null);
  const [loadingDetails, setLoadingDetails] = useState(false);

  const [activePrintIndex, setActivePrintIndex] = useState<number>(0);
  const [hoveredPrint, setHoveredPrint] = useState<CardPrint | null>(null);

  const [hoveredCard, setHoveredCard] = useState<CardSuggestion | null>(null);
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });

  const searchContainerRef = useRef<HTMLDivElement>(null);

  // Carregar a coleção real do usuário autenticado no Supabase ao montar a página
  useEffect(() => {
    async function fetchUserCollection() {
      const token = localStorage.getItem('spellbinder_token');
      try {
        const response = await fetch('http://localhost:3333/api/collection', {
          headers: {
            ...(token ? { Authorization: `Bearer ${token}` } : {}),
          },
        });
        if (response.ok) {
          const data = await response.json();
          const slugs = new Set<string>();
          data.forEach((item: any) => {
            const rawName = item.name || item.scryfall_cards_cache?.name;
            if (rawName) {
              const cardSlug = rawName.toLowerCase().replace(/[^a-z0-9]+/g, '-');
              slugs.add(cardSlug);
              slugs.add(rawName.toLowerCase().trim());
            }
            if (item.card_scryfall_id) slugs.add(String(item.card_scryfall_id));
            if (item.scryfall_id) slugs.add(String(item.scryfall_id));
          });
          setCollectionSlugs(slugs);
        }
      } catch (err) {
        console.error('Erro ao carregar coleção do servidor:', err);
      }
    }

    fetchUserCollection();
  }, []);

  useEffect(() => {
    setStaplesPage(1);
  }, [selectedFormat, colorFilter, typeFilter, rarityFilter, searchQuery]);

  useEffect(() => {
    const handleFormatChange = (e: any) => {
      if (e?.detail) {
        setSelectedFormat(e.detail);
      }
    };
    window.addEventListener('mtg-format-change', handleFormatChange);
    return () => {
      window.removeEventListener('mtg-format-change', handleFormatChange);
    };
  }, []);

  useEffect(() => {
    if (cardSlug) {
      handleSelectCardBySlug(cardSlug);
    }
  }, [cardSlug]);

  useEffect(() => {
    const checkUrlForCard = () => {
      const params = new URLSearchParams(window.location.search);
      const urlSlug = params.get('card');
      if (urlSlug) {
        handleSelectCardBySlug(urlSlug);
      } else if (!cardSlug) {
        setSelectedCard(null);
      }
    };

    checkUrlForCard();
    window.addEventListener('popstate', checkUrlForCard);
    return () => window.removeEventListener('popstate', checkUrlForCard);
  }, []);

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (searchContainerRef.current && !searchContainerRef.current.contains(event.target as Node)) {
        setShowDropdown(false);
        setHoveredCard(null);
      }
    }

    function handleKeyDown(event: KeyboardEvent) {
      if (event.key === 'Escape') {
        setShowDropdown(false);
        setHoveredCard(null);
      }
    }

    document.addEventListener('mousedown', handleClickOutside);
    document.addEventListener('keydown', handleKeyDown);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
      document.removeEventListener('keydown', handleKeyDown);
    };
  }, []);

  useEffect(() => {
    const timer = setTimeout(async () => {
      if (!searchQuery || searchQuery.trim().length < 2) {
        setSuggestions([]);
        setShowDropdown(false);
        setHoveredCard(null);
        return;
      }

      setLoadingSuggestions(true);
      try {
        const res = await fetch(`/api/cards/search?q=${encodeURIComponent(searchQuery.trim())}`);
        if (res.ok) {
          const data = await res.json();
          setSuggestions(data);
          setShowDropdown(true);
        } else {
          setSuggestions([]);
        }
      } catch (err) {
        console.error('Erro ao buscar sugestões:', err);
        setSuggestions([]);
      } finally {
        setLoadingSuggestions(false);
      }
    }, 300);

    return () => clearTimeout(timer);
  }, [searchQuery]);

  const handleMouseMove = (e: React.MouseEvent) => {
    const previewWidth = 240;
    const previewHeight = 340;

    let posX = e.clientX + 20;
    if (posX + previewWidth > window.innerWidth - 10) {
      posX = Math.max(10, e.clientX - previewWidth - 20);
    }

    let posY = e.clientY - 140;
    posY = Math.max(10, Math.min(window.innerHeight - previewHeight - 10, posY));

    setMousePosition({ x: posX, y: posY });
  };

  const handleSelectCardBySlug = async (slug: string) => {
    if (!slug) return;
    setShowDropdown(false);
    setHoveredCard(null);
    setSearchQuery('');
    setLoadingDetails(true);
    setActivePrintIndex(0);
    setHoveredPrint(null);

    if (window.location.search !== `?card=${slug}`) {
      window.history.pushState({}, '', `/buscar-cartas?card=${slug}`);
    }

    try {
      const res = await fetch(`/api/cards/${slug}`);
      if (res.ok) {
        const data = await res.json();
        if (!data.prints || data.prints.length === 0) {
          const found = findCardFallback(slug);
          data.prints = found?.prints || [
            { set_code: data.set_code || 'cmm', set_name: data.set_name || data.set || 'Commander Masters', rarity: data.rarity || 'rare', image_url: data.image_url, price: data.price },
          ];
        }
        setSelectedCard(data);
      } else {
        const found = findCardFallback(slug);
        if (found) {
          setSelectedCard({
            ...found,
            mana_cost: (found as any).mana_cost || '{4}{U}{R}',
            type_line: found.type,
            oracle_text: (found as any).oracle_text || 'Texto do efeito da carta carregado com sucesso.',
            prints: found.prints,
          });
        } else {
          setToastMessage('Não foi possível carregar os detalhes da carta.');
        }
      }
    } catch (err) {
      console.error('Erro ao carregar detalhes:', err);
      const found = findCardFallback(slug);
      if (found) {
        setSelectedCard({
          ...found,
          mana_cost: (found as any).mana_cost || '{4}{U}{R}',
          type_line: found.type,
          oracle_text: (found as any).oracle_text || 'Texto do efeito da carta carregado com sucesso.',
          prints: found.prints,
        });
      } else {
        setToastMessage('Erro de conexão ao buscar detalhes.');
      }
    } finally {
      setLoadingDetails(false);
    }
  };

  const handleBackToList = () => {
    setSelectedCard(null);
    setActivePrintIndex(0);
    setHoveredPrint(null);
    window.history.pushState({}, '', '/buscar-cartas');
    if (onClearSelectedCard) {
      onClearSelectedCard();
    }
  };

  const getRarityLabel = (rarity?: string) => {
    if (!rarity) return 'Comum';
    const map: Record<string, string> = {
      common: 'Comum',
      uncommon: 'Incomum',
      rare: 'Rara',
      mythic: 'Mítica',
      special: 'Especial',
    };
    return map[rarity.toLowerCase()] || rarity;
  };

  const renderOracleText = (text?: string | null) => {
    if (!text) return 'Esta carta não possui texto de regras impresso.';
    const parts = text.split(/(\{[^}]+\})/g);

    return parts.map((part, index) => {
      const match = part.match(/^\{([^}]+)\}$/);
      if (match) {
        const code = match[1].toUpperCase();
        const svgUrl = `https://svgs.scryfall.io/card-symbols/${code}.svg`;

        return (
          <img
            key={index}
            src={svgUrl}
            alt={part}
            title={part}
            className="w-3.5 h-3.5 inline-block align-middle mx-0.5 drop-shadow-xs"
            onError={(e) => {
              (e.target as HTMLElement).replaceWith(document.createTextNode(part));
            }}
          />
        );
      }
      return <span key={index}>{part}</span>;
    });
  };

  const renderManaCost = (manaCostString?: string | null) => {
    if (!manaCostString) return <span>Sem custo impresso</span>;
    const symbols = manaCostString.match(/\{([^}]+)\}/g);
    if (!symbols) return <span>{manaCostString}</span>;

    return (
      <span className="inline-flex items-center gap-1 flex-wrap">
        {symbols.map((sym, index) => {
          const code = sym.replace(/[{}]/g, '').toLowerCase();
          const svgUrl = `https://svgs.scryfall.io/card-symbols/${code.toUpperCase()}.svg`;

          return (
            <img
              key={index}
              src={svgUrl}
              alt={sym}
              title={sym}
              className="w-4 h-4 inline-block align-middle drop-shadow-xs"
              onError={(e) => {
                (e.target as HTMLElement).replaceWith(document.createTextNode(sym));
              }}
            />
          );
        })}
      </span>
    );
  };

  const getFormattedPrice = (card: CardDetail) => {
    if (card.prices?.brl) return `R$ ${card.prices.brl}`;
    if (card.prices?.usd) {
      const usdVal = parseFloat(card.prices.usd);
      if (!isNaN(usdVal)) {
        const approxBrl = (usdVal * 5.7).toFixed(2).replace('.', ',');
        return `R$ ${approxBrl} ($ ${card.prices.usd})`;
      }
      return `$ ${card.prices.usd}`;
    }
    return card.price || 'R$ 25,00';
  };

  const handleToggleCollection = async (
    optionsOrName: string | {
      name: string;
      slug?: string;
      scryfallId?: string | number;
      setCode?: string;
      setName?: string;
      imageUrl?: string;
      collectorNumber?: string;
    },
    cardIdArg?: string | number,
    cardSlugArg?: string
  ) => {
    let cardName: string;
    let cardSlug: string;
    let scryfallId: string | number | undefined;
    let setCode: string | undefined;
    let setName: string | undefined;
    let imageUrl: string | undefined;
    let collectorNumber: string | undefined;

    if (typeof optionsOrName === 'string') {
      cardName = optionsOrName;
      cardSlug = cardSlugArg || String(cardIdArg || '').toLowerCase().replace(/[^a-z0-9]+/g, '-');
      scryfallId = cardIdArg;
    } else {
      cardName = optionsOrName.name;
      cardSlug = optionsOrName.slug || cardName.toLowerCase().replace(/[^a-z0-9]+/g, '-');
      scryfallId = optionsOrName.scryfallId;
      setCode = optionsOrName.setCode;
      setName = optionsOrName.setName;
      imageUrl = optionsOrName.imageUrl;
      collectorNumber = optionsOrName.collectorNumber;
    }

    const nameKey = cardName.toLowerCase().trim();
    const token = localStorage.getItem('spellbinder_token');
    const isInCollection = Boolean(
      (scryfallId && collectionSlugs.has(String(scryfallId))) ||
      collectionSlugs.has(cardSlug) ||
      collectionSlugs.has(nameKey)
    );
    const method = isInCollection ? 'DELETE' : 'POST';

    try {
      const deleteIdentifier = scryfallId || cardSlug || cardName;
      const url = method === 'DELETE'
        ? `http://localhost:3333/api/collection/${encodeURIComponent(String(deleteIdentifier))}`
        : 'http://localhost:3333/api/collection';

      const response = await fetch(url, {
        method: method,
        headers: {
          'Content-Type': 'application/json',
          ...(token ? { Authorization: `Bearer ${token}` } : {}),
        },
        ...(method === 'POST' ? {
          body: JSON.stringify({
            scryfall_id: scryfallId,
            print_id: typeof scryfallId === 'string' ? scryfallId : undefined,
            slug: cardSlug,
            name: cardName,
            set_code: setCode,
            set_name: setName,
            image_url: imageUrl,
            collector_number: collectorNumber,
            quantity: 1,
          })
        } : {}),
      });

      if (response.ok) {
        setCollectionSlugs((prev) => {
          const newSet = new Set(prev);
          if (isInCollection) {
            newSet.delete(cardSlug);
            newSet.delete(nameKey);
            if (scryfallId) newSet.delete(String(scryfallId));
            setToastMessage(`"${cardName}" foi removida da sua coleção.`);
          } else {
            newSet.add(cardSlug);
            newSet.add(nameKey);
            if (scryfallId) newSet.add(String(scryfallId));
            setToastMessage(`"${cardName}" foi adicionada à sua coleção!`);
          }
          return newSet;
        });
      } else {
        const errorData = await response.json();
        console.error('Erro retornado pela API:', errorData);
        setToastMessage(`Erro: ${errorData.message || 'Erro ao atualizar a coleção'}`);
      }
    } catch (err) {
      console.error('Erro de conexão:', err);
      setToastMessage('Falha de conexão com o servidor.');
    }
  };

  const handleToggleWishlist = async (cardName: string, cardSlug: string) => {
    const token = localStorage.getItem('spellbinder_token');
    const isInWishlist = wishlistSlugs.has(cardSlug);
    const method = isInWishlist ? 'DELETE' : 'POST';

    try {
      const url = method === 'DELETE'
        ? `http://localhost:3333/api/collection/${cardSlug}`
        : 'http://localhost:3333/api/collection';

      const response = await fetch(url, {
        method: method,
        headers: {
          'Content-Type': 'application/json',
          ...(token ? { Authorization: `Bearer ${token}` } : {}),
        },
        ...(method === 'POST' ? {
          body: JSON.stringify({
            slug: cardSlug,
            name: cardName,
            set_code: 'wishlist',
            quantity: 1,
          })
        } : {}),
      });

      if (response.ok) {
        setWishlistSlugs((prev) => {
          const newSet = new Set(prev);
          if (isInWishlist) {
            newSet.delete(cardSlug);
            setToastMessage(`"${cardName}" foi removida da lista de desejos.`);
          } else {
            newSet.add(cardSlug);
            setToastMessage(`"${cardName}" foi adicionada à sua lista de desejos!`);
          }
          return newSet;
        });

        if (selectedCard) {
          setSelectedCard({ ...selectedCard, inWishlist: !isInWishlist } as any);
        }
      } else {
        setToastMessage('Erro ao atualizar a lista de desejos no servidor.');
      }
    } catch (err) {
      console.error('Erro de conexão com a API de wishlist:', err);
      setToastMessage('Falha de conexão com o servidor.');
    }
  };

  const formatStaplesFiltered = useMemo(() => {
    return FORMAT_STAPLES.filter((card) => {
      const matchesFormat = card.formats.some(
        (f) => f.toLowerCase() === selectedFormat.toLowerCase()
      );
      if (!matchesFormat) return false;

      if (colorFilter !== 'Todas') {
        if (card.color !== colorFilter) return false;
      }

      if (typeFilter !== 'Todos') {
        if (typeFilter === 'Lendárias') {
          if (!card.isLegendary && !card.type.toLowerCase().includes('lendár')) return false;
        } else {
          if (!card.type.toLowerCase().includes(typeFilter.toLowerCase())) return false;
        }
      }

      if (rarityFilter !== 'Todas') {
        if (card.rarity.toLowerCase() !== rarityFilter.toLowerCase()) return false;
      }

      if (searchQuery.trim().length > 0) {
        const q = searchQuery.toLowerCase().trim();
        const matchesName = card.name.toLowerCase().includes(q);
        const matchesType = card.type.toLowerCase().includes(q);
        if (!matchesName && !matchesType) return false;
      }

      return true;
    });
  }, [selectedFormat, colorFilter, typeFilter, rarityFilter, searchQuery]);

  const totalStaples = formatStaplesFiltered.length;
  const totalPages = Math.ceil(totalStaples / STAPLES_PER_PAGE) || 1;
  const paginatedStaples = useMemo(() => {
    const startIndex = (staplesPage - 1) * STAPLES_PER_PAGE;
    return formatStaplesFiltered.slice(startIndex, startIndex + STAPLES_PER_PAGE);
  }, [formatStaplesFiltered, staplesPage]);

  const activePrint: CardPrint = selectedCard?.prints && selectedCard.prints.length > 0
    ? selectedCard.prints[activePrintIndex] || selectedCard.prints[0]
    : {
      id: selectedCard?.scryfall_id || selectedCard?.id ? String(selectedCard.scryfall_id || selectedCard.id) : undefined,
      image_url: selectedCard?.image_url || '',
      set_name: selectedCard?.set_name || selectedCard?.set || 'Coleção Principal',
      set_code: selectedCard?.set_code || 'cmm',
      rarity: selectedCard?.rarity || 'common',
    };

  const displayedPrint = hoveredPrint || activePrint;

  const isCardInCollection = Boolean(
    (activePrint?.id && collectionSlugs.has(String(activePrint.id))) ||
    (selectedCard?.slug && collectionSlugs.has(selectedCard.slug)) ||
    (selectedCard?.name && (
      collectionSlugs.has(selectedCard.name.toLowerCase().trim()) ||
      collectionSlugs.has(selectedCard.name.toLowerCase().replace(/[^a-z0-9]+/g, '-'))
    ))
  );

  return (
    <main
      className="dashboard-shell min-h-screen relative flex flex-col justify-between overflow-x-hidden"
      style={{ backgroundColor: colors.light.background, color: colors.light['text-main'] }}
    >
      <section className="dashboard-content flex flex-col flex-1">
        <AppNav
          activeNav="/buscar-cartas"
          onNavigate={onNavigate}
          onLogout={onLogout}
          onSearch={onSearch}
          selectedFormat={selectedFormat}
          onFormatChange={setSelectedFormat}
        />

        <div className="collection-main max-w-[1500px] w-full mx-auto px-8 py-4 flex flex-col flex-1">
          <header className="mb-4">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-2">
              <div>
                <p
                  className="eyebrow text-[9px] font-black uppercase tracking-widest"
                  style={{ color: colors.light.bronze }}
                >
                  Catálogo Global MTG
                </p>
                <h1
                  className="text-2xl md:text-3xl font-black tracking-tight mt-0.5"
                  style={{ color: colors.light['text-main'] }}
                >
                  Pesquisar cartas
                </h1>
              </div>

              <div className="relative w-full md:w-96" ref={searchContainerRef}>
                <div
                  className="flex items-center gap-2.5 h-10 rounded-xl border px-3.5 shadow-sm relative z-20"
                  style={{
                    backgroundColor: colors.light.surface,
                    borderColor: colors.light.border,
                  }}
                >
                  <svg
                    className="w-4 h-4 shrink-0"
                    style={{ color: colors.light['text-faint'] }}
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                  >
                    <circle cx="10.8" cy="10.8" r="6.8" />
                    <path d="m16 16 4.5 4.5" />
                  </svg>
                  <input
                    type="text"
                    placeholder="Busque por nome na base global..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    onFocus={() => {
                      if (suggestions.length > 0) setShowDropdown(true);
                    }}
                    onKeyDown={(e) => {
                      if (e.key === 'Enter' && suggestions.length > 0) {
                        e.preventDefault();
                        handleSelectCardBySlug(suggestions[0].slug);
                      }
                    }}
                    className="w-full bg-transparent border-none outline-none text-xs"
                    style={{ color: colors.light['text-main'] }}
                  />
                  {loadingSuggestions && (
                    <div className="w-3.5 h-3.5 border-2 border-[#9b7130] border-t-transparent rounded-full animate-spin shrink-0" />
                  )}
                </div>

                {showDropdown && suggestions.length > 0 && (
                  <div
                    className="absolute top-12 left-0 w-full rounded-2xl border shadow-2xl z-50 overflow-hidden py-1.5"
                    style={{
                      backgroundColor: colors.light.surface,
                      borderColor: colors.light.border,
                    }}
                  >
                    <div className="px-4 py-1 text-[9px] uppercase font-black tracking-widest border-b" style={{ color: colors.light['text-faint'], borderColor: colors.light.border }}>
                      Cartas encontradas
                    </div>
                    <div className="max-h-[280px] overflow-y-auto">
                      {suggestions.map((item) => (
                        <button
                          key={item.id}
                          type="button"
                          onClick={() => handleSelectCardBySlug(item.slug)}
                          className="w-full text-left px-3 py-2 flex items-center justify-between transition-colors cursor-pointer hover:bg-black/5 dark:hover:bg-white/5 border-b border-black/5 last:border-none"
                        >
                          <div className="flex items-center gap-2.5">
                            <div className="w-8 h-11 shrink-0 rounded overflow-hidden shadow-xs border border-black/10">
                              <SafeCardImage
                                src={item.image_url || ''}
                                alt={item.name}
                                name={item.name}
                                className="w-full h-full object-cover transition-transform hover:scale-105"
                              />
                            </div>
                            <div>
                              <p className="text-xs font-black tracking-tight leading-snug" style={{ color: colors.light['text-main'] }}>{item.name}</p>
                              <p className="text-[10px] font-medium" style={{ color: colors.light['text-muted'] }}>{item.set}</p>
                            </div>
                          </div>
                          <span className="text-[9px] px-2 py-0.5 rounded-full font-black uppercase tracking-wider shrink-0" style={{ color: colors.light.bronze, backgroundColor: `${colors.light.bronze}1a` }}>
                            {getRarityLabel(item.rarity)}
                          </span>
                        </button>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            </div>

            {!selectedCard && (
              <div className="flex flex-col gap-3 mt-4 pt-3 border-t" style={{ borderColor: colors.light.border }}>
                <div className="flex flex-wrap items-center justify-between gap-3">
                  <div className="flex flex-wrap items-center gap-2">
                    <span className="text-[11px] font-black uppercase tracking-wider mr-1" style={{ color: colors.light['text-faint'] }}>
                      Cores de Mana:
                    </span>
                    <button
                      type="button"
                      onClick={() => setColorFilter('Todas')}
                      className={`px-3 py-1.5 rounded-full text-xs font-bold transition-all cursor-pointer border shadow-2xs ${colorFilter === 'Todas' ? 'shadow-xs scale-102 font-black' : 'opacity-70 hover:opacity-100 hover:bg-black/5'
                        }`}
                      style={{
                        backgroundColor: colorFilter === 'Todas' ? colors.light.dark : colors.light.surface,
                        color: colorFilter === 'Todas' ? '#ffffff' : colors.light['text-main'],
                        borderColor: colorFilter === 'Todas' ? colors.light.dark : colors.light.border,
                      }}
                    >
                      Todas
                    </button>

                    <div className="flex items-center gap-1.5">
                      {MANA_COLORS.map((mc) => {
                        const isSelected = colorFilter === mc.name;
                        return (
                          <button
                            key={mc.code}
                            type="button"
                            onClick={() => setColorFilter(isSelected ? 'Todas' : mc.name)}
                            title={`Filtrar por ${mc.name}`}
                            className={`relative group w-8 h-8 rounded-full flex items-center justify-center transition-all duration-150 cursor-pointer border-2 ${isSelected
                              ? 'scale-110 shadow-md ring-2 ring-offset-2'
                              : 'hover:scale-105 opacity-85 hover:opacity-100 shadow-2xs'
                              }`}
                            style={{
                              backgroundColor: mc.bg,
                              borderColor: isSelected ? mc.border : colors.light.border,
                              ['--tw-ring-color' as any]: mc.border,
                            }}
                          >
                            <img
                              src={mc.svg}
                              alt={mc.name}
                              className="w-4 h-4 object-contain drop-shadow-xs group-hover:scale-110 transition-transform"
                            />
                          </button>
                        );
                      })}
                    </div>
                  </div>

                  <div className="flex items-center gap-2">
                    <select
                      value={rarityFilter}
                      onChange={(e) => setRarityFilter(e.target.value)}
                      className="h-8.5 px-3 rounded-xl border text-xs font-bold outline-none cursor-pointer"
                      style={{
                        backgroundColor: colors.light.surface,
                        borderColor: colors.light.border,
                        color: colors.light['text-main'],
                      }}
                    >
                      <option value="Todas">Todas as Raridades</option>
                      <option value="Comum">Comum</option>
                      <option value="Incomum">Incomum</option>
                      <option value="Rara">Rara</option>
                      <option value="Mítica">Mítica</option>
                    </select>

                    {(colorFilter !== 'Todas' || typeFilter !== 'Todos' || rarityFilter !== 'Todas' || searchQuery) && (
                      <button
                        type="button"
                        onClick={() => {
                          setColorFilter('Todas');
                          setTypeFilter('Todos');
                          setRarityFilter('Todas');
                          setSearchQuery('');
                        }}
                        className="text-[11px] font-bold px-3 py-1.5 rounded-xl border transition-colors hover:bg-black/5 cursor-pointer flex items-center gap-1 shadow-2xs"
                        style={{ color: colors.light.bronze, borderColor: colors.light.border, backgroundColor: colors.light.surface }}
                      >
                        Limpar filtros ✕
                      </button>
                    )}
                  </div>
                </div>

                <div className="flex items-center gap-2 overflow-x-auto pb-1 scrollbar-none">
                  <span className="text-[11px] font-black uppercase tracking-wider mr-1 shrink-0" style={{ color: colors.light['text-faint'] }}>
                    Categorias / Tipos:
                  </span>
                  {TYPE_PILLS.map((tp) => {
                    const isSelected = typeFilter === tp.id;
                    return (
                      <button
                        key={tp.id}
                        type="button"
                        onClick={() => setTypeFilter(tp.id)}
                        className={`px-3 py-1 rounded-full text-xs font-bold whitespace-nowrap transition-all cursor-pointer border ${isSelected
                          ? 'shadow-xs scale-102 font-black'
                          : 'opacity-75 hover:opacity-100 hover:bg-black/5'
                          }`}
                        style={{
                          backgroundColor: isSelected ? colors.light.dark : colors.light.surface,
                          color: isSelected ? '#ffffff' : colors.light['text-main'],
                          borderColor: isSelected ? colors.light.dark : colors.light.border,
                        }}
                      >
                        {tp.label}
                      </button>
                    );
                  })}
                </div>
              </div>
            )}
          </header>

          {loadingDetails ? (
            <div className="py-20 text-center font-bold text-sm" style={{ color: colors.light['text-muted'] }}>
              <div className="inline-block w-6 h-6 border-2 border-[#9b7130] border-t-transparent rounded-full animate-spin mb-3" />
              <p>Carregando detalhes da carta...</p>
            </div>
          ) : selectedCard ? (
            <div className="flex flex-col flex-1">
              <button
                type="button"
                onClick={handleBackToList}
                className="mb-3 px-3.5 py-2 rounded-xl text-xs font-bold border transition-colors cursor-pointer inline-flex items-center gap-2 shadow-2xs hover:bg-black/5 w-fit"
                style={{ borderColor: colors.light.border, backgroundColor: colors.light.surface, color: colors.light['text-main'] }}
              >
                ← Voltar para a listagem
              </button>

              <div
                className="rounded-3xl border p-5 md:p-8 shadow-md grid grid-cols-1 md:grid-cols-12 gap-8 items-start flex-1"
                style={{ backgroundColor: colors.light.surface, borderColor: colors.light.border }}
              >
                <div className="md:col-span-5 flex items-start gap-6 pt-1">
                  {selectedCard.prints && selectedCard.prints.length > 0 && (
                    <div className="flex flex-col max-h-[380px] overflow-y-auto pr-2 w-52 shrink-0 divide-y" style={{ borderColor: colors.light.border }}>
                      <div className="pb-2 mb-1">
                        <span className="text-[9px] font-black uppercase tracking-widest" style={{ color: colors.light['text-faint'] }}>
                          Coleções ({selectedCard.prints.length})
                        </span>
                      </div>
                      {selectedCard.prints.map((print, idx) => {
                        const isSelected = activePrintIndex === idx;
                        const setCodeLower = (print.set_code || 'set').toLowerCase();
                        const setSymbolUrl = `https://svgs.scryfall.io/sets/${setCodeLower}.svg`;

                        return (
                          <div
                            key={idx}
                            onClick={() => {
                              setActivePrintIndex(idx);
                              setHoveredPrint(print);
                            }}
                            onMouseEnter={(e) => {
                              setHoveredPrint(print);
                              handleMouseMove(e);
                            }}
                            onMouseMove={handleMouseMove}
                            onMouseLeave={() => setHoveredPrint(null)}
                            className={`w-full text-left py-2.5 px-2 rounded-xl transition-all cursor-pointer flex flex-col gap-0.5 group ${isSelected
                              ? 'bg-black/5 dark:bg-white/10 opacity-100 font-black shadow-2xs'
                              : 'opacity-70 hover:opacity-100 hover:bg-black/[0.03]'
                              }`}
                          >
                            <div className="flex items-center gap-2">
                              <img
                                src={setSymbolUrl}
                                alt={print.set_code}
                                className="w-4 h-4 shrink-0 object-contain opacity-80"
                                onError={(e) => {
                                  (e.target as HTMLElement).style.display = 'none';
                                }}
                              />
                              <span
                                className={`text-xs truncate block leading-tight ${isSelected ? 'font-black' : 'font-semibold'}`}
                                style={{ color: isSelected ? colors.light['text-main'] : colors.light['text-muted'] }}
                              >
                                {print.set_name}
                              </span>
                            </div>
                            <span className="text-[9px] uppercase font-bold pl-6" style={{ color: colors.light['text-faint'] }}>
                              {print.set_code} {(print as any).collector_number ? `• #${(print as any).collector_number}` : ''} • {getRarityLabel(print.rarity)}
                            </span>
                          </div>
                        );
                      })}
                    </div>
                  )}

                  <div className="flex-1 flex justify-center">
                    {displayedPrint?.image_url ? (
                      <SafeCardImage
                        key={displayedPrint.image_url}
                        src={displayedPrint.image_url}
                        alt={displayedPrint.set_name || selectedCard.name}
                        name={selectedCard.name}
                        className="w-full max-w-[300px] md:max-w-[350px] rounded-2xl shadow-2xl object-contain border border-black/10 transition-all duration-150"
                      />
                    ) : (
                      <div className="w-full aspect-[0.72] max-w-[300px] rounded-2xl bg-black/5 border border-black/10 flex items-center justify-center font-bold text-sm">
                        Sem Imagem Disponível
                      </div>
                    )}
                  </div>
                </div>

                <div className="md:col-span-7 flex flex-col justify-center space-y-4">
                  <div className="space-y-3">
                    <div className="flex items-center justify-between">
                      <span
                        className="text-[11px] font-black px-3 py-1 rounded-full uppercase tracking-wider"
                        style={{ color: colors.light.bronze, backgroundColor: `${colors.light.bronze}1a` }}
                      >
                        {getRarityLabel(displayedPrint.rarity || selectedCard.rarity)}
                      </span>
                      <span className="text-xs font-bold" style={{ color: colors.light['text-muted'] }}>
                        {displayedPrint.set_name || selectedCard.set_name || selectedCard.set || 'Coleção Principal'}
                      </span>
                    </div>

                    <h2 className="text-2xl md:text-3xl font-black tracking-tight" style={{ color: colors.light['text-main'] }}>
                      {selectedCard.name}
                    </h2>

                    <div className="divider h-px w-full my-2" style={{ backgroundColor: colors.light.border }} />

                    <div className="space-y-2 text-xs md:text-sm font-semibold">
                      <div className="flex justify-between py-1.5 border-b border-black/5 dark:border-white/5 items-center">
                        <span style={{ color: colors.light['text-muted'] }}>Custo de Mana:</span>
                        <span className="font-bold tracking-wider" style={{ color: colors.light['text-main'] }}>
                          {renderManaCost(selectedCard.mana_cost)}
                        </span>
                      </div>

                      <div className="flex justify-between py-1.5 border-b border-black/5 dark:border-white/5">
                        <span style={{ color: colors.light['text-muted'] }}>Tipo da Carta:</span>
                        <span style={{ color: colors.light['text-main'] }}>
                          {selectedCard.type_line || selectedCard.type || 'N/A'}
                        </span>
                      </div>

                      <div className="flex justify-between py-1.5 border-b border-black/5 dark:border-white/5">
                        <span style={{ color: colors.light['text-muted'] }}>Preço Médio Estimado:</span>
                        <span className="font-black text-sm" style={{ color: colors.light.bronze }}>
                          {getFormattedPrice(selectedCard)}
                        </span>
                      </div>
                    </div>

                    <div className="mt-2">
                      <p className="text-[10px] font-black uppercase tracking-wider mb-1" style={{ color: colors.light['text-muted'] }}>
                        Texto da Carta (Oracle / Efeito)
                      </p>
                      <div
                        className="p-3 rounded-2xl border text-xs md:text-sm leading-relaxed whitespace-pre-line font-medium max-h-[140px] overflow-y-auto"
                        style={{ backgroundColor: colors.light.background, borderColor: colors.light.border, color: colors.light['text-main'] }}
                      >
                        {renderOracleText(selectedCard.oracle_text)}
                      </div>
                    </div>
                  </div>

                  <div className="pt-2 flex flex-col sm:flex-row gap-3">
                    <button
                      type="button"
                      onClick={() => handleToggleCollection({
                        name: selectedCard.name,
                        slug: selectedCard.slug,
                        scryfallId: activePrint?.id,
                        setCode: activePrint?.set_code,
                        setName: activePrint?.set_name,
                        imageUrl: activePrint?.image_url || undefined,
                        collectorNumber: activePrint?.collector_number,
                      })}
                      style={{
                        border: `2px solid ${colors.light.dark}`,
                        backgroundColor: isCardInCollection ? colors.light['surface-alt'] : colors.light.dark,
                        borderRadius: '0.9em',
                        cursor: 'pointer',
                        padding: '0.7em 1.2em',
                        fontSize: '13px',
                        flex: 1,
                      }}
                    >
                      <span className="flex items-center justify-center gap-2 font-bold" style={{ color: isCardInCollection ? colors.light['text-main'] : '#ffffff' }}>
                        {isCardInCollection ? '✓ Na coleção' : '+ Adicionar à coleção'}
                      </span>
                    </button>

                    <button
                      type="button"
                      onClick={() => handleToggleWishlist(selectedCard.name, selectedCard.slug)}
                      style={{
                        border: `2px solid ${colors.light.border}`,
                        backgroundColor: selectedCard.inWishlist ? `${colors.light.bronze}15` : colors.light.surface,
                        borderRadius: '0.9em',
                        cursor: 'pointer',
                        padding: '0.7em 1.2em',
                        fontSize: '13px',
                        flex: 1,
                      }}
                    >
                      <span className="flex items-center justify-center gap-2 font-bold" style={{ color: selectedCard.inWishlist ? colors.light.bronze : colors.light['text-main'] }}>
                        {selectedCard.inWishlist ? '★ Na lista de desejos' : '★ Adicionar à lista de desejos'}
                      </span>
                    </button>
                  </div>
                </div>
              </div>
            </div>
          ) : (
            <div className="flex flex-col flex-1" id="catalog-staples-section">
              <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-3 mb-4 mt-2">
                <div>
                  <div className="flex items-center gap-2 mb-1">
                    <span
                      className="text-[10px] font-black uppercase tracking-widest px-2.5 py-0.5 rounded-full"
                      style={{ backgroundColor: `${colors.light.bronze}1a`, color: colors.light.bronze }}
                    >
                      Formato Ativo • {selectedFormat}
                    </span>
                    <span className="text-[11px] font-bold" style={{ color: colors.light['text-muted'] }}>
                      Metagame & Staples
                    </span>
                  </div>
                  <h2 className="text-xl md:text-2xl font-black tracking-tight" style={{ color: colors.light['text-main'] }}>
                    Cartas Mais Relevantes e Essenciais de {selectedFormat}
                  </h2>
                  <p className="text-xs mt-0.5" style={{ color: colors.light['text-muted'] }}>
                    Explore as principais staples, cartas mais jogadas e peças fundamentais para decks de {selectedFormat}.
                  </p>
                </div>

                <div className="text-xs font-bold shrink-0 self-start sm:self-end flex items-center gap-1.5" style={{ color: colors.light['text-muted'] }}>
                  <span>Mostrando</span>
                  <span className="font-black text-xs px-2 py-0.5 rounded-md" style={{ backgroundColor: `${colors.light.bronze}1a`, color: colors.light.bronze }}>
                    {totalStaples > 0 ? (staplesPage - 1) * STAPLES_PER_PAGE + 1 : 0} - {Math.min(staplesPage * STAPLES_PER_PAGE, totalStaples)}
                  </span>
                  <span>de <strong style={{ color: colors.light['text-main'] }}>{totalStaples}</strong> cartas</span>
                </div>
              </div>

              {loading ? (
                <LoadingState count={8} type="card" />
              ) : formatStaplesFiltered.length === 0 ? (
                <div
                  className="text-center py-16 px-6 rounded-3xl border flex flex-col items-center justify-center shadow-xs my-4"
                  style={{ backgroundColor: colors.light.surface, borderColor: colors.light.border }}
                >
                  <div
                    className="w-14 h-14 rounded-2xl flex items-center justify-center mb-3 shadow-inner text-2xl"
                    style={{ backgroundColor: `${colors.light.bronze}1a`, color: colors.light.bronze }}
                  >
                    🔍
                  </div>
                  <h3 className="text-base font-black" style={{ color: colors.light['text-main'] }}>
                    Nenhum staple encontrado no formato {selectedFormat}
                  </h3>
                  <p className="text-xs max-w-md mt-1 mb-4" style={{ color: colors.light['text-muted'] }}>
                    Não encontramos cartas para {selectedFormat} com os filtros selecionados.
                  </p>
                  <button
                    type="button"
                    onClick={() => {
                      setColorFilter('Todas');
                      setTypeFilter('Todos');
                      setRarityFilter('Todas');
                      setSearchQuery('');
                    }}
                    className="px-4 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer shadow-xs hover:scale-102"
                    style={{ backgroundColor: colors.light.dark, color: '#ffffff' }}
                  >
                    Limpar todos os filtros
                  </button>
                </div>
              ) : (
                <>
                  <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-4">
                    {paginatedStaples.map((card) => {
                      const isInCollection = collectionSlugs.has(card.slug);
                      const isInWishlist = wishlistSlugs.has(card.slug);

                      return (
                        <div
                          key={card.id}
                          onClick={() => handleSelectCardBySlug(card.slug)}
                          className="group relative rounded-2xl border overflow-hidden transition-all duration-200 hover:-translate-y-1.5 hover:shadow-xl flex flex-col justify-between cursor-pointer"
                          style={{
                            backgroundColor: colors.light.surface,
                            borderColor: colors.light.border,
                          }}
                        >
                          <div className="relative aspect-[0.714] w-full overflow-hidden bg-black/5">
                            <SafeCardImage
                              src={card.image_url}
                              alt={card.name}
                              name={card.name}
                              className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
                            />

                            <div className="absolute top-2 left-2 z-10">
                              <span
                                className="text-[9px] font-black uppercase tracking-wider px-2 py-0.5 rounded-full shadow-xs backdrop-blur-md"
                                style={{
                                  backgroundColor: 'rgba(23, 21, 19, 0.75)',
                                  color: '#ffffff',
                                }}
                              >
                                {card.rarity}
                              </span>
                            </div>

                            <div className="absolute inset-x-2 bottom-2 z-10 flex gap-1.5 opacity-0 group-hover:opacity-100 transition-opacity duration-200">
                              <button
                                type="button"
                                title={isInCollection ? "Remover da coleção" : "Adicionar à Coleção"}
                                onClick={(e) => {
                                  e.stopPropagation();
                                  handleToggleCollection({
                                    name: card.name,
                                    slug: card.slug,
                                    setCode: card.set_code,
                                    setName: card.set,
                                    imageUrl: card.image_url,
                                  });
                                }}
                                className={`flex-1 py-1.5 px-2 rounded-xl text-[10px] font-black shadow-lg transition-transform active:scale-95 flex items-center justify-center gap-1 cursor-pointer border ${isInCollection
                                  ? 'bg-[#171513] text-white border-[#171513] shadow-inner scale-[0.98]'
                                  : 'bg-white text-neutral-900 border-neutral-300 hover:bg-neutral-100'
                                  }`}
                              >
                                {isInCollection ? '✓ Na coleção' : '+ Coleção'}
                              </button>

                              <button
                                type="button"
                                title={isInWishlist ? "Remover dos desejos" : "Adicionar à Lista de Desejos"}
                                onClick={(e) => {
                                  e.stopPropagation();
                                  handleToggleWishlist(card.name, card.slug);
                                }}
                                className={`py-1.5 px-2.5 rounded-xl text-[11px] font-black shadow-lg transition-transform active:scale-95 flex items-center justify-center cursor-pointer border ${isInWishlist
                                  ? 'bg-[#9b7130] text-white border-[#9b7130] shadow-inner'
                                  : 'bg-white text-[#9b7130] border-neutral-300 hover:bg-neutral-100'
                                  }`}
                              >
                                ★
                              </button>
                            </div>
                          </div>

                          <div
                            className="p-3 flex flex-col justify-between flex-1 gap-1.5 border-t"
                            style={{ borderColor: colors.light.border }}
                          >
                            <div>
                              <h3
                                className="text-xs font-black truncate leading-tight group-hover:text-[#9b7130] transition-colors"
                                style={{ color: colors.light['text-main'] }}
                                title={card.name}
                              >
                                {card.name}
                              </h3>
                              <p className="text-[10px] font-medium truncate mt-0.5" style={{ color: colors.light['text-muted'] }}>
                                {card.type}
                              </p>
                            </div>

                            <div className="flex items-center justify-between pt-1 border-t border-black/5 dark:border-white/5">
                              <span className="text-xs font-black" style={{ color: colors.light.bronze }}>
                                {card.price}
                              </span>
                              <span
                                className="text-[9px] font-bold uppercase tracking-wider px-1.5 py-0.5 rounded"
                                style={{ backgroundColor: `${colors.light.bronze}12`, color: colors.light.bronze }}
                              >
                                {card.set_code.toUpperCase()}
                              </span>
                            </div>
                          </div>
                        </div>
                      );
                    })}
                  </div>

                  {totalPages > 1 && (
                    <div
                      className="flex flex-col sm:flex-row items-center justify-between gap-4 mt-8 pt-5 border-t"
                      style={{ borderColor: colors.light.border }}
                    >
                      <span className="text-xs font-semibold" style={{ color: colors.light['text-muted'] }}>
                        Página <strong style={{ color: colors.light['text-main'] }}>{staplesPage}</strong> de{' '}
                        <strong style={{ color: colors.light['text-main'] }}>{totalPages}</strong> ({totalStaples} cartas no total)
                      </span>

                      <div className="flex items-center gap-1.5">
                        <button
                          type="button"
                          disabled={staplesPage === 1}
                          onClick={() => {
                            setStaplesPage((p) => Math.max(1, p - 1));
                            document.getElementById('catalog-staples-section')?.scrollIntoView({ behavior: 'smooth' });
                          }}
                          className="px-3.5 py-1.5 rounded-xl text-xs font-bold border transition-all cursor-pointer flex items-center gap-1 shadow-2xs disabled:opacity-40 disabled:cursor-not-allowed hover:bg-black/5"
                          style={{
                            backgroundColor: colors.light.surface,
                            borderColor: colors.light.border,
                            color: colors.light['text-main'],
                          }}
                        >
                          ← Anterior
                        </button>

                        <div className="flex items-center gap-1">
                          {Array.from({ length: totalPages }, (_, i) => i + 1).map((pageNum) => {
                            const isActive = pageNum === staplesPage;
                            return (
                              <button
                                key={pageNum}
                                type="button"
                                onClick={() => {
                                  setStaplesPage(pageNum);
                                  document.getElementById('catalog-staples-section')?.scrollIntoView({ behavior: 'smooth' });
                                }}
                                className={`w-8 h-8 rounded-xl text-xs font-bold transition-all cursor-pointer flex items-center justify-center border shadow-2xs ${isActive ? 'scale-105 font-black shadow-xs' : 'hover:bg-black/5 opacity-80 hover:opacity-100'
                                  }`}
                                style={{
                                  backgroundColor: isActive ? colors.light.dark : colors.light.surface,
                                  borderColor: isActive ? colors.light.dark : colors.light.border,
                                  color: isActive ? '#ffffff' : colors.light['text-main'],
                                }}
                              >
                                {pageNum}
                              </button>
                            );
                          })}
                        </div>

                        <button
                          type="button"
                          disabled={staplesPage === totalPages}
                          onClick={() => {
                            setStaplesPage((p) => Math.min(totalPages, p + 1));
                            document.getElementById('catalog-staples-section')?.scrollIntoView({ behavior: 'smooth' });
                          }}
                          className="px-3.5 py-1.5 rounded-xl text-xs font-bold border transition-all cursor-pointer flex items-center gap-1 shadow-2xs disabled:opacity-40 disabled:cursor-not-allowed hover:bg-black/5"
                          style={{
                            backgroundColor: colors.light.surface,
                            borderColor: colors.light.border,
                            color: colors.light['text-main'],
                          }}
                        >
                          Próxima →
                        </button>
                      </div>
                    </div>
                  )}
                </>
              )}
            </div>
          )}
        </div>
      </section>

      {hoveredPrint?.image_url ? (
        <div
          className="fixed z-[99999] pointer-events-none transition-all duration-75 ease-out shadow-2xl rounded-2xl overflow-hidden border-2 border-black/20 bg-black/80 backdrop-blur-sm p-1.5"
          style={{
            top: `${mousePosition.y}px`,
            left: `${mousePosition.x}px`,
            width: '240px',
          }}
        >
          <SafeCardImage
            key={hoveredPrint.image_url}
            src={hoveredPrint.image_url}
            alt={hoveredPrint.set_name}
            name={hoveredPrint.set_name}
            className="w-full h-auto rounded-xl object-contain shadow-inner"
          />
        </div>
      ) : hoveredCard?.image_url ? (
        <div
          className="fixed z-[99999] pointer-events-none transition-all duration-75 ease-out shadow-2xl rounded-2xl overflow-hidden border-2 border-black/20 bg-black/80 backdrop-blur-sm p-1.5"
          style={{
            top: `${mousePosition.y}px`,
            left: `${mousePosition.x}px`,
            width: '240px',
          }}
        >
          <SafeCardImage
            key={hoveredCard.image_url}
            src={hoveredCard.image_url}
            alt={hoveredCard.name}
            name={hoveredCard.name}
            className="w-full h-auto rounded-xl object-contain shadow-inner"
          />
        </div>
      ) : null}

      {toastMessage && <Toast message={toastMessage} onClose={() => setToastMessage(null)} />}
    </main>
  );
}

export default BuscarCartasPage;