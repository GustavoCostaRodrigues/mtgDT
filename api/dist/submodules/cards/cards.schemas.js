// api/src/submodules/cards/cards.schemas.ts
import { z } from 'zod';
// --- CREATE --------------------------------------------------------------------
// Body: Importar/inserir carta pelo ID do Scryfall
export const importCardSchema = z.object({
    scryfallId: z.string().uuid('O scryfallId deve ser um UUID válido'),
});
// --- READ --------------------------------------------------------------------
// Query: Busca textual / autocomplete (?q=termo&limit=8)
export const searchCardsQuerySchema = z.object({
    q: z.string().trim().min(1, 'O termo de busca é obrigatório').max(100),
    limit: z.coerce.number().int().min(1).max(50).default(8),
});
export const searchCardsSchema = z.object({
    query: z.object({
        q: z.string().trim().min(1, 'O termo de busca é obrigatório'),
    }),
});
// Params: Identificador por slug (:slug)
export const getCardBySlugSchema = z.object({
    params: z.object({
        slug: z.string().trim().min(1, 'O slug da carta é obrigatório'),
    }),
});
// Params: Identificador da carta no cache (:id)
export const cardIdParamSchema = z.object({
    id: z.coerce.bigint().positive(),
});
