// api/src/submodules/cards/cards.routes.ts
import { Router } from 'express';
import { 
  handleImportCard,
  handleSearchCards, 
  handleGetCardById 
} from './cards.controller.js';

const cardsRouter = Router();

// --- CREATE ------------------------------------------------------------------
cardsRouter.post('/', handleImportCard);

// --- READ --------------------------------------------------------------------
cardsRouter.get('/search', handleSearchCards);
cardsRouter.get('/:id', handleGetCardById);

// --- READ --------------------------------------------------------------------

// GET /api/cards/search - Pesquisar cartas
cardsRouter.get('/search', handleSearchCards);

// GET /api/cards/:id - Detalhes da carta
cardsRouter.get('/:id', handleGetCardById);

export { cardsRouter };