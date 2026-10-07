import { z } from 'zod';
export const saveCollectionSchema = z.object({
    scryfall_id: z.union([z.number(), z.string()]).optional().nullable(),
    slug: z.string().trim().optional().nullable(),
    name: z.string().trim().optional().nullable(),
    cardName: z.string().trim().optional().nullable(),
    set_code: z.string().trim().default('cmm'),
    image_url: z.string().url().optional().nullable(),
    quantity: z.number().int().positive().default(1),
    is_foil: z.boolean().default(false),
    condition: z.string().default('NM'),
    language: z.string().default('en'),
});
