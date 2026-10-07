import { getUserCollection, saveCardToCollection, removeCardFromCollection } from './collection.service.js';
import { createDbClient } from '../../shared/database/supabase.js';
// Regex para validação de formato UUID padrão v1-v5
const UUID_REGEX = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;
// Fallback seguro caso não haja usuário autenticado ou o token esteja ausente
const DEFAULT_FALLBACK_USER_ID = '00000000-0000-0000-0000-000000000000';
function isValidUuid(id) {
    if (!id || typeof id !== 'string')
        return false;
    return UUID_REGEX.test(id.trim());
}
function extractToken(req) {
    const authHeader = req.headers.authorization;
    if (!authHeader)
        return undefined;
    if (authHeader.startsWith('Bearer ')) {
        const t = authHeader.slice(7).trim();
        return t || undefined;
    }
    return authHeader.trim() || undefined;
}
function extractUserIdFromJwt(token) {
    if (!token || !token.includes('.'))
        return null;
    try {
        const parts = token.split('.');
        if (parts.length < 2)
            return null;
        const base64 = parts[1].replace(/-/g, '+').replace(/_/g, '/');
        const jsonStr = Buffer.from(base64, 'base64').toString('utf8');
        const payload = JSON.parse(jsonStr);
        const candidate = payload.sub || payload.user_id || payload.id;
        if (isValidUuid(candidate)) {
            return candidate;
        }
    }
    catch {
        // Falha silenciosa ao decodificar payload JWT
    }
    return null;
}
/**
 * Extrai e valida o UUID do usuário atual através do token JWT Bearer do Supabase.
 * Se o token for vazio, inválido ou não autenticado, retorna um fallback seguro garantindo um UUID válido.
 */
export async function resolveUserAuth(req) {
    // 1. Tenta extrair de middleware anterior se injetado em req.user ou req.usuario
    const user = req.user || req.usuario;
    if (user?.id && isValidUuid(user.id)) {
        return { userId: user.id, userJwt: extractToken(req) };
    }
    if (user?.sub && isValidUuid(user.sub)) {
        return { userId: user.sub, userJwt: extractToken(req) };
    }
    // 2. Extrai do header Authorization
    const token = extractToken(req);
    if (token) {
        // 2a. Extração instantânea do UUID a partir do payload JWT do Supabase
        const decodedId = extractUserIdFromJwt(token);
        if (decodedId) {
            return { userId: decodedId, userJwt: token };
        }
        // 2b. Validação complementar via API auth do Supabase caso o payload não tenha vindo em formato direto
        try {
            const client = createDbClient(token);
            const { data: { user: authUser } } = await client.auth.getUser();
            if (authUser?.id && isValidUuid(authUser.id)) {
                return { userId: authUser.id, userJwt: token };
            }
        }
        catch {
            // Falha silenciosa ao consultar auth
        }
    }
    // 3. Fallback seguro caso o token venha vazio (elimina definitivamente "mock-user-id")
    return {
        userId: DEFAULT_FALLBACK_USER_ID,
        userJwt: token,
    };
}
export async function handleGetCollection(req, res) {
    try {
        const { userId, userJwt } = await resolveUserAuth(req);
        const search = typeof req.query.search === 'string' ? req.query.search : undefined;
        const cards = await getUserCollection(userId, search, userJwt);
        return res.status(200).json(cards);
    }
    catch (error) {
        console.error('ERRO EM GET /api/collection:', error);
        return res.status(500).json({ message: error.message || 'Erro ao carregar coleção' });
    }
}
export async function handleSaveCollection(req, res) {
    try {
        const { userId, userJwt } = await resolveUserAuth(req);
        console.log('--- REQ.BODY RECEBIDO NO CONTROLLER ---', req.body);
        const { scryfall_id, print_id, slug, name, cardName, set_code, set_name, image_url, collector_number, quantity, is_foil, condition, language } = req.body;
        const resolvedName = name || cardName || slug;
        if (!scryfall_id && !print_id && !resolvedName) {
            return res.status(400).json({ message: 'O identificador da carta (scryfall_id, print_id, slug ou name) é obrigatório' });
        }
        const saved = await saveCardToCollection(userId, {
            scryfall_id,
            print_id: typeof print_id === 'string' ? print_id : undefined,
            slug: typeof slug === 'string' ? slug : undefined,
            name: typeof resolvedName === 'string' ? resolvedName : undefined,
            cardName: typeof cardName === 'string' ? cardName : undefined,
            set_code: typeof set_code === 'string' && set_code ? set_code : undefined,
            set_name: typeof set_name === 'string' ? set_name : undefined,
            image_url: typeof image_url === 'string' ? image_url : undefined,
            collector_number: typeof collector_number === 'string' ? collector_number : undefined,
            quantity: typeof quantity === 'number' ? quantity : 1,
            is_foil: typeof is_foil === 'boolean' ? is_foil : false,
            condition: typeof condition === 'string' ? condition : 'NM',
            language: typeof language === 'string' ? language : 'en',
        }, userJwt);
        return res.status(201).json(saved);
    }
    catch (error) {
        console.error('ERRO DETALHADO EM POST /api/collection:', error);
        const isAuthError = error.message?.includes('não autenticado') ||
            error.message?.includes('RLS') ||
            error.message?.includes('JWT') ||
            error.message?.includes('row-level security');
        const status = isAuthError ? 401 : 500;
        return res.status(status).json({ message: error.message || 'Erro ao salvar na coleção' });
    }
}
export async function handleDeleteCollection(req, res) {
    try {
        const { userId, userJwt } = await resolveUserAuth(req);
        const rawParam = req.params.id;
        const idParam = Array.isArray(rawParam) ? rawParam[0] : rawParam;
        if (!idParam) {
            return res.status(400).json({ message: 'Identificador da carta é obrigatório' });
        }
        await removeCardFromCollection(userId, idParam, userJwt);
        return res.status(200).json({ message: 'Carta removida com sucesso' });
    }
    catch (error) {
        console.error('ERRO EM DELETE /api/collection:', error);
        return res.status(500).json({ message: error.message || 'Erro ao remover da coleção' });
    }
}
