import logo from '../../assets/logo-original.png';

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
      <img
        src={logo}
        alt="Logo Camisa de Elite"
        className={s.logo + ' object-contain'}
        style={{ maxHeight: '64px', maxWidth: '64px' }}
        draggable={false}
      />

      {showText && (
        <span className={`font-heading font-bold text-eliteGold ${s.text} tracking-wider`}>
          CAMISA DE ELITE
        </span>
      )}
    </div>
  );
}