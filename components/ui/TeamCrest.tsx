import Image from 'next/image';

interface TeamCrestProps {
  src: string;
  size?: number;
  className?: string;
  priority?: boolean;
}

export default function TeamCrest({ src, size = 16, className = '', priority = false }: TeamCrestProps) {
  return (
    <Image
      src={src}
      alt=""
      width={size}
      height={size}
      className={`object-contain ${className}`}
      loading={priority ? undefined : 'lazy'}
      priority={priority}
    />
  );
}
