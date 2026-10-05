import { useState } from 'react';
import { HeroPage } from './submodules/hero/HeroPage';
import { LoginPage } from './submodules/auth/loginPage';
import { RegisterPage } from './submodules/auth/RegisterPage';
import { DashboardPage } from './submodules/dashboard/DashboardPage';
import { MinhaColecaoPage } from './submodules/dashboard/MinhaColecaoPage';
import { CartaPage } from './submodules/dashboard/CartaPage';
import { BuscarCartasPage } from './submodules/dashboard/BuscarCartasPage';

type Page = 'hero' | 'login' | 'register' | 'dashboard' | 'minha-colecao' | 'carta' | 'buscar-cartas';

export default function App() {
  const [currentPage, setCurrentPage] = useState<Page>('hero');
  const [selectedCardSlug, setSelectedCardSlug] = useState('rhystic-study');
  const [searchQuery, setSearchQuery] = useState('');

  const handleNavigate = (href: string) => {
    if (href === '#minha-colecao' || href === '/minha-colecao') {
      setCurrentPage('minha-colecao');
    } else if (href === '/buscar-cartas' || href === '#buscar-cartas') {
      setCurrentPage('buscar-cartas');
    } else if (href === '#visao-geral' || href === '/' || href === '/dashboard') {
      setCurrentPage('dashboard');
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