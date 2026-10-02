import React, { useState } from 'react';
import { BackgroundBeams } from '../../components/ui/background-beams';

interface LoginPageProps {
    onLoginSuccess?: () => void;
    onNavigateRegister?: () => void;
    onNavigateHome?: () => void;
}

export function LoginPage({ onLoginSuccess, onNavigateRegister, onNavigateHome }: LoginPageProps) {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [showPassword, setShowPassword] = useState(false);
    const [loading, setLoading] = useState(false);

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);

        // Simula validação e redireciona para a tela de decks (dashboard)
        setTimeout(() => {
            setLoading(false);
            if (onLoginSuccess) {
                onLoginSuccess();
            }
        }, 600);
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
            <main className="w-full flex-1 flex items-center justify-center px-4 relative z-10 min-h-0">
                <div className="w-full max-w-[420px] rounded-2xl p-6 sm:p-8 bg-[#141418]/90 border border-white/10 backdrop-blur-2xl shadow-[0_24px_64px_rgba(0,0,0,0.95)] flex flex-col gap-6">

                    <div className="flex flex-col gap-1.5 text-center items-center">
                        <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-[#1b1b1e] border border-white/5 mb-1">
                            <span className="w-1.5 h-1.5 rounded-full bg-[#7bd0ff] animate-pulse" />
                            <span className="font-mono text-[9px] uppercase tracking-wider text-[#7bd0ff] font-bold">
                                Acesso Seguro
                            </span>
                        </div>
                        <h2 className="text-2xl font-extrabold tracking-tight text-[#e4e1e6]">
                            Bem-vindo de volta
                        </h2>
                        <p className="text-xs text-[#908fa0]">
                            Entre para gerenciar seus comandantes e telemetrias táticas.
                        </p>
                    </div>

                    {/* Login Social Google */}
                    <div className="flex flex-col gap-2">
                        <button
                            type="button"
                            onClick={onLoginSuccess}
                            className="w-full py-2.5 px-4 rounded-xl bg-[#1b1b1e]/90 hover:bg-[#2a2a2d] border border-white/5 text-xs font-semibold text-[#e4e1e6] flex items-center justify-center gap-2.5 transition-all shadow-sm cursor-pointer"
                        >
                            <svg className="w-4 h-4 flex-shrink-0" viewBox="0 0 24 24">
                                <path fill="#EA4335" d="M12 5c1.6 0 3 .6 4.1 1.7l3.1-3.1C17.3 1.8 14.8 1 12 1 7.5 1 3.7 3.6 1.9 7.3l3.7 2.9C6.5 7.4 9 5 12 5z" />
                                <path fill="#4285F4" d="M23.5 12.3c0-.8-.1-1.7-.2-2.3H12v4.6h6.5c-.3 1.5-1.1 2.8-2.4 3.7l3.7 2.9c2.2-2 3.7-5 3.7-8.9z" />
                                <path fill="#FBBC05" d="M5.6 14.8c-.2-.7-.4-1.5-.4-2.3s.2-1.6.4-2.3L1.9 7.3C.7 9.7 0 12.3 0 15.2c0 2.8.7 5.5 1.9 7.8l3.7-2.9z" />
                                <path fill="#34A853" d="M12 23c3.2 0 6-1.1 8-3l-3.7-2.9c-1.1.7-2.5 1.2-4.3 1.2-3 0-5.5-2-6.4-4.8L1.9 16.4C3.7 20.2 7.5 23 12 23z" />
                            </svg>
                            <span>Continuar com Google</span>
                        </button>
                    </div>

                    <div className="flex items-center gap-3">
                        <div className="flex-1 h-px bg-white/10" />
                        <span className="font-mono text-[10px] uppercase text-[#908fa0]">ou com e-mail</span>
                        <div className="flex-1 h-px bg-white/10" />
                    </div>

                    {/* Formulário */}
                    <form onSubmit={handleSubmit} className="flex flex-col gap-4">
                        <div className="flex flex-col gap-1.5">
                            <label className="text-[11px] font-semibold text-[#c7c4d7]" htmlFor="email">
                                E-mail
                            </label>
                            <input
                                id="email"
                                type="email"
                                required
                                placeholder="planeswalker@dominaria.com"
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                className="w-full px-3.5 py-2.5 rounded-xl bg-[#1b1b1e]/80 border border-white/10 text-xs text-[#e4e1e6] placeholder:text-[#908fa0]/50 focus:outline-none focus:border-[#7bd0ff] focus:ring-1 focus:ring-[#7bd0ff] transition-all"
                            />
                        </div>

                        <div className="flex flex-col gap-1.5">
                            <div className="flex justify-between items-center">
                                <label className="text-[11px] font-semibold text-[#c7c4d7]" htmlFor="password">
                                    Senha
                                </label>
                                <a href="#forgot" className="text-[10px] text-[#7bd0ff] hover:underline">
                                    Esqueceu a senha?
                                </a>
                            </div>
                            <div className="relative">
                                <input
                                    id="password"
                                    type={showPassword ? 'text' : 'password'}
                                    required
                                    placeholder="••••••••"
                                    value={password}
                                    onChange={(e) => setPassword(e.target.value)}
                                    className="w-full px-3.5 py-2.5 rounded-xl bg-[#1b1b1e]/80 border border-white/10 text-xs text-[#e4e1e6] placeholder:text-[#908fa0]/50 focus:outline-none focus:border-[#7bd0ff] focus:ring-1 focus:ring-[#7bd0ff] transition-all pr-10"
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

                        <button
                            type="submit"
                            disabled={loading}
                            className="mt-2 w-full py-3 rounded-xl bg-[#e4e1e6] hover:bg-[#c0c1ff] text-[#0e0e11] font-bold text-xs shadow-lg transition-all flex items-center justify-center gap-2 disabled:opacity-50 cursor-pointer"
                        >
                            {loading ? (
                                <div className="w-4 h-4 border-2 border-[#0e0e11] border-t-transparent rounded-full animate-spin" />
                            ) : (
                                <>
                                    <span>Entrar no Cockpit</span>
                                    <span>→</span>
                                </>
                            )}
                        </button>

                        {/* Criar Conta */}
                        <div className="flex items-center justify-center gap-1.5 pt-2 text-xs text-[#908fa0]">
                            <span>Não tem uma conta?</span>
                            <button
                                type="button"
                                onClick={onNavigateRegister}
                                className="text-[#c0c1ff] font-semibold hover:underline cursor-pointer"
                            >
                                Criar conta
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