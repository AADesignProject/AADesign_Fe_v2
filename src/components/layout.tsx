import React from 'react';

//components
import HeaderComponent from './header';

//scss
import styles from '@/scss/layout.module.scss';
import FooterComponent from './footer';
import { Montserrat, Playfair_Display } from 'next/font/google';
import LoadingComponent from './loading';
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
  return loading ? (
    <LoadingComponent />
  ) : (
    <div
      className={`${styles.container} ${monterast.variable} ${playfair.variable} ${monterast.className}`}
    >
      <a href="#main-content" className={styles.skipLink}>
        Bỏ qua đến nội dung chính
      </a>
      <HeaderComponent />
      <main id="main-content" className={styles.content}>
        {children}
      </main>
      <FooterComponent />
    </div>
  );
};

export default LayoutComponent;
