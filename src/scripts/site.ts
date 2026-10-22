import { navigate } from 'astro:transitions/client';
import { copy, isLocale, pathFor } from '../data/site';
import { searchPages, type SearchPage } from '../lib/search';
import { initializeMedia } from '../lib/media';
import { initializeRecipeTooltips } from '../lib/recipes';
import { initializeLaboratory } from '../lib/laboratory';
import { initializeWikiTheme } from '../lib/wiki-theme';

let controller: AbortController | undefined;
let localeScroll: number | undefined;
let firstVisit = true;
const indexes = new Map<string, Promise<SearchPage[]>>();

function rememberLanguage(locale: string) {
  try {
    localStorage.setItem('nekogenix.language', locale);
  } catch {
    /* The current selection still works without storage. */
  }
}

document.addEventListener(
  'click',
  (event) => {
    if (!(event.target instanceof Element)) return;
    const link = event.target.closest<HTMLAnchorElement>('[data-locale]');
    if (!link || !isLocale(link.dataset.locale)) return;
    rememberLanguage(link.dataset.locale);
    localeScroll = window.scrollY;
    const url = new URL(link.href);
    url.hash = location.hash;
    link.href = url.href;
  },
  true,
);

function initialize() {
  controller?.abort();
  controller = new AbortController();
  const { signal } = controller;
  initializeWikiTheme(signal);
  initializeMedia(signal);
  initializeRecipeTooltips(signal);
  initializeLaboratory(signal);
  const language = document.documentElement.lang;
  const locale = isLocale(language) ? language : 'en';
  const t = copy[locale];

  if (firstVisit) {
    firstVisit = false;
    try {
      const preference = localStorage.getItem('nekogenix.language');
      if (
        location.pathname === '/' &&
        isLocale(preference) &&
        preference !== 'en'
      ) {
        void navigate(pathFor(preference), { history: 'replace' });
      }
    } catch {
      /* Browsing works without local storage. */
    }
  }
  if (localeScroll !== undefined) {
    const top = localeScroll;
    localeScroll = undefined;
    requestAnimationFrame(() => window.scrollTo({ top, behavior: 'instant' }));
  }

  const nav = document.querySelector<HTMLElement>('#main-navigation');
  const navToggle =
    document.querySelector<HTMLButtonElement>('[data-nav-toggle]');
  const closeNav = () => {
    nav?.removeAttribute('data-open');
    navToggle?.setAttribute('aria-expanded', 'false');
  };
  navToggle?.addEventListener(
    'click',
    () => {
      const open = navToggle.getAttribute('aria-expanded') !== 'true';
      navToggle.setAttribute('aria-expanded', String(open));
      nav?.toggleAttribute('data-open', open);
    },
    { signal },
  );
  nav?.addEventListener(
    'click',
    (event) => {
      if (event.target instanceof Element && event.target.closest('a'))
        closeNav();
    },
    { signal },
  );

  const wikiToggle =
    document.querySelector<HTMLButtonElement>('[data-wiki-toggle]');
  const sidebar = document.querySelector<HTMLElement>('#wiki-sidebar');
  wikiToggle?.addEventListener(
    'click',
    () => {
      const open = wikiToggle.getAttribute('aria-expanded') !== 'true';
      wikiToggle.setAttribute('aria-expanded', String(open));
      sidebar?.toggleAttribute('data-open', open);
    },
    { signal },
  );

  document.addEventListener(
    'pointerdown',
    (event) => {
      if (!(event.target instanceof Element)) return;
      for (const picker of document.querySelectorAll<HTMLDetailsElement>(
        '.language-picker[open]',
      )) {
        if (!picker.contains(event.target)) picker.open = false;
      }
      if (!event.target.closest('.site-header')) closeNav();
    },
    { signal },
  );
  document.addEventListener(
    'keydown',
    (event) => {
      if (event.key === 'Escape') {
        const dialog =
          document.querySelector<HTMLDialogElement>('dialog[open]');
        if (dialog) {
          event.preventDefault();
          dialog.close();
          return;
        }
        if (nav?.contains(document.activeElement)) navToggle?.focus();
        closeNav();
        for (const picker of document.querySelectorAll<HTMLDetailsElement>(
          '.language-picker[open]',
        )) {
          picker.open = false;
          picker.querySelector<HTMLElement>('summary')?.focus();
        }
      }
      if ((event.ctrlKey || event.metaKey) && event.key.toLowerCase() === 'k') {
        event.preventDefault();
        openSearch();
      }
    },
    { signal },
  );

  const search = document.querySelector<HTMLDialogElement>(
    '[data-search-dialog]',
  );
  const input = search?.querySelector<HTMLInputElement>('[data-search-input]');
  const results = search?.querySelector<HTMLElement>('[data-search-results]');
  let pages: SearchPage[] = [];
  let searchOpener: HTMLElement | undefined;

  const renderResults = () => {
    if (!results || !input) return;
    const matched = searchPages(pages, input.value);
    const nodes = matched.map((page) => {
      const link = document.createElement('a');
      link.href = page.url;
      link.className = 'search-result';
      const heading = document.createElement('strong');
      heading.textContent = page.title;
      const description = document.createElement('p');
      description.textContent = page.description;
      link.append(heading, description);
      link.addEventListener('click', () => search?.close(), { signal });
      return link;
    });
    if (!matched.length) {
      const message = document.createElement('p');
      message.className = 'search-empty';
      message.textContent = t.noResults;
      results.replaceChildren(message);
    } else results.replaceChildren(...nodes);
  };

  async function openSearch(opener?: HTMLElement) {
    if (!search || !input || search.open) return;
    searchOpener = opener;
    search.showModal();
    input.focus();
    if (!indexes.has(locale)) {
      indexes.set(
        locale,
        fetch(`/search/${locale}.json`)
          .then((response) => {
            if (!response.ok) throw new Error('Search index unavailable');
            return response.json() as Promise<SearchPage[]>;
          })
          .catch((error: unknown) => {
            indexes.delete(locale);
            throw error;
          }),
      );
    }
    try {
      pages = await indexes.get(locale)!;
      if (!signal.aborted) renderResults();
    } catch {
      if (results && !signal.aborted) {
        const link = document.createElement('a');
        link.href = pathFor(locale, 'wiki');
        link.className = 'text-link';
        link.textContent = t.browse;
        results.replaceChildren(link);
      }
    }
  }
  for (const button of document.querySelectorAll<HTMLButtonElement>(
    '[data-search-toggle]',
  )) {
    button.addEventListener('click', () => void openSearch(button), { signal });
  }
  input?.addEventListener('input', renderResults, { signal });
  search?.addEventListener(
    'close',
    () => searchOpener?.focus({ preventScroll: true }),
    { signal },
  );

  for (const dialog of document.querySelectorAll<HTMLDialogElement>('dialog')) {
    dialog
      .querySelector('[data-dialog-close]')
      ?.addEventListener('click', () => dialog.close(), { signal });
    dialog.addEventListener(
      'click',
      (event) => {
        if (event.target !== dialog) return;
        const bounds = dialog.getBoundingClientRect();
        if (
          event.clientX < bounds.left ||
          event.clientX > bounds.right ||
          event.clientY < bounds.top ||
          event.clientY > bounds.bottom
        )
          dialog.close();
      },
      { signal },
    );
  }
}

document.addEventListener('astro:page-load', initialize);
