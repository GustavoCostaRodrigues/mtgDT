import { supabase, createDbClient } from '../../shared/database/supabase.js';
import { importCardFromScryfall } from '../cards/cards.service.js';
/**
 * Busca a coleção do usuário.
 * Faz join inteligente ou busca detalhes complementares na tabela de cartas.
 */
export async function getUserCollection(userId, search, userJwt) {
    const dbClient = userJwt ? createDbClient(userJwt) : supabase;
    let query = dbClient
        .from('user_collection')
        .select('*, scryfall_cards_cache(*)')
        .eq('user_id', userId);
    const { data, error } = await query.order('created_at', { ascending: false });
    if (error) {
        // Fallback caso a relação cache apresente inconsistência de RLS ou schema
        const fallbackRes = await dbClient
            .from('user_collection')
            .select('*')
            .eq('user_id', userId)
            .order('created_at', { ascending: false });
        if (!fallbackRes.error && fallbackRes.data) {
            return await enrichCollectionWithCardsData(fallbackRes.data, search);
        }
        throw new Error(`Erro ao buscar coleção: ${error.message}`);
    }
    const results = data || [];
    return await enrichCollectionWithCardsData(results, search);
}
/**
 * Enriquece os itens de user_collection com os detalhes completos da tabela cards (nome, tipo, imagem, preços, etc.).
 */
async function enrichCollectionWithCardsData(items, search) {
    if (!items || items.length === 0)
        return [];
    const cardIds = items.map((item) => item.scryfall_id).filter(Boolean);
    if (cardIds.length === 0)
        return items;
    let cardsQuery = supabase
        .from('cards')
        .select('id, scryfall_id, name, type_line, set_name, set_code, collector_number, rarity, prices, colors, image_url')
        .in('id', cardIds);
    if (search && search.trim()) {
        cardsQuery = cardsQuery.ilike('name', `%${search.trim()}%`);
    }
    const { data: cardsDetails } = await cardsQuery;
    if (!cardsDetails || cardsDetails.length === 0) {
        if (search && search.trim()) {
            return [];
        }
        return items;
    }
    const cardsMap = new Map(cardsDetails.map((c) => [c.id, c]));
    const enriched = items
        .map((item) => {
        const cardInfo = cardsMap.get(item.scryfall_id);
        if (!cardInfo) {
            if (search && search.trim())
                return null;
            return item;
        }
        return {
            ...item,
            card_scryfall_id: cardInfo.scryfall_id,
            collector_number: cardInfo.collector_number,
            name: cardInfo.name,
            type_line: cardInfo.type_line,
            set_name: cardInfo.set_name || cardInfo.set_code || item.set_code,
            set_code: cardInfo.set_code || item.set_code,
            rarity: cardInfo.rarity,
            prices: cardInfo.prices,
            colors: cardInfo.colors,
            image_url: cardInfo.image_url,
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
export async function saveCardToCollection(userId, data, userJwt) {
    console.log('--- DADOS RECEBIDOS PARA SALVAR NA COLEÇÃO ---', { userId, data });
    let targetCardId;
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
            if (cardByUuid.set_code)
                targetSetCode = cardByUuid.set_code;
        }
        else {
            // Importa a impressão exata selecionada diretamente do Scryfall
            try {
                const imported = await importCardFromScryfall({ scryfallId: uuidCandidate });
                if (imported?.id) {
                    targetCardId = Number(imported.id);
                    if (imported.set_code)
                        targetSetCode = imported.set_code;
                }
            }
            catch (err) {
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
                if (cardById.set_code)
                    targetSetCode = cardById.set_code;
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
        }
        else {
            // Busca na API do Scryfall a carta naquele set específico
            try {
                const scryRes = await fetch(`https://api.scryfall.com/cards/named?exact=${encodeURIComponent(cleanName)}&set=${encodeURIComponent(data.set_code)}`, { headers: { 'User-Agent': 'MTGDeckTracker/1.0', 'Accept': 'application/json' } });
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
            }
            catch (err) {
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
            if (cardRecord.set_code)
                targetSetCode = cardRecord.set_code;
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
                        if (imported.set_code)
                            targetSetCode = imported.set_code;
                    }
                }
            }
        }
        catch (err) {
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
export async function removeCardFromCollection(userId, identifier, userJwt) {
    const matchedCardIds = [];
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
