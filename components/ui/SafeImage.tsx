import Image from 'next/image';
import { isNextImageHost } from '@/lib/image-hosts';

interface SafeImageProps {
  src: string;
  alt: string;
  fill?: boolean;
  className?: string;
  sizes?: string;
  quality?: number;
  priority?: boolean;
  fetchPriority?: 'high' | 'low' | 'auto';
  loading?: 'lazy' | 'eager';
}

export default function SafeImage({
  src,
  alt,
  fill,
  className = '',
  sizes,
  quality,
  priority,
  fetchPriority,
  loading,
}: SafeImageProps) {
  if (!isNextImageHost(src)) {
    if (fill) {
      return (
        // eslint-disable-next-line @next/next/no-img-element
        <img
          src={src}
          alt={alt}
          className={`absolute inset-0 h-full w-full object-cover ${className}`}
          loading={loading ?? 'lazy'}
        />
      );
    }
    return (
      // eslint-disable-next-line @next/next/no-img-element
      <img src={src} alt={alt} className={className} loading={loading ?? 'lazy'} />
    );
  }

  return (
    <Image
      src={src}
      alt={alt}
      fill={fill}
      sizes={sizes}
      quality={quality}
      priority={priority}
      fetchPriority={fetchPriority}
      loading={loading}
      className={className}
    />
  );
}
