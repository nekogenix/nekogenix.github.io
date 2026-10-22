type WikiTheme = 'light' | 'dark';

let theme: WikiTheme =
  document.documentElement.dataset.wikiTheme === 'dark' ? 'dark' : 'light';

document.addEventListener('astro:before-swap', (event) => {
  event.newDocument.documentElement.dataset.wikiTheme = theme;
});

export function initializeWikiTheme(signal: AbortSignal) {
  const buttons = document.querySelectorAll<HTMLButtonElement>(
    '[data-wiki-theme-choice]',
  );
  function apply() {
    document.documentElement.dataset.wikiTheme = theme;
    for (const button of buttons)
      button.setAttribute(
        'aria-pressed',
        String(button.dataset.wikiThemeChoice === theme),
      );
  }
  apply();
  for (const button of buttons)
    button.addEventListener(
      'click',
      () => {
        theme = button.dataset.wikiThemeChoice === 'dark' ? 'dark' : 'light';
        apply();
        try {
          localStorage.setItem('nekogenix.wikiTheme', theme);
        } catch {
          /* Keep the selection for this visit if storage is unavailable. */
        }
      },
      { signal },
    );
}
