import { cn } from '@/lib/utils';

interface Props extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'outline' | 'ghost';
  size?:    'sm' | 'md' | 'lg';
}

export default function Button({
  variant = 'primary', size = 'md', className, children, ...props
}: Props) {
  const base = 'inline-flex items-center justify-center font-semibold uppercase tracking-wider rounded-full transition-all disabled:opacity-50';
  const variants = {
    primary: 'bg-green-700 text-white hover:bg-green-800 shadow-md hover:shadow-lg',
    outline: 'border-2 border-green-700 text-green-700 hover:bg-green-50',
    ghost:   'text-green-700 hover:bg-green-50',
  };
  const sizes = {
    sm: 'px-4 py-1.5 text-xs',
    md: 'px-5 py-2 text-sm',
    lg: 'px-6 py-3 text-sm',
  };
  return (
    <button type="button" className={cn(base, variants[variant], sizes[size], className)} {...props}>
      {children}
    </button>
  );
}
