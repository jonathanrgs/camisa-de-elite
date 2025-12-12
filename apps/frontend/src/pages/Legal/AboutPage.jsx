import { Link } from 'react-router-dom';
import { CONFIG, getWhatsAppLink } from '../../config';

export function AboutPage() {
  return (
    <div className="container mx-auto px-4 py-8 max-w-4xl">
      <h1 className="font-heading text-3xl text-eliteGold mb-8">Sobre o {CONFIG.storeName}</h1>
      
      <div className="space-y-8">
        {/* Hero */}
        <section className="card text-center py-8">
          <div className="w-20 h-20 mx-auto mb-4 rounded-full bg-eliteGold/20 flex items-center justify-center">
            <svg className="w-10 h-10 text-eliteGold" viewBox="0 0 24 24" fill="currentColor">
              <circle cx="12" cy="12" r="10" fill="none" stroke="currentColor" strokeWidth="2"/>
              <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm1 17.93c-3.95-.49-7-3.85-7-7.93 0-.62.08-1.21.21-1.79L10 14v1c0 1.1.9 2 2 2v1.93zm6.9-2.54c-.26-.81-1-1.39-1.9-1.39h-1v-3c0-.55-.45-1-1-1H8v-2h2c.55 0 1-.45 1-1V7h2c1.1 0 2-.9 2-2v-.41c2.93 1.19 5 4.06 5 7.41 0 2.08-.8 3.97-2.1 5.39z" />
            </svg>
          </div>
          <h2 className="text-2xl font-semibold text-white mb-4">
            {CONFIG.storeSlogan}
          </h2>
          <p className="text-gray-300 max-w-2xl mx-auto">
            O {CONFIG.storeName} é um catálogo de camisas de futebol. 
            Encontre camisas dos seus times favoritos com ótimos preços.
          </p>
        </section>

        {/* O que oferecemos */}
        <section className="card">
          <h2 className="text-xl font-semibold text-white mb-6">O que oferecemos</h2>
          <div className="grid md:grid-cols-3 gap-6">
            <div className="text-center">
              <div className="w-14 h-14 mx-auto mb-3 bg-eliteGold/20 rounded-full flex items-center justify-center">
                <svg className="w-7 h-7 text-eliteGold" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4M7.835 4.697a3.42 3.42 0 001.946-.806 3.42 3.42 0 014.438 0 3.42 3.42 0 001.946.806 3.42 3.42 0 013.138 3.138 3.42 3.42 0 00.806 1.946 3.42 3.42 0 010 4.438 3.42 3.42 0 00-.806 1.946 3.42 3.42 0 01-3.138 3.138 3.42 3.42 0 00-1.946.806 3.42 3.42 0 01-4.438 0 3.42 3.42 0 00-1.946-.806 3.42 3.42 0 01-3.138-3.138 3.42 3.42 0 00-.806-1.946 3.42 3.42 0 010-4.438 3.42 3.42 0 00.806-1.946 3.42 3.42 0 013.138-3.138z" />
                </svg>
              </div>
              <h3 className="font-semibold text-eliteGold mb-2">Variedade</h3>
              <p className="text-gray-400 text-sm">
                Camisas de diversos times e seleções, nacionais e internacionais
              </p>
            </div>
            <div className="text-center">
              <div className="w-14 h-14 mx-auto mb-3 bg-blue-500/20 rounded-full flex items-center justify-center">
                <svg className="w-7 h-7 text-blue-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <circle cx="12" cy="12" r="10" />
                  <path d="M2 12h20M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z" />
                </svg>
              </div>
              <h3 className="font-semibold text-eliteGold mb-2">Times do Mundo Todo</h3>
              <p className="text-gray-400 text-sm">
                Clubes brasileiros, europeus, seleções nacionais e edições especiais
              </p>
            </div>
            <div className="text-center">
              <div className="w-14 h-14 mx-auto mb-3 bg-green-500/20 rounded-full flex items-center justify-center">
                <svg className="w-7 h-7 text-green-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
                </svg>
              </div>
              <h3 className="font-semibold text-eliteGold mb-2">Atendimento Direto</h3>
              <p className="text-gray-400 text-sm">
                Tire suas dúvidas diretamente pelo WhatsApp
              </p>
            </div>
          </div>
        </section>

        {/* Tabela de Medidas */}
        <section className="card">
          <h2 className="text-xl font-semibold text-white mb-4">Tabela de Medidas</h2>
          <div className="overflow-x-auto">
            <table className="min-w-full text-xs text-center border border-eliteGold/20 rounded-lg bg-eliteBlackSoft">
              <thead>
                <tr className="bg-eliteGold/10 text-eliteGold">
                  <th className="p-2">Tamanho</th>
                  <th className="p-2">Comprimento (cm)</th>
                  <th className="p-2">Largura (cm)</th>
                  <th className="p-2">Altura (cm)</th>
                  <th className="p-2">Peso (kg)</th>
                </tr>
              </thead>
              <tbody>
                <tr className="border-t border-eliteGold/10">
                  <td className="p-2 font-bold text-eliteGold">P</td>
                  <td className="p-2 text-white">69-71</td>
                  <td className="p-2 text-white">53-55</td>
                  <td className="p-2 text-white">162-170</td>
                  <td className="p-2 text-white">50-62</td>
                </tr>
                <tr className="border-t border-eliteGold/10">
                  <td className="p-2 font-bold text-eliteGold">M</td>
                  <td className="p-2 text-white">71-73</td>
                  <td className="p-2 text-white">55-57</td>
                  <td className="p-2 text-white">170-176</td>
                  <td className="p-2 text-white">62-78</td>
                </tr>
                <tr className="border-t border-eliteGold/10">
                  <td className="p-2 font-bold text-eliteGold">G</td>
                  <td className="p-2 text-white">73-75</td>
                  <td className="p-2 text-white">57-58</td>
                  <td className="p-2 text-white">176-182</td>
                  <td className="p-2 text-white">78-83</td>
                </tr>
                <tr className="border-t border-eliteGold/10">
                  <td className="p-2 font-bold text-eliteGold">GG</td>
                  <td className="p-2 text-white">75-78</td>
                  <td className="p-2 text-white">58-60</td>
                  <td className="p-2 text-white">182-190</td>
                  <td className="p-2 text-white">83-90</td>
                </tr>
                <tr className="border-t border-eliteGold/10">
                  <td className="p-2 font-bold text-eliteGold">XG</td>
                  <td className="p-2 text-white">78-81</td>
                  <td className="p-2 text-white">60-62</td>
                  <td className="p-2 text-white">190-195</td>
                  <td className="p-2 text-white">90-97</td>
                </tr>
              </tbody>
            </table>
            <p className="text-xs text-gray-500 mt-2 text-center">Considerar margem de erro de 1-3 cm em cada medida.</p>
          </div>
          <p className="text-center text-gray-400 text-sm mt-4">
            Consulte a disponibilidade de cada tamanho na página do produto.
          </p>
        </section>

        {/* Como funciona */}
        <section className="card">
          <h2 className="text-xl font-semibold text-white mb-6">Como funciona</h2>
          <div className="space-y-4">
            <div className="flex gap-4 items-start">
              <div className="w-10 h-10 rounded-full bg-eliteGold text-eliteBlack flex items-center justify-center font-bold flex-shrink-0">
                1
              </div>
              <div>
                <h3 className="font-semibold text-white">Escolha seus produtos</h3>
                <p className="text-gray-400 text-sm">
                  Navegue pelo catálogo e adicione ao carrinho as camisas que deseja
                </p>
              </div>
            </div>
            <div className="flex gap-4 items-start">
              <div className="w-10 h-10 rounded-full bg-eliteGold text-eliteBlack flex items-center justify-center font-bold flex-shrink-0">
                2
              </div>
              <div>
                <h3 className="font-semibold text-white">Finalize o pedido</h3>
                <p className="text-gray-400 text-sm">
                  Preencha seus dados e clique em finalizar
                </p>
              </div>
            </div>
            <div className="flex gap-4 items-start">
              <div className="w-10 h-10 rounded-full bg-eliteGold text-eliteBlack flex items-center justify-center font-bold flex-shrink-0">
                3
              </div>
              <div>
                <h3 className="font-semibold text-white">Converse no WhatsApp</h3>
                <p className="text-gray-400 text-sm">
                  Você será redirecionado para o WhatsApp para combinar pagamento e entrega
                </p>
              </div>
            </div>
            <div className="flex gap-4 items-start">
              <div className="w-10 h-10 rounded-full bg-eliteGold text-eliteBlack flex items-center justify-center font-bold flex-shrink-0">
                4
              </div>
              <div>
                <h3 className="font-semibold text-white">Receba em casa</h3>
                <p className="text-gray-400 text-sm">
                  Enviamos para todo o Brasil com acompanhamento de rastreio
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* Contato */}
        <section className="card text-center">
          <h2 className="text-xl font-semibold text-white mb-4">Entre em contato</h2>
          <p className="text-gray-300 mb-6">
            Dúvidas? Fale conosco pelo WhatsApp!
          </p>
          <a 
            href={getWhatsAppLink()}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2 bg-green-600 hover:bg-green-700 text-white px-6 py-3 rounded-lg font-semibold transition-colors"
          >
            <svg className="w-5 h-5" viewBox="0 0 24 24" fill="currentColor">
              <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/>
            </svg>
            Chamar no WhatsApp
          </a>
        </section>

        {/* Links legais */}
        <div className="flex flex-wrap gap-4 justify-center pt-4">
          <Link to="/termos" className="text-gray-400 hover:text-eliteGold transition-colors">
            Termos de Uso
          </Link>
          <span className="text-gray-600">•</span>
          <Link to="/privacidade" className="text-gray-400 hover:text-eliteGold transition-colors">
            Política de Privacidade
          </Link>
          <span className="text-gray-600">•</span>
          <Link to="/catalogo" className="text-eliteGold hover:underline">
            Ver Catálogo →
          </Link>
        </div>
      </div>
    </div>
  );
}
