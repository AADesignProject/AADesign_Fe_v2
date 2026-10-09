import { RefObject, useEffect, useState } from 'react';
import type { gsap as Gsap } from 'gsap';
import type { ScrollTrigger as ScrollTriggerPlugin } from 'gsap/ScrollTrigger';

export type GsapLib = {
  gsap: typeof Gsap;
  ScrollTrigger: typeof ScrollTriggerPlugin;
};

let loading: Promise<GsapLib> | null = null;

/**
 * GSAP is loaded on demand, after the page has rendered, so it stays out of the
 * first-load bundle (the hero image and text should not wait for it).
 */
export const loadGsap = (): Promise<GsapLib> => {
  loading ??= Promise.all([import('gsap'), import('gsap/ScrollTrigger')]).then(
    ([{ gsap }, { ScrollTrigger }]) => {
      gsap.registerPlugin(ScrollTrigger);
      // Avoid refresh jank when the mobile address bar shows/hides.
      ScrollTrigger.config({ ignoreMobileResize: true });
      return { gsap, ScrollTrigger };
    }
  );
  return loading;
};

type MotionConditions = { mobile: boolean } & GsapLib;

/**
 * Runs `setup` once after mount, scoped to `scope`, once GSAP has loaded.
 * Everything created inside (tweens, ScrollTriggers) is killed on unmount (and
 * `setup`'s returned cleanup is called, e.g. to restore text or attributes),
 * and `setup` is skipped when the visitor prefers reduced motion, so content
 * stays static. `mobile` lets the caller soften parallax on small screens.
 * Only animate transform/opacity.
 */
export const useScrollAnimation = (
  scope: RefObject<HTMLElement>,
  setup: (conditions: MotionConditions) => void | (() => void)
) => {
  useEffect(() => {
    let cancelled = false;
    let revert = () => {};

    loadGsap().then((lib) => {
      if (cancelled) return;

      const mm = lib.gsap.matchMedia(scope.current ?? undefined);
      revert = () => mm.revert();

      mm.add(
        {
          motion: '(prefers-reduced-motion: no-preference)',
          mobile: '(max-width: 767px)',
        },
        (context) => {
          const { motion, mobile } = context.conditions as {
            motion: boolean;
            mobile: boolean;
          };
          // Optional cleanup returned by setup runs when the media query flips.
          if (motion) return setup({ mobile, ...lib });
        }
      );
    });

    return () => {
      cancelled = true;
      revert();
    };
    // setup is intentionally read once: animations are created on mount only.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);
};

/**
 * Every `[data-reveal]` inside `scope` rises into place once as it scrolls into
 * view. List items are staggered by their position so a list reads in order.
 * Content is visible by default, so it stays readable without JS or motion.
 */
export const useReveal = (scope: RefObject<HTMLElement>) => {
  useScrollAnimation(scope, ({ gsap, mobile }) => {
    scope.current
      ?.querySelectorAll<HTMLElement>('[data-reveal]')
      .forEach((node) => {
        const index = Array.from(node.parentElement?.children ?? []).indexOf(
          node
        );
        gsap.from(node, {
          y: mobile ? 20 : 40,
          opacity: 0,
          duration: 0.9,
          delay: node.tagName === 'LI' ? index * 0.08 : 0,
          ease: 'power3.out',
          scrollTrigger: { trigger: node, start: 'top 88%', once: true },
        });
      });
  });
};

// "100+" -> 100 and "+": the number counts up, the suffix stays put.
export const parseStat = (value: string) => {
  const match = value.match(/^(\d+)(.*)$/);
  return { number: Number(match?.[1] ?? 0), suffix: match?.[2] ?? '' };
};

/**
 * Counts every `[data-count]` inside `scope` up from 0 once it scrolls into
 * view (`data-suffix` is appended as-is). Without motion the numbers simply
 * stay at their final value.
 */
export const useCountUp = (scope: RefObject<HTMLElement>) => {
  useScrollAnimation(scope, ({ gsap }) => {
    const nodes = Array.from(
      scope.current?.querySelectorAll<HTMLElement>('[data-count]') ?? []
    );
    const finals = nodes.map((node) => node.textContent ?? '');

    nodes.forEach((node) => {
      const suffix = node.dataset.suffix ?? '';
      const counter = { value: 0 };
      node.textContent = `0${suffix}`;

      gsap.to(counter, {
        value: Number(node.dataset.count),
        duration: 1.8,
        ease: 'power2.out',
        scrollTrigger: { trigger: node, start: 'top 88%', once: true },
        onUpdate: () => {
          node.textContent = `${Math.round(counter.value)}${suffix}`;
        },
      });
    });

    return () => {
      nodes.forEach((node, index) => {
        node.textContent = finals[index];
      });
    };
  });
};

/** True once the window `load` event has fired (immediately on client navigations). */
export const useAfterLoad = () => {
  const [ready, setReady] = useState(false);

  useEffect(() => {
    if (document.readyState === 'complete') {
      setReady(true);
      return;
    }
    const onLoad = () => setReady(true);
    window.addEventListener('load', onLoad, { once: true });
    return () => window.removeEventListener('load', onLoad);
  }, []);

  return ready;
};
