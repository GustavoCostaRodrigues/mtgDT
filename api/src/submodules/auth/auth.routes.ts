// api/src/submodules/auth/auth.routes.ts
import { Router } from 'express';
import {
    handleRegister,
    handleLogin,
    handleGetMe,
    handleUpdateMe,
    handleDeleteAvatar
} from './auth.controller.js';

const authRouter = Router();

// --- CREATE ------------------------------------------------------------------

// POST /api/auth/register - Cadastro de usuário
authRouter.post('/register', handleRegister);

// POST /api/auth/login - Autenticação
authRouter.post('/login', handleLogin);

// --- READ --------------------------------------------------------------------

// GET /api/auth/me - Dados do usuário para navbar e tela de perfil
authRouter.get('/me', handleGetMe);

// --- UPDATE ------------------------------------------------------------------

// PATCH /api/auth/me - Editar nome, foto ou senha
authRouter.patch('/me', handleUpdateMe);

// --- DELETE ------------------------------------------------------------------

// DELETE /api/auth/me/avatar - Excluir foto de perfil
authRouter.delete('/me/avatar', handleDeleteAvatar);

export { authRouter };