// api/src/submodules/decks/decks.routes.ts
import { Router } from 'express';
import { 
  handleListDecks, 
  handleGetDeckById, 
  handleCreateDeck, 
  handleUpdateDeck,
  handleDeleteDeck,
  handleAddCardToDeck,
  handleUpdateCardInDeck,
  handleRemoveCardFromDeck
} from './decks.controller.js';

const decksRouter = Router();

// --- CREATE ------------------------------------------------------------------

// POST /api/decks - Criar deck
decksRouter.post('/', handleCreateDeck);

// --- READ --------------------------------------------------------------------

// GET /api/decks - Listar decks
decksRouter.get('/', handleListDecks);

// GET /api/decks/:id - Detalhes do deck
decksRouter.get('/:id', handleGetDeckById);

// --- UPDATE ------------------------------------------------------------------

// PATCH /api/decks/:id - Atualizar deck
decksRouter.patch('/:id', handleUpdateDeck);

// --- DELETE ------------------------------------------------------------------

// DELETE /api/decks/:id - Excluir deck
decksRouter.delete('/:id', handleDeleteDeck);

// --- EXTRA RULES / CARDS -----------------------------------------------------

// POST /api/decks/:id/cards - Adicionar carta
decksRouter.post('/:id/cards', handleAddCardToDeck);

// PATCH /api/decks/:id/cards/:cardId - Atualizar quantidade ou board
decksRouter.patch('/:id/cards/:cardId', handleUpdateCardInDeck);

// DELETE /api/decks/:id/cards/:cardId - Remover carta do deck
decksRouter.delete('/:id/cards/:cardId', handleRemoveCardFromDeck);

export { decksRouter };