import { Link } from 'react-router-dom';
import { useState, useEffect } from 'react';
import { Button, ProductCard, Logo } from '../../components';
import { productService } from '../../services/productService';

export function HomePage() {
  const [featuredProducts, setFeaturedProducts] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadProducts = async () => {
      try {
        const response = await productService.getProducts({ pageSize: 8 });
        // A API retorna { success, data: { items, pagination } }
        const items = response?.data?.items || [];
        setFeaturedProducts(items);
      } catch (error) {
        console.error('Erro ao carregar produtos:', error);
        setFeaturedProducts([]);
      } finally {
        setLoading(false);
      }
    };
    loadProducts();
  }, []);

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
          <div className="mb-8 flex justify-center animate-fade-in-down">
            <Logo size="xxl" showText={false} />
          </div>

          <h1 className="font-heading text-4xl md:text-6xl lg:text-7xl font-bold text-white mb-4 animate-fade-in">
            CAMISA DE <span className="text-gradient-gold">ELITE</span>
          </h1>

          <p className="text-xl md:text-2xl text-gray-300 mb-8 max-w-2xl mx-auto animate-fade-in-up animation-delay-200">
            Vista-se como campeão. As melhores camisas de futebol do mundo.
          </p>

          <div className="flex flex-col sm:flex-row gap-4 justify-center animate-fade-in-up animation-delay-300">
            <Link to="/catalogo">
              <Button className="animate-glow-pulse">Ver Catálogo</Button>
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

      {/* Produtos em Destaque */}
      <section className="container mx-auto px-4 py-16">
        <div className="text-center mb-12">
          <h2 className="text-3xl font-heading font-bold text-white mb-2">
            Produtos em <span className="text-eliteGold">Destaque</span>
          </h2>
          <p className="text-gray-400">As camisas mais procuradas do momento</p>
        </div>

        {loading ? (
          <div className="flex justify-center py-12">
            <div className="w-8 h-8 border-2 border-eliteGold border-t-transparent rounded-full animate-spin" />
          </div>
        ) : (
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 md:gap-6">
            {featuredProducts.map((product, index) => (
              <div 
                key={product.id} 
                className="animate-fade-in-up"
                style={{ animationDelay: `${index * 100}ms` }}
              >
                <ProductCard product={product} />
              </div>
            ))}
          </div>
        )}

        <div className="text-center mt-10">
          <Link to="/catalogo">
            <Button>Ver Todos os Produtos</Button>
          </Link>
        </div>
      </section>

      {/* Categorias */}
      <section className="container mx-auto px-4 py-16 border-t border-eliteGold/10">
        <div className="text-center mb-12">
          <h2 className="text-3xl font-heading font-bold text-white mb-2">Explore por <span className="text-eliteGold">Categoria</span></h2>
          <p className="text-gray-400">Camisas nacionais e internacionais para todos os gostos</p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-12">
          {/* ...links de categoria... */}
          <Link to="/catalogo?category=NACIONAL" className="card-hover group p-6 text-center border border-transparent hover:border-eliteGold/40">
            <div className="w-12 h-12 mx-auto mb-3 bg-green-500/20 rounded-full flex items-center justify-center group-hover:scale-110 transition-transform">
              <svg className="w-6 h-6 text-green-400" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M3 21V3h18v18H3z" />
                <circle cx="12" cy="12" r="4" />
              </svg>
            </div>
            <h3 className="text-lg font-semibold group-hover:text-eliteGold transition-colors">
              Nacionais
            </h3>
            <p className="text-gray-500 text-sm mt-1">Brasileirão e mais</p>
          </Link>
          <Link to="/catalogo?category=INTERNACIONAL" className="card-hover group p-6 text-center border border-transparent hover:border-eliteGold/40">
            <div className="w-12 h-12 mx-auto mb-3 bg-blue-500/20 rounded-full flex items-center justify-center group-hover:scale-110 transition-transform">
              <svg className="w-6 h-6 text-blue-400" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <circle cx="12" cy="12" r="10" />
                <path d="M2 12h20M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z" />
              </svg>
            </div>
            <h3 className="text-lg font-semibold group-hover:text-eliteGold transition-colors">
              Internacionais
            </h3>
            <p className="text-gray-500 text-sm mt-1">Europa e mais</p>
          </Link>
          <Link to="/catalogo?category=SELECAO" className="card-hover group p-6 text-center border border-transparent hover:border-eliteGold/40">
            <div className="w-12 h-12 mx-auto mb-3 bg-yellow-500/20 rounded-full flex items-center justify-center group-hover:scale-110 transition-transform">
              <svg className="w-6 h-6 text-yellow-400" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M6 9H4.5a2.5 2.5 0 0 1 0-5H6" />
                <path d="M18 9h1.5a2.5 2.5 0 0 0 0-5H18" />
                <path d="M4 22h16" />
                <path d="M10 14.66V17c0 .55-.47.98-.97 1.21C7.85 18.75 7 20.24 7 22" />
                <path d="M14 14.66V17c0 .55.47.98.97 1.21C16.15 18.75 17 20.24 17 22" />
                <path d="M18 2H6v7a6 6 0 0 0 12 0V2Z" />
              </svg>
            </div>
            <h3 className="text-lg font-semibold group-hover:text-eliteGold transition-colors">
              Seleções
            </h3>
            <p className="text-gray-500 text-sm mt-1">Copa do Mundo</p>
          </Link>
          <Link to="/catalogo?category=RETRO" className="card-hover group p-6 text-center border border-transparent hover:border-eliteGold/40">
            <div className="w-12 h-12 mx-auto mb-3 bg-eliteGold/20 rounded-full flex items-center justify-center group-hover:scale-110 transition-transform">
              <svg className="w-6 h-6 text-eliteGold" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2" />
              </svg>
            </div>
            <h3 className="text-lg font-semibold group-hover:text-eliteGold transition-colors">
              Retrô
            </h3>
            <p className="text-gray-500 text-sm mt-1">Clássicas</p>
          </Link>
        </div>
        {/* CTA junto */}
        <div className="bg-eliteBlackSoft rounded-2xl py-12 px-4 text-center max-w-2xl mx-auto">
          <h2 className="font-heading text-2xl text-white mb-4">
            Não encontrou o que procura?
          </h2>
          <p className="text-gray-400 mb-6">
            Entre em contato pelo WhatsApp e encomende sua camisa favorita
          </p>
          <a
            href="https://wa.me/5534996769091"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2"
          >
            <Button className="flex items-center gap-2">
              <svg className="w-5 h-5" viewBox="0 0 24 24" fill="currentColor">
                <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z" />
              </svg>
              Fale Conosco
            </Button>
          </a>
        </div>
      </section>
    </div>
  );
}
