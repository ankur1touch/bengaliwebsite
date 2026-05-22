interface Props {
  label:   string;
  variant?: 'green' | 'gray' | 'yellow';
  className?: string;
}

export default function Tag({ label, variant = 'gray', className = '' }: Props) {
  const colors = {
    green:  'bg-green-100 text-green-800',
    gray:   'bg-gray-100 text-gray-600',
    yellow: 'bg-yellow-100 text-yellow-800',
  };
  return (
    <span className={`inline-block px-2 py-0.5 rounded text-[10px] font-semibold uppercase tracking-wide ${colors[variant]} ${className}`}>
      {label}
    </span>
  );
}
