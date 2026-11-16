import { useTranslation } from 'react-i18next';

import glance from '@/data/faq-glance.json';
import styles from '@/scss/home-page.module.scss';
import trust from '@/scss/home-trust.module.scss';

type Faq = { answer: string; question: string };
type Glance = Record<
  'build' | 'design' | 'warranty',
  Partial<Record<string, string>> | null
>;

// Owner-supplied values live in src/data/faq-glance.json ({ vi, en } each).
const GLANCE_KEYS = ['design', 'build', 'warranty'] as const;

const HomeFaq = () => {
  const { i18n, t } = useTranslation();
  const faqs = t('home.landing.faq.items', { returnObjects: true }) as Faq[];
  const glanceItems = GLANCE_KEYS.flatMap((key) => {
    const value = (glance as Glance)[key]?.[i18n.language]?.trim();
    return value ? [{ key, value }] : [];
  });

  return (
    <section id="faq" className={styles.faq}>
      <div className={styles.faqInner}>
        <h2 className={styles.faqTitle}>{t('home.landing.faq.title')}</h2>
        <div className={styles.faqList}>
          {glanceItems.length > 0 && (
            <dl className={trust.glance}>
              {glanceItems.map(({ key, value }) => (
                <div key={key}>
                  <dt>{t(`home.landing.faq.glance.${key}`)}</dt>
                  <dd>{value}</dd>
                </div>
              ))}
            </dl>
          )}
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
