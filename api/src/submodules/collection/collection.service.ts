import { supabase, createDbClient } from '../../shared/database/supabase.js';
import { importCardFromScryfall } from '../cards/cards.service.js';

export interface SaveCollectionPayload {
    scryfall_id?: number | string | null;
    print_id?: string | null;
    slug?: string | null;
    name?: string | null;
    cardName?: string | null;
    set_code?: string | null;
    set_name?: string | null;
    image_url?: string | null;
    collector_number?: string | null;
    quantity?: number | null;
    is_foil?: boolean | null;
    condition?: string | null;
    language?: string | null;
}

/**
 * Busca a coleção do usuário.
 * Faz JOIN com a tabela de catálogo de cartas (cards ou scryfall_cards_cache),
 * retornando os dados da carta tanto unidos na raiz quanto aninhados.
 */
export async function getUserCollection(userId: string, search?: string, userJwt?: string) {
    const dbClient = userJwt ? createDbClient(userJwt) : supabase;

    // 1. Busca os registros reais da coleção do usuário no banco
    const { data: collectionItems, error } = await dbClient
        .from('user_collection')
        .select('*')
        .eq('user_id', userId)
        .order('created_at', { ascending: false });

    if (error) {
        throw new Error(`Erro ao buscar coleção: ${error.message}`);
    }

    if (!collectionItems || collectionItems.length === 0) return [];

    // 2. Extrai os IDs reais das cartas para buscar no catálogo
    const cardIds = [...new Set(collectionItems.map((item: any) => item.scryfall_id).filter(Boolean))];

    let cardsMap = new Map();
    if (cardIds.length > 0) {
        const { data: cardsData } = await dbClient
            .from('cards')
            .select('*')
            .in('id', cardIds);

        if (cardsData) {
            cardsData.forEach((c: any) => {
                cardsMap.set(c.id, c);
                cardsMap.set(String(c.id), c);
            });
        }
    }

    // 3. Mescla estritamente com os dados reais do banco, sem valores padrão fictícios
    const enriched = collectionItems.map((item: any) => {
        const cardInfo = cardsMap.get(item.scryfall_id) || cardsMap.get(String(item.scryfall_id)) || {};

        return {
            ...item,
            name: cardInfo.name || null,
            mana_cost: cardInfo.mana_cost || null,
            type_line: cardInfo.type_line || null,
            set_code: cardInfo.set_code || item.set_code || null,
            set_name: cardInfo.set_name || null,
            collector_number: cardInfo.collector_number || null,
            rarity: cardInfo.rarity || null,
            image_url: cardInfo.image_uri || cardInfo.image_url || null,
            image_uri: cardInfo.image_uri || cardInfo.image_url || null,
            image_uris: cardInfo.image_uris || null,
            prices: cardInfo.prices || null,
            colors: cardInfo.colors || null,
            // Apenas referências reais do banco
            cards: cardInfo,
            card: cardInfo,
        };
    });

    // 4. Filtro de busca real baseado estritamente no nome retornado do banco
    if (search && search.trim()) {
        const term = search.trim().toLowerCase();
        return enriched.filter((item: any) => item.name && item.name.toLowerCase().includes(term));
    }

    return enriched;
}

/**
 * Enriquece os registros de user_collection unindo com os dados completos do catálogo de cartas (cards / scryfall_cards_cache).
 * Retorna os dados completos da carta tanto aninhados (cards, card, scryfall_cards_cache) quanto unidos na raiz.
 */
