import { NextIntlClientProvider } from 'next-intl';
import { getMessages, getTranslations } from 'next-intl/server';
import { Inter } from 'next/font/google';
import StoreProvider from '@/store/StoreProvider';
import Header from '@/components/layout/Header';
import Footer from '@/components/layout/Footer';
import BreakingTicker from '@/components/layout/BreakingTicker';
import '../globals.css';

const inter = Inter({
  subsets: ['latin'],
  variable: '--font-inter',
  display: 'swap',
  preload: true,
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
  return (
    <html lang={locale} className={inter.variable}>
      <body className="bg-gray-50 text-gray-900 antialiased">
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
