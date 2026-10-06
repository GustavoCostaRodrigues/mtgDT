// api/src/submodules/cards/cards.controller.ts
import type { Request, Response } from 'express';
import { importCardSchema, cardIdParamSchema } from './cards.schemas.js';
import { 
  importCardFromScryfall, 
  searchCards, 
  getCardBySlug, 
  getCardById 
} from './cards.service.js';

// --- CREATE ------------------------------------------------------------------

// POST /api/cards - Importa e cadastra carta pelo scryfallId
export async function handleImportCard(req: Request, res: Response) {
  try {
    const bodyValidation = importCardSchema.safeParse(req.body);
    if (!bodyValidation.success) {
      return res.status(400).json({
        message: 'Dados inválidos para importação de carta',
        errors: bodyValidation.error.flatten(),
      });
    }

    const card = await importCardFromScryfall(bodyValidation.data);
    return res.status(201).json(card);
  } catch (error: any) {
    return res.status(error.message?.includes('não encontrada') ? 404 : 500).json({
      message: error.message || 'Erro ao importar carta',
    });
  }
}

// --- READ --------------------------------------------------------------------

// 1. GET /api/cards/search?q=termo - Busca Rápida / Autocomplete para dropdown
export async function handleSearchCards(req: Request, res: Response) {
  try {
    const q = req.query.q;

    if (!q || typeof q !== 'string' || !q.trim()) {
      return res.status(400).json({
        message: 'O parâmetro de busca "q" é obrigatório',
      });
    }

    const limit = req.query.limit ? Number(req.query.limit) : 8;
    const cards = await searchCards(q.trim(), isNaN(limit) ? 8 : limit);

    return res.status(200).json(cards);
  } catch (error: any) {
    return res.status(500).json({
      message: error.message || 'Erro ao buscar cartas',
    });
  }
}

// 2. GET /api/cards/:slug - Detalhes completos da carta por slug (ou ID)
export async function handleGetCardBySlug(req: Request, res: Response) {
  try {
    const rawSlug = req.params.slug;
    const slug = typeof rawSlug === 'string' ? rawSlug.trim() : '';

    if (!slug) {
      return res.status(400).json({
        message: 'O identificador slug da carta é obrigatório',
      });
    }

    const card = await getCardBySlug(slug);
    return res.status(200).json(card);
  } catch (error: any) {
    if (error.message?.includes('não encontrada')) {
      return res.status(404).json({
        message: 'Carta não encontrada',
      });
    }

    return res.status(500).json({
      message: error.message || 'Erro ao carregar detalhes da carta',
    });
  }
}

// GET /api/cards/id/:id - Buscar por ID numérico direto (compatibilidade)
export async function handleGetCardById(req: Request, res: Response) {
  try {
    const paramValidation = cardIdParamSchema.safeParse(req.params);

    if (!paramValidation.success) {
      return res.status(400).json({
        message: 'ID inválido',
        errors: paramValidation.error.flatten(),
      });
    }

    const card = await getCardById(paramValidation.data.id);
    return res.status(200).json(card);
  } catch (error: any) {
    if (error.message?.includes('não encontrada')) {
      return res.status(404).json({
        message: 'Carta não encontrada no catálogo',
      });
    }

    return res.status(500).json({
      message: error.message || 'Erro ao buscar carta',
    });
  }
}