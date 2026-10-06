import React, { useState } from 'react';
import { colors } from '../../styles/colors';

interface LoginPageProps {
  onLoginSuccess?: () => void;
  onNavigateRegister?: () => void;
  onNavigateHome?: () => void;
}

export function LoginPage({ onLoginSuccess, onNavigateRegister, onNavigateHome }: LoginPageProps) {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setTimeout(() => {
      setLoading(false);
      if (onLoginSuccess) {
        onLoginSuccess();
      }
    }, 400);
  };

  return (
    <main
      className="auth-page relative min-h-screen overflow-hidden flex flex-col w-full"
      style={{ backgroundColor: colors.light.background, color: colors.light['text-main'] }}
    >
      {/* Background Orbs / Decorators em largura total */}
      <div aria-hidden="true" className="hero-grid pointer-events-none absolute inset-0 opacity-50 w-full" />
      <div aria-hidden="true" className="hero-orb pointer-events-none absolute left-[-10%] top-20 size-[380px] rounded-full bg-[#e9e0c7]/45 blur-3xl" />
      <div aria-hidden="true" className="hero-orb pointer-events-none absolute right-[-8%] top-[28%] size-[300px] rounded-full bg-[#e6c66d]/20 blur-3xl" />

      {/* Top Header com padding alinhado */}
      <header
        className="sticky top-0 left-0 right-0 z-[9999] border-b backdrop-blur-2xl shadow-sm shrink-0 w-full"
        style={{ backgroundColor: `${colors.light.background}f2`, borderColor: colors.light.border }}
      >
        <div className="mx-auto flex h-[78px] max-w-[1440px] items-center justify-between px-6 lg:px-12 w-full">
          <button
            type="button"
            onClick={onNavigateHome}
            className="flex items-center gap-2.5 text-[21px] font-extrabold tracking-[-0.05em] cursor-pointer group border-0 bg-transparent p-0"
            style={{ color: colors.light['text-main'] }}
          >
            <div
              className="relative flex size-10 items-center justify-center rounded-[11px] border-2 p-1 shadow-[3px_3px_0_#171513] group-hover:scale-105 transition-transform overflow-hidden"
              style={{ backgroundColor: colors.light.background, borderColor: colors.light['text-main'] }}
            >
              <img src="/mascot.png" alt="SpellBinder Logo" className="w-full h-full object-contain" />
            </div>
            <span>SpellBinder</span>
          </button>
          <p className="text-sm" style={{ color: colors.light['text-muted'] }}>
            Ainda não tem uma conta?{' '}
            <button
              type="button"
              onClick={onNavigateRegister}
              className="font-bold hover:underline cursor-pointer ml-1"
              style={{ color: colors.light.bronze }}
            >
              Registre-se
            </button>
          </p>
        </div>
      </header>

      {/* Page Layout Container centralizado (max-w-6xl com respiro lateral elegante) */}
      <div className="relative z-10 mx-auto w-full max-w-6xl grid flex-1 items-center gap-12 px-6 lg:grid-cols-[0.85fr_1fr] lg:px-10 pt-4 pb-8 my-auto">
        {/* Left Welcome Content */}
        <section className="hidden lg:block">
          <button
            type="button"
            onClick={onNavigateHome}
            className="mb-6 text-sm font-medium transition-colors cursor-pointer inline-flex items-center gap-1.5 border-0 bg-transparent p-0 hover:text-black"
            style={{ color: colors.light['text-muted'] }}
          >
            <span aria-hidden="true">←</span> Voltar para início
          </button>
          <p className="mb-4 text-xs font-bold uppercase tracking-[0.2em]" style={{ color: colors.light.bronze }}>Bem-vindo de volta</p>
          <h1 className="max-w-lg text-6xl font-black leading-[0.94] tracking-[-0.065em]" style={{ color: colors.light['text-main'] }}>
            Volte para a mesa com tudo no lugar.
          </h1>
          <p className="mt-6 max-w-md text-lg leading-7" style={{ color: colors.light['text-muted'] }}>
            Encontre suas cartas, monte seus decks e saiba exatamente o que já faz parte da sua coleção física.
          </p>
          <div className="mt-8 h-px w-24" style={{ backgroundColor: colors.light.bronze }} />
        </section>

        {/* Right Form Card */}
        <section
          className="w-full max-w-md justify-self-end backdrop-blur-md px-8 py-6 rounded-[28px] shadow-[0_20px_50px_rgba(70,57,39,0.08)] border"
          style={{ backgroundColor: `${colors.light.surface}cc`, borderColor: colors.light.border }}
        >
          <div className="lg:hidden mb-4">
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
          <div className="mt-5 grid gap-3 sm:grid-cols-2">
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
          <div className="my-5 flex items-center gap-4 text-xs" style={{ color: colors.light['text-faint'] }}>
            <span className="h-px flex-1 bg-black/10" />
            <span>ou entre com e-mail</span>
            <span className="h-px flex-1 bg-black/10" />
          </div>

          {/* Login Form */}
          <form onSubmit={handleSubmit} className="space-y-3.5">
            <label className="block text-sm font-semibold" style={{ color: colors.light['text-main'] }}>
              E-mail
              <input
                type="email"
                placeholder="voce@email.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="mt-1 h-10 w-full border-0 border-b bg-transparent px-0 text-sm outline-none transition focus:ring-0"
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
                className="mt-1 h-10 w-full border-0 border-b bg-transparent px-0 text-sm outline-none transition focus:ring-0"
                style={{ borderColor: 'rgba(36, 33, 31, 0.25)', color: colors.light['text-main'] }}
                required
              />
            </label>

            <div className="flex justify-end pt-0.5">
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
              className="mt-1 h-11 w-full rounded-full text-sm font-semibold text-white transition cursor-pointer shadow-[0_4px_0_#d8d4cc,0_10px_24px_rgba(36,33,31,0.12)] border-0"
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