export interface SearchPage {
  title: string;
  description: string;
  url: string;
  text: string;
}

export function normalize(value: string) {
  return value
    .toLocaleLowerCase()
    .normalize('NFKD')
    .replace(/\p{M}/gu, '')
    .replace(/[’‘']/g, '');
}

export function searchPages(pages: SearchPage[], query: string): SearchPage[] {
  const terms = normalize(query).trim().split(/\s+/).filter(Boolean);
  if (!terms.length) return pages;
  return pages
    .map((page, index) => {
      const title = normalize(page.title);
      const summary = normalize(page.description);
      const full = `${title} ${summary} ${normalize(page.text)}`;
      const matches = terms.every((term) => full.includes(term));
      const score = terms.reduce(
        (sum, term) =>
          sum + (title.includes(term) ? 5 : summary.includes(term) ? 2 : 1),
        0,
      );
      return { page, index, matches, score };
    })
    .filter((result) => result.matches)
    .sort((a, b) => b.score - a.score || a.index - b.index)
    .map(({ page }) => page);
}
