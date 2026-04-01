import React from 'react';
import Image from 'next/image';
import { useRouter } from 'next/router';
import { useTranslation } from 'react-i18next';

//images
import vietnamFlag from '@public/images/vietnam_flag.webp';
import ukFlag from '@public/images/kingdom_flag.webp';

//styles
import styles from '@/scss/button-language.module.scss';

const ButtonLanguageComponent = () => {
  const { i18n } = useTranslation();
  const router = useRouter();

  const changeLanguage = async (lng: string) => {
    await i18n.changeLanguage(lng);
    await router.push(router.asPath, router.asPath, { locale: lng });
  };

  const listLanguage = [
    {
      language: 'vi',
      label: 'VIE',
      flag: vietnamFlag.src,
      altFlag: 'vietnam flag',
    },
    {
      language: 'en',
      label: 'ENG',
      flag: ukFlag.src,
      altFlag: 'uk flag',
    },
  ];

  return (
    <div className={styles.wrapperButtonLanguage}>
      {listLanguage.map((item) => (
        <button
          type="button"
          aria-label="button-language"
          key={item.language}
          onClick={() => changeLanguage(item.language)}
          className={`${styles.containerContent} ${i18n.language === item.language ? styles.active : ''}`}
        >
          <Image
            src={item.flag}
            alt={item.altFlag}
            width={20}
            height={20}
            sizes="20px"
            quality={85}
          />
          <span>{item.label}</span>
        </button>
      ))}
    </div>
  );
};

export default ButtonLanguageComponent;
