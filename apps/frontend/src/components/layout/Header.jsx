import { Link } from 'react-router-dom';

export function Header() {
  return (
    <header className="sticky top-0 z-50 bg-eliteBlack/95 backdrop-blur border-b border-eliteGold/20">
      <div className="container mx-auto px-4 py-4 flex items-center justify-between">
        <Link to="/" className="flex items-center gap-2">
          <span className="text-2xl font-heading font-bold text-eliteGold">CAMISA DE ELITE</span>
        </Link>

        <nav className="hidden md:flex items-center gap-6">
          <Link to="/catalogo" className="text-white hover:text-eliteGold transition-colors">
            Catálogo
          </Link>
          <Link to="/sobre" className="text-white hover:text-eliteGold transition-colors">
            Sobre
          </Link>
        </nav>

        <div className="flex items-center gap-4">
          <Link to="/carrinho" className="relative">
            <svg className="w-6 h-6 text-white hover:text-eliteGold transition-colors" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" />
            </svg>
          </Link>
        </div>
      </div>
    </header>
  );
}
