import { useState } from 'react';
import { HeroPage } from './submodules/hero/HeroPage';
import { LoginPage } from './submodules/auth/loginPage';
import { RegisterPage } from './submodules/auth/RegisterPage';
import { DashboardPage } from './submodules/dashboard/DashboardPage';
import MinhaColecaoPage from './submodules/colecao/MinhaColecaoPage';
import { CartaPage } from './submodules/carta/CartaPage';
import { BuscarCartasPage } from './submodules/buscar-cartas/BuscarCartasPage';

type Page = 'hero' | 'login' | 'register' | 'dashboard' | 'minha-colecao' | 'carta' | 'buscar-cartas';

export default function App() {
  const [currentPage, setCurrentPage] = useState<Page>('hero');
  const [selectedCardSlug, setSelectedCardSlug] = useState('rhystic-study');
  const [searchQuery, setSearchQuery] = useState('');

  const handleNavigate = (href: string) => {
    if (href === '#minha-colecao' || href === '/minha-colecao' || href === '#colecao') {
      setCurrentPage('minha-colecao');
      window.scrollTo({ top: 0, behavior: 'smooth' });
    } else if (href === '/buscar-cartas' || href === '#buscar-cartas') {
      setCurrentPage('buscar-cartas');
      window.scrollTo({ top: 0, behavior: 'smooth' });
    } else if (href === '#visao-geral' || href === '/' || href === '/dashboard') {
      setCurrentPage('dashboard');
      window.scrollTo({ top: 0, behavior: 'smooth' });
    } else if (href === '#deckbuilder' || href === '/decks' || href === '#decks' || href === '/deckbuilder') {
      setCurrentPage('dashboard');
      setTimeout(() => {
        const el = document.getElementById('deckbuilder') || document.getElementById('decks');
        if (el) {
          el.scrollIntoView({ behavior: 'smooth', block: 'start' });
        }
      }, 50);
    } else if (href === '#lista-de-desejos' || href === '/desejos') {
      setCurrentPage('dashboard');
      setTimeout(() => {
        const el = document.getElementById('lista-de-desejos');
        if (el) {
          el.scrollIntoView({ behavior: 'smooth', block: 'start' });
        }
      }, 50);
    } else {
      setCurrentPage('dashboard');
    }
  };

  const handleSearchFromNav = (query: string) => {
    setSearchQuery(query);
    setCurrentPage('buscar-cartas');
  };

  const renderPage = () => {
    switch (currentPage) {
      case 'dashboard':
        return (
          <DashboardPage
            onLogout={() => setCurrentPage('hero')}
            onNavigate={handleNavigate}
            onSearch={handleSearchFromNav}
          />
        );
      case 'minha-colecao':
        return (
          <MinhaColecaoPage
            onLogout={() => setCurrentPage('hero')}
            onNavigate={handleNavigate}
            onSearch={handleSearchFromNav}
            onSelectCard={(slug) => {
              setSelectedCardSlug(slug);
              setCurrentPage('carta');
            }}
          />
        );
      case 'buscar-cartas':
        return (
          <BuscarCartasPage
            initialQuery={searchQuery}
            onLogout={() => setCurrentPage('hero')}
            onNavigate={handleNavigate}
            onSearch={handleSearchFromNav}
            onSelectCard={(slug) => {
              setSelectedCardSlug(slug);
              setCurrentPage('carta');
            }}
          />
        );
      case 'carta':
        return (
          <CartaPage
            slug={selectedCardSlug}
            onBack={() => setCurrentPage('minha-colecao')}
            onNavigate={handleNavigate}
            onSearch={handleSearchFromNav}
            onLogout={() => setCurrentPage('hero')}
          />
        );
      case 'login':
        return (
          <LoginPage
            onLoginSuccess={() => setCurrentPage('dashboard')}
            onNavigateHome={() => setCurrentPage('hero')}
            onNavigateRegister={() => setCurrentPage('register')}
          />
        );
      case 'register':
        return (
          <RegisterPage
            onNavigateHome={() => setCurrentPage('hero')}
            onNavigateLogin={() => setCurrentPage('login')}
          />
        );
      case 'hero':
      default:
        return (
          <HeroPage
            onNavigateLogin={() => setCurrentPage('login')}
            onNavigateRegister={() => setCurrentPage('register')}
          />
        );
    }
  };

  return (
    <div key={currentPage} className="min-h-screen w-[#100%] overflow-x-hidden">
      {renderPage()}
    </div>
  );
}