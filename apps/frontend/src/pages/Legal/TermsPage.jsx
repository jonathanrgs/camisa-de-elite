import { Link } from 'react-router-dom';
import { CONFIG } from '../../config';

export function TermsPage() {
  return (
    <div className="container mx-auto px-4 py-8 max-w-4xl">
      <h1 className="font-heading text-3xl text-eliteGold mb-8">Termos de Uso</h1>
      
      <div className="prose prose-invert prose-gold max-w-none space-y-6 text-gray-300">
        <p className="text-sm text-gray-400">Última atualização: {new Date().toLocaleDateString('pt-BR')}</p>
        
        <section className="card">
          <h2 className="text-xl font-semibold text-white mb-4">1. Aceitação dos Termos</h2>
          <p>
            Ao acessar e utilizar o site {CONFIG.storeName} ("Catálogo", "nós", "nosso"), você concorda 
            em cumprir e estar vinculado aos seguintes termos e condições de uso. Se você não 
            concordar com qualquer parte destes termos, não deverá utilizar nosso site.
          </p>
        </section>

        <section className="card">
          <h2 className="text-xl font-semibold text-white mb-4">2. Natureza do Serviço</h2>
          <p>
            O {CONFIG.storeName} é um <strong className="text-eliteGold">catálogo online de camisas de futebol</strong> que 
            apresenta produtos para visualização. Atualmente, operamos como vitrine de produtos, 
            com negociações realizadas diretamente via WhatsApp.
          </p>
          <ul className="list-disc list-inside mt-3 space-y-1">
            <li>Somos um catálogo/vitrine de produtos</li>
            <li>Preços e disponibilidade estão sujeitos a alterações</li>
            <li>As imagens são meramente ilustrativas</li>
          </ul>
        </section>

        <section className="card">
          <h2 className="text-xl font-semibold text-white mb-4">3. Produtos</h2>
          <p>
            Os produtos exibidos neste catálogo são camisas de futebol de diversos times e seleções.
            Consulte detalhes sobre cada produto diretamente via WhatsApp.
          </p>
        </section>

        <section className="card">
          <h2 className="text-xl font-semibold text-white mb-4">4. Uso do Site</h2>
          <p>Ao utilizar nosso site, você concorda em:</p>
          <ul className="list-disc list-inside mt-3 space-y-1">
            <li>Fornecer informações verdadeiras e precisas ao entrar em contato</li>
            <li>Não utilizar o site para fins ilegais ou não autorizados</li>
            <li>Não tentar acessar áreas restritas do sistema</li>
            <li>Não reproduzir, duplicar ou revender qualquer parte do serviço</li>
          </ul>
        </section>

        <section className="card">
          <h2 className="text-xl font-semibold text-white mb-4">5. Preços e Pagamentos</h2>
          <ul className="list-disc list-inside space-y-1">
            <li>Os preços são exibidos em Reais (R$)</li>
            <li>Preços podem ser alterados sem aviso prévio</li>
            <li>Formas de pagamento são combinadas diretamente via WhatsApp</li>
            <li>Frete e prazo de entrega são informados no momento da negociação</li>
          </ul>
        </section>

        <section className="card">
          <h2 className="text-xl font-semibold text-white mb-4">6. Trocas e Devoluções</h2>
          <p>
            Para informações sobre trocas e devoluções, entre em contato via WhatsApp. 
            Cada caso será analisado individualmente.
          </p>
        </section>

        <section className="card">
          <h2 className="text-xl font-semibold text-white mb-4">7. Limitação de Responsabilidade</h2>
          <p>
            O {CONFIG.storeName} não se responsabiliza por:
          </p>
          <ul className="list-disc list-inside mt-3 space-y-1">
            <li>Interrupções ou erros no funcionamento do site</li>
            <li>Danos decorrentes do uso ou impossibilidade de uso do serviço</li>
            <li>Atrasos na entrega por parte de transportadoras</li>
          </ul>
        </section>

        <section className="card">
          <h2 className="text-xl font-semibold text-white mb-4">8. Modificações dos Termos</h2>
          <p>
            Reservamo-nos o direito de modificar estes termos a qualquer momento. As alterações 
            entram em vigor imediatamente após a publicação no site.
          </p>
        </section>

        <section className="card">
          <h2 className="text-xl font-semibold text-white mb-4">9. Contato</h2>
          <p>
            Para dúvidas sobre estes termos, entre em contato:
          </p>
          <ul className="list-disc list-inside mt-3 space-y-1">
            <li>WhatsApp: {CONFIG.whatsapp.formatted}</li>
            <li>E-mail: {CONFIG.email.contact}</li>
          </ul>
        </section>

        <div className="flex gap-4 pt-6">
          <Link to="/privacidade" className="text-eliteGold hover:underline">
            Política de Privacidade →
          </Link>
          <Link to="/" className="text-gray-400 hover:text-white">
            ← Voltar ao início
          </Link>
        </div>
      </div>
    </div>
  );
}
