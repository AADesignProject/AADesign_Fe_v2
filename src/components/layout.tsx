import React from 'react';
import { Montserrat, Playfair_Display } from 'next/font/google';
import { useTranslation } from 'react-i18next';

//components
import HeaderComponent from './header';
import FooterComponent from './footer';
import FloatingContactComponent from './floating-contact';
import LoadingComponent from './loading';

//scss
import styles from '@/scss/layout.module.scss';
import { useLoadingStore } from '@/services/zustand/loading';

interface ILayoutProps {
  children: React.ReactNode;
}

const monterast = Montserrat({
  subsets: ['latin'],
  variable: '--font-body',
});

const playfair = Playfair_Display({
  subsets: ['latin', 'vietnamese'],
  variable: '--font-heading',
});

const LayoutComponent = ({ children }: ILayoutProps) => {
  const { loading } = useLoadingStore();
  const { t } = useTranslation();

  return (
    <div
      className={`${styles.container} ${monterast.variable} ${playfair.variable} ${monterast.className}`}
    >
      {loading && <LoadingComponent />}
      <a href="#main-content" className={styles.skipLink}>
        {t('aria.skipToContent')}
      </a>
      <HeaderComponent />
      <main id="main-content" className={styles.content}>
        {children}
      </main>
      <FooterComponent />
      <FloatingContactComponent />
    </div>
  );
};

export default LayoutComponent;
