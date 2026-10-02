// api/src/submodules/auth/auth.service.ts
import { createDbClient } from '../../shared/database/supabase.js';
import type { RegisterInput, LoginInput, UpdateProfileInput } from './auth.schemas.js';

// --- CREATE ------------------------------------------------------------------

export async function registerUser(data: RegisterInput) {
    const supabase = createDbClient('');

    const { data: authData, error } = await supabase.auth.signUp({
        email: data.email,
        password: data.password,
        options: {
            data: {
                name: data.name,
                avatar_url: null,
            },
        },
    });

    if (error) throw new Error(error.message);

    return {
        user: {
            id: authData.user?.id,
            email: authData.user?.email,
            name: data.name,
            avatarUrl: null,
        },
        session: authData.session ? {
            accessToken: authData.session.access_token,
            refreshToken: authData.session.refresh_token,
        } : null,
    };
}

export async function loginUser(data: LoginInput) {
    const supabase = createDbClient('');

    const { data: authData, error } = await supabase.auth.signInWithPassword({
        email: data.email,
        password: data.password,
    });

    if (error) throw new Error('Credenciais inválidas');

    return {
        user: {
            id: authData.user.id,
            email: authData.user.email,
            name: authData.user.user_metadata?.name ?? null,
            avatarUrl: authData.user.user_metadata?.avatar_url ?? null,
        },
        session: {
            accessToken: authData.session.access_token,
            refreshToken: authData.session.refresh_token,
        },
    };
}

// --- READ --------------------------------------------------------------------

export async function getCurrentUserProfile(userJwt: string) {
    const supabase = createDbClient(userJwt);

    const { data: { user }, error: authError } = await supabase.auth.getUser();
    if (authError || !user) throw new Error('Usuário não autenticado');

    const { data: profile } = await supabase
        .from('profiles')
        .select('plan')
        .eq('user_id', user.id)
        .single();

    return {
        id: user.id,
        email: user.email,
        name: user.user_metadata?.name ?? null,
        avatarUrl: user.user_metadata?.avatar_url ?? null,
        plan: profile?.plan ?? 'default',
    };
}

// --- UPDATE ------------------------------------------------------------------

// Atualizar nome, foto e/ou senha do próprio usuário
export async function updateCurrentUserProfile(userJwt: string, data: UpdateProfileInput) {
    const supabaseUrl = process.env.SUPABASE_URL;
    const anonKey = process.env.SUPABASE_ANON_KEY;

    if (!supabaseUrl || !anonKey) {
        throw new Error('Configurações do Supabase ausentes');
    }

    // Primeiro garante que o token é válido e pega os metadados atuais
    const supabase = createDbClient(userJwt);
    const { data: { user }, error: authError } = await supabase.auth.getUser();
    if (authError || !user) throw new Error('Usuário não autenticado');

    const currentMetadata = user.user_metadata || {};
    const updatedMetadata = { ...currentMetadata };

    if (data.name !== undefined) updatedMetadata.name = data.name;
    if (data.avatarUrl !== undefined) updatedMetadata.avatar_url = data.avatarUrl;

    const bodyPayload: Record<string, any> = {
        data: updatedMetadata,
    };

    if (data.password) {
        bodyPayload.password = data.password;
    }

    // Chamada REST direta para a rota oficial /auth/v1/user do Supabase Auth
    const response = await fetch(`${supabaseUrl}/auth/v1/user`, {
        method: 'PUT',
        headers: {
            'apikey': anonKey,
            'Authorization': `Bearer ${userJwt}`,
            'Content-Type': 'application/json',
        },
        body: JSON.stringify(bodyPayload),
    });

    const resJson = await response.json();

    if (!response.ok) {
        throw new Error(resJson.msg || resJson.message || 'Erro ao atualizar perfil');
    }

    return {
        id: resJson.id,
        email: resJson.email,
        name: resJson.user_metadata?.name ?? null,
        avatarUrl: resJson.user_metadata?.avatar_url ?? null,
    };
}

// --- DELETE ------------------------------------------------------------------

// Remover apenas a foto de perfil (reseta para null)
export async function removeCurrentUserAvatar(userJwt: string) {
    return updateCurrentUserProfile(userJwt, { avatarUrl: undefined });
}