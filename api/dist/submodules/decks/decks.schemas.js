// api/src/submodules/decks/decks.schemas.ts
import { z } from 'zod';
// --- CREATE ------------------------------------------------------------------
// Body: Criar deck
export const createDeckSchema = z.object({
    name: z.string().trim().min(1, 'O nome do deck é obrigatório').max(100, 'Máximo de 100 caracteres'),
    format: z.enum(['commander', 'standard', 'modern', 'pauper', 'pioneer', 'brawl', 'casual']),
    description: z.string().trim().max(500, 'A descrição pode ter no máximo 500 caracteres').optional(),
});
// --- READ --------------------------------------------------------------------
// Query: Listar decks (?limit=4&sort=updated_at:desc)
export const listDecksQuerySchema = z.object({
    limit: z.coerce.number().min(1).max(20).default(4),
    sort: z.enum(['updated_at:desc', 'name:asc']).default('updated_at:desc'),
});
// Params: Identificador de rota (:id) - Reutilizado no READ, UPDATE e DELETE
export const deckIdParamSchema = z.object({
    id: z.coerce.bigint().positive(),
});
// --- UPDATE ------------------------------------------------------------------
// Body: Atualizar deck
export const updateDeckSchema = z.object({
    name: z.string().trim().min(1, 'O nome não pode ser vazio').max(100, 'Máximo de 100 caracteres').optional(),
    format: z.enum(['commander', 'standard', 'modern', 'pauper', 'pioneer', 'brawl', 'casual']).optional(),
    description: z.string().trim().max(500, 'Máximo de 500 caracteres').nullable().optional(),
    is_private: z.boolean().optional(),
}).refine((data) => Object.keys(data).length > 0, {
    message: 'Envie pelo menos um campo para atualização',
});
// --- DELETE ------------------------------------------------------------------
// O DELETE utiliza deckIdParamSchema definido no READ
// --- EXTRA RULES / CARDS -----------------------------------------------------
// Params: Identificadores de rota (:id e :cardId)
export const deckCardParamsSchema = z.object({
    id: z.coerce.bigint().positive(),
    cardId: z.coerce.bigint().positive(),
});
// Body: Adicionar carta ao deck
export const addCardToDeckSchema = z.object({
    scryfall_id: z.coerce.bigint().positive('ID da carta no cache é obrigatório'),
    quantity: z.number().int().min(1, 'Quantidade mínima é 1').default(1),
    board: z.enum(['mainboard', 'sideboard', 'maybeboard', 'commander']).default('mainboard'),
});
// Body: Atualizar carta no deck
export const updateDeckCardSchema = z.object({
    quantity: z.number().int().min(1, 'Quantidade mínima é 1').optional(),
    board: z.enum(['mainboard', 'sideboard', 'maybeboard', 'commander']).optional(),
}).refine((data) => Object.keys(data).length > 0, {
    message: 'Envie ao menos quantity ou board para atualizar',
});
