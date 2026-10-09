import React, { memo, useEffect, useRef, useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/router';
import { IoMenu, IoClose } from 'react-icons/io5';
import { useTranslation } from 'react-i18next';

//components
import ButtonLanguageComponent from './button-language';

//scss
import styles from '@/scss/header.module.scss';
import { email, phoneNumber, phoneNumberHref } from '@/constant/general';

// Pages that open on a full-bleed photo: the header floats transparent over it.
const heroPaths = ['/'];
// Header stays put near the top, then hides on scroll down / shows on scroll up.
const HIDE_AFTER = 120;
const SCROLL_STEP = 6;
const MOBILE_MAX = 1024;

const useScrollHeader = () => {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isHidden, setIsHidden] = useState(false);

  useEffect(() => {
    let lastY = window.scrollY;
    let frame = 0;

    const update = () => {
      frame = 0;
      const y = window.scrollY;
      setIsScrolled(y > 8);

      if (y < HIDE_AFTER) {
        setIsHidden(false);
        lastY = y;
        return;
      }

      const delta = y - lastY;
      if (Math.abs(delta) < SCROLL_STEP) return;
      setIsHidden(delta > 0);
      lastY = y;
    };

    const onScroll = () => {
      if (!frame) frame = requestAnimationFrame(update);
    };

    update();
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => {
      window.removeEventListener('scroll', onScroll);
      cancelAnimationFrame(frame);
    };
  }, []);

  return { isScrolled, isHidden, reveal: () => setIsHidden(false) };
};

const HeaderComponent = () => {
  const { t } = useTranslation();
  const router = useRouter();
  const [isMenuOpen, setIsMenuOpen] = useState<boolean>(false);
  const { isScrolled, isHidden, reveal } = useScrollHeader();
  const toggleRef = useRef<HTMLButtonElement>(null);
  const closeRef = useRef<HTMLButtonElement>(null);
  const menuRef = useRef<HTMLDivElement>(null);

  const isOverlay =
    heroPaths.includes(router.pathname) && !isScrolled && !isMenuOpen;

  const listMenu = [
    { label: t('header.menu.introduction'), url: '/profile' },
    { label: t('header.menu.construction'), url: '/construction' },
    { label: t('header.menu.services'), url: '/#services' },
    { label: t('header.menu.contact'), url: '/contact' },
  ];
  const isActiveMenu = (url: string) => {
    const cleanUrl = url.split('#')[0];
    return cleanUrl !== '/' && router.pathname.startsWith(cleanUrl);
  };

  // Close the menu and bring the header back whenever the page changes.
  useEffect(() => {
    const handleRouteChange = () => {
      setIsMenuOpen(false);
      reveal();
    };
    router.events.on('routeChangeComplete', handleRouteChange);
    return () => router.events.off('routeChangeComplete', handleRouteChange);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [router.events]);

  // Full-screen menu: lock page scroll, trap focus, close on Esc / desktop width.
  useEffect(() => {
    if (!isMenuOpen) return;

    const root = document.documentElement;
    const toggle = toggleRef.current;
    const previousOverflow = root.style.overflow;
    root.style.overflow = 'hidden';
    closeRef.current?.focus();

    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        setIsMenuOpen(false);
        return;
      }
      if (event.key !== 'Tab') return;

      const focusable = Array.from(
        menuRef.current?.querySelectorAll<HTMLElement>(
          'a[href], button:not([disabled])'
        ) ?? []
      );
      if (!focusable.length) return;

      const first = focusable[0];
      const last = focusable[focusable.length - 1];
      if (event.shiftKey && document.activeElement === first) {
        event.preventDefault();
        last.focus();
      } else if (!event.shiftKey && document.activeElement === last) {
        event.preventDefault();
        first.focus();
      }
    };
    const handleResize = () => {
      if (window.innerWidth > MOBILE_MAX) setIsMenuOpen(false);
    };

    document.addEventListener('keydown', handleKeyDown);
    window.addEventListener('resize', handleResize);
    return () => {
      document.removeEventListener('keydown', handleKeyDown);
      window.removeEventListener('resize', handleResize);
      root.style.overflow = previousOverflow;
      toggle?.focus();
    };
  }, [isMenuOpen]);

  return (
    <>
      <header
        className={`${styles.siteHeader} ${isOverlay ? styles.overlay : ''} ${
          isHidden && !isMenuOpen ? styles.hidden : ''
        }`}
      >
        <div className={styles.bar}>
          <Link href="/" className={styles.logo}>
            AA Design
          </Link>
          <nav className={styles.nav} aria-label={t('aria.mainNavigation')}>
            {listMenu.map((menu) => (
              <Link
                key={menu.url}
                href={menu.url}
                aria-current={isActiveMenu(menu.url) ? 'page' : undefined}
                className={`${styles.navLink} ${
                  isActiveMenu(menu.url) ? styles.active : ''
                }`}
              >
                {menu.label}
              </Link>
            ))}
          </nav>
          <div className={styles.tools}>
            <Link href={`tel:${phoneNumberHref}`} className={styles.phone}>
              {phoneNumber}
            </Link>
            <div className={styles.language}>
              <ButtonLanguageComponent />
            </div>
            <button
              ref={toggleRef}
              type="button"
              className={styles.menuButton}
              onClick={() => setIsMenuOpen(true)}
              aria-label={t('aria.openMenu')}
              aria-expanded={isMenuOpen}
              aria-controls="mobile-menu"
            >
              <IoMenu size={28} aria-hidden="true" />
            </button>
          </div>
        </div>
      </header>

      {/* Outside <header>: a transformed ancestor would break position: fixed. */}
      {isMenuOpen && (
        <div
          id="mobile-menu"
          ref={menuRef}
          className={styles.menu}
          role="dialog"
          aria-modal="true"
          aria-label={t('aria.mobileMenu')}
          data-lenis-prevent
        >
          <div className={styles.menuTop}>
            <Link
              href="/"
              className={styles.menuLogo}
              onClick={() => setIsMenuOpen(false)}
            >
              AA Design
            </Link>
            <button
              ref={closeRef}
              type="button"
              className={styles.menuClose}
              onClick={() => setIsMenuOpen(false)}
              aria-label={t('aria.close')}
            >
              <IoClose size={32} aria-hidden="true" />
            </button>
          </div>
          <nav className={styles.menuNav} aria-label={t('aria.mobileMenu')}>
            {listMenu.map((menu, index) => (
              <Link
                key={menu.url}
                href={menu.url}
                aria-current={isActiveMenu(menu.url) ? 'page' : undefined}
                className={`${styles.menuLink} ${
                  isActiveMenu(menu.url) ? styles.active : ''
                }`}
                style={{ ['--i' as string]: index }}
                onClick={() => setIsMenuOpen(false)}
              >
                {menu.label}
              </Link>
            ))}
          </nav>
          <div className={styles.menuFoot}>
            <ButtonLanguageComponent />
            <div className={styles.menuContact}>
              <Link href={`tel:${phoneNumberHref}`}>{phoneNumber}</Link>
              <Link href={`mailto:${email}`}>{email}</Link>
              <p>{`${t('header.hours')}: ${t('contact.time_active')}`}</p>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default memo(HeaderComponent);
