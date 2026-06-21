import React, { memo, useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/router';
import { BsFillTelephoneFill } from 'react-icons/bs';
import { GoClock } from 'react-icons/go';
import { IoMenu, IoClose } from 'react-icons/io5';
import { motion, AnimatePresence } from 'framer-motion';
import { useTranslation } from 'react-i18next';

//components
import ButtonLanguageComponent from './button-language';

//scss
import styles from '@/scss/header.module.scss';
import { email, phoneNumber, phoneNumberHref } from '@/constant/general';

const HeaderComponent = () => {
  const { t } = useTranslation();
  const router = useRouter();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState<boolean>(false);

  const handleMobileMenuItemClick = () => {
    setIsMobileMenuOpen(false);
  };

  const toggleMobileMenu = () => {
    setIsMobileMenuOpen(!isMobileMenuOpen);
  };

  const listMenu = [
    {
      label: t('header.menu.introduction'),
      url: '/profile',
    },
    {
      label: t('header.menu.construction'),
      url: '/construction',
    },
    {
      label: t('header.menu.services'),
      url: '/#our-service',
    },
    {
      label: t('header.menu.contact'),
      url: '/contact',
    },
  ];
  const isActiveMenu = (url: string) => {
    const cleanUrl = url.split('#')[0];
    return cleanUrl !== '/' && router.pathname.startsWith(cleanUrl);
  };

  return (
    <motion.header
      initial={{ y: -100, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.5 }}
      className={styles.siteHeader}
    >
      <div className={styles.headerContainerTop}>
        <div className={styles.containerOption}>
          <div className={styles.wrapperInfo}>
            <Link
              href={`tel:${phoneNumberHref}`}
              className={styles.contentLink}
            >
              <BsFillTelephoneFill />
              <span>{phoneNumber}</span>
            </Link>
            <span className={styles.contentLink}>
              <GoClock size={18} />
              <span>{`24/7 ${t('header.emergency')}`}</span>
            </span>
          </div>

          <div className={styles.wrapperSocialAndLanguage}>
            <ButtonLanguageComponent />
          </div>
        </div>
      </div>
      <div className={styles.headerContainerBottom}>
        <div className={styles.containerContent}>
          <Link href="/" className={styles.logo}>{`AA Design`}</Link>
          <nav
            className={styles.menuOption}
            aria-label={t('aria.mainNavigation')}
          >
            {listMenu.map((menu, index) => (
              <Link
                key={index}
                href={menu.url}
                className={`${styles.menuLink} ${
                  isActiveMenu(menu.url) ? styles.active : ''
                }`}
              >
                {menu.label}
              </Link>
            ))}
          </nav>
          <div className={styles.menuMobile}>
            <button
              type="button"
              className={styles.menuIconButton}
              onClick={toggleMobileMenu}
              aria-label={
                isMobileMenuOpen ? t('aria.close') : t('aria.openMenu')
              }
              aria-expanded={isMobileMenuOpen}
              aria-controls="mobile-menu"
            >
              <IoMenu size={28} />
            </button>
          </div>
        </div>
      </div>
      <AnimatePresence>
        {isMobileMenuOpen && (
          <motion.div
            id="mobile-menu"
            className={styles.mobileMenu}
            role="dialog"
            aria-modal="true"
            aria-label={t('aria.mobileMenu')}
            initial={{ x: '100%' }}
            animate={{ x: 0 }}
            exit={{ x: '100%' }}
            transition={{ duration: 0.25 }}
          >
            <div className={styles.mobileMenuHeader}>
              <Link
                href="/"
                className={styles.mobileLogo}
                onClick={handleMobileMenuItemClick}
              >
                AA Design
              </Link>
              <button
                type="button"
                className={styles.menuIconButton}
                onClick={toggleMobileMenu}
                aria-label={t('aria.close')}
              >
                <IoClose size={35} />
              </button>
            </div>
            <nav className={styles.mobileMenuContent} aria-label="Mobile menu">
              {listMenu.map((menu, index) => (
                <Link
                  key={index}
                  href={menu.url}
                  className={styles.mobileMenuItem}
                  onClick={handleMobileMenuItemClick}
                >
                  {menu.label}
                </Link>
              ))}
            </nav>
            <div className={styles.mobileLanguage}>
              <ButtonLanguageComponent />
            </div>
            <div className={styles.mobileMenuFooter}>
              <div className={styles.contactInfo}>
                <Link href={`tel:${phoneNumberHref}`}>Call: {phoneNumber}</Link>
                <Link href={`mailto:${email}`}>Email: {email}</Link>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.header>
  );
};

export default memo(HeaderComponent);
