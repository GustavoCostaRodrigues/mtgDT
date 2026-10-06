// api/src/submodules/cards/cards.routes.ts
import { Router } from 'express';
import { 
  handleImportCard,
  handleSearchCards, 
  handleGetCardBySlug,
  handleGetCardById,
} from './cards.controller.js';

const cardsRouter = Router();

// --- CREATE ------------------------------------------------------------------
// POST /api/cards - Importar e cadastrar carta
cardsRouter.post('/', handleImportCard);

// --- READ --------------------------------------------------------------------
// 1. GET /api/cards/search?q=termo - Busca rápida / Autocomplete (registrada ANTES de :slug)
cardsRouter.get('/search', handleSearchCards);

// GET /api/cards/id/:id - Detalhes por ID numérico direto (compatibilidade)
cardsRouter.get('/id/:id', handleGetCardById);

// 2. GET /api/cards/:slug - Detalhes completos da carta por slug
cardsRouter.get('/:slug', handleGetCardBySlug);

export { cardsRouter };