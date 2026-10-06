// api/src/submodules/cards/cards.service.ts
import { createDbClient } from '../../shared/database/supabase.js';
import type { SearchCardsQueryInput, ImportCardInput } from './cards.schemas.js';

// --- CREATE --------------------------------------------------------------------

export async function importCardFromScryfall(data: ImportCardInput) {
    // Instância com anon key (cards é catálogo público no banco)
    const supabase = createDbClient('');

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
    const { data: savedCard, error } = await supabase
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

// Buscar cartas no catálogo geral por trecho de nome (ilike ou Scryfall API)
export async function searchCards(userJwt: string, filters: SearchCardsQueryInput) {
    const supabase = createDbClient(userJwt);

    // 1. Tenta buscar primeiro na tabela cards
    let { data, error } = await supabase
        .from('cards')
        .select('*')
        .ilike('name', `%${filters.q}%`)
        .order('name', { ascending: true })
        .limit(filters.limit);

    // 2. Se não encontrar em cards, tenta em scryfall_cards_cache
    if (error || !data || data.length === 0) {
        const { data: cacheData } = await supabase
            .from('scryfall_cards_cache')
            .select(`
                id,
                name,
                set_code,
                collector_number,
                mana_cost,
                type_line,
                rarity,
                image_uris
            `)
            .ilike('name', `%${filters.q}%`)
            .order('name', { ascending: true })
            .limit(filters.limit);

        if (cacheData && cacheData.length > 0) {
            data = cacheData.map((c: any) => ({
                id: c.id,
                name: c.name,
                set_code: c.set_code,
                collector_number: c.collector_number,
                mana_cost: c.mana_cost,
                type_line: c.type_line,
                rarity: c.rarity,
                image_url: c.image_uris?.normal || c.image_uris?.large || null,
            }));
        }
    }

    // 3. Se ainda não houver resultados no banco local, faz fallback diretamente na API do Scryfall
    if (!data || data.length === 0) {
        try {
            const scryfallRes = await fetch(`https://api.scryfall.com/cards/search?q=${encodeURIComponent(filters.q)}`, {
                headers: {
                    'User-Agent': 'MTGDeckTracker/1.0',
                    'Accept': 'application/json',
                },
            });

            if (scryfallRes.ok) {
                const scryfallData = await scryfallRes.json();
                data = (scryfallData.data || []).slice(0, filters.limit).map((c: any) => {
                    const img = c.image_uris?.normal || c.image_uris?.large || c.card_faces?.[0]?.image_uris?.normal || null;
                    return {
                        id: c.id,
                        scryfall_id: c.id,
                        name: c.name,
                        set_code: c.set,
                        set_name: c.set_name,
                        collector_number: c.collector_number,
                        mana_cost: c.mana_cost || null,
                        type_line: c.type_line || '',
                        rarity: c.rarity || 'common',
                        image_url: img,
                        prices: c.prices || {},
                        colors: c.colors || c.color_identity || [],
                    };
                });
            }
        } catch (err) {
            console.error('Erro ao buscar cartas no Scryfall API:', err);
        }
    }

    return data || [];
}

// Buscar detalhes completos de uma carta do catálogo por ID
export async function getCardById(id: number | bigint) {
  const supabase = createDbClient('');

  const { data, error } = await supabase
    .from('cards')
    .select('*')
    .eq('id', id.toString()) // Converte para string para o PostgREST comparar o bigint sem perda de precisão
    .maybeSingle();

  if (error || !data) {
    throw new Error('Carta não encontrada no catálogo');
  }

  return data;
}