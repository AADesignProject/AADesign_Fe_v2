import React from 'react';
import Image from 'next/image';
import { useTranslation } from 'react-i18next';

//images
import vietnamFlag from '@public/images/vietnam_flag.webp';
import ukFlag from '@public/images/kingdom_flag.webp';

//styles
import styles from '@/scss/button-language.module.scss';
import { STORAGE_KEY } from '@/constant/storage-key';

const ButtonLanguageComponent = () => {
  const { i18n } = useTranslation();

  const changeLanguage = (lng: string) => {
    localStorage.setItem(STORAGE_KEY.language, lng);
    i18n.changeLanguage(lng);
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

  // useLayoutEffect(() => {
  //   const language = localStorage.getItem(STORAGE_KEY.language);
  //   if (language) {
  //     i18n.changeLanguage(language);
  //   }
  // }, [])

  return (
    <div className={styles.wrapperButtonLanguage}>
      {listLanguage?.map((item, index) => (
        <button
          aria-label="button-language"
          key={index}
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
