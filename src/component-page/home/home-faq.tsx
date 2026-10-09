import { useTranslation } from 'react-i18next';

import styles from '@/scss/home-page.module.scss';

type Faq = { answer: string; question: string };

const HomeFaq = () => {
  const { t } = useTranslation();
  const faqs = t('home.landing.faq.items', { returnObjects: true }) as Faq[];

  return (
    <section id="faq" className={styles.faq}>
      <div className={styles.faqInner}>
        <h2 className={styles.faqTitle}>{t('home.landing.faq.title')}</h2>
        <div className={styles.faqList}>
          {faqs.map((faq) => (
            <details key={faq.question}>
              <summary>{faq.question}</summary>
              <p>{faq.answer}</p>
            </details>
          ))}
        </div>
      </div>
    </section>
  );
};

export default HomeFaq;
