import { Link } from 'react-router-dom';

export function Footer() {
  return (
    <footer className="bg-eliteBlackSoft border-t border-eliteGold/20 mt-16">
      <div className="container mx-auto px-4 py-8">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <div>
            <h3 className="font-heading text-eliteGold text-lg mb-4">CAMISA DE ELITE</h3>
            <p className="text-gray-400 text-sm">
              Vista-se como campeão. As melhores camisas de futebol você encontra aqui.
            </p>
          </div>

          <div>
            <h4 className="font-subheading font-semibold mb-4">Links</h4>
            <ul className="space-y-2 text-sm text-gray-400">
              <li><Link to="/catalogo" className="hover:text-eliteGold">Catálogo</Link></li>
              <li><Link to="/sobre" className="hover:text-eliteGold">Sobre nós</Link></li>
              <li><Link to="/contato" className="hover:text-eliteGold">Contato</Link></li>
            </ul>
          </div>

          <div>
            <h4 className="font-subheading font-semibold mb-4">Contato</h4>
            <p className="text-sm text-gray-400">
              WhatsApp: (11) 99999-9999
            </p>
          </div>
        </div>

        <div className="border-t border-eliteGold/10 mt-8 pt-4 text-center text-xs text-gray-500">
          © {new Date().getFullYear()} Camisa de Elite. Todos os direitos reservados.
        </div>
      </div>
    </footer>
  );
}
