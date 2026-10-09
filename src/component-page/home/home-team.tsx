import { useTranslation } from 'react-i18next';

import styles from '@/scss/home-page.module.scss';

const HomeTeam = () => {
  const { t } = useTranslation();

  return (
    <section id="team" className={styles.team}>
      <div className={styles.teamInner}>
        <span className={styles.teamLabel}>
          {t('home.landing.founder.eyebrow')}
        </span>
        <div className={styles.teamBody}>
          <h2>{t('home.landing.founder.title')}</h2>
          <p>{t('home.landing.founder.description')}</p>
          {/* TODO(owner): add a founder/team portrait (high-resolution, with
              the person's consent) next to this text. No stock photo. */}
          <blockquote>{t('home.landing.founder.quote')}</blockquote>
        </div>
      </div>
    </section>
  );
};

export default HomeTeam;
