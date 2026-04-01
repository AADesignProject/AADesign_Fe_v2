import { useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import type { AppProps } from 'next/app';
import { Analytics } from '@vercel/analytics/react';
import { SpeedInsights } from '@vercel/speed-insights/next';

//i18n
import '../i18n';

//components
import LayoutComponent from '@/components/layout';

///scss
import '@/scss/globals.scss';

export default function App({ Component, pageProps }: AppProps) {
  const { i18n } = useTranslation();

  useEffect(() => {
    document.documentElement.lang = i18n.language;
  }, [i18n.language]);

  return (
    <LayoutComponent>
      <Component {...pageProps} />
      <Analytics />
      <SpeedInsights />
    </LayoutComponent>
  );
}
