// api/src/submodules/decks/decks.service.ts
import { createDbClient } from '../../shared/database/supabase.js';
import type { 
  ListDecksQueryInput, 
  CreateDeckInput, 
  UpdateDeckInput,
  AddCardToDeckInput,
  UpdateDeckCardInput
} from './decks.schemas.js';

// --- CREATE ------------------------------------------------------------------

// Criar deck validando limites de plano
export async function createDeck(userJwt: string, deckData: CreateDeckInput) {
  const supabase = createDbClient(userJwt);

  const { data: { user }, error: userError } = await supabase.auth.getUser();
  if (userError || !user) {
    throw new Error('Não foi possível identificar o usuário');
  }

  const { data: profile } = await supabase
    .from('profiles')
    .select('plan')
    .eq('user_id', user.id)
    .single();

  const userPlan = profile?.plan ?? 'default';
  const maxAllowedDecks = userPlan === 'premium' ? 100 : 20;

  const { count, error: countError } = await supabase
    .from('decks')
    .select('*', { count: 'exact', head: true })
    .eq('user_id', user.id);

  if (countError) {
    throw new Error(`Erro ao verificar quantidade de decks: ${countError.message}`);
  }

  if ((count ?? 0) >= maxAllowedDecks) {
    throw new Error(`Limite de decks atingido para o plano ${userPlan} (${maxAllowedDecks} decks).`);
  }

  const { data: newDeck, error: insertError } = await supabase
    .from('decks')
    .insert({
      user_id: user.id,
      name: deckData.name,
      format: deckData.format,
      description: deckData.description,
    })
    .select()
    .single();

  if (insertError) {
    throw new Error(`Erro ao criar o deck: ${insertError.message}`);
  }

  return newDeck;
}

// --- READ --------------------------------------------------------------------

// Listar decks com paginação e ordenação
export async function listUserDecks(userJwt: string, filters: ListDecksQueryInput) {
  const supabase = createDbClient(userJwt);
  const [sortField, sortDirection] = filters.sort.split(':') as ['updated_at' | 'name', 'asc' | 'desc'];

  const { data, error } = await supabase
    .from('decks')
    .select(`
      id,
      name,
      format,
      updated_at,
      deck_cards (quantity)
    `)
    .order(sortField, { ascending: sortDirection === 'asc' })
    .limit(filters.limit);

  if (error) {
    throw new Error(`Erro ao buscar decks: ${error.message}`);
  }

  return data.map((deck) => ({
    id: deck.id,
    name: deck.name,
    format: deck.format,
    updatedAt: deck.updated_at,
    totalCards: deck.deck_cards?.reduce((acc, curr) => acc + curr.quantity, 0) ?? 0,
  }));
}

// Buscar detalhes do deck por ID incluindo cartas
export async function getDeckDetailsById(userJwt: string, deckId: bigint) {
  const supabase = createDbClient(userJwt);

  const { data: deck, error } = await supabase
    .from('decks')
    .select(`
      id,
      name,
      format,
      description,
      is_private,
      created_at,
      updated_at,
      deck_cards (
        id,
        quantity,
        board,
        scryfall_cards_cache (
          id,
          name,
          mana_cost,
          cmc,
          type_line,
          image_uris,
          colors,
          color_identity,
          rarity
        )
      )
    `)
    .eq('id', deckId)
    .single();

  if (error) {
    if (error.code === 'PGRST116') return null;
    throw new Error(`Erro ao buscar detalhes do deck: ${error.message}`);
  }

  return deck;
}

// --- UPDATE ------------------------------------------------------------------

// Atualizar metadados do deck
export async function updateDeck(userJwt: string, deckId: bigint, updateData: UpdateDeckInput) {
  const supabase = createDbClient(userJwt);

  const { data: updatedDeck, error } = await supabase
    .from('decks')
    .update({
      ...updateData,
      updated_at: new Date().toISOString(),
    })
    .eq('id', deckId)
    .select()
    .single();

  if (error) {
    if (error.code === 'PGRST116') return null;
    throw new Error(`Erro ao atualizar o deck: ${error.message}`);
  }

  return updatedDeck;
}

// --- DELETE ------------------------------------------------------------------

