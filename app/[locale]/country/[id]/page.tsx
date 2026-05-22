import { redirect } from '@/i18n/navigation';

export default async function CountryPage({
  params,
}: {
  params: Promise<{ locale: string; id: string }>;
}) {
  const { locale } = await params;
  redirect({ href: '/', locale });
}
