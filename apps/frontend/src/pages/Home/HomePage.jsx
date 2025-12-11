import { Link } from 'react-router-dom';
import { Button } from '../../components';

export function HomePage() {
  return (
    <div>
      {/* Hero Banner */}
      <section className="relative h-screen flex items-center justify-center overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-b from-eliteBlack via-eliteBlack/80 to-eliteBlack" />

        {/* Background pattern */}
        <div className="absolute inset-0 opacity-10">
          <div className="absolute inset-0" style={{
            backgroundImage: 'radial-gradient(circle at 2px 2px, #c9a227 1px, transparent 0)',
            backgroundSize: '40px 40px'
          }} />
        </div>

        <div className="relative z-10 text-center px-4">
          <div className="mb-6">
            <span className="text-eliteGold text-lg tracking-widest">👑</span>
          </div>

          <h1 className="font-heading text-4xl md:text-6xl lg:text-7xl font-bold text-white mb-4">
            CAMISA DE <span className="text-eliteGold">ELITE</span>
          </h1>

          <p className="text-xl md:text-2xl text-gray-300 mb-8 max-w-2xl mx-auto">
            Vista-se como campeão. As melhores camisas de futebol do mundo.
          </p>

          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link to="/catalogo">
              <Button>Ver Catálogo</Button>
            </Link>
            <Link to="/sobre">
              <Button variant="secondary">Sobre Nós</Button>
            </Link>
          </div>
        </div>

        {/* Scroll indicator */}
        <div className="absolute bottom-8 left-1/2 -translate-x-1/2 animate-bounce">
          <svg className="w-6 h-6 text-eliteGold" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 14l-7 7m0 0l-7-7m7 7V3" />
          </svg>
        </div>
      </section>

      {/* Seções de produtos */}
      <section className="container mx-auto px-4 py-16">
        <div className="text-center mb-12">
          <h2 className="font-heading text-3xl text-eliteGold mb-2">Explore Nossa Coleção</h2>
          <p className="text-gray-400">Camisas nacionais e internacionais para todos os gostos</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <Link to="/catalogo?category=NACIONAL" className="card group p-8 text-center">
            <span className="text-4xl mb-4 block">🇧🇷</span>
            <h3 className="font-subheading text-xl font-semibold group-hover:text-eliteGold transition-colors">
              Times Nacionais
            </h3>
            <p className="text-gray-400 text-sm mt-2">Brasileirão, Copa do Brasil e mais</p>
          </Link>

          <Link to="/catalogo?category=INTERNACIONAL" className="card group p-8 text-center">
            <span className="text-4xl mb-4 block">🌍</span>
            <h3 className="font-subheading text-xl font-semibold group-hover:text-eliteGold transition-colors">
              Times Internacionais
            </h3>
            <p className="text-gray-400 text-sm mt-2">Premier League, La Liga, Serie A e mais</p>
          </Link>
        </div>
      </section>

      {/* CTA */}
      <section className="bg-eliteBlackSoft py-16">
        <div className="container mx-auto px-4 text-center">
          <h2 className="font-heading text-2xl text-white mb-4">
            Não encontrou o que procura?
          </h2>
          <p className="text-gray-400 mb-6">
            Entre em contato pelo WhatsApp e encomende sua camisa favorita
          </p>
          <a
            href="https://wa.me/5511999999999"
            target="_blank"
            rel="noopener noreferrer"
          >
            <Button>Fale Conosco</Button>
          </a>
        </div>
      </section>
    </div>
  );
}
