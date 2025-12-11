import { Link } from 'react-router-dom';
import { CONFIG, getWhatsAppLink } from '../../config';
import { Logo } from '../ui/Logo';

export function Footer() {
  return (
    <footer className="bg-eliteBlackSoft border-t border-eliteGold/20 mt-16">
      <div className="container mx-auto px-4 py-8">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          <div>
            <Link to="/" className="inline-block mb-4 logo-hover">
              <Logo size="sm" />
            </Link>
            <p className="text-gray-400 text-sm">
              Catálogo de camisas de futebol. {CONFIG.storeSlogan}!
            </p>
          </div>

          <div>
            <h4 className="font-semibold mb-4 text-white">Navegação</h4>
            <ul className="space-y-2 text-sm text-gray-400">
              <li><Link to="/" className="hover:text-eliteGold transition-colors">Início</Link></li>
              <li><Link to="/catalogo" className="hover:text-eliteGold transition-colors">Catálogo</Link></li>
              <li><Link to="/sobre" className="hover:text-eliteGold transition-colors">Sobre nós</Link></li>
            </ul>
          </div>

          <div>
            <h4 className="font-semibold mb-4 text-white">Legal</h4>
            <ul className="space-y-2 text-sm text-gray-400">
              <li><Link to="/termos" className="hover:text-eliteGold transition-colors">Termos de Uso</Link></li>
              <li><Link to="/privacidade" className="hover:text-eliteGold transition-colors">Política de Privacidade</Link></li>
              <li><span className="text-gray-500">Licença MIT</span></li>
            </ul>
          </div>

          <div>
            <h4 className="font-semibold mb-4 text-white">Contato</h4>
            <a 
              href={getWhatsAppLink()} 
              target="_blank" 
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 text-green-400 hover:text-green-300 transition-colors text-sm"
            >
              <svg className="w-4 h-4" viewBox="0 0 24 24" fill="currentColor">
                <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/>
              </svg>
              {CONFIG.whatsapp.formatted}
            </a>
            <p className="text-gray-500 text-xs mt-3">
              Atendimento: {CONFIG.businessHours}
            </p>
          </div>
        </div>

        <div className="border-t border-eliteGold/10 mt-8 pt-6 flex flex-col md:flex-row justify-between items-center gap-4">
          <p className="text-xs text-gray-500">
            © {new Date().getFullYear()} {CONFIG.storeName}. Todos os direitos reservados.
          </p>
          <div className="flex gap-4 text-xs text-gray-500">
            <Link to="/termos" className="hover:text-gray-400">Termos</Link>
            <span>•</span>
            <Link to="/privacidade" className="hover:text-gray-400">Privacidade</Link>
            <span>•</span>
            <span>LGPD Compliant</span>
          </div>
        </div>
      </div>
    </footer>
  );
}
