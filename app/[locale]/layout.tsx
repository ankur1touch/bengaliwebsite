import { NextIntlClientProvider } from 'next-intl';
import { getMessages, getTranslations } from 'next-intl/server';
import { Bebas_Neue, Outfit, Hind_Siliguri } from 'next/font/google';
import StoreProvider from '@/store/StoreProvider';
import Header from '@/components/layout/Header';
import Footer from '@/components/layout/Footer';
import BreakingTicker from '@/components/layout/BreakingTicker';
import '../globals.css';

const bebasNeue = Bebas_Neue({
  weight: '400',
  variable: '--font-bebas',
  subsets: ['latin'],
  display: 'swap',
});

const outfit = Outfit({
  subsets: ['latin'],
  variable: '--font-outfit',
  display: 'swap',
});

const hindSiliguri = Hind_Siliguri({
  weight: ['400', '600'],
  subsets: ['bengali'],
  variable: '--font-hind',
  display: 'swap',
  preload: false,
});

export async function generateMetadata({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: 'brand' });
  const name = t('name');
  const desc = locale === 'bn'
    ? 'বাংলায় ফুটবলের সর্বশেষ খবর, লাইভ স্কোর ও বিশ্লেষণ'
    : 'Latest football news, live scores and analysis in Bengali & English';
  return {
    title:       { default: name, template: `%s | ${name}` },
    description: desc,
  };
}

export default async function LocaleLayout({
  children,
  params,
}: {
  children: React.ReactNode;
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  const messages = await getMessages();
  const fontClass =
    locale === 'bn'
      ? `${bebasNeue.variable} ${outfit.variable} ${hindSiliguri.variable}`
      : `${bebasNeue.variable} ${outfit.variable}`;
  const bodyFont = locale === 'bn' ? 'font-bengali' : 'font-sans';

  return (
    <html lang={locale} className={fontClass}>
      <body className={`bg-gray-50 text-gray-900 antialiased ${bodyFont}`}>
        <NextIntlClientProvider messages={messages}>
          <StoreProvider>
            <Header />
            <BreakingTicker />
            <main>{children}</main>
            <Footer />
          </StoreProvider>
        </NextIntlClientProvider>
      </body>
    </html>
  );
}
