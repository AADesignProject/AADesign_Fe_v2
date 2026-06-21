import { useEffect } from 'react';
import type { AppProps } from 'next/app';
import { Analytics } from '@vercel/analytics/react';
import { SpeedInsights } from '@vercel/speed-insights/next';

//i18n
import i18n from '../i18n';

//components
import LayoutComponent from '@/components/layout';
import { useLoadingStore } from '@/services/zustand/loading';

///scss
import '@/scss/globals.scss';

export default function App({ Component, pageProps, router }: AppProps) {
  const currentLocale = router.locale ?? router.defaultLocale ?? 'vi';
  const setLoading = useLoadingStore((state) => state.setLoading);

  if (i18n.resolvedLanguage !== currentLocale) {
    void i18n.changeLanguage(currentLocale);
  }

  useEffect(() => {
    document.documentElement.lang = currentLocale;
  }, [currentLocale]);

  useEffect(() => {
    let loadingTimer: ReturnType<typeof setTimeout> | null = null;

    const clearLoadingTimer = () => {
      if (loadingTimer) {
        clearTimeout(loadingTimer);
        loadingTimer = null;
      }
    };

    const handleRouteChangeStart = (nextUrl: string) => {
      if (nextUrl === router.asPath) return;

      clearLoadingTimer();
      loadingTimer = setTimeout(() => {
        setLoading(true);
      }, 120);
    };

    const handleRouteChangeDone = () => {
      clearLoadingTimer();
      setLoading(false);
    };

    router.events.on('routeChangeStart', handleRouteChangeStart);
    router.events.on('routeChangeComplete', handleRouteChangeDone);
    router.events.on('routeChangeError', handleRouteChangeDone);

    return () => {
      clearLoadingTimer();
      router.events.off('routeChangeStart', handleRouteChangeStart);
      router.events.off('routeChangeComplete', handleRouteChangeDone);
      router.events.off('routeChangeError', handleRouteChangeDone);
      setLoading(false);
    };
  }, [router.asPath, router.events, setLoading]);

  useEffect(() => {
    const preventImageContextMenu = (event: MouseEvent) => {
      if (event.target instanceof HTMLImageElement) {
        event.preventDefault();
      }
    };

    document.addEventListener('contextmenu', preventImageContextMenu);

    return () => {
      document.removeEventListener('contextmenu', preventImageContextMenu);
    };
  }, []);

  return (
    <LayoutComponent>
      <Component {...pageProps} />
      <Analytics />
      <SpeedInsights />
    </LayoutComponent>
  );
}
