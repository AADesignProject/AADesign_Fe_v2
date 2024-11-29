import React from 'react';

//components
import HeaderComponent from './header';

//scss
import styles from '@/scss/layout.module.scss';
import FooterComponent from './footer';
import { Montserrat } from 'next/font/google';
import LoadingComponent from './loading';
import { useLoadingStore } from '@/services/zustand/loading';

interface ILayoutProps {
  children: React.ReactNode;
}

const monterast = Montserrat({
  subsets: ['latin'],
});

const LayoutComponent = ({ children }: ILayoutProps) => {
  const { loading } = useLoadingStore();
  return loading ? (
    <LoadingComponent />
  ) : (
    <div className={`${styles.container} ${monterast.className}`}>
      <HeaderComponent />
      <main className={styles.content}>{children}</main>
      <FooterComponent />
    </div>
  );
};

export default LayoutComponent;
