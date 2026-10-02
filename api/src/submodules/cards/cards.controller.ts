// api/src/submodules/cards/cards.controller.ts
import type { Request, Response } from 'express';
import { importCardSchema, searchCardsQuerySchema, cardIdParamSchema } from './cards.schemas.js';
import { importCardFromScryfall, searchCards, getCardById } from './cards.service.js';

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
        return res.status(error.message.includes('não encontrada') ? 404 : 500).json({
            message: error.message || 'Erro ao importar carta',
        });
    }
}

// --- READ --------------------------------------------------------------------

// GET /api/cards/search - Pesquisar cartas por nome
export async function handleSearchCards(req: Request, res: Response) {
    try {
        const authHeader = req.headers.authorization;
        const userJwt = authHeader?.split(' ')[1] || '';

        const queryValidation = searchCardsQuerySchema.safeParse(req.query);
        if (!queryValidation.success) {
            return res.status(400).json({
                message: 'Termo de busca inválido',
                errors: queryValidation.error.flatten(),
            });
        }

        const cards = await searchCards(userJwt, queryValidation.data);
        return res.status(200).json(cards);
    } catch (error: any) {
        return res.status(500).json({ message: error.message || 'Erro interno do servidor' });
    }
}

// GET /api/cards/:id
export async function handleGetCardById(req: Request, res: Response) {
    try {
        const paramValidation = cardIdParamSchema.safeParse(req.params);

        if (!paramValidation.success) {
            return res.status(400).json({
                message: 'ID inválido',
                errors: paramValidation.error.flatten(),
            });
        }

        // AQUI: Passe APENAS o id (1 argumento)
        const card = await getCardById(paramValidation.data.id);

        return res.status(200).json(card);
    } catch (error: any) {
        if (error.message.includes('não encontrada')) {
            return res.status(404).json({ message: error.message });
        }

        return res.status(500).json({
            message: error.message || 'Erro ao buscar carta',
        });
    }
}