import { listDecksQuerySchema, deckIdParamSchema, createDeckSchema, updateDeckSchema, deckCardParamsSchema, addCardToDeckSchema, updateDeckCardSchema } from './decks.schemas.js';
import { listUserDecks, getDeckDetailsById, createDeck, updateDeck, deleteDeck, addCardToDeck, updateCardInDeck, removeCardFromDeck } from './decks.service.js';
// --- CREATE ------------------------------------------------------------------
// POST /api/decks - Criar deck
export async function handleCreateDeck(req, res) {
    try {
        const authHeader = req.headers.authorization;
        const userJwt = authHeader?.split(' ')[1];
        if (!userJwt)
            return res.status(401).json({ message: 'Token de autenticação não fornecido' });
        const bodyValidation = createDeckSchema.safeParse(req.body);
        if (!bodyValidation.success) {
            return res.status(400).json({
                message: 'Dados inválidos para criação do deck',
                errors: bodyValidation.error.flatten(),
            });
        }
        const newDeck = await createDeck(userJwt, bodyValidation.data);
        return res.status(201).json(newDeck);
    }
    catch (error) {
        if (error.message?.includes('Limite de decks atingido')) {
            return res.status(403).json({ message: error.message });
        }
        return res.status(500).json({ message: error.message || 'Erro interno do servidor' });
    }
}
// --- READ --------------------------------------------------------------------
// GET /api/decks - Listar decks
export async function handleListDecks(req, res) {
    try {
        const authHeader = req.headers.authorization;
        const userJwt = authHeader?.split(' ')[1];
        if (!userJwt)
            return res.status(401).json({ message: 'Token de autenticação não fornecido' });
        const queryValidation = listDecksQuerySchema.safeParse(req.query);
        if (!queryValidation.success) {
            return res.status(400).json({
                message: 'Parâmetros inválidos',
                errors: queryValidation.error.flatten()
            });
        }
        const decks = await listUserDecks(userJwt, queryValidation.data);
        return res.status(200).json(decks);
    }
    catch (error) {
        return res.status(500).json({ message: error.message || 'Erro interno do servidor' });
    }
}
// GET /api/decks/:id - Detalhes do deck
export async function handleGetDeckById(req, res) {
    try {
        const authHeader = req.headers.authorization;
        const userJwt = authHeader?.split(' ')[1];
        if (!userJwt)
            return res.status(401).json({ message: 'Token de autenticação não fornecido' });
        const paramValidation = deckIdParamSchema.safeParse(req.params);
        if (!paramValidation.success) {
            return res.status(400).json({
                message: 'ID do deck inválido',
                errors: paramValidation.error.flatten(),
            });
        }
        const deck = await getDeckDetailsById(userJwt, paramValidation.data.id);
        if (!deck) {
            return res.status(404).json({ message: 'Deck não encontrado' });
        }
        return res.status(200).json(deck);
    }
    catch (error) {
        return res.status(500).json({ message: error.message || 'Erro interno do servidor' });
    }
}
// --- UPDATE ------------------------------------------------------------------
// PATCH /api/decks/:id - Atualizar deck
export async function handleUpdateDeck(req, res) {
    try {
        const authHeader = req.headers.authorization;
        const userJwt = authHeader?.split(' ')[1];
        if (!userJwt)
            return res.status(401).json({ message: 'Token de autenticação não fornecido' });
        const paramValidation = deckIdParamSchema.safeParse(req.params);
        if (!paramValidation.success) {
            return res.status(400).json({
                message: 'ID do deck inválido',
                errors: paramValidation.error.flatten(),
            });
        }
        const bodyValidation = updateDeckSchema.safeParse(req.body);
        if (!bodyValidation.success) {
            return res.status(400).json({
                message: 'Dados de atualização inválidos',
                errors: bodyValidation.error.flatten(),
            });
        }
        const updatedDeck = await updateDeck(userJwt, paramValidation.data.id, bodyValidation.data);
        if (!updatedDeck) {
            return res.status(404).json({ message: 'Deck não encontrado' });
        }
        return res.status(200).json(updatedDeck);
    }
    catch (error) {
        return res.status(500).json({ message: error.message || 'Erro interno do servidor' });
    }
}
// --- DELETE ------------------------------------------------------------------
// DELETE /api/decks/:id - Excluir deck
export async function handleDeleteDeck(req, res) {
    try {
        const authHeader = req.headers.authorization;
        const userJwt = authHeader?.split(' ')[1];
        if (!userJwt)
            return res.status(401).json({ message: 'Token de autenticação não fornecido' });
        const paramValidation = deckIdParamSchema.safeParse(req.params);
        if (!paramValidation.success) {
            return res.status(400).json({
                message: 'ID do deck inválido',
                errors: paramValidation.error.flatten(),
            });
        }
        const wasDeleted = await deleteDeck(userJwt, paramValidation.data.id);
        if (!wasDeleted) {
            return res.status(404).json({ message: 'Deck não encontrado' });
        }
        return res.status(204).send();
    }
    catch (error) {
        return res.status(500).json({ message: error.message || 'Erro interno do servidor' });
    }
}
// --- EXTRA RULES / CARDS -----------------------------------------------------
// POST /api/decks/:id/cards - Adicionar carta ao deck
export async function handleAddCardToDeck(req, res) {
    try {
        const authHeader = req.headers.authorization;
        const userJwt = authHeader?.split(' ')[1];
        if (!userJwt)
            return res.status(401).json({ message: 'Token não fornecido' });
        const paramValidation = deckIdParamSchema.safeParse(req.params);
        if (!paramValidation.success) {
            return res.status(400).json({ message: 'ID do deck inválido', errors: paramValidation.error.flatten() });
        }
        const bodyValidation = addCardToDeckSchema.safeParse(req.body);
        if (!bodyValidation.success) {
            return res.status(400).json({ message: 'Dados inválidos', errors: bodyValidation.error.flatten() });
        }
        const result = await addCardToDeck(userJwt, paramValidation.data.id, bodyValidation.data);
        return res.status(201).json(result);
    }
    catch (error) {
        return res.status(500).json({ message: error.message || 'Erro interno do servidor' });
    }
}
// PATCH /api/decks/:id/cards/:cardId - Atualizar quantidade ou board da carta
export async function handleUpdateCardInDeck(req, res) {
    try {
        const authHeader = req.headers.authorization;
        const userJwt = authHeader?.split(' ')[1];
        if (!userJwt)
            return res.status(401).json({ message: 'Token não fornecido' });
        const paramsValidation = deckCardParamsSchema.safeParse(req.params);
        if (!paramsValidation.success) {
            return res.status(400).json({ message: 'Parâmetros inválidos', errors: paramsValidation.error.flatten() });
        }
        const bodyValidation = updateDeckCardSchema.safeParse(req.body);
        if (!bodyValidation.success) {
            return res.status(400).json({ message: 'Dados inválidos', errors: bodyValidation.error.flatten() });
        }
        const updated = await updateCardInDeck(userJwt, paramsValidation.data.id, paramsValidation.data.cardId, bodyValidation.data);
        if (!updated) {
            return res.status(404).json({ message: 'Carta não encontrada no deck' });
        }
        return res.status(200).json(updated);
    }
    catch (error) {
        return res.status(500).json({ message: error.message || 'Erro interno do servidor' });
    }
}
// DELETE /api/decks/:id/cards/:cardId - Remover carta do deck
export async function handleRemoveCardFromDeck(req, res) {
    try {
        const authHeader = req.headers.authorization;
        const userJwt = authHeader?.split(' ')[1];
        if (!userJwt)
            return res.status(401).json({ message: 'Token não fornecido' });
        const paramsValidation = deckCardParamsSchema.safeParse(req.params);
        if (!paramsValidation.success) {
            return res.status(400).json({ message: 'Parâmetros inválidos', errors: paramsValidation.error.flatten() });
        }
        const removed = await removeCardFromDeck(userJwt, paramsValidation.data.id, paramsValidation.data.cardId);
        if (!removed) {
            return res.status(404).json({ message: 'Carta não encontrada no deck' });
        }
        return res.status(204).send();
    }
    catch (error) {
        return res.status(500).json({ message: error.message || 'Erro interno do servidor' });
    }
}
