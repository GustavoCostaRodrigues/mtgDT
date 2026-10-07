// api/src/submodules/cards/cards.service.ts
import { supabase, createDbClient } from '../../shared/database/supabase.js';
import type { ImportCardInput } from './cards.schemas.js';

// --- CREATE --------------------------------------------------------------------

export async function importCardFromScryfall(data: ImportCardInput) {
  // Instância com anon key (cards é catálogo público no banco)
  const dbClient = createDbClient('');

  // 1. Busca os detalhes oficiais da carta diretamente na API do Scryfall
  const scryfallRes = await fetch(`https://api.scryfall.com/cards/${data.scryfallId}`, {
    headers: {
      'User-Agent': 'MTGDeckTracker/1.0',
      'Accept': 'application/json',
    },
  });

  if (!scryfallRes.ok) {
    if (scryfallRes.status === 404) {
      throw new Error('Carta não encontrada na base do Scryfall');
    }
    throw new Error('Falha ao comunicar com o serviço do Scryfall');
  }

  const cardData = await scryfallRes.json();

  // Tratamento de cartas dupla face / transform (cards com card_faces)
  const imageUrl = cardData.image_uris?.normal
    ?? cardData.image_uris?.large
    ?? cardData.card_faces?.[0]?.image_uris?.normal
    ?? null;

  // 2. Monta o registro formatado para a tabela cards
  const newCard = {
    scryfall_id: cardData.id,
    oracle_id: cardData.oracle_id ?? null,
    name: cardData.name,
    mana_cost: cardData.mana_cost ?? null,
    cmc: cardData.cmc ?? 0,
    type_line: cardData.type_line ?? '',
    oracle_text: cardData.oracle_text ?? null,
    colors: cardData.colors ?? [],
    color_identity: cardData.color_identity ?? [],
    set_code: cardData.set,
    set_name: cardData.set_name,
    collector_number: cardData.collector_number,
    rarity: cardData.rarity,
    image_url: imageUrl,
    prices: cardData.prices ?? {},
    legalities: cardData.legalities ?? {},
  };

  // 3. Upsert no banco: insere se não existir, atualiza se já existir (evita duplicidade)
  const { data: savedCard, error } = await dbClient
    .from('cards')
    .upsert(newCard, { onConflict: 'scryfall_id' })
    .select('*')
    .single();

  if (error) {
    throw new Error(`Erro ao salvar carta no banco: ${error.message}`);
  }

  return savedCard;
}

// --- READ --------------------------------------------------------------------

/**
 * 1. Busca Rápida / Autocomplete (GET /api/cards/search?q=termo)
 * Retorna uma lista leve e otimizada contendo apenas os campos essenciais para sugestões em dropdown.
 */
