import React, { Fragment } from 'react';
import { useRouter } from 'next/router';
import { useTranslation } from 'react-i18next';

//styles
import styles from '@/scss/button-language.module.scss';

const languages = [
  { language: 'vi', label: 'VIE' },
  { language: 'en', label: 'ENG' },
];

const ButtonLanguageComponent = () => {
  const { i18n, t } = useTranslation();
  const router = useRouter();

  const changeLanguage = async (lng: string) => {
    await i18n.changeLanguage(lng);
    await router.push(router.asPath, router.asPath, { locale: lng });
  };

  return (
    <div className={styles.wrapperButtonLanguage}>
      {languages.map((item, index) => (
        <Fragment key={item.language}>
          {index > 0 && <span aria-hidden="true">/</span>}
          <button
            type="button"
            lang={item.language}
            aria-label={t('language.switchTo', { label: item.label })}
            aria-pressed={i18n.language === item.language}
            onClick={() => changeLanguage(item.language)}
            className={`${styles.button} ${
              i18n.language === item.language ? styles.active : ''
            }`}
          >
            {item.label}
          </button>
        </Fragment>
      ))}
    </div>
  );
};

export default ButtonLanguageComponent;
