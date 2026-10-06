import React, { useState } from 'react';
import { colors } from '../../styles/colors';
import { AuthNavbar } from './AuthNavbar';
import { setStoredUser } from './authStorage';

interface RegisterPageProps {
  onNavigateLogin?: () => void;
  onNavigateHome?: () => void;
}

export function RegisterPage({ onNavigateLogin, onNavigateHome }: RegisterPageProps) {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      const res = await fetch('/api/auth/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name, email, password }),
      });
      if (res.ok) {
        const data = await res.json();
        setStoredUser({
          name: data.user?.name || name,
          email: data.user?.email || email,
        });
      } else {
        setStoredUser({ name, email });
      }
    } catch {
      setStoredUser({ name, email });
    } finally {
      setLoading(false);
      if (onNavigateLogin) {
        onNavigateLogin();
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
        rightActionPrompt="Já tem uma conta?"
        rightActionText="Entrar"
        onRightActionClick={onNavigateLogin}
      />

      {/* Container Principal Expandido (max-w-[1440px] com grid de duas colunas balanceadas) */}
      <div className="relative z-10 mx-auto w-full max-w-[1440px] grid flex-1 items-center gap-16 px-6 lg:grid-cols-2 lg:px-16 py-12 my-auto">
        {/* Left Branding */}
        <section className="hidden lg:block max-w-xl">
          <button
            type="button"
            onClick={onNavigateHome}
            className="mb-8 text-sm font-medium transition-colors cursor-pointer inline-flex items-center gap-1.5 border-0 bg-transparent p-0 hover:text-black"
            style={{ color: colors.light['text-muted'] }}
          >
            <span aria-hidden="true">←</span> Voltar para início
          </button>
          <p className="mb-4 text-xs font-bold uppercase tracking-[0.2em]" style={{ color: colors.light.bronze }}>Comece gratuitamente</p>
          <h1 className="text-6xl xl:text-7xl font-black leading-[0.94] tracking-[-0.065em]" style={{ color: colors.light['text-main'] }}>
            Sua coleção merece um lugar à altura.
          </h1>
          <p className="mt-6 text-lg leading-relaxed max-w-lg" style={{ color: colors.light['text-muted'] }}>
            Crie seu fichário digital, acompanhe suas cartas e monte decks usando todo o universo de Magic.
          </p>
          <div className="mt-8 h-px w-24" style={{ backgroundColor: colors.light.bronze }} />
        </section>

        {/* Right Register Form */}
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
          <p className="mb-1.5 text-xs font-bold uppercase tracking-[0.18em]" style={{ color: colors.light.bronze }}>Seu próximo deck começa aqui</p>
          <h2 className="text-3xl sm:text-4xl font-black tracking-[-0.055em]" style={{ color: colors.light['text-main'] }}>Crie sua conta</h2>
          <p className="mt-1.5 text-sm" style={{ color: colors.light['text-muted'] }}>Organize suas cartas e transforme ideias em decks.</p>

          {/* Social Logins */}
          <div className="mt-6 grid gap-3 sm:grid-cols-2">
            <button
              type="button"
              onClick={onNavigateLogin}
              className="flex items-center justify-center gap-2.5 p-2.5 rounded-full text-sm font-semibold transition-colors cursor-pointer shadow-xs border"
              style={{ backgroundColor: colors.light.surface, borderColor: colors.light.border, color: colors.light['text-main'] }}
            >
              <img src="https://cdn.jsdelivr.net/gh/glincker/thesvg@main/public/icons/google/default.svg" alt="Google" aria-hidden="true" className="size-4" />
              <span>Google</span>
            </button>
            <button
              type="button"
              onClick={onNavigateLogin}
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
            <span>ou cadastre seu e-mail</span>
            <span className="h-px flex-1 bg-black/10" />
          </div>

          {/* Registration Form */}
          <form onSubmit={handleSubmit} className="space-y-4">
            <label className="block text-sm font-semibold" style={{ color: colors.light['text-main'] }}>
              Nome
              <input
                type="text"
                placeholder="Como quer ser chamado?"
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="mt-1.5 h-10 w-full border-0 border-b bg-transparent px-0 text-sm outline-none transition focus:ring-0"
                style={{ borderColor: 'rgba(36, 33, 31, 0.25)', color: colors.light['text-main'] }}
                required
              />
            </label>

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
                placeholder="Crie uma senha forte"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="mt-1.5 h-10 w-full border-0 border-b bg-transparent px-0 text-sm outline-none transition focus:ring-0"
                style={{ borderColor: 'rgba(36, 33, 31, 0.25)', color: colors.light['text-main'] }}
                required
              />
            </label>

            <button
              type="submit"
              disabled={loading}
              className="mt-3 h-11 w-full rounded-full text-sm font-semibold text-white transition cursor-pointer shadow-[0_4px_0_#d8d4cc,0_10px_24px_rgba(36,33,31,0.12)] border-0"
              style={{ backgroundColor: colors.light.dark }}
            >
              {loading ? 'Criando conta...' : 'Criar minha conta'}
            </button>
          </form>

          <p className="mt-4 text-xs text-center" style={{ color: colors.light['text-muted'] }}>
            Ao continuar, você concorda com nossos termos de uso.
          </p>
        </section>
      </div>
    </main>
  );
}

export default RegisterPage;