async function enrichCollectionWithCardsData(items: any[], search?: string) {
    if (!items || items.length === 0) return [];

    // Mapeamento de cartas já associadas ou que precisam ser buscadas
    const cardsMap = new Map<any, any>();

    // 1. Extrai identificadores numéricos e UUIDs que precisam de consulta
    const rawIds = items
        .map((item) => item.scryfall_id)
        .filter((id) => id !== null && id !== undefined && id !== '');

    const numericIds = rawIds
        .filter((id) => typeof id === 'number' || (!isNaN(Number(id)) && !String(id).includes('-')))
        .map(Number);

    const uuidIds = rawIds
        .filter((id) => typeof id === 'string' && /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i.test(id))
        .map(String);

    // 2. Consulta tabela 'cards' por ID numérico
    if (numericIds.length > 0) {
        const { data: numCards } = await supabase
            .from('cards')
            .select('*')
            .in('id', numericIds);

        if (numCards) {
            numCards.forEach((c: any) => {
                cardsMap.set(c.id, c);
                cardsMap.set(Number(c.id), c);
                cardsMap.set(String(c.id), c);
                if (c.scryfall_id) cardsMap.set(c.scryfall_id, c);
            });
        }
    }

    // 3. Consulta tabela 'cards' por scryfall_id (UUID)
    if (uuidIds.length > 0) {
        const { data: uuidCards } = await supabase
            .from('cards')
            .select('*')
            .in('scryfall_id', uuidIds);

        if (uuidCards) {
            uuidCards.forEach((c: any) => {
                cardsMap.set(c.scryfall_id, c);
                cardsMap.set(c.id, c);
                cardsMap.set(Number(c.id), c);
            });
        }
    }

    // 4. Monta os objetos finais unindo e aninhando os dados
    const enriched = items
        .map((item) => {
            // Prioriza o join direto do PostgREST se já existir
            const existingCard = item.cards || item.card || item.scryfall_cards_cache;
            const lookupCard = cardsMap.get(item.scryfall_id) || cardsMap.get(Number(item.scryfall_id));
            const cardInfo = existingCard || lookupCard || {};

            const cardName = cardInfo.name || item.name || '';

            // Filtro por termo de busca se fornecido
            if (search && search.trim()) {
                const term = search.trim().toLowerCase();
                if (!cardName.toLowerCase().includes(term)) {
                    return null;
                }
            }

            const imageUrl =
                cardInfo.image_url ||
                cardInfo.image_uri ||
                cardInfo.image_uris?.normal ||
                cardInfo.image_uris?.large ||
                cardInfo.image_uris?.small ||
                cardInfo.image ||
                item.image_url ||
                item.image_uri ||
                '';

            const rawPrice =
                cardInfo.prices?.usd ||
                cardInfo.prices?.usd_foil ||
                cardInfo.price ||
                item.prices?.usd ||
                item.price;

            const cardDetails = {
                id: cardInfo.id || item.scryfall_id,
                scryfall_id: cardInfo.scryfall_id || cardInfo.id || item.scryfall_id,
                oracle_id: cardInfo.oracle_id || null,
                name: cardName,
                mana_cost: cardInfo.mana_cost || item.mana_cost || '',
                type_line: cardInfo.type_line || item.type_line || '',
                oracle_text: cardInfo.oracle_text || '',
                set_code: cardInfo.set_code || item.set_code || '',
                set_name: cardInfo.set_name || item.set_name || item.set_code || '',
                collector_number: cardInfo.collector_number || item.collector_number || '',
                rarity: cardInfo.rarity || item.rarity || 'common',
                image_url: imageUrl,
                image_uri: imageUrl,
                image_uris: cardInfo.image_uris || (imageUrl ? { normal: imageUrl, small: imageUrl, large: imageUrl } : null),
                prices: cardInfo.prices || item.prices || (rawPrice ? { usd: rawPrice } : {}),
                price: rawPrice || null,
                colors: cardInfo.colors || item.colors || [],
            };

            return {
                ...item,
                // Dados unidos diretamente na raiz
                name: cardDetails.name,
                mana_cost: cardDetails.mana_cost,
                type_line: cardDetails.type_line,
                set_code: cardDetails.set_code,
                set_name: cardDetails.set_name,
                collector_number: cardDetails.collector_number,
                rarity: cardDetails.rarity,
                image_url: cardDetails.image_url,
                image_uri: cardDetails.image_uri,
                image_uris: cardDetails.image_uris,
                prices: cardDetails.prices,
                price: cardDetails.price,
                colors: cardDetails.colors,
                card_scryfall_id: cardDetails.scryfall_id,

                // Dados aninhados nos três formatos esperados pelo frontend
                cards: cardDetails,
                card: cardDetails,
                scryfall_cards_cache: cardDetails,
            };
        })
        .filter(Boolean);

    return enriched;
}

