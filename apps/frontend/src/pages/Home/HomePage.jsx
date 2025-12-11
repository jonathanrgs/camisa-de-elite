import { Link } from 'react-router-dom';
import { useState, useEffect } from 'react';
import { Button, ProductCard } from '../../components';
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

      {/* Produtos em Destaque */}
      <section className="container mx-auto px-4 py-16">
        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold text-white mb-2">
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
            {featuredProducts.map(product => (
              <ProductCard key={product.id} product={product} />
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
          <h2 className="text-3xl font-bold text-white mb-2">Explore por <span className="text-eliteGold">Categoria</span></h2>
          <p className="text-gray-400">Camisas nacionais e internacionais para todos os gostos</p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          <Link to="/catalogo?category=NACIONAL" className="card group p-6 text-center hover:border-eliteGold/60">
            <span className="text-4xl mb-3 block">🇧🇷</span>
            <h3 className="text-lg font-semibold group-hover:text-eliteGold transition-colors">
              Nacionais
            </h3>
            <p className="text-gray-500 text-sm mt-1">Brasileirão e mais</p>
          </Link>

          <Link to="/catalogo?category=INTERNACIONAL" className="card group p-6 text-center hover:border-eliteGold/60">
            <span className="text-4xl mb-3 block">🌍</span>
            <h3 className="text-lg font-semibold group-hover:text-eliteGold transition-colors">
              Internacionais
            </h3>
            <p className="text-gray-500 text-sm mt-1">Europa e mais</p>
          </Link>

          <Link to="/catalogo?category=SELECAO" className="card group p-6 text-center hover:border-eliteGold/60">
            <span className="text-4xl mb-3 block">🏆</span>
            <h3 className="text-lg font-semibold group-hover:text-eliteGold transition-colors">
              Seleções
            </h3>
            <p className="text-gray-500 text-sm mt-1">Copa do Mundo</p>
          </Link>

          <Link to="/catalogo?category=RETRO" className="card group p-6 text-center hover:border-eliteGold/60">
            <span className="text-4xl mb-3 block">⭐</span>
            <h3 className="text-lg font-semibold group-hover:text-eliteGold transition-colors">
              Retrô
            </h3>
            <p className="text-gray-500 text-sm mt-1">Clássicas</p>
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
