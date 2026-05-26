import { cn } from '@/lib/utils';

const variants: Record<string, string> = {
  green:      'bg-green-100 text-green-800',
  yellow:     'bg-yellow-100 text-yellow-800',
  red:        'bg-red-100 text-red-700',
  navy:       'bg-blue-900 text-white',
  live:       'bg-red-600 text-white animate-pulse',
  muted:      'bg-gray-100 text-gray-600',
  wc:         'bg-yellow-400/20 text-yellow-300 border border-yellow-400/40',
  tournament: 'bg-green-600/30 text-green-200 border border-green-400/30',
};

interface Props { label: string; variant?: keyof typeof variants; className?: string; }

export default function Badge({ label, variant = 'green', className }: Props) {
  return (
    <span className={cn(
      'inline-flex items-center text-[10px] sm:text-xs font-semibold uppercase tracking-widest px-2.5 py-1 rounded-full',
      variants[variant],
      className,
    )}>
      {label}
    </span>
  );
}