export async function searchCards(searchTerm: string, limit = 8) {
  if (!searchTerm || !searchTerm.trim()) {
    return [];
  }

  const term = searchTerm.trim();

  // 1. Consulta no banco de dados (tabela cards) filtrando pelo nome via ilike
  const { data, error } = await supabase
    .from('cards')
    .select('id, name, set_code, set_name, rarity, type_line, image_url, scryfall_id')
    .ilike('name', `%${term}%`)
    .order('name', { ascending: true })
    .limit(limit);

  if (error) {
    throw new Error(`Erro ao buscar cartas: ${error.message}`);
  }

  let results = data || [];

  // 2. Fallback caso não haja cartas locais: busca em scryfall_cards_cache
  if (results.length === 0) {
    const { data: cacheData } = await supabase
      .from('scryfall_cards_cache')
      .select('id, name, set_code, rarity, type_line, image_uris')
      .ilike('name', `%${term}%`)
      .order('name', { ascending: true })
      .limit(limit);

    if (cacheData && cacheData.length > 0) {
      results = cacheData.map((c: any) => ({
        id: c.id,
        name: c.name,
        set_code: c.set_code,
        set_name: c.set_code,
        rarity: c.rarity,
        type_line: c.type_line,
        image_url: c.image_uris?.normal || c.image_uris?.large || null,
        scryfall_id: c.id,
      }));
    }
  }

  // 3. Fallback adicional na API Scryfall pública se o banco não tiver o card
  if (results.length === 0) {
    try {
      const scryRes = await fetch(`https://api.scryfall.com/cards/search?q=${encodeURIComponent(term)}`, {
        headers: {
          'User-Agent': 'MTGDeckTracker/1.0',
          'Accept': 'application/json',
        },
      });

      if (scryRes.ok) {
        const scryJson = await scryRes.json();
        results = (scryJson.data || []).slice(0, limit).map((c: any) => ({
          id: c.id,
          name: c.name,
          set_code: c.set,
          set_name: c.set_name,
          rarity: c.rarity,
          type_line: c.type_line,
          image_url: c.image_uris?.normal || c.card_faces?.[0]?.image_uris?.normal || null,
          scryfall_id: c.id,
        }));
      }
    } catch {
      // Ignora falhas externas silenciosamente para retornar array vazio
    }
  }

  // 4. Retorna formato limpo com os campos essenciais: id, name, set, slug, rarity, type, image_url
  return results.map((c: any) => {
    const slug = (c.name || '')
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, '-')
      .replace(/(^-|-$)/g, '');

    return {
      id: c.id,
      name: c.name,
      set: c.set_name || c.set_code || '',
      set_code: c.set_code || '',
      slug,
      rarity: c.rarity || 'common',
      type: c.type_line || '',
      image_url: c.image_url || null,
    };
  });
}

async function fetchCardPrints(cardName: string) {
  try {
    const scryRes = await fetch(`https://api.scryfall.com/cards/search?order=released&q=%21%22${encodeURIComponent(cardName)}%22+include%3Aextras&unique=prints`, {
      headers: {
        'User-Agent': 'MTGDeckTracker/1.0',
        'Accept': 'application/json',
      },
    });

    if (scryRes.ok) {
      const json = await scryRes.json();
      const seenSets = new Set<string>();
      const seenImages = new Set<string>();
      const results: any[] = [];

      for (const p of json.data || []) {
        const imageUrl = p.image_uris?.normal || p.image_uris?.large || p.card_faces?.[0]?.image_uris?.normal || null;
        if (!imageUrl) continue;

        const setKey = (p.set || '').toLowerCase();
        // Evita múltiplos prints idênticos do mesmo set
        if (seenSets.has(setKey) && seenImages.has(imageUrl)) continue;
        seenSets.add(setKey);
        seenImages.add(imageUrl);

        const isShowcase = Array.isArray(p.frame_effects) && p.frame_effects.includes('showcase');
        const isBorderless = p.border_color === 'borderless';
        let displaySetName = p.set_name;
        if (isShowcase) displaySetName += ' (Showcase)';
        else if (isBorderless) displaySetName += ' (Borderless)';
        else if (p.promo) displaySetName += ' (Promo)';

        results.push({
          id: p.id,
          set_code: p.set,
          set_name: displaySetName,
          raw_set_name: p.set_name,
          collector_number: p.collector_number,
          rarity: p.rarity,
          image_url: imageUrl,
          price: p.prices?.usd ? `$ ${p.prices.usd}` : undefined,
        });

        if (results.length >= 25) break;
      }
      return results;
    }
  } catch {
    // Ignora falhas de busca de prints externos
  }
  return [];
}

/**
 * 2. Detalhes da Carta (GET /api/cards/:slug)
 * Consulta o banco de dados buscando o registro completo da carta pelo identificador slug.
 */
