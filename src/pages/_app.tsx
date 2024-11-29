import { useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import type { AppProps } from 'next/app';
import { QueryClientProvider } from '@tanstack/react-query';

//i18n
import '../i18n';

//components
import LayoutComponent from '@/components/layout';

//services
import queryClient from '@/services/query-client';

///scss
import '@/scss/globals.scss';

export default function App({ Component, pageProps }: AppProps) {
  const { i18n } = useTranslation();

  useEffect(() => {
    document.documentElement.lang = i18n.language;
  }, [i18n.language]);

  return (
    <QueryClientProvider client={queryClient}>
      <LayoutComponent>
        <Component {...pageProps} />
      </LayoutComponent>
    </QueryClientProvider>
  );
}