/**
 * Salva ou atualiza uma carta na coleção do usuário.
 * Prioriza a impressão específica informada (Scryfall UUID ou set_code),
 * importando automaticamente do Scryfall se a versão exata ainda não existir em `cards`.
 */
export async function saveCardToCollection(
    userId: string,
    data: SaveCollectionPayload,
    userJwt?: string
) {
    console.log('--- DADOS RECEBIDOS PARA SALVAR NA COLEÇÃO ---', { userId, data });

    let targetCardId: number | undefined;
    let targetSetCode = data.set_code || undefined;

    const rawName = data.name || data.cardName || (data.slug ? data.slug.replace(/-/g, ' ') : '');
    const cleanName = rawName.trim();

    // 1. Prioridade máxima: ID UUID específico da impressão (Scryfall UUID)
    const uuidCandidate = (typeof data.print_id === 'string' && data.print_id.trim())
        || (typeof data.scryfall_id === 'string' && data.scryfall_id.trim())
        || '';

    const isUuid = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i.test(uuidCandidate);

    if (isUuid) {
        // Verifica se a impressão exata já existe na tabela cards
        const { data: cardByUuid } = await supabase
            .from('cards')
            .select('id, set_code')
            .eq('scryfall_id', uuidCandidate)
            .limit(1)
            .maybeSingle();

        if (cardByUuid?.id) {
            targetCardId = Number(cardByUuid.id);
            if (cardByUuid.set_code) targetSetCode = cardByUuid.set_code;
        } else {
            // Importa a impressão exata selecionada diretamente do Scryfall
            try {
                const imported = await importCardFromScryfall({ scryfallId: uuidCandidate });
                if (imported?.id) {
                    targetCardId = Number(imported.id);
                    if (imported.set_code) targetSetCode = imported.set_code;
                }
            } catch (err) {
                console.error('Erro ao importar impressão específica do Scryfall:', err);
            }
        }
    }

    // 2. Tenta por ID numérico direto caso informado
    if (!targetCardId && data.scryfall_id) {
        const parsedNum = Number(data.scryfall_id);
        if (!isNaN(parsedNum) && parsedNum > 0) {
            const { data: cardById } = await supabase
                .from('cards')
                .select('id, set_code')
                .eq('id', parsedNum)
                .limit(1)
                .maybeSingle();

            if (cardById?.id) {
                targetCardId = Number(cardById.id);
                if (cardById.set_code) targetSetCode = cardById.set_code;
            }
        }
    }

    // 3. Se temos nome e set_code específico (diferente de genérico), busca essa edição
    if (!targetCardId && cleanName && data.set_code && data.set_code.toLowerCase() !== 'cmm') {
        const { data: cardWithSet } = await supabase
            .from('cards')
            .select('id, set_code')
            .ilike('name', cleanName)
            .ilike('set_code', data.set_code)
            .limit(1)
            .maybeSingle();

        if (cardWithSet?.id) {
            targetCardId = Number(cardWithSet.id);
            targetSetCode = cardWithSet.set_code;
        } else {
            // Busca na API do Scryfall a carta naquele set específico
            try {
                const scryRes = await fetch(
                    `https://api.scryfall.com/cards/named?exact=${encodeURIComponent(cleanName)}&set=${encodeURIComponent(data.set_code)}`,
                    { headers: { 'User-Agent': 'MTGDeckTracker/1.0', 'Accept': 'application/json' } }
                );
                if (scryRes.ok) {
                    const scryJson = await scryRes.json();
                    if (scryJson?.id) {
                        const imported = await importCardFromScryfall({ scryfallId: scryJson.id });
                        if (imported?.id) {
                            targetCardId = Number(imported.id);
                            targetSetCode = imported.set_code || data.set_code;
                        }
                    }
                }
            } catch (err) {
                console.error('Erro ao buscar carta com set no Scryfall:', err);
            }
        }
    }

    // 4. Busca pelo nome ou slug na tabela cards
    if (!targetCardId && cleanName) {
        const { data: cardRecord } = await supabase
            .from('cards')
            .select('id, set_code')
            .or(`name.ilike.${cleanName},slug.ilike.${data.slug || ''}`)
            .limit(1)
            .maybeSingle();

        if (cardRecord?.id) {
            targetCardId = Number(cardRecord.id);
            if (cardRecord.set_code) targetSetCode = cardRecord.set_code;
        }
    }

    // 5. Fallback final: busca fuzzy na Scryfall, importa e captura o ID gerado
    if (!targetCardId && cleanName) {
        try {
            const scryRes = await fetch(`https://api.scryfall.com/cards/named?fuzzy=${encodeURIComponent(cleanName)}`, {
                headers: { 'User-Agent': 'MTGDeckTracker/1.0', 'Accept': 'application/json' },
            });

            if (scryRes.ok) {
                const scryJson = await scryRes.json();
                if (scryJson?.id) {
                    const imported = await importCardFromScryfall({ scryfallId: scryJson.id });
                    if (imported?.id) {
                        targetCardId = Number(imported.id);
                        if (imported.set_code) targetSetCode = imported.set_code;
                    }
                }
            }
        } catch (err) {
            console.error('Erro ao importar da Scryfall:', err);
        }
    }

    if (!targetCardId || isNaN(targetCardId)) {
        throw new Error(`Não foi possível encontrar ou importar o ID numérico da carta "${cleanName}".`);
    }

    console.log('--- ID NUMÉRICO INT8 SELECIONADO PARA O UPSERT:', targetCardId, 'SET:', targetSetCode);

    const record = {
        user_id: userId,
        scryfall_id: targetCardId,
        set_code: targetSetCode || data.set_code || 'cmm',
        quantity: typeof data.quantity === 'number' && data.quantity > 0 ? data.quantity : 1,
        is_foil: Boolean(data.is_foil ?? false),
        condition: data.condition || 'NM',
        language: data.language || 'en',
    };

    const dbClient = userJwt ? createDbClient(userJwt) : supabase;

    const { data: saved, error } = await dbClient
        .from('user_collection')
        .upsert(record, { onConflict: 'user_id,scryfall_id,is_foil,condition,language' })
        .select('*')
        .single();

    if (error) {
        throw new Error(`Erro ao salvar carta na coleção: ${error.message}`);
    }

    return saved;
}

