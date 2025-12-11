import { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { useCart } from '../../hooks/useCart';
import { useAuth } from '../../hooks/useAuth';

export function Header() {
  const { count } = useCart();
  const { isAuthenticated, isAdmin, user, logout } = useAuth();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const location = useLocation();

  const isActive = (path) => location.pathname === path;

  const navLinks = [
    { path: '/catalogo', label: 'Catálogo' },
    { path: '/sobre', label: 'Sobre' },
  ];
  
  return (
    <>
      <header className="sticky top-0 z-50 bg-eliteBlack/95 backdrop-blur border-b border-eliteGold/20">
        <div className="container mx-auto px-4 py-4 flex items-center justify-between">
          {/* Logo */}
          <Link to="/" className="flex items-center gap-2">
            <span className="text-xl md:text-2xl font-heading font-bold text-eliteGold">CAMISA DE ELITE</span>
          </Link>

          {/* Nav Desktop */}
          <nav className="hidden md:flex items-center gap-6">
            {navLinks.map(link => (
              <Link 
                key={link.path}
                to={link.path} 
                className={`transition-colors ${isActive(link.path) ? 'text-eliteGold' : 'text-white hover:text-eliteGold'}`}
              >
                {link.label}
              </Link>
            ))}
          </nav>

          {/* Ações Desktop */}
          <div className="flex items-center gap-3 md:gap-4">
            {/* Carrinho Desktop */}
            <Link to="/carrinho" className="relative group hidden md:block">
              <svg className="w-6 h-6 text-white group-hover:text-eliteGold transition-colors" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" />
              </svg>
              {count > 0 && (
                <span className="absolute -top-2 -right-2 bg-eliteGold text-eliteBlack text-xs font-bold w-5 h-5 rounded-full flex items-center justify-center">
                  {count > 9 ? '9+' : count}
                </span>
              )}
            </Link>

            {/* Usuário Desktop */}
            <div className="hidden md:block">
              {isAuthenticated ? (
                <div className="relative group">
                  <button className="flex items-center gap-2 text-white hover:text-eliteGold transition-colors">
                    <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                    </svg>
                    <span className="text-sm">{user?.name?.split(' ')[0] || 'Conta'}</span>
                    {isAdmin && (
                      <span className="bg-eliteGold/20 text-eliteGold text-xs px-1.5 py-0.5 rounded">Admin</span>
                    )}
                    <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                    </svg>
                  </button>
                  {/* Dropdown */}
                  <div className="absolute right-0 top-full mt-2 w-48 bg-eliteBlackCard border border-eliteGold/20 rounded-lg shadow-xl opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all">
                    <div className="p-2 space-y-1">
                      {isAdmin && (
                        <Link to="/admin" className="block px-3 py-2 text-sm text-white hover:bg-eliteGold/10 rounded transition-colors">
                          Painel Admin
                        </Link>
                      )}
                      <Link to="/minha-conta" className="block px-3 py-2 text-sm text-white hover:bg-eliteGold/10 rounded transition-colors">
                        Minha Conta
                      </Link>
                      <Link to="/minha-conta/pedidos" className="block px-3 py-2 text-sm text-white hover:bg-eliteGold/10 rounded transition-colors">
                        Meus Pedidos
                      </Link>
                      <hr className="border-eliteGold/10 my-1" />
                      <button 
                        onClick={logout}
                        className="w-full text-left px-3 py-2 text-sm text-red-400 hover:bg-red-500/10 rounded transition-colors"
                      >
                        Sair
                      </button>
                    </div>
                  </div>
                </div>
              ) : (
                <Link to="/login" className="text-white hover:text-eliteGold transition-colors text-sm">
                  Entrar
                </Link>
              )}
            </div>

            {/* Menu Hamburger Mobile */}
            <button
              onClick={() => setMobileMenuOpen(true)}
              className="md:hidden p-2 text-white hover:text-eliteGold transition-colors"
              aria-label="Abrir menu"
            >
              <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
              </svg>
            </button>
          </div>
        </div>
      </header>

      {/* Menu Mobile Overlay */}
      {mobileMenuOpen && (
        <div 
          className="fixed inset-0 bg-black/60 z-50 md:hidden"
          onClick={() => setMobileMenuOpen(false)}
        />
      )}

      {/* Menu Mobile Drawer */}
      <div className={`fixed top-0 right-0 h-full w-80 max-w-[85vw] bg-eliteBlack border-l border-eliteGold/20 z-50 transform transition-transform duration-300 md:hidden ${mobileMenuOpen ? 'translate-x-0' : 'translate-x-full'}`}>
        {/* Header do menu */}
        <div className="flex items-center justify-between p-4 border-b border-eliteGold/20">
          <span className="font-heading text-eliteGold">Menu</span>
          <button
            onClick={() => setMobileMenuOpen(false)}
            className="p-2 hover:bg-eliteGold/10 rounded-lg transition-colors"
          >
            <svg className="w-6 h-6 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        {/* Conteúdo do menu */}
        <div className="p-4 space-y-2">
          {/* Info do usuário */}
          {isAuthenticated && (
            <div className="p-3 bg-eliteBlackSoft rounded-lg mb-4">
              <p className="text-white font-medium">{user?.name || 'Usuário'}</p>
              <p className="text-gray-400 text-sm">{user?.email}</p>
              {isAdmin && (
                <span className="inline-block mt-1 bg-eliteGold/20 text-eliteGold text-xs px-2 py-0.5 rounded">
                  Admin
                </span>
              )}
            </div>
          )}

          {/* Links de navegação */}
          {navLinks.map(link => (
            <Link 
              key={link.path}
              to={link.path}
              onClick={() => setMobileMenuOpen(false)}
              className={`block px-4 py-3 rounded-lg transition-colors ${isActive(link.path) ? 'bg-eliteGold/20 text-eliteGold' : 'text-white hover:bg-eliteGold/10'}`}
            >
              {link.label}
            </Link>
          ))}

          <hr className="border-eliteGold/10 my-3" />

          {/* Links de conta */}
          {isAuthenticated ? (
            <>
              {isAdmin && (
                <Link 
                  to="/admin"
                  onClick={() => setMobileMenuOpen(false)}
                  className="flex items-center gap-3 px-4 py-3 text-white hover:bg-eliteGold/10 rounded-lg transition-colors"
                >
                  <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                  </svg>
                  Painel Admin
                </Link>
              )}
              <Link 
                to="/minha-conta"
                onClick={() => setMobileMenuOpen(false)}
                className="flex items-center gap-3 px-4 py-3 text-white hover:bg-eliteGold/10 rounded-lg transition-colors"
              >
                <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                </svg>
                Minha Conta
              </Link>
              <Link 
                to="/minha-conta/pedidos"
                onClick={() => setMobileMenuOpen(false)}
                className="flex items-center gap-3 px-4 py-3 text-white hover:bg-eliteGold/10 rounded-lg transition-colors"
              >
                <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
                </svg>
                Meus Pedidos
              </Link>
              <button 
                onClick={() => { logout(); setMobileMenuOpen(false); }}
                className="w-full flex items-center gap-3 px-4 py-3 text-red-400 hover:bg-red-500/10 rounded-lg transition-colors"
              >
                <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
                </svg>
                Sair
              </button>
            </>
          ) : (
            <>
              <Link 
                to="/login"
                onClick={() => setMobileMenuOpen(false)}
                className="flex items-center gap-3 px-4 py-3 text-white hover:bg-eliteGold/10 rounded-lg transition-colors"
              >
                <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 16l-4-4m0 0l4-4m-4 4h14m-5 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h7a3 3 0 013 3v1" />
                </svg>
                Entrar
              </Link>
              <Link 
                to="/cadastro"
                onClick={() => setMobileMenuOpen(false)}
                className="flex items-center gap-3 px-4 py-3 bg-eliteGold text-eliteBlack font-semibold rounded-lg transition-colors"
              >
                <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M18 9v3m0 0v3m0-3h3m-3 0h-3m-2-5a4 4 0 11-8 0 4 4 0 018 0zM3 20a6 6 0 0112 0v1H3v-1z" />
                </svg>
                Criar Conta
              </Link>
            </>
          )}
        </div>
      </div>
    </>
  );
}
