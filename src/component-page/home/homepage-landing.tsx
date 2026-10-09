import { useMemo } from 'react';
import { useRouter } from 'next/router';

import staticContent from '@/data/static-content.json';
import styles from '@/scss/home-page.module.scss';
import { getLocalizedProjects } from '@/utils/localizedProject';

import HomeBand from './home-band';
import HomeContact from './home-contact';
import HomeFaq from './home-faq';
import HomeFeatured, { featuredRows } from './home-featured';
import HomeHero from './home-hero';
import HomeIntro from './home-intro';
import HomeProcess from './home-process';
import HomeServices from './home-services';
import HomeTeam from './home-team';
import type { LocalizedProject, Project } from './types';

const heroProjectId = '67f90c4ff603a839446d4911'; // Amour Resort Ba Vi
const bandProjectId = '67f898307d268cfebb8c0af4'; // Au Co Villa (timber hall)

const HomepageLandingComponent = () => {
  const router = useRouter();

  const projects = useMemo(
    () =>
      getLocalizedProjects(
        staticContent.projects as Project[],
        router.locale
      ) as LocalizedProject[],
    [router.locale]
  );

  const find = (id: string) => projects.find((project) => project._id === id);
  const featured = featuredRows.flat().flatMap((slot) => find(slot.id) ?? []);
  const hero = find(heroProjectId) ?? projects[0];
  const band = find(bandProjectId) ?? projects[0];

  return (
    <div className={styles.landingPage}>
      <HomeHero project={hero} />
      <HomeIntro />
      <HomeFeatured projects={featured} />
      <HomeBand project={band} />
      <HomeProcess />
      <HomeServices />
      <HomeTeam />
      <HomeFaq />
      <HomeContact />
    </div>
  );
};

export default HomepageLandingComponent;
