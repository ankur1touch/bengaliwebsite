export function formatRelative(dateStr: string, locale = 'bn'): string {
  const diff = Date.now() - new Date(dateStr).getTime();
  const minutes = Math.floor(diff / 60000);

  if (locale === 'en') {
    if (minutes < 1)  return 'just now';
    if (minutes < 60) return `${minutes} min ago`;
    const hours = Math.floor(minutes / 60);
    if (hours < 24)   return `${hours} hr ago`;
    const days = Math.floor(hours / 24);
    return `${days} day${days === 1 ? '' : 's'} ago`;
  }

  if (minutes < 1)  return 'এইমাত্র';
  if (minutes < 60) return `${minutes} মিনিট আগে`;
  const hours = Math.floor(minutes / 60);
  if (hours < 24)   return `${hours} ঘণ্টা আগে`;
  const days = Math.floor(hours / 24);
  return `${days} দিন আগে`;
}

export function formatDate(dateStr: string, locale = 'bn'): string {
  const loc = locale === 'en' ? 'en-GB' : 'bn-BD';
  return new Date(dateStr).toLocaleDateString(loc, {
    year: 'numeric', month: 'long', day: 'numeric',
  });
}