/**
 * Remove uma carta da coleção do usuário por ID numérico, Scryfall UUID ou slug/nome.
 */
export async function removeCardFromCollection(
    userId: string,
    identifier: number | string,
    userJwt?: string
) {
    const matchedCardIds: number[] = [];
    const parsedNum = Number(identifier);

    if (!isNaN(parsedNum) && parsedNum > 0) {
        matchedCardIds.push(parsedNum);
    }

    // Se identifier for UUID de Scryfall
    const isUuid = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i.test(String(identifier));
    if (isUuid) {
        const { data: cardRecord } = await supabase
            .from('cards')
            .select('id')
            .eq('scryfall_id', identifier)
            .limit(1)
            .maybeSingle();

        if (cardRecord?.id) {
            matchedCardIds.push(Number(cardRecord.id));
        }
    }

    // Se for string / slug / nome
    const cleanName = String(identifier).replace(/-/g, ' ').trim();
    if (cleanName) {
        const { data: cardRecords } = await supabase
            .from('cards')
            .select('id')
            .or(`name.ilike.${cleanName},slug.ilike.${String(identifier).trim()}`);

        if (cardRecords && cardRecords.length > 0) {
            cardRecords.forEach((c) => {
                const idNum = Number(c.id);
                if (idNum && !matchedCardIds.includes(idNum)) {
                    matchedCardIds.push(idNum);
                }
            });
        }
    }

    if (matchedCardIds.length === 0) {
        throw new Error('Identificador da carta para exclusão não foi encontrado.');
    }

    const dbClient = userJwt ? createDbClient(userJwt) : supabase;

    const { error } = await dbClient
        .from('user_collection')
        .delete()
        .eq('user_id', userId)
        .in('scryfall_id', matchedCardIds);

    if (error) {
        throw new Error(`Erro ao remover carta da coleção: ${error.message}`);
    }

    return { success: true };
}