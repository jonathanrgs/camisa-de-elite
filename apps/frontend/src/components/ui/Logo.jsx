export function Logo({ className = '', size = 'md', showText = true }) {
  const sizes = {
    sm: { logo: 'w-8 h-10', text: 'text-sm' },
    md: { logo: 'w-10 h-12', text: 'text-lg' },
    lg: { logo: 'w-16 h-20', text: 'text-2xl' },
    xl: { logo: 'w-24 h-28', text: 'text-3xl' },
  };

  const s = sizes[size] || sizes.md;

  return (
    <div className={`flex items-center gap-2 ${className}`}>
      {/* Logo SVG - Escudo com coroa */}
      <svg 
        className={`${s.logo} text-eliteGold`} 
        viewBox="0 0 100 130" 
        fill="none"
      >
        {/* Coroa */}
        <g className="crown">
          {/* Base da coroa */}
          <path 
            d="M25 32 L75 32 L75 28 L25 28 Z" 
            fill="currentColor" 
            fillOpacity="0.9"
          />
          {/* Corpo da coroa */}
          <path 
            d="M28 28 L28 12 L35 20 L42 8 L50 18 L58 8 L65 20 L72 12 L72 28 Z" 
            fill="currentColor"
          />
          {/* Cruz no topo */}
          <path 
            d="M48 8 L52 8 L52 2 L48 2 Z M46 6 L54 6 L54 4 L46 4 Z" 
            fill="currentColor"
          />
          {/* Pérolas/Pontos decorativos */}
          <circle cx="28" cy="12" r="2" fill="currentColor" />
          <circle cx="35" cy="20" r="1.5" fill="currentColor" fillOpacity="0.7" />
          <circle cx="42" cy="8" r="2" fill="currentColor" />
          <circle cx="50" cy="18" r="1.5" fill="currentColor" fillOpacity="0.7" />
          <circle cx="58" cy="8" r="2" fill="currentColor" />
          <circle cx="65" cy="20" r="1.5" fill="currentColor" fillOpacity="0.7" />
          <circle cx="72" cy="12" r="2" fill="currentColor" />
          {/* Detalhes da coroa */}
          <circle cx="33" cy="25" r="2.5" fill="currentColor" fillOpacity="0.5" />
          <circle cx="50" cy="25" r="2.5" fill="currentColor" fillOpacity="0.5" />
          <circle cx="67" cy="25" r="2.5" fill="currentColor" fillOpacity="0.5" />
        </g>

        {/* Escudo */}
        <path 
          d="M15 40 L15 85 Q15 110 50 125 Q85 110 85 85 L85 40 Z" 
          stroke="currentColor" 
          strokeWidth="3" 
          fill="none"
          className="animate-draw"
        />

        {/* Bola de futebol central */}
        <g className="ball" transform="translate(50, 75)">
          <circle r="18" stroke="currentColor" strokeWidth="2" fill="none" />
          {/* Pentágonos da bola */}
          <path 
            d="M0 -10 L6 -4 L4 4 L-4 4 L-6 -4 Z" 
            fill="currentColor" 
            fillOpacity="0.6"
          />
          <path 
            d="M-12 5 L-8 -2 L-2 2 L-4 10 L-10 10 Z" 
            fill="currentColor" 
            fillOpacity="0.4"
          />
          <path 
            d="M12 5 L8 -2 L2 2 L4 10 L10 10 Z" 
            fill="currentColor" 
            fillOpacity="0.4"
          />
          {/* Linhas da bola */}
          <line x1="0" y1="-10" x2="6" y2="-4" stroke="currentColor" strokeWidth="1" />
          <line x1="6" y1="-4" x2="4" y2="4" stroke="currentColor" strokeWidth="1" />
          <line x1="4" y1="4" x2="-4" y2="4" stroke="currentColor" strokeWidth="1" />
          <line x1="-4" y1="4" x2="-6" y2="-4" stroke="currentColor" strokeWidth="1" />
          <line x1="-6" y1="-4" x2="0" y2="-10" stroke="currentColor" strokeWidth="1" />
          {/* Linhas externas */}
          <line x1="0" y1="-10" x2="0" y2="-18" stroke="currentColor" strokeWidth="1" />
          <line x1="6" y1="-4" x2="15" y2="-8" stroke="currentColor" strokeWidth="1" />
          <line x1="4" y1="4" x2="12" y2="12" stroke="currentColor" strokeWidth="1" />
          <line x1="-4" y1="4" x2="-12" y2="12" stroke="currentColor" strokeWidth="1" />
          <line x1="-6" y1="-4" x2="-15" y2="-8" stroke="currentColor" strokeWidth="1" />
        </g>

        {/* Louros/Folhas */}
        <g className="laurels" stroke="currentColor" fill="currentColor" fillOpacity="0.6">
          {/* Lado esquerdo */}
          <path d="M28 60 Q20 65 25 75" fill="none" strokeWidth="1.5" />
          <ellipse cx="22" cy="62" rx="4" ry="2" transform="rotate(-30 22 62)" />
          <ellipse cx="20" cy="70" rx="4" ry="2" transform="rotate(-20 20 70)" />
          <ellipse cx="21" cy="78" rx="4" ry="2" transform="rotate(-10 21 78)" />
          <ellipse cx="24" cy="86" rx="4" ry="2" transform="rotate(0 24 86)" />
          <ellipse cx="28" cy="93" rx="4" ry="2" transform="rotate(10 28 93)" />
          <ellipse cx="34" cy="99" rx="4" ry="2" transform="rotate(25 34 99)" />
          
          {/* Lado direito */}
          <path d="M72 60 Q80 65 75 75" fill="none" strokeWidth="1.5" />
          <ellipse cx="78" cy="62" rx="4" ry="2" transform="rotate(30 78 62)" />
          <ellipse cx="80" cy="70" rx="4" ry="2" transform="rotate(20 80 70)" />
          <ellipse cx="79" cy="78" rx="4" ry="2" transform="rotate(10 79 78)" />
          <ellipse cx="76" cy="86" rx="4" ry="2" transform="rotate(0 76 86)" />
          <ellipse cx="72" cy="93" rx="4" ry="2" transform="rotate(-10 72 93)" />
          <ellipse cx="66" cy="99" rx="4" ry="2" transform="rotate(-25 66 99)" />
          
          {/* Laço inferior */}
          <path d="M42 105 Q50 112 58 105" fill="none" strokeWidth="1.5" />
          <line x1="48" y1="108" x2="45" y2="115" strokeWidth="1.5" />
          <line x1="52" y1="108" x2="55" y2="115" strokeWidth="1.5" />
        </g>
      </svg>

      {showText && (
        <span className={`font-heading font-bold text-eliteGold ${s.text} tracking-wider`}>
          CAMISA DE ELITE
        </span>
      )}
    </div>
  );
}
