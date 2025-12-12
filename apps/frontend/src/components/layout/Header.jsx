import { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { useCart } from '../../hooks/useCart';
import { useAuth } from '../../hooks/useAuth';
import { Logo } from '../ui/Logo';

export function Header() {
  const { count } = useCart();
  const { isAuthenticated, isAdmin, user, logout } = useAuth();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const location = useLocation();

  // Detectar scroll para mudar estilo do header
  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const isActive = (path) => location.pathname === path;

  const navLinks = [
    { path: '/', label: 'Início', icon: (
      <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
      </svg>
    )},
    { path: '/catalogo', label: 'Catálogo', icon: (
      <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2V6zM14 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2V6zM4 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2v-2zM14 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2v-2z" />
      </svg>
    )},
    { path: '/sobre', label: 'Sobre', icon: (
      <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
      </svg>
    )},
  ];
  
  // Detecta se está na home
  const isHome = location.pathname === '/';

  // Header: transparente só na home no topo, escuro e menor ao rolar
  const headerBase = 'sticky top-0 z-50';
  const headerBg = 'bg-eliteBlack';
  const headerBorder = 'border-b border-eliteGold/10';
  // Altura fixa padrão
  const headerHeight = 'h-24 lg:h-28 pb-6';

  return (
    <>
      <header className={`${headerBase} ${headerBg} ${headerBorder} ${headerHeight}`}>  
        {/* Top bar - apenas desktop */}
        <div className="hidden lg:block bg-gradient-to-r from-eliteGold/10 via-eliteGold/5 to-eliteGold/10">
          <div className="container mx-auto px-4 py-1.5 flex items-center justify-between text-xs">
            <div className="flex items-center gap-4 text-gray-400">
              <span className="flex items-center gap-1">
                <svg className="w-3.5 h-3.5 text-green-400" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/>
                </svg>
                Atendimento via WhatsApp
              </span>
              <span className="text-eliteGold/60">|</span>
              <span>Entrega para todo Brasil</span>
            </div>
            <div className="flex items-center gap-4 text-gray-400">
              <Link to="/termos" className="hover:text-eliteGold transition-colors">Termos</Link>
              <Link to="/privacidade" className="hover:text-eliteGold transition-colors">Privacidade</Link>
            </div>
          </div>
        </div>

        {/* Main header */}
        <div className="container mx-auto px-4">
          <div className={`flex items-center justify-between ${headerHeight}`}> 
            {/* Logo */}
            <Link to="/" className="logo-hover group flex items-center gap-2">
              <Logo size="sm" />
            </Link>

            {/* Nav Desktop - Centro */}
            <nav className="hidden lg:flex items-center gap-1">
              {navLinks.map(link => (
                <Link 
                  key={link.path}
                  to={link.path} 
                  className={`relative px-4 py-2 rounded-lg font-medium transition-all duration-200 flex items-center gap-2 ${
                    isActive(link.path) 
                      ? 'text-eliteGold bg-eliteGold/10' 
                      : 'text-gray-300 hover:text-white hover:bg-white/5'
                  }`}
                >
                  {link.icon}
                  {link.label}
                  {isActive(link.path) && (
                    <span className="absolute bottom-0 left-1/2 -translate-x-1/2 w-8 h-0.5 bg-eliteGold rounded-full" />
                  )}
                </Link>
              ))}
            </nav>

            {/* Ações - Direita */}
            <div className="flex items-center gap-2 lg:gap-3">
              {/* Carrinho */}
              <Link to="/carrinho" className="relative p-2.5 text-gray-300 hover:text-eliteGold bg-white/5 hover:bg-eliteGold/10 rounded-lg transition-all group">
                <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" />
                </svg>
                {count > 0 && (
                  <span className="absolute -top-1 -right-1 bg-eliteGold text-eliteBlack text-xs font-bold min-w-5 h-5 px-1 rounded-full flex items-center justify-center animate-scale-in">
                    {count > 9 ? '9+' : count}
                  </span>
                )}
              </Link>

              {/* Usuário Desktop */}
              <div className="hidden md:block">
                {isAuthenticated ? (
                  <div className="relative group">
                    <button className="flex items-center gap-2 px-3 py-2 text-gray-300 hover:text-white bg-white/5 hover:bg-white/10 rounded-lg transition-all">
                      <div className="w-7 h-7 bg-gradient-to-br from-eliteGold to-eliteGold/60 rounded-full flex items-center justify-center text-eliteBlack font-bold text-sm">
                        {user?.name?.[0]?.toUpperCase() || 'U'}
                      </div>
                      <span className="text-sm max-w-24 truncate">{user?.name?.split(' ')[0] || 'Conta'}</span>
                      {isAdmin && (
                        <span className="bg-eliteGold/20 text-eliteGold text-[10px] px-1.5 py-0.5 rounded font-medium">ADM</span>
                      )}
                      <svg className="w-4 h-4 text-gray-500 group-hover:rotate-180 transition-transform" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                      </svg>
                    </button>
                    {/* Dropdown */}
                    <div className="absolute right-0 top-full mt-2 w-56 bg-eliteBlack border border-eliteGold/20 rounded-xl shadow-2xl opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200 transform translate-y-2 group-hover:translate-y-0">
                      <div className="p-3 border-b border-gray-800">
                        <p className="text-white font-medium truncate">{user?.name}</p>
                        <p className="text-gray-500 text-sm truncate">{user?.email}</p>
                      </div>
                      <div className="p-2">
                        {isAdmin && (
                          <Link to="/admin" className="flex items-center gap-3 px-3 py-2.5 text-sm text-white hover:bg-eliteGold/10 rounded-lg transition-colors">
                            <svg className="w-4 h-4 text-eliteGold" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                            </svg>
                            Painel Admin
                          </Link>
                        )}
                        <Link to="/minha-conta" className="flex items-center gap-3 px-3 py-2.5 text-sm text-white hover:bg-white/5 rounded-lg transition-colors">
                          <svg className="w-4 h-4 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                          </svg>
                          Minha Conta
                        </Link>
                        <Link to="/minha-conta/pedidos" className="flex items-center gap-3 px-3 py-2.5 text-sm text-white hover:bg-white/5 rounded-lg transition-colors">
                          <svg className="w-4 h-4 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4" />
                          </svg>
                          Meus Pedidos
                        </Link>
                        <hr className="my-2 border-gray-800" />
                        <button 
                          onClick={logout}
                          className="w-full flex items-center gap-3 px-3 py-2.5 text-sm text-red-400 hover:bg-red-500/10 rounded-lg transition-colors"
                        >
                          <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
                          </svg>
                          Sair
                        </button>
                      </div>
                    </div>
                  </div>
                ) : (
                  <div className="flex items-center gap-2">
                    <Link to="/login" className="px-4 py-2 text-sm text-gray-300 hover:text-white transition-colors">
                      Entrar
                    </Link>
                    <Link to="/cadastro" className="px-4 py-2 text-sm bg-eliteGold hover:bg-eliteGoldLight text-eliteBlack font-semibold rounded-lg transition-all hover:shadow-lg hover:shadow-eliteGold/20">
                      Cadastrar
                    </Link>
                  </div>
                )}
              </div>

              {/* Menu Hamburger Mobile */}
              <button
                onClick={() => setMobileMenuOpen(true)}
                className="lg:hidden p-2.5 text-gray-300 hover:text-white bg-white/5 hover:bg-white/10 rounded-lg transition-all"
                aria-label="Abrir menu"
              >
                <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
                </svg>
              </button>
            </div>
          </div>
        </div>
      </header>

      {/* Menu Mobile Overlay */}
      {mobileMenuOpen && (
        <div 
          className="fixed inset-0 bg-black/70 backdrop-blur-sm z-50 lg:hidden animate-fade-in"
          onClick={() => setMobileMenuOpen(false)}
        />
      )}

      {/* Menu Mobile Drawer */}
      <div className={`fixed top-0 right-0 h-full w-80 max-w-[85vw] bg-eliteBlack z-50 transform transition-transform duration-300 ease-out lg:hidden ${mobileMenuOpen ? 'translate-x-0' : 'translate-x-full'}`}>
        {/* Header do menu */}
        <div className="flex items-center justify-between p-4 border-b border-gray-800">
          <Logo size="sm" />
          <button
            onClick={() => setMobileMenuOpen(false)}
            className="p-2 hover:bg-white/10 rounded-lg transition-colors"
          >
            <svg className="w-5 h-5 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        {/* Conteúdo do menu */}
        <div className="p-4 overflow-y-auto h-[calc(100%-60px)]">
          {/* Info do usuário */}
          {isAuthenticated && (
            <div className="flex items-center gap-3 p-3 bg-white/5 rounded-xl mb-4">
              <div className="w-10 h-10 bg-gradient-to-br from-eliteGold to-eliteGold/60 rounded-full flex items-center justify-center text-eliteBlack font-bold">
                {user?.name?.[0]?.toUpperCase() || 'U'}
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-white font-medium truncate">{user?.name || 'Usuário'}</p>
                <p className="text-gray-500 text-sm truncate">{user?.email}</p>
              </div>
              {isAdmin && (
                <span className="bg-eliteGold/20 text-eliteGold text-xs px-2 py-0.5 rounded font-medium">ADM</span>
              )}
            </div>
          )}

          {/* Links de navegação */}
          <div className="space-y-1 mb-4">
            {navLinks.map(link => (
              <Link 
                key={link.path}
                to={link.path}
                onClick={() => setMobileMenuOpen(false)}
                className={`flex items-center gap-3 px-4 py-3 rounded-xl transition-all ${
                  isActive(link.path) 
                    ? 'bg-eliteGold/15 text-eliteGold' 
                    : 'text-gray-300 hover:bg-white/5 hover:text-white'
                }`}
              >
                {link.icon}
                {link.label}
              </Link>
            ))}
          </div>

          <hr className="border-gray-800 my-4" />

          {/* Links de conta */}
          {isAuthenticated ? (
            <div className="space-y-1">
              {isAdmin && (
                <Link 
                  to="/admin"
                  onClick={() => setMobileMenuOpen(false)}
                  className="flex items-center gap-3 px-4 py-3 text-eliteGold hover:bg-eliteGold/10 rounded-xl transition-colors"
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
                className="flex items-center gap-3 px-4 py-3 text-gray-300 hover:bg-white/5 hover:text-white rounded-xl transition-colors"
              >
                <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                </svg>
                Minha Conta
              </Link>
              <Link 
                to="/minha-conta/pedidos"
                onClick={() => setMobileMenuOpen(false)}
                className="flex items-center gap-3 px-4 py-3 text-gray-300 hover:bg-white/5 hover:text-white rounded-xl transition-colors"
              >
                <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4" />
                </svg>
                Meus Pedidos
              </Link>
              <hr className="border-gray-800 my-2" />
              <button 
                onClick={() => { logout(); setMobileMenuOpen(false); }}
                className="w-full flex items-center gap-3 px-4 py-3 text-red-400 hover:bg-red-500/10 rounded-xl transition-colors"
              >
                <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
                </svg>
                Sair
              </button>
            </div>
          ) : (
            <div className="space-y-2">
              <Link 
                to="/login"
                onClick={() => setMobileMenuOpen(false)}
                className="flex items-center justify-center gap-2 px-4 py-3 text-white bg-white/5 hover:bg-white/10 rounded-xl transition-colors"
              >
                <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 16l-4-4m0 0l4-4m-4 4h14m-5 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h7a3 3 0 013 3v1" />
                </svg>
                Entrar
              </Link>
              <Link 
                to="/cadastro"
                onClick={() => setMobileMenuOpen(false)}
                className="flex items-center justify-center gap-2 px-4 py-3 bg-eliteGold text-eliteBlack font-semibold rounded-xl transition-colors"
              >
                <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M18 9v3m0 0v3m0-3h3m-3 0h-3m-2-5a4 4 0 11-8 0 4 4 0 018 0zM3 20a6 6 0 0112 0v1H3v-1z" />
                </svg>
                Criar Conta
              </Link>
            </div>
          )}
        </div>
      </div>
    </>
  );
}
