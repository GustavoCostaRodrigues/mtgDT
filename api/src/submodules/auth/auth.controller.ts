// api/src/submodules/auth/auth.controller.ts
import type { Request, Response } from 'express';
import { registerSchema, loginSchema, updateProfileSchema } from './auth.schemas.js';
import {
  registerUser,
  loginUser,
  getCurrentUserProfile,
  updateCurrentUserProfile,
  removeCurrentUserAvatar
} from './auth.service.js';

// --- CREATE ------------------------------------------------------------------

// POST /api/auth/register - Cadastro
export async function handleRegister(req: Request, res: Response) {
  try {
    const bodyValidation = registerSchema.safeParse(req.body);
    if (!bodyValidation.success) {
      return res.status(400).json({
        message: 'Dados de registro inválidos',
        errors: bodyValidation.error.flatten(),
      });
    }

    const result = await registerUser(bodyValidation.data);
    return res.status(201).json(result);
  } catch (error: any) {
    return res.status(400).json({ message: error.message || 'Erro ao registrar usuário' });
  }
}

// POST /api/auth/login - Login
export async function handleLogin(req: Request, res: Response) {
  try {
    const bodyValidation = loginSchema.safeParse(req.body);
    if (!bodyValidation.success) {
      return res.status(400).json({
        message: 'Dados de login inválidos',
        errors: bodyValidation.error.flatten(),
      });
    }

    // O loginUser (no service) recebe os dados validados, incluindo o rememberMe
    const result = await loginUser(bodyValidation.data);
    return res.status(200).json(result);
  } catch (error: any) {
    return res.status(401).json({ message: error.message || 'Credenciais inválidas' });
  }
}

// --- READ --------------------------------------------------------------------

// GET /api/auth/me - Obter dados para navbar e tela de perfil
export async function handleGetMe(req: Request, res: Response) {
  try {
    const authHeader = req.headers.authorization;
    const userJwt = authHeader?.split(' ')[1];
    if (!userJwt) return res.status(401).json({ message: 'Token de autenticação não fornecido' });

    const profile = await getCurrentUserProfile(userJwt);
    return res.status(200).json(profile);
  } catch (error: any) {
    return res.status(401).json({ message: error.message || 'Sessão inválida ou expirada' });
  }
}

// --- UPDATE ------------------------------------------------------------------

// PATCH /api/auth/me - Atualizar nome, foto ou senha
export async function handleUpdateMe(req: Request, res: Response) {
  try {
    const authHeader = req.headers.authorization;
    const userJwt = authHeader?.split(' ')[1];
    if (!userJwt) return res.status(401).json({ message: 'Token de autenticação não fornecido' });

    const bodyValidation = updateProfileSchema.safeParse(req.body);
    if (!bodyValidation.success) {
      return res.status(400).json({
        message: 'Dados de atualização inválidos',
        errors: bodyValidation.error.flatten(),
      });
    }

    const updated = await updateCurrentUserProfile(userJwt, bodyValidation.data);
    return res.status(200).json(updated);
  } catch (error: any) {
    return res.status(500).json({ message: error.message || 'Erro ao atualizar dados' });
  }
}

// --- DELETE ------------------------------------------------------------------

// DELETE /api/auth/me/avatar - Remover foto de perfil
export async function handleDeleteAvatar(req: Request, res: Response) {
  try {
    const authHeader = req.headers.authorization;
    const userJwt = authHeader?.split(' ')[1];
    if (!userJwt) return res.status(401).json({ message: 'Token de autenticação não fornecido' });

    const result = await removeCurrentUserAvatar(userJwt);
    return res.status(200).json(result);
  } catch (error: any) {
    return res.status(500).json({ message: error.message || 'Erro ao remover foto' });
  }
}