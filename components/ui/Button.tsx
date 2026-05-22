import { cn } from '@/lib/utils';

interface Props extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'outline' | 'ghost';
  size?:    'sm' | 'md';
}

export default function Button({
  variant = 'primary', size = 'md', className, children, ...props
}: Props) {
  const base = 'inline-flex items-center justify-center font-medium rounded-lg transition-colors disabled:opacity-50';
  const variants = {
    primary: 'bg-green-700 text-white hover:bg-green-800',
    outline: 'border border-green-700 text-green-700 hover:bg-green-50',
    ghost:   'text-green-700 hover:bg-green-50',
  };
  const sizes = { sm: 'px-3 py-1.5 text-xs', md: 'px-4 py-2 text-sm' };
  return (
    <button type="button" className={cn(base, variants[variant], sizes[size], className)} {...props}>
      {children}
    </button>
  );
}
