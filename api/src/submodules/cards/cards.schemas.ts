// api/src/submodules/cards/cards.schemas.ts
import { z } from 'zod';

// --- CREATE --------------------------------------------------------------------

// Body: Importar/inserir carta pelo ID do Scryfall
export const importCardSchema = z.object({
    scryfallId: z.string().uuid('O scryfallId deve ser um UUID válido'),
});

export type ImportCardInput = z.infer<typeof importCardSchema>;

// --- READ --------------------------------------------------------------------

export const searchCardsSchema = z.object({
    q: z.string().trim().min(1, 'Termo de busca obrigatório'),
});

export type SearchCardsInput = z.infer<typeof searchCardsSchema>;

// Query: Busca textual de cartas (?q=lightning&limit=15)
export const searchCardsQuerySchema = z.object({
    q: z.string().trim().min(2, 'Digite pelo menos 2 caracteres para buscar').max(100),
    limit: z.coerce.number().int().min(1).max(50).default(15),
});

export type SearchCardsQueryInput = z.infer<typeof searchCardsQuerySchema>;

// Params: Identificador da carta no cache (:id)
export const cardIdParamSchema = z.object({
    id: z.coerce.bigint().positive(),
});

export type CardIdParamInput = z.infer<typeof cardIdParamSchema>;

// --- UPDATE --------------------------------------------------------------------


// --- DELETE --------------------------------------------------------------------


// --- REGRAS/CARDS --------------------------------------------------------------------