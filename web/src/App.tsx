import { useState } from 'react';
import { HeroPage } from './submodules/hero/HeroPage';
import { LoginPage } from './submodules/auth/loginPage';
import { RegisterPage } from './submodules/auth/RegisterPage';
import { DashboardPage } from './submodules/dashboard/DashboardPage';

type Page = 'hero' | 'login' | 'register' | 'dashboard';

export default function App() {
  const [currentPage, setCurrentPage] = useState<Page>('hero');

  if (currentPage === 'dashboard') {
    return <DashboardPage onLogout={() => setCurrentPage('hero')} />;
  }

  if (currentPage === 'login') {
    return (
      <LoginPage
        onLoginSuccess={() => setCurrentPage('dashboard')}
        onNavigateHome={() => setCurrentPage('hero')}
        onNavigateRegister={() => setCurrentPage('register')}
      />
    );
  }

  if (currentPage === 'register') {
    return (
      <RegisterPage
        onNavigateHome={() => setCurrentPage('hero')}
        onNavigateLogin={() => setCurrentPage('login')}
      />
    );
  }

  return (
    <HeroPage
      onNavigateLogin={() => setCurrentPage('login')}
      onNavigateRegister={() => setCurrentPage('register')}
    />
  );
}