import { useEffect } from 'react';
import type { AppProps } from 'next/app';
import { Analytics } from '@vercel/analytics/react';
import { SpeedInsights } from '@vercel/speed-insights/next';

//i18n
import i18n from '../i18n';

//components
import LayoutComponent from '@/components/layout';

///scss
import '@/scss/globals.scss';

export default function App({ Component, pageProps, router }: AppProps) {
  const currentLocale = router.locale ?? router.defaultLocale ?? 'vi';

  if (i18n.resolvedLanguage !== currentLocale) {
    void i18n.changeLanguage(currentLocale);
  }

  useEffect(() => {
    document.documentElement.lang = currentLocale;
  }, [currentLocale]);

  return (
    <LayoutComponent>
      <Component {...pageProps} />
      <Analytics />
      <SpeedInsights />
    </LayoutComponent>
  );
}
