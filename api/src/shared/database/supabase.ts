import { createClient } from '@supabase/supabase-js';
import dotenv from 'dotenv';

dotenv.config();

const supabaseUrl = process.env.SUPABASE_URL;
const supabaseKey = process.env.SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseKey) {
    throw new Error('Variáveis SUPABASE_URL e SUPABASE_ANON_KEY são obrigatórias');
}

/**
 * Cria um cliente Supabase com o token JWT do usuário.
 * Isso garante que o RLS do banco de dados seja aplicado corretamente.
 */
export const createDbClient = (userJwt?: string) => {
    const options = userJwt
        ? {
            global: {
                headers: {
                    Authorization: `Bearer ${userJwt}`,
                },
            },
        }
        : {};

    return createClient(supabaseUrl, supabaseKey, {
        auth: {
            persistSession: false,
            autoRefreshToken: false,
        },
        ...options,
    });
};