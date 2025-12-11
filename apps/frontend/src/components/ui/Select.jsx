export function Select({ label, options = [], className = '', ...props }) {
  return (
    <div className="space-y-1">
      {label && <label className="text-sm text-gray-300">{label}</label>}
      <select className={`input ${className}`} {...props}>
        {options.map(opt => (
          <option key={opt.value} value={opt.value}>{opt.label}</option>
        ))}
      </select>
    </div>
  );
}
