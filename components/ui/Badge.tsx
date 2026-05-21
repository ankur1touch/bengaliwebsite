import { cn } from '@/lib/utils';

const variants: Record<string, string> = {
  green:   'bg-green-100 text-green-800',
  yellow:  'bg-yellow-100 text-yellow-800',
  red:     'bg-red-100 text-red-700',
  navy:    'bg-blue-900 text-white',
  live:    'bg-red-600 text-white animate-pulse',
  muted:   'bg-gray-100 text-gray-600',
};

interface Props { label: string; variant?: keyof typeof variants; className?: string; }
export default function Badge({ label, variant = 'green', className }: Props) {
  return (
    <span className={cn('text-xs font-medium px-2 py-0.5 rounded', variants[variant], className)}>
      {label}
    </span>
  );
}
