import React, { useState, useEffect } from 'react';
import { colors } from '../../styles/colors';
import { AuthNavbar } from './AuthNavbar';
import { setStoredUser } from './authStorage';

interface LoginPageProps {
  onLoginSuccess?: () => void;
  onNavigateRegister?: () => void;
  onNavigateHome?: () => void;
}

export function LoginPage({ onLoginSuccess, onNavigateRegister, onNavigateHome }: LoginPageProps) {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [rememberEmail, setRememberEmail] = useState(false);
  const [rememberMe, setRememberMe] = useState(false);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const savedEmail = localStorage.getItem('saved_email');
    if (savedEmail) {
      setEmail(savedEmail);
      setRememberEmail(true);
    }
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    if (rememberEmail) {
      localStorage.setItem('saved_email', email);
    } else {
      localStorage.removeItem('saved_email');
    }

    try {
      const res = await fetch('/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password }),
      });
      if (res.ok) {
        const data = await res.json();
        if (data.user) {
          setStoredUser({
            name: data.user.name || email.split('@')[0],
            email: data.user.email || email,
            avatarUrl: data.user.avatarUrl || '/mascot.png',
          });
        }
        if (data.session?.accessToken) {
          localStorage.setItem('spellbinder_token', data.session.accessToken);
        }
      } else {
        const cleanName = email.split('@')[0];
        setStoredUser({
          name: cleanName.charAt(0).toUpperCase() + cleanName.slice(1),
          email,
        });
      }
    } catch {
      const cleanName = email.split('@')[0];
      setStoredUser({
        name: cleanName.charAt(0).toUpperCase() + cleanName.slice(1),
        email,
      });
    } finally {
      setLoading(false);
      if (onLoginSuccess) {
        onLoginSuccess();
      }
    }
  };

  return (
    <main
      className="auth-page relative min-h-screen overflow-hidden flex flex-col w-full"
      style={{ backgroundColor: colors.light.background, color: colors.light['text-main'] }}
    >
      {/* Background Orbs */}
      <div aria-hidden="true" className="hero-grid pointer-events-none absolute inset-0 opacity-50 w-full" />
      <div aria-hidden="true" className="hero-orb pointer-events-none absolute left-[-5%] top-20 size-[420px] rounded-full bg-[#e9e0c7]/45 blur-3xl" />
      <div aria-hidden="true" className="hero-orb pointer-events-none absolute right-[-5%] top-[25%] size-[380px] rounded-full bg-[#e6c66d]/20 blur-3xl" />

      {/* Top Header Compartilhado */}
      <AuthNavbar
        onNavigateHome={onNavigateHome}
        rightActionPrompt="Ainda não tem uma conta?"
        rightActionText="Registre-se"
        onRightActionClick={onNavigateRegister}
      />

      {/* Container Principal Expandido (max-w-[1440px] com grid de duas colunas balanceadas) */}
      <div className="relative z-10 mx-auto w-full max-w-[1440px] grid flex-1 items-center gap-16 px-6 lg:grid-cols-2 lg:px-16 py-12 my-auto">
        {/* Left Welcome Content */}
        <section className="hidden lg:block max-w-xl">
          <button
            type="button"
            onClick={onNavigateHome}
            className="mb-8 text-sm font-medium transition-colors cursor-pointer inline-flex items-center gap-1.5 border-0 bg-transparent p-0 hover:text-black"
            style={{ color: colors.light['text-muted'] }}
          >
            <span aria-hidden="true">←</span> Voltar para início
          </button>
          <p className="mb-4 text-xs font-bold uppercase tracking-[0.2em]" style={{ color: colors.light.bronze }}>Bem-vindo de volta</p>
          <h1 className="text-6xl xl:text-7xl font-black leading-[0.94] tracking-[-0.065em]" style={{ color: colors.light['text-main'] }}>
            Volte para a mesa com tudo no lugar.
          </h1>
          <p className="mt-6 text-lg leading-relaxed max-w-lg" style={{ color: colors.light['text-muted'] }}>
            Encontre suas cartas, monte seus decks e saiba exatamente o que já faz parte da sua coleção física.
          </p>
          <div className="mt-8 h-px w-24" style={{ backgroundColor: colors.light.bronze }} />
        </section>

        {/* Right Form Card (Alinhado à direita com largura ideal) */}
        <section
          className="w-full max-w-md justify-self-center lg:justify-self-end backdrop-blur-md px-8 py-8 rounded-[28px] shadow-[0_20px_50px_rgba(70,57,39,0.08)] border"
          style={{ backgroundColor: `${colors.light.surface}cc`, borderColor: colors.light.border }}
        >
          <div className="lg:hidden mb-6">
            <button
              type="button"
              onClick={onNavigateHome}
              className="text-xs font-medium transition-colors cursor-pointer inline-flex items-center gap-1 border-0 bg-transparent p-0 hover:text-black"
              style={{ color: colors.light['text-muted'] }}
            >
              <span aria-hidden="true">←</span> Voltar para início
            </button>
          </div>
          <p className="mb-1.5 text-xs font-bold uppercase tracking-[0.18em]" style={{ color: colors.light.bronze }}>Sua coleção espera por você</p>
          <h2 className="text-3xl sm:text-4xl font-black tracking-[-0.055em]" style={{ color: colors.light['text-main'] }}>Entrar na sua conta</h2>
          <p className="mt-1.5 text-sm" style={{ color: colors.light['text-muted'] }}>Continue organizando sua coleção e construindo decks.</p>

          {/* Social Logins */}
          <div className="mt-6 grid gap-3 sm:grid-cols-2">
            <button
              type="button"
              onClick={onLoginSuccess}
              className="flex items-center justify-center gap-2.5 p-2.5 rounded-full text-sm font-semibold transition-colors cursor-pointer shadow-xs border"
              style={{ backgroundColor: colors.light.surface, borderColor: colors.light.border, color: colors.light['text-main'] }}
            >
              <img src="https://cdn.jsdelivr.net/gh/glincker/thesvg@main/public/icons/google/default.svg" alt="Google" aria-hidden="true" className="size-4" />
              <span>Google</span>
            </button>
            <button
              type="button"
              onClick={onLoginSuccess}
              className="flex items-center justify-center gap-2.5 p-2.5 rounded-full text-sm font-semibold transition-colors cursor-pointer shadow-xs border"
              style={{ backgroundColor: colors.light.surface, borderColor: colors.light.border, color: colors.light['text-main'] }}
            >
              <img src="https://cdn.jsdelivr.net/gh/glincker/thesvg@main/public/icons/apple/mono.svg" alt="Apple" aria-hidden="true" className="size-4" />
              <span>Apple</span>
            </button>
          </div>

          {/* Divider */}
          <div className="my-6 flex items-center gap-4 text-xs" style={{ color: colors.light['text-faint'] }}>
            <span className="h-px flex-1 bg-black/10" />
            <span>ou entre com e-mail</span>
            <span className="h-px flex-1 bg-black/10" />
          </div>

          {/* Login Form */}
          <form onSubmit={handleSubmit} className="space-y-4">
            <label className="block text-sm font-semibold" style={{ color: colors.light['text-main'] }}>
              E-mail
              <input
                type="email"
                placeholder="voce@email.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="mt-1.5 h-10 w-full border-0 border-b bg-transparent px-0 text-sm outline-none transition focus:ring-0"
                style={{ borderColor: 'rgba(36, 33, 31, 0.25)', color: colors.light['text-main'] }}
                required
              />
            </label>

            <label className="block text-sm font-semibold" style={{ color: colors.light['text-main'] }}>
              Senha
              <input
                type="password"
                placeholder="Sua senha"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="mt-1.5 h-10 w-full border-0 border-b bg-transparent px-0 text-sm outline-none transition focus:ring-0"
                style={{ borderColor: 'rgba(36, 33, 31, 0.25)', color: colors.light['text-main'] }}
                required
              />
            </label>

            {/* Opções */}
            <div className="space-y-2.5 pt-1">
              <label className="flex items-center gap-2.5 text-xs font-medium cursor-pointer" style={{ color: colors.light['text-muted'] }}>
                <input
                  type="checkbox"
                  checked={rememberEmail}
                  onChange={(e) => setRememberEmail(e.target.checked)}
                  className="rounded border-gray-300 text-black focus:ring-0 cursor-pointer size-4"
                />
                Lembrar e-mail neste dispositivo
              </label>

              <label className="flex items-center gap-2.5 text-xs font-medium cursor-pointer" style={{ color: colors.light['text-muted'] }}>
                <input
                  type="checkbox"
                  checked={rememberMe}
                  onChange={(e) => setRememberMe(e.target.checked)}
                  className="rounded border-gray-300 text-black focus:ring-0 cursor-pointer size-4"
                />
                Manter conectado por 30 dias
              </label>
            </div>

            <div className="flex justify-end pt-1">
              <button
                type="button"
                onClick={(e) => e.preventDefault()}
                className="text-sm font-semibold hover:underline cursor-pointer border-0 bg-transparent p-0"
                style={{ color: colors.light.bronze }}
              >
                Esqueci minha senha
              </button>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="mt-2 h-11 w-full rounded-full text-sm font-semibold text-white transition cursor-pointer shadow-[0_4px_0_#d8d4cc,0_10px_24px_rgba(36,33,31,0.12)] border-0"
              style={{ backgroundColor: colors.light.dark }}
            >
              {loading ? 'Entrando...' : 'Entrar'}
            </button>
          </form>
        </section>
      </div>
    </main>
  );
}

export default LoginPage;