import React, { useState } from 'react';

interface RegisterPageProps {
  onNavigateLogin?: () => void;
  onNavigateHome?: () => void;
}

export function RegisterPage({ onNavigateLogin, onNavigateHome }: RegisterPageProps) {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setTimeout(() => {
      setLoading(false);
      if (onNavigateLogin) {
        onNavigateLogin();
      }
    }, 500);
  };

  return (
    <main className="auth-page relative min-h-screen overflow-hidden bg-[#f1eee7] text-[#24211f]">
      {/* Header */}
      <header className="border-b border-black/[0.07] bg-[#f8f5ee]/80 backdrop-blur-md">
        <div className="mx-auto flex h-[78px] max-w-6xl items-center justify-between px-6 lg:px-10">
          <button
            type="button"
            onClick={onNavigateHome}
            className="flex items-center gap-2 text-[21px] font-extrabold tracking-[-0.06em] cursor-pointer"
          >
            <img src="/mascot.png" alt="SpellBinder Mascot" className="size-10 object-contain" />
            <span>SpellBinder</span>
          </button>
          <p className="text-sm text-[#77706a]">
            Já tem uma conta?{' '}
            <button
              type="button"
              onClick={onNavigateLogin}
              className="font-bold text-[#9b7130] hover:underline cursor-pointer ml-1"
            >
              Entrar
            </button>
          </p>
        </div>
      </header>

      {/* Back link */}
      <button
        type="button"
        onClick={onNavigateHome}
        className="auth-back-link absolute left-6 top-[94px] z-20 lg:left-10 cursor-pointer"
      >
        <span aria-hidden="true">←</span> Voltar para início
      </button>

      {/* Background Decorators */}
      <div aria-hidden="true" className="auth-decoration auth-decoration-one" />
      <div aria-hidden="true" className="auth-decoration auth-decoration-two" />

      {/* Main Grid */}
      <div className="relative z-10 mx-auto grid min-h-[calc(100vh-78px)] max-w-6xl items-center gap-16 px-6 py-16 lg:grid-cols-[0.85fr_1fr] lg:px-10 animate-fade-in-up">
        {/* Left Branding */}
        <section className="hidden lg:block">
          <p className="mb-5 text-xs font-bold uppercase tracking-[0.2em] text-[#9b7130]">Comece gratuitamente</p>
          <h1 className="max-w-lg text-6xl font-extrabold leading-[0.94] tracking-[-0.065em]">
            Sua coleção merece um lugar à altura.
          </h1>
          <p className="mt-7 max-w-md text-lg leading-8 text-[#77706a]">
            Crie seu fichário digital, acompanhe suas cartas e monte decks usando todo o universo de Magic.
          </p>
          <div className="mt-10 h-px w-24 bg-[#9b7130]" />
        </section>

        {/* Right Register Form */}
        <section className="w-full max-w-md justify-self-end">
          <p className="mb-3 text-xs font-bold uppercase tracking-[0.18em] text-[#9b7130]">Seu próximo deck começa aqui</p>
          <h2 className="text-4xl font-extrabold tracking-[-0.055em]">Crie sua conta</h2>
          <p className="mt-3 text-sm leading-6 text-[#77706a]">Organize suas cartas e transforme ideias em decks.</p>

          {/* Social Logins */}
          <div className="mt-8 grid gap-3 sm:grid-cols-2">
            <button
              type="button"
              onClick={onNavigateLogin}
              className="auth-provider-button"
            >
              <img src="https://cdn.jsdelivr.net/gh/glincker/thesvg@main/public/icons/google/default.svg" alt="Google" aria-hidden="true" />
              <span>Continuar com Google</span>
            </button>
            <button
              type="button"
              onClick={onNavigateLogin}
              className="auth-provider-button"
            >
              <img src="https://cdn.jsdelivr.net/gh/glincker/thesvg@main/public/icons/apple/mono.svg" alt="Apple" aria-hidden="true" />
              <span>Continuar com Apple</span>
            </button>
          </div>

          {/* Divider */}
          <div className="my-8 flex items-center gap-4 text-xs text-[#a29b94]">
            <span className="h-px flex-1 bg-black/10" />
            <span>ou cadastre seu e-mail</span>
            <span className="h-px flex-1 bg-black/10" />
          </div>

          {/* Registration Form */}
          <form onSubmit={handleSubmit} className="space-y-5">
            <label className="block text-sm font-semibold text-[#24211f]">
              Nome
              <input
                type="text"
                placeholder="Como quer ser chamado?"
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="mt-2 h-12 w-full border-0 border-b border-black/20 bg-transparent px-0 outline-none transition placeholder:text-[#aaa39b] focus:border-[#9b7130] focus:ring-0"
                required
              />
            </label>

            <label className="block text-sm font-semibold text-[#24211f]">
              E-mail
              <input
                type="email"
                placeholder="voce@email.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="mt-2 h-12 w-full border-0 border-b border-black/20 bg-transparent px-0 outline-none transition placeholder:text-[#aaa39b] focus:border-[#9b7130] focus:ring-0"
                required
              />
            </label>

            <label className="block text-sm font-semibold text-[#24211f]">
              Senha
              <input
                type="password"
                placeholder="Crie uma senha forte"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="mt-2 h-12 w-full border-0 border-b border-black/20 bg-transparent px-0 outline-none transition placeholder:text-[#aaa39b] focus:border-[#9b7130] focus:ring-0 font-mono"
                required
              />
            </label>

            <button
              type="submit"
              disabled={loading}
              className="h-12 w-full rounded-full bg-[#171513] font-semibold text-white transition hover:bg-[#2a2623] cursor-pointer"
            >
              {loading ? 'Criando conta...' : 'Criar minha conta'}
            </button>
          </form>

          <p className="mt-8 text-sm text-[#77706a]">
            Ao continuar, você concorda com nossos termos de uso.
          </p>
        </section>
      </div>
    </main>
  );
}

export default RegisterPage;