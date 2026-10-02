import React, { useState } from 'react';
import { BackgroundBeams } from '../../components/ui/background-beams';

interface RegisterPageProps {
    onNavigateLogin?: () => void;
    onNavigateHome?: () => void;
}

export function RegisterPage({ onNavigateLogin, onNavigateHome }: RegisterPageProps) {
    const [name, setName] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [showPassword, setShowPassword] = useState(false);
    const [showConfirmPassword, setShowConfirmPassword] = useState(false);
    const [loading, setLoading] = useState(false);
    const [errorMessage, setErrorMessage] = useState('');
    const [successMessage, setSuccessMessage] = useState('');

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setErrorMessage('');
        setSuccessMessage('');

        if (password !== confirmPassword) {
            setErrorMessage('As senhas não coincidem.');
            return;
        }

        setLoading(true);

        try {
            const response = await fetch('/api/auth/register', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    name,
                    email,
                    password,
                    confirmPassword,
                }),
            });

            if (response.status === 201) {
                setSuccessMessage('Usuário cadastrado com sucesso! Redirecionando...');
                setTimeout(() => {
                    if (onNavigateLogin) {
                        onNavigateLogin();
                    }
                }, 1500);
                return;
            }

            const data = await response.json().catch(() => null);
            if (response.status === 400) {
                let msg = data?.message || 'Dados inválidos. Verifique as informações fornecidas.';
                if (data?.errors?.fieldErrors) {
                    const fieldMsgs = (Object.values(data.errors.fieldErrors) as string[][]).flat();
                    if (fieldMsgs.length > 0) {
                        msg = fieldMsgs.join(' ');
                    }
                }
                setErrorMessage(msg);
            } else {
                setErrorMessage(data?.message || `Erro no registro (código: ${response.status}).`);
            }
        } catch {
            setErrorMessage('Falha ao conectar com o servidor. Verifique se a API está em execução.');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="h-screen max-h-screen w-full bg-[#09090b] text-[#e4e1e6] flex flex-col justify-between overflow-hidden relative selection:bg-[#8083ff] selection:text-[#0d0096]">
            <BackgroundBeams />

            {/* Top Header */}
            <header className="z-50 w-full h-14 bg-[#0e0e11]/85 backdrop-blur-2xl border-b border-white/5 flex-shrink-0 px-6 flex items-center justify-between">
                <button
                    type="button"
                    onClick={onNavigateHome}
                    className="flex items-center gap-3 hover:opacity-90 transition-opacity cursor-pointer"
                >
                    <div className="w-9 h-9 flex items-center justify-center flex-shrink-0">
                        <img src="/logo.png" alt="DeckTracker Logo" className="w-full h-full object-contain filter drop-shadow-[0_0_8px_rgba(128,131,255,0.4)]" />
                    </div>
                    <span className="font-bold text-base tracking-wider text-[#e4e1e6]">DECKTRACKER</span>
                    <span className="text-[10px] font-bold px-1.5 py-0.5 rounded bg-[#2a2a2d] text-[#c0c1ff]">MTG</span>
                </button>

                <button
                    type="button"
                    onClick={onNavigateHome}
                    className="text-xs text-[#908fa0] hover:text-[#e4e1e6] transition-colors cursor-pointer"
                >
                    ← Voltar ao início
                </button>
            </header>

            {/* Card Central */}
            <main className="w-full flex-1 flex items-center justify-center px-4 relative z-10 min-h-0 overflow-y-auto py-4">
                <div className="w-full max-w-[440px] rounded-2xl p-6 sm:p-8 bg-[#141418]/90 border border-white/10 backdrop-blur-2xl shadow-[0_24px_64px_rgba(0,0,0,0.95)] flex flex-col gap-4">

                    <div className="flex flex-col gap-1 text-center items-center">
                        <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-[#1b1b1e] border border-white/5 mb-0.5">
                            <span className="w-1.5 h-1.5 rounded-full bg-[#c0c1ff] animate-pulse" />
                            <span className="font-mono text-[9px] uppercase tracking-wider text-[#c0c1ff] font-bold">
                                Novo Arquiteto
                            </span>
                        </div>
                        <h2 className="text-2xl font-extrabold tracking-tight text-[#e4e1e6]">
                            Criar Conta
                        </h2>
                        <p className="text-xs text-[#908fa0]">
                            Cadastre-se para gerenciar seus decks e telemetrias táticas.
                        </p>
                    </div>

                    {/* Feedback de Erro ou Sucesso */}
                    {errorMessage && (
                        <div className="px-3 py-2 rounded-xl bg-red-500/10 border border-red-500/20 text-red-400 text-xs text-center font-medium">
                            {errorMessage}
                        </div>
                    )}

                    {successMessage && (
                        <div className="px-3 py-2 rounded-xl bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 text-xs text-center font-medium">
                            {successMessage}
                        </div>
                    )}

                    <form onSubmit={handleSubmit} className="flex flex-col gap-3">
                        <div className="flex flex-col gap-1">
                            <label className="text-[11px] font-semibold text-[#c7c4d7]" htmlFor="name">
                                Nome completo
                            </label>
                            <input
                                id="name"
                                type="text"
                                required
                                disabled={loading}
                                placeholder="Ex: Gustavo Costa"
                                value={name}
                                onChange={(e) => setName(e.target.value)}
                                className="w-full px-3.5 py-2.5 rounded-xl bg-[#1b1b1e]/80 border border-white/10 text-xs text-[#e4e1e6] placeholder:text-[#908fa0]/50 focus:outline-none focus:border-[#7bd0ff] focus:ring-1 focus:ring-[#7bd0ff] transition-all disabled:opacity-50"
                            />
                        </div>

                        <div className="flex flex-col gap-1">
                            <label className="text-[11px] font-semibold text-[#c7c4d7]" htmlFor="email">
                                E-mail
                            </label>
                            <input
                                id="email"
                                type="email"
                                required
                                disabled={loading}
                                placeholder="gustavo@exemplo.com"
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                className="w-full px-3.5 py-2.5 rounded-xl bg-[#1b1b1e]/80 border border-white/10 text-xs text-[#e4e1e6] placeholder:text-[#908fa0]/50 focus:outline-none focus:border-[#7bd0ff] focus:ring-1 focus:ring-[#7bd0ff] transition-all disabled:opacity-50"
                            />
                        </div>

                        <div className="flex flex-col gap-1">
                            <label className="text-[11px] font-semibold text-[#c7c4d7]" htmlFor="password">
                                Senha
                            </label>
                            <div className="relative">
                                <input
                                    id="password"
                                    type={showPassword ? 'text' : 'password'}
                                    required
                                    disabled={loading}
                                    placeholder="••••••••"
                                    value={password}
                                    onChange={(e) => setPassword(e.target.value)}
                                    className="w-full px-3.5 py-2.5 rounded-xl bg-[#1b1b1e]/80 border border-white/10 text-xs text-[#e4e1e6] placeholder:text-[#908fa0]/50 focus:outline-none focus:border-[#7bd0ff] focus:ring-1 focus:ring-[#7bd0ff] transition-all pr-10 disabled:opacity-50"
                                />
                                <button
                                    type="button"
                                    onClick={() => setShowPassword(!showPassword)}
                                    className="absolute right-3 top-1/2 -translate-y-1/2 text-[#908fa0] hover:text-[#e4e1e6] transition-colors cursor-pointer"
                                >
                                    {showPassword ? (
                                        <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.8} d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.88 9.88l-3.29-3.29m7.532 7.532l3.29 3.29M3 3l18 18" />
                                        </svg>
                                    ) : (
                                        <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.8} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.8} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                                        </svg>
                                    )}
                                </button>
                            </div>
                        </div>

                        <div className="flex flex-col gap-1">
                            <label className="text-[11px] font-semibold text-[#c7c4d7]" htmlFor="confirm-password">
                                Confirmar senha
                            </label>
                            <div className="relative">
                                <input
                                    id="confirm-password"
                                    type={showConfirmPassword ? 'text' : 'password'}
                                    required
                                    disabled={loading}
                                    placeholder="••••••••"
                                    value={confirmPassword}
                                    onChange={(e) => setConfirmPassword(e.target.value)}
                                    className="w-full px-3.5 py-2.5 rounded-xl bg-[#1b1b1e]/80 border border-white/10 text-xs text-[#e4e1e6] placeholder:text-[#908fa0]/50 focus:outline-none focus:border-[#7bd0ff] focus:ring-1 focus:ring-[#7bd0ff] transition-all pr-10 disabled:opacity-50"
                                />
                                <button
                                    type="button"
                                    onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                                    className="absolute right-3 top-1/2 -translate-y-1/2 text-[#908fa0] hover:text-[#e4e1e6] transition-colors cursor-pointer"
                                >
                                    {showConfirmPassword ? (
                                        <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.8} d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.88 9.88l-3.29-3.29m7.532 7.532l3.29 3.29M3 3l18 18" />
                                        </svg>
                                    ) : (
                                        <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.8} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.8} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                                        </svg>
                                    )}
                                </button>
                            </div>
                        </div>

                        <button
                            type="submit"
                            disabled={loading}
                            className="mt-2 w-full py-3 rounded-xl bg-[#e4e1e6] hover:bg-[#c0c1ff] text-[#0e0e11] font-bold text-xs shadow-lg transition-all flex items-center justify-center gap-2 disabled:opacity-50 cursor-pointer"
                        >
                            {loading ? (
                                <div className="w-4 h-4 border-2 border-[#0e0e11] border-t-transparent rounded-full animate-spin" />
                            ) : (
                                <>
                                    <span>Criar Conta</span>
                                    <span>→</span>
                                </>
                            )}
                        </button>

                        {/* Link para Login */}
                        <div className="flex items-center justify-center gap-1.5 pt-1 text-xs text-[#908fa0]">
                            <span>Já tem uma conta?</span>
                            <button
                                type="button"
                                onClick={onNavigateLogin}
                                className="text-[#c0c1ff] font-semibold hover:underline cursor-pointer"
                            >
                                Entrar
                            </button>
                        </div>
                    </form>

                </div>
            </main>

            <footer className="w-full h-10 bg-[#0e0e11] border-t border-white/5 px-6 flex items-center justify-between text-[11px] text-[#908fa0] flex-shrink-0 z-10">
                <div>© 2026 MTG DeckTracker. Todos os direitos reservados.</div>
                <div className="flex items-center gap-3">
                    <a href="#terms" className="hover:underline">Termos</a>
                    <a href="#privacy" className="hover:underline">Privacidade</a>
                </div>
            </footer>
        </div>
    );
}