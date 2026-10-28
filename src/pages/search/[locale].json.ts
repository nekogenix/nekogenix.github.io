import { locales, pathFor } from '../../data/site';
import { articles } from '../../data/wiki';
import advancements from '../../data/advancements.json';
import type { Locale } from '../../data/site';
import type { APIRoute } from 'astro';
import { inlineText } from '../../lib/inline';
export function getStaticPaths() {
  return locales.map((locale) => ({ params: { locale } }));
}
export const GET: APIRoute = ({ params }) => {
  const locale = params.locale as Locale;
  return new Response(
    JSON.stringify(
      articles[locale].map((article) => ({
        title: article.title,
        description: article.description,
        url: pathFor(locale, `wiki/${article.slug}`),
        text: article.sections
          .map((section) =>
            [
              section.title,
              ...(section.paragraphs ?? []),
              ...(section.list ?? []),
              section.notice ?? '',
              ...(section.advancements
                ? advancements[locale].entries.flatMap((entry) => [
                    entry.name,
                    entry.description,
                  ])
                : []),
            ]
              .map(inlineText)
              .join(' '),
          )
          .join(' '),
      })),
    ),
    { headers: { 'Content-Type': 'application/json; charset=utf-8' } },
  );
};
