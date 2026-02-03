import React, { memo, useState, useEffect } from 'react';
import Link from 'next/link';
import { BsFillTelephoneFill } from 'react-icons/bs';
import { GoClock } from 'react-icons/go';
import { RiArrowDropDownLine } from 'react-icons/ri';
import { IoMenu, IoClose } from 'react-icons/io5';
import { motion, AnimatePresence } from 'framer-motion';
import { useTranslation } from 'react-i18next';
import { useRouter } from 'next/router';

//components
import ButtonLanguageComponent from './button-language';

//scss
import styles from '@/scss/header.module.scss';
import { email, phoneNumber } from '@/constant/general';

const HeaderComponent = () => {
  const { t } = useTranslation();

  const [openMenu, setOpenMenu] = useState<string | null>(null);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState<boolean>(false);

  const handleMenuClick = (label: string) => {
    if (openMenu === label) {
      setOpenMenu(null);
    } else {
      setOpenMenu(label);
    }
  };

  const handleMobileMenuItemClick = (url: string) => {
    setIsMobileMenuOpen(false);
    setOpenMenu(null);
  };

  const toggleMobileMenu = () => {
    setIsMobileMenuOpen(!isMobileMenuOpen);
  };

  const listMenu = [
    {
      label: t('header.menu.introduction'),
      url: '/profile',
      children: [
        {
          label: t('header.menu.my_name'),
          url: '/profile',
          icon: '',
        },
      ],
    },
    {
      label: t('header.menu.construction'),
      url: '/construction',
    },
    {
      label: t('header.menu.services'),
      url: '#services',
    },
    {
      label: t('header.menu.contact'),
      url: '/contact',
    },
  ];

  return (
    <motion.div
      initial={{ y: -100, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.5 }}
    >
      <div className={styles.headerContainerTop}>
        <div className={`${styles.containerOption}`}>
          <div className={styles.wrapperInfo}>
            <Link href={`tel: ${phoneNumber}`} className={styles.contentLink}>
              <BsFillTelephoneFill />
              <span>{phoneNumber}</span>
            </Link>
            <Link href={'#'} className={styles.contentLink}>
              <GoClock size={18} />
              <span>{`24/7 ${t('header.emergency')}`}</span>
            </Link>
          </div>

          <div className={styles.wrapperSocialAndLanguage}>
            <ButtonLanguageComponent />
          </div>
        </div>
      </div>
      <div className={styles.headerContainerBottom}>
        <div className={styles.containerContent}>
          <Link href={'/'} className={styles.logo}>{`AA Design`}</Link>
          <div className={styles.menuOption}>
            {listMenu.map((menu, index) => (
              <div key={index} className={styles.menuItem}>
                <div
                  onClick={() => handleMenuClick(menu.label)}
                  className={styles.menuLabel}
                >
                  <Link href={menu.url}>{menu.label}</Link>
                  {menu.children && <RiArrowDropDownLine size={28} />}
                </div>
                <AnimatePresence>
                  {menu.children && openMenu === menu.label && (
                    <motion.div
                      initial={{ opacity: 0, y: -10 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -10 }}
                      transition={{ duration: 0.3 }}
                      className={styles.subMenu}
                    >
                      {menu.children.map((child, childIndex) => (
                        <Link
                          key={childIndex}
                          href={child.url}
                          className={styles.subMenuItem}
                        >
                          {child.label}
                        </Link>
                      ))}
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            ))}
          </div>
          <div className={styles.menuMobile}>
            <button
              type="button"
              className={styles.menuIconButton}
              onClick={toggleMobileMenu}
              aria-label="Mở menu"
            >
              <IoMenu size={28} />
            </button>
          </div>
        </div>
      </div>
      {
        <div
          className={`${styles.mobileMenu} ${isMobileMenuOpen && styles.open}`}
        >
          <div className={styles.mobileMenuHeader}>
            <div className={styles.mobileLogo}>{`AA'Design`}</div>
            <button
              type="button"
              className={styles.menuIconButton}
              onClick={toggleMobileMenu}
              aria-label="Đóng menu"
            >
              <IoClose size={35} />
            </button>
          </div>
          <div className={styles.mobileMenuContent}>
            {listMenu.map((menu, index) => (
              <div key={index} className={styles.mobileMenuItem}>
                <div className={styles.mobileMenuLabel}>
                  <Link
                    href={menu.url}
                    onClick={() => handleMobileMenuItemClick(menu.url)}
                  >
                    {menu.label}
                  </Link>
                  {menu.children && <RiArrowDropDownLine size={28} />}
                </div>
                {menu.children && openMenu === menu.label && (
                  <div className={styles.mobileSubMenu}>
                    {menu.children.map((child, childIndex) => (
                      <Link
                        key={childIndex}
                        href={child.url}
                        className={styles.mobileSubMenuItem}
                        onClick={() => handleMobileMenuItemClick(child.url)}
                      >
                        {child.label}
                      </Link>
                    ))}
                  </div>
                )}
              </div>
            ))}
          </div>
          <div className={styles.mobileMenuFooter}>
            <div className={styles.contactInfo}>
              <p>Call: {phoneNumber}</p>
              <p>Email: {email}</p>
            </div>
          </div>
        </div>
      }
    </motion.div>
  );
};

export default memo(HeaderComponent);
