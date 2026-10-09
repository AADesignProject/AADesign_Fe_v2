import { useEffect } from 'react';
import { useRouter } from 'next/router';

import { loadGsap } from '@/utils/gsap';

/**
 * Lenis smooth scroll driven by GSAP's ticker, so there is a single
 * requestAnimationFrame loop shared with ScrollTrigger. Lenis and GSAP load
 * after the page has rendered. Not created when the visitor prefers reduced
 * motion (re-evaluated live if the setting changes). Touch devices keep native
 * scrolling (Lenis default).
 */
const SmoothScrollComponent = () => {
  const router = useRouter();

  useEffect(() => {
    let cancelled = false;
    let cleanup = () => {};

    Promise.all([loadGsap(), import('lenis')]).then(
      ([{ gsap, ScrollTrigger }, { default: Lenis }]) => {
        if (cancelled) return;

        const reducedMotion = window.matchMedia(
          '(prefers-reduced-motion: reduce)'
        );
        let lenis: InstanceType<typeof Lenis> | null = null;

        const tick = (time: number) => lenis?.raf(time * 1000);

        const stop = () => {
          if (!lenis) return;
          gsap.ticker.remove(tick);
          gsap.ticker.lagSmoothing(500, 33);
          lenis.destroy();
          lenis = null;
        };

        const sync = () => {
          stop();
          if (reducedMotion.matches) return;

          lenis = new Lenis({ allowNestedScroll: true });
          lenis.on('scroll', ScrollTrigger.update);
          gsap.ticker.add(tick);
          gsap.ticker.lagSmoothing(0);
        };

        // Next.js has already scrolled to the top (or the #hash) by now. Lenis
        // ignores native scrolls while it is still gliding, so without this it
        // finishes its old animation and drags the new page back down.
        const onRouteChange = () => {
          lenis?.scrollTo(window.scrollY, { immediate: true, force: true });
          ScrollTrigger.refresh();
        };

        sync();
        reducedMotion.addEventListener('change', sync);
        router.events.on('routeChangeComplete', onRouteChange);

        cleanup = () => {
          reducedMotion.removeEventListener('change', sync);
          router.events.off('routeChangeComplete', onRouteChange);
          stop();
        };
      }
    );

    return () => {
      cancelled = true;
      cleanup();
    };
  }, [router.events]);

  return null;
};

export default SmoothScrollComponent;
