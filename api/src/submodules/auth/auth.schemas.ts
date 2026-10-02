// api/src/submodules/auth/auth.schemas.ts
import { z } from 'zod';

// --- CREATE ------------------------------------------------------------------

// Body: Registro de novo usuário
export const registerSchema = z.object({
  name: z.string().trim().min(2, 'O nome deve ter no mínimo 2 caracteres').max(100),
  email: z.string().trim().email('E-mail inválido'),
  password: z.string().min(6, 'A senha deve ter no mínimo 6 caracteres'),
  confirmPassword: z.string().min(6, 'A confirmação de senha deve ter no mínimo 6 caracteres'),
}).refine((data) => data.password === data.confirmPassword, {
  message: 'As senhas não coincidem',
  path: ['confirmPassword'],
});

export type RegisterInput = z.infer<typeof registerSchema>;

// Body: Login de usuário
export const loginSchema = z.object({
  email: z.string().trim().email('E-mail inválido'),
  password: z.string().min(1, 'A senha é obrigatória'),
});

export type LoginInput = z.infer<typeof loginSchema>;

// --- READ --------------------------------------------------------------------

// Não requer schemas de entrada (identidade extraída do token JWT)

// --- UPDATE ------------------------------------------------------------------

// Body: Atualizar perfil do usuário (nome, avatar e/ou senha)
export const updateProfileSchema = z.object({
  name: z.string().trim().min(2, 'Nome não pode ser vazio').max(100).optional(),
  avatarUrl: z.string().trim().url('URL da foto inválida').optional(),
  password: z.string().min(6, 'Nova senha deve ter no mínimo 6 caracteres').optional(),
}).refine((data) => Object.keys(data).length > 0, {
  message: 'Envie ao menos um campo para atualização',
});

export type UpdateProfileInput = z.infer<typeof updateProfileSchema>;

// --- DELETE ------------------------------------------------------------------

// Apenas deleção da foto de perfil (não requer body nem params)