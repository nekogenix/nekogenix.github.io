export function initializeAdvancements(signal: AbortSignal) {
  document
    .querySelectorAll<HTMLElement>('[data-advancements]')
    .forEach((window) => {
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