// Excluir deck, alocações e lista de cartas (NÃO remove da user_collection)
export async function deleteDeck(userJwt: string, deckId: bigint) {
  const supabase = createDbClient(userJwt);

  // 1. Identifica os IDs das cartas contidas neste deck
  const { data: deckCards, error: fetchCardsError } = await supabase
    .from('deck_cards')
    .select('id')
    .eq('deck_id', deckId);

  if (fetchCardsError) {
    throw new Error(`Erro ao localizar cartas do deck: ${fetchCardsError.message}`);
  }

  const cardIds = deckCards?.map((c) => c.id) ?? [];

  // 2. Se houver cartas, desfaz as alocações da coleção física
  if (cardIds.length > 0) {
    const { error: allocationError } = await supabase
      .from('deck_card_allocations')
      .delete()
      .in('deck_card_id', cardIds);

    if (allocationError) {
      throw new Error(`Erro ao desalocar cartas da coleção: ${allocationError.message}`);
    }

    // 3. Remove a lista de cartas do deck
    const { error: cardsDeleteError } = await supabase
      .from('deck_cards')
      .delete()
      .eq('deck_id', deckId);

    if (cardsDeleteError) {
      throw new Error(`Erro ao remover lista de cartas do deck: ${cardsDeleteError.message}`);
    }
  }

  // 4. Remove o deck
  const { data, error } = await supabase
    .from('decks')
    .delete()
    .eq('id', deckId)
    .select('id')
    .single();

  if (error) {
    if (error.code === 'PGRST116') return false;
    throw new Error(`Erro ao excluir o deck: ${error.message}`);
  }

  return true;
}

// --- EXTRA RULES / CARDS -----------------------------------------------------

// Adicionar ou incrementar carta no deck
export async function addCardToDeck(userJwt: string, deckId: bigint, cardData: AddCardToDeckInput) {
  const supabase = createDbClient(userJwt);

  const { data: deck, error: deckError } = await supabase
    .from('decks')
    .select('id')
    .eq('id', deckId)
    .single();

  if (deckError || !deck) {
    throw new Error('Deck não encontrado ou sem permissão de acesso.');
  }

  const { data: existingCard } = await supabase
    .from('deck_cards')
    .select('id, quantity')
    .eq('deck_id', deckId)
    .eq('scryfall_id', cardData.scryfall_id)
    .eq('board', cardData.board)
    .maybeSingle();

  if (existingCard) {
    const { data: updated, error: updateError } = await supabase
      .from('deck_cards')
      .update({ quantity: existingCard.quantity + cardData.quantity })
      .eq('id', existingCard.id)
      .select()
      .single();

    if (updateError) throw new Error(`Erro ao atualizar quantidade: ${updateError.message}`);
    return updated;
  }

  const { data: newCard, error: insertError } = await supabase
    .from('deck_cards')
    .insert({
      deck_id: deckId,
      scryfall_id: cardData.scryfall_id,
      quantity: cardData.quantity,
      board: cardData.board,
    })
    .select()
    .single();

  if (insertError) throw new Error(`Erro ao adicionar carta ao deck: ${insertError.message}`);
  return newCard;
}

// Atualizar quantidade ou board de uma carta no deck
export async function updateCardInDeck(
  userJwt: string, 
  deckId: bigint, 
  deckCardId: bigint, 
  data: UpdateDeckCardInput
) {
  const supabase = createDbClient(userJwt);

  const { data: updatedCard, error } = await supabase
    .from('deck_cards')
    .update(data)
    .eq('id', deckCardId)
    .eq('deck_id', deckId)
    .select()
    .single();

  if (error) {
    if (error.code === 'PGRST116') return null;
    throw new Error(`Erro ao atualizar carta no deck: ${error.message}`);
  }

  return updatedCard;
}

// Remover carta do deck
export async function removeCardFromDeck(userJwt: string, deckId: bigint, deckCardId: bigint) {
  const supabase = createDbClient(userJwt);

  const { data, error } = await supabase
    .from('deck_cards')
    .delete()
    .eq('id', deckCardId)
    .eq('deck_id', deckId)
    .select('id')
    .single();

  if (error) {
    if (error.code === 'PGRST116') return false;
    throw new Error(`Erro ao remover carta: ${error.message}`);
  }

  return true;
}