export async function getCardBySlug(slug: string) {
  if (!slug || !slug.trim()) {
    throw new Error('Carta não encontrada');
  }

  const cleanSlug = slug.trim();
  let query = supabase.from('cards').select('*');

  // Identifica se o parâmetro recebido é numérico (id), UUID (scryfall_id) ou slug textual
  if (/^\d+$/.test(cleanSlug)) {
    query = query.eq('id', cleanSlug);
  } else if (/^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i.test(cleanSlug)) {
    query = query.eq('scryfall_id', cleanSlug);
  } else {
    const pattern = cleanSlug.split('-').filter(Boolean).join('%');
    query = query.ilike('name', `%${pattern}%`);
  }

  const { data, error } = await query.limit(1).maybeSingle();

  if (error) {
    throw new Error(`Erro ao buscar carta: ${error.message}`);
  }

  // Se encontrado no banco local, formata o retorno
  if (data) {
    const cardSlug = data.name
      ? data.name.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '')
      : cleanSlug;

    const prints = await fetchCardPrints(data.name || cleanSlug);

    return {
      ...data,
      slug: cardSlug,
      prints: prints.length > 0 ? prints : [
        {
          id: data.id,
          set_code: data.set_code,
          set_name: data.set_name,
          rarity: data.rarity,
          image_url: data.image_url,
          price: data.prices?.usd ? `$ ${data.prices.usd}` : undefined,
        },
      ],
    };
  }

  // Fallback no Scryfall se a carta não estiver no cache local
  try {
    const cardName = cleanSlug.replace(/-/g, ' ');
    const scryfallRes = await fetch(`https://api.scryfall.com/cards/named?fuzzy=${encodeURIComponent(cardName)}`, {
      headers: {
        'User-Agent': 'MTGDeckTracker/1.0',
        'Accept': 'application/json',
      },
    });

    if (scryfallRes.ok) {
      const cardData = await scryfallRes.json();
      const imageUrl = cardData.image_uris?.normal
        ?? cardData.image_uris?.large
        ?? cardData.card_faces?.[0]?.image_uris?.normal
        ?? null;

      const cardSlug = (cardData.name || '')
        .toLowerCase()
        .replace(/[^a-z0-9]+/g, '-')
        .replace(/(^-|-$)/g, '');

      const prints = await fetchCardPrints(cardData.name);

      return {
        id: cardData.id,
        scryfall_id: cardData.id,
        oracle_id: cardData.oracle_id ?? null,
        name: cardData.name,
        mana_cost: cardData.mana_cost ?? null,
        cmc: cardData.cmc ?? 0,
        type_line: cardData.type_line ?? '',
        oracle_text: cardData.oracle_text ?? null,
        colors: cardData.colors ?? [],
        color_identity: cardData.color_identity ?? [],
        set_code: cardData.set,
        set_name: cardData.set_name,
        collector_number: cardData.collector_number,
        rarity: cardData.rarity,
        image_url: imageUrl,
        prices: cardData.prices ?? {},
        legalities: cardData.legalities ?? {},
        slug: cardSlug,
        prints: prints.length > 0 ? prints : [
          {
            id: cardData.id,
            set_code: cardData.set,
            set_name: cardData.set_name,
            rarity: cardData.rarity,
            image_url: imageUrl,
            price: cardData.prices?.usd ? `$ ${cardData.prices.usd}` : undefined,
          },
        ],
      };
    }
  } catch {
    // Ignora erro externo e lança erro padrão de carta não encontrada
  }

  throw new Error('Carta não encontrada');
}

/**
 * Buscar detalhes de uma carta por ID numérico (mantido para compatibilidade)
 */
export async function getCardById(id: number | bigint | string) {
  const dbClient = createDbClient('');

  const { data, error } = await dbClient
    .from('cards')
    .select('*')
    .eq('id', id.toString())
    .maybeSingle();

  if (error || !data) {
    throw new Error('Carta não encontrada no catálogo');
  }

  return data;
}

// Classe de serviço para suportar tanto import modular quanto orientado a objetos
export class CardsService {
  async searchCards(searchTerm: string, limit = 8) {
    return searchCards(searchTerm, limit);
  }

  async getCardBySlug(slug: string) {
    return getCardBySlug(slug);
  }

  async getCardById(id: number | bigint | string) {
    return getCardById(id);
  }

  async importCardFromScryfall(data: ImportCardInput) {
    return importCardFromScryfall(data);
  }
}

export const cardsService = new CardsService();