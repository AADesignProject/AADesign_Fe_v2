import React from 'react';
import Link from 'next/link';
import { useTranslation } from 'react-i18next';

//constants
import {
  email,
  phoneNumber,
  phoneNumberHref,
  zaloHref,
} from '@/constant/general';

//styles
import styles from '@/scss/footer.module.scss';

const FooterComponent = () => {
  const currentYear = new Date().getFullYear();
  const { t } = useTranslation();

  const footerLinks = [
    { href: '/profile', label: t('header.menu.introduction') },
    { href: '/construction', label: t('header.menu.construction') },
    { href: '/#services', label: t('header.menu.services') },
    { href: '/contact', label: t('header.menu.contact') },
  ];

  return (
    <footer className={styles.footer}>
      <div className={styles.inner}>
        <div className={styles.info}>
          <div className={styles.brand}>
            <Link href="/" className={styles.logo}>
              AA Design
            </Link>
            <p>{t('footer.description')}</p>
            <a
              href={zaloHref}
              target="_blank"
              rel="noopener noreferrer"
              className={styles.cta}
            >
              {t('footer.zalo')}
            </a>
          </div>

          <div className={styles.columns}>
            <nav
              className={styles.nav}
              aria-label={t('footer.navigationLabel')}
            >
              <h2>{t('footer.titleNavigation')}</h2>
              <ul>
                {footerLinks.map((item) => (
                  <li key={item.href}>
                    <Link href={item.href}>{item.label}</Link>
                  </li>
                ))}
              </ul>
            </nav>

            <address className={styles.contact}>
              <h2>{t('footer.titleContact')}</h2>
              <dl>
                <div>
                  <dt>{t('footer.phone')}</dt>
                  <dd className={styles.phone}>
                    <a href={`tel:${phoneNumberHref}`}>{phoneNumber}</a>
                  </dd>
                </div>
                <div>
                  <dt>{t('footer.email')}</dt>
                  <dd>
                    <a href={`mailto:${email}`}>{email}</a>
                  </dd>
                </div>
                <div>
                  <dt>{t('footer.office')}</dt>
                  <dd>{t('footer.location')}</dd>
                </div>
              </dl>
            </address>
          </div>
        </div>

        <div className={styles.map}>
          <iframe
            src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3722.7169064245427!2d105.80781677587349!3d21.083966085879066!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x3135aa9463936459%3A0x6e366b579f34c4fc!2zTOG6oWMgSOG7k25nIFdlc3RsYWtl!5e0!3m2!1svi!2sus!4v1730779456521!5m2!1svi!2sus"
            title={t('footer.mapTitle')}
            allowFullScreen
            loading="lazy"
            referrerPolicy="no-referrer-when-downgrade"
            sandbox="allow-scripts allow-same-origin allow-popups"
          ></iframe>
        </div>
      </div>

      <div className={styles.legal}>
        <p>{t('footer.copyright', { year: currentYear })}</p>
      </div>
    </footer>
  );
};

export default FooterComponent;
