import { Link } from 'react-router-dom';
import { Logo } from '../components/ui/Logo';
import { Button } from '../components/ui/Button';

export default function NotFoundPage() {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-eliteBlack text-white px-4">
      <div className="mb-8 animate-fade-in-down">
        <Logo size="xl" />
      </div>
      <h1 className="text-6xl font-bold text-eliteGold mb-2 animate-fade-in">404</h1>
      <h2 className="text-2xl font-heading mb-4 animate-fade-in-up">Página não encontrada</h2>
      <p className="text-lg text-gray-300 mb-8 animate-fade-in-up animation-delay-200">
        O link acessado não existe ou foi removido.
      </p>
      <Link to="/">
        <Button className="animate-glow-pulse">Voltar para a página inicial</Button>
      </Link>
    </div>
  );
}
