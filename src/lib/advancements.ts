import { nekoSupernova } from './neko-supernova';
import { endStarfield } from './end-starfield';

export function initializeAdvancements(signal: AbortSignal) {
  document
    .querySelectorAll<HTMLElement>('[data-advancements]')
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
      const buttons =
        window.querySelectorAll<HTMLButtonElement>('[data-adv-select]');
      const panels = window.querySelectorAll<HTMLElement>('[data-adv-panel]');
      buttons.forEach((button) =>
        button.addEventListener(
          'click',
          () => {
            buttons.forEach((item) =>
              item.setAttribute('aria-pressed', String(item === button)),
            );
            panels.forEach((panel) => {
              panel.hidden = panel.id !== button.getAttribute('aria-controls');
            });
          },
          { signal },
        ),
      );
    });
}
