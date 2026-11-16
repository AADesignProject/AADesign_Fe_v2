import Image from 'next/image';
import { useTranslation } from 'react-i18next';

import proof from '@/data/proof.json';
import styles from '@/scss/home-page.module.scss';
import trust from '@/scss/home-trust.module.scss';

type Portrait = { height: number; src: string; width: number };

// Filled in by the owner in src/data/proof.json; null renders nothing extra.
const portrait = proof.founderPortrait as Portrait | null;

const HomeTeam = () => {
  const { t } = useTranslation();

  return (
    <section id="team" className={styles.team}>
      <div
        className={
          portrait
            ? `${styles.teamInner} ${trust.teamHasPhoto}`
            : styles.teamInner
        }
      >
        <span className={styles.teamLabel}>
          {t('home.landing.founder.eyebrow')}
        </span>
        {portrait && (
          <figure>
            <Image
              src={portrait.src}
              alt={`${t('home.landing.founder.name')}, ${t('profile.hero.role')}`}
              width={portrait.width}
              height={portrait.height}
              sizes="(max-width: 1024px) 100vw, 33vw"
            />
          </figure>
        )}
        <div className={styles.teamBody}>
          <h2>{t('home.landing.founder.title')}</h2>
          <p>{t('home.landing.founder.description')}</p>
          <blockquote className={trust.quote}>
            {t('home.landing.founder.quote')}
            <footer>
              <cite>{t('home.landing.founder.name')}</cite>
            </footer>
          </blockquote>
        </div>
      </div>
    </section>
  );
};

export default HomeTeam;
