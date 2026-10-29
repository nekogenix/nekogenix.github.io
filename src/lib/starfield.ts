import { nekoSupernova } from './neko-supernova';
import { endStarfield } from './end-starfield';
export function initializeStarfields(signal: AbortSignal) {
  document
    .querySelectorAll<HTMLElement>('[data-starfield]')
    .forEach((window) => {
      nekoSupernova(window, signal);
      endStarfield(window, signal);
      let visible = false;
      const updateStars = () => {
        window.toggleAttribute(
          'data-stars-active',
          visible && !document.hidden,
        );
      };
      const observer = new IntersectionObserver(([entry]) => {
        visible = entry!.isIntersecting;
        updateStars();
      });
      observer.observe(window);
      document.addEventListener('visibilitychange', updateStars, { signal });
      signal.addEventListener('abort', () => observer.disconnect(), {
        once: true,
      });
    });
}
