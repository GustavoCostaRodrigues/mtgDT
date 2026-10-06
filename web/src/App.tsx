import { useState, useEffect } from 'react';
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
  const [selectedCardSlug, setSelectedCardSlug] = useState('');
  const [searchQuery, setSearchQuery] = useState('');

  // Sincroniza a página e o card selecionado com a URL atual
  useEffect(() => {
    const syncRouteFromUrl = () => {
      const pathname = window.location.pathname;
      const search = window.location.search;
      const params = new URLSearchParams(search);
      const cardSlug = params.get('card');

      if (pathname === '/buscar-cartas') {
        setCurrentPage('buscar-cartas');
        if (cardSlug) {
          setSelectedCardSlug(cardSlug);
        }
      } else if (pathname === '/minha-colecao' || pathname === '/colecao') {
        setCurrentPage('minha-colecao');
      } else if (pathname === '/dashboard') {
        setCurrentPage('dashboard');
      }
    };

    syncRouteFromUrl();
    window.addEventListener('popstate', syncRouteFromUrl);
    return () => window.removeEventListener('popstate', syncRouteFromUrl);
  }, []);

  const handleNavigate = (href: string) => {
    const [path, search] = href.split('?');
    const params = new URLSearchParams(search || '');
    const cardSlug = params.get('card');

    if (path === '#minha-colecao' || path === '/minha-colecao' || path === '#colecao' || path === '/colecao') {
      setCurrentPage('minha-colecao');
      window.history.pushState({}, '', href);
      window.scrollTo({ top: 0, behavior: 'smooth' });
    } else if (path === '/buscar-cartas' || path === '#buscar-cartas') {
      setCurrentPage('buscar-cartas');
      if (cardSlug) {
        setSelectedCardSlug(cardSlug);
      }
      window.history.pushState({}, '', href);
      window.scrollTo({ top: 0, behavior: 'smooth' });
    } else if (path === '#visao-geral' || path === '/' || path === '/dashboard') {
      setCurrentPage('dashboard');
      window.history.pushState({}, '', href);
      window.scrollTo({ top: 0, behavior: 'smooth' });
    } else if (path === '#deckbuilder' || path === '/decks' || path === '#decks' || path === '/deckbuilder') {
      setCurrentPage('dashboard');
      setTimeout(() => {
        const el = document.getElementById('deckbuilder') || document.getElementById('decks');
        if (el) {
          el.scrollIntoView({ behavior: 'smooth', block: 'start' });
        }
      }, 50);
    } else if (path === '#lista-de-desejos' || path === '/desejos' || path === '/wishlist') {
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
            cardSlug={selectedCardSlug}
            onClearSelectedCard={() => setSelectedCardSlug('')}
            onLogout={() => setCurrentPage('hero')}
            onNavigate={handleNavigate}
            onSearch={handleSearchFromNav}
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