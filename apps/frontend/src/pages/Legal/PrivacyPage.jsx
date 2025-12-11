import { Link } from 'react-router-dom';
import { CONFIG } from '../../config';

export function PrivacyPage() {
  return (
    <div className="container mx-auto px-4 py-8 max-w-4xl">
      <h1 className="font-heading text-3xl text-eliteGold mb-8">Política de Privacidade</h1>
      
      <div className="prose prose-invert prose-gold max-w-none space-y-6 text-gray-300">
        <p className="text-sm text-gray-400">Última atualização: {new Date().toLocaleDateString('pt-BR')}</p>
        
        <div className="bg-blue-500/10 border border-blue-500/30 rounded-lg p-4 flex items-start gap-3">
          <svg className="w-5 h-5 text-blue-400 flex-shrink-0 mt-0.5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" /></svg>
          <p className="text-blue-300 text-sm">
            <strong>LGPD:</strong> Esta política está em conformidade com a Lei Geral de Proteção 
            de Dados (Lei nº 13.709/2018) e outras legislações aplicáveis sobre proteção de dados pessoais.
          </p>
        </div>

        <section className="card">
          <h2 className="text-xl font-semibold text-white mb-4">1. Introdução</h2>
          <p>
            O {CONFIG.storeName} ("nós", "nosso" ou "Catálogo") está comprometido em proteger 
            sua privacidade. Esta Política de Privacidade explica como coletamos, usamos, 
            armazenamos e protegemos suas informações pessoais quando você utiliza nosso site.
          </p>
        </section>

        <section className="card">
          <h2 className="text-xl font-semibold text-white mb-4">2. Dados que Coletamos</h2>
          <p>Podemos coletar os seguintes tipos de dados:</p>
          
          <h3 className="text-lg font-medium text-eliteGold mt-4 mb-2">2.1 Dados fornecidos por você:</h3>
          <ul className="list-disc list-inside space-y-1">
            <li>Nome completo</li>
            <li>Número de telefone/WhatsApp</li>
            <li>Endereço de entrega</li>
            <li>Informações sobre pedidos</li>
          </ul>

          <h3 className="text-lg font-medium text-eliteGold mt-4 mb-2">2.2 Dados coletados automaticamente:</h3>
          <ul className="list-disc list-inside space-y-1">
            <li>Endereço IP</li>
            <li>Tipo de navegador e dispositivo</li>
            <li>Páginas visitadas e tempo de permanência</li>
            <li>Dados de cookies (se aceitos)</li>
          </ul>
        </section>

        <section className="card">
          <h2 className="text-xl font-semibold text-white mb-4">3. Base Legal para Tratamento (LGPD)</h2>
          <p>Tratamos seus dados pessoais com base nas seguintes hipóteses legais:</p>
          <ul className="list-disc list-inside mt-3 space-y-2">
            <li>
              <strong className="text-eliteGold">Execução de contrato:</strong> Para processar 
              pedidos e entregar produtos
            </li>
            <li>
              <strong className="text-eliteGold">Consentimento:</strong> Para envio de 
              comunicações de marketing (quando autorizado)
            </li>
            <li>
              <strong className="text-eliteGold">Interesse legítimo:</strong> Para melhorar 
              nossos serviços e experiência do usuário
            </li>
            <li>
              <strong className="text-eliteGold">Cumprimento de obrigação legal:</strong> Para 
              atender exigências fiscais e regulatórias
            </li>
          </ul>
        </section>

        <section className="card">
          <h2 className="text-xl font-semibold text-white mb-4">4. Finalidade do Tratamento</h2>
          <p>Utilizamos seus dados para:</p>
          <ul className="list-disc list-inside mt-3 space-y-1">
            <li>Processar e gerenciar pedidos</li>
            <li>Entrar em contato sobre produtos e entregas</li>
            <li>Enviar informações sobre novos produtos (com seu consentimento)</li>
            <li>Melhorar nosso site e serviços</li>
            <li>Cumprir obrigações legais</li>
            <li>Prevenir fraudes e garantir segurança</li>
          </ul>
        </section>

        <section className="card">
          <h2 className="text-xl font-semibold text-white mb-4">5. Compartilhamento de Dados</h2>
          <p>Seus dados podem ser compartilhados com:</p>
          <ul className="list-disc list-inside mt-3 space-y-1">
            <li>Transportadoras e serviços de entrega</li>
            <li>Processadores de pagamento</li>
            <li>Autoridades governamentais (quando exigido por lei)</li>
          </ul>
          <p className="mt-3 text-sm">
            <strong className="text-eliteGold">Não vendemos</strong> seus dados pessoais a terceiros 
            para fins de marketing.
          </p>
        </section>

        <section className="card">
          <h2 className="text-xl font-semibold text-white mb-4">6. Seus Direitos (LGPD - Art. 18)</h2>
          <p>Conforme a LGPD, você tem direito a:</p>
          <ul className="list-disc list-inside mt-3 space-y-2">
            <li>
              <strong className="text-eliteGold">Confirmação e acesso:</strong> Saber se tratamos 
              seus dados e acessá-los
            </li>
            <li>
              <strong className="text-eliteGold">Correção:</strong> Corrigir dados incompletos, 
              inexatos ou desatualizados
            </li>
            <li>
              <strong className="text-eliteGold">Anonimização ou eliminação:</strong> Solicitar 
              anonimização ou exclusão de dados desnecessários
            </li>
            <li>
              <strong className="text-eliteGold">Portabilidade:</strong> Transferir seus dados 
              para outro fornecedor
            </li>
            <li>
              <strong className="text-eliteGold">Eliminação:</strong> Excluir dados tratados 
              com seu consentimento
            </li>
            <li>
              <strong className="text-eliteGold">Informação:</strong> Saber com quem compartilhamos 
              seus dados
            </li>
            <li>
              <strong className="text-eliteGold">Revogação:</strong> Revogar o consentimento 
              a qualquer momento
            </li>
            <li>
              <strong className="text-eliteGold">Oposição:</strong> Opor-se ao tratamento em 
              determinadas situações
            </li>
          </ul>
          <div className="bg-green-500/10 border border-green-500/30 rounded-lg p-4 mt-4">
            <p className="text-green-300 text-sm">
              Para exercer seus direitos, entre em contato pelo WhatsApp ou e-mail informados 
              ao final desta política. Responderemos em até 15 dias úteis.
            </p>
          </div>
        </section>

        <section className="card">
          <h2 className="text-xl font-semibold text-white mb-4">7. Cookies</h2>
          <p>
            Utilizamos cookies para melhorar sua experiência de navegação. Cookies são 
            pequenos arquivos armazenados no seu dispositivo que nos ajudam a:
          </p>
          <ul className="list-disc list-inside mt-3 space-y-1">
            <li>Lembrar itens no seu carrinho</li>
            <li>Analisar o tráfego do site</li>
            <li>Personalizar conteúdo</li>
          </ul>
          <p className="mt-3">
            Você pode configurar seu navegador para recusar cookies, mas isso pode 
            afetar algumas funcionalidades do site.
          </p>
        </section>

        <section className="card">
          <h2 className="text-xl font-semibold text-white mb-4">8. Armazenamento e Segurança</h2>
          <ul className="list-disc list-inside space-y-1">
            <li>Dados do carrinho são armazenados localmente no seu navegador (localStorage)</li>
            <li>Dados de pedidos são armazenados em servidores seguros</li>
            <li>Utilizamos criptografia SSL/TLS para transmissão de dados</li>
            <li>Acesso aos dados é restrito a pessoas autorizadas</li>
          </ul>
        </section>

        <section className="card">
          <h2 className="text-xl font-semibold text-white mb-4">9. Retenção de Dados</h2>
          <p>Mantemos seus dados pelo tempo necessário para:</p>
          <ul className="list-disc list-inside mt-3 space-y-1">
            <li>Cumprir as finalidades descritas nesta política</li>
            <li>Atender obrigações legais (ex: 5 anos para dados fiscais)</li>
            <li>Exercer direitos em processos judiciais</li>
          </ul>
          <p className="mt-3">
            Após esse período, os dados serão eliminados ou anonimizados.
          </p>
        </section>

        <section className="card">
          <h2 className="text-xl font-semibold text-white mb-4">10. Menores de Idade</h2>
          <p>
            Nosso site não é direcionado a menores de 18 anos. Não coletamos intencionalmente 
            dados de menores. Se você é pai ou responsável e acredita que seu filho nos 
            forneceu dados pessoais, entre em contato conosco.
          </p>
        </section>

        <section className="card">
          <h2 className="text-xl font-semibold text-white mb-4">11. Alterações nesta Política</h2>
          <p>
            Podemos atualizar esta política periodicamente. Alterações significativas serão 
            comunicadas através do site. Recomendamos revisar esta página regularmente.
          </p>
        </section>

        <section className="card">
          <h2 className="text-xl font-semibold text-white mb-4">12. Contato e Encarregado (DPO)</h2>
          <p>
            Para questões sobre privacidade e proteção de dados, entre em contato:
          </p>
          <ul className="list-disc list-inside mt-3 space-y-1">
            <li><strong>WhatsApp:</strong> {CONFIG.whatsapp.formatted}</li>
            <li><strong>E-mail:</strong> {CONFIG.email.privacy}</li>
          </ul>
          <p className="mt-3 text-sm text-gray-400">
            Você também pode registrar reclamação junto à Autoridade Nacional de Proteção 
            de Dados (ANPD) através do site: <a href="https://www.gov.br/anpd" target="_blank" 
            rel="noopener noreferrer" className="text-eliteGold hover:underline">www.gov.br/anpd</a>
          </p>
        </section>

        <div className="flex gap-4 pt-6">
          <Link to="/termos" className="text-eliteGold hover:underline">
            Termos de Uso →
          </Link>
          <Link to="/" className="text-gray-400 hover:text-white">
            ← Voltar ao início
          </Link>
        </div>
      </div>
    </div>
  );
}
