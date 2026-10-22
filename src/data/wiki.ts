import en from './articles.en.json';
import uk from './articles.uk.json';
import ru from './articles.ru.json';
import type { Locale } from './site';

export interface ArticleSection {
  id: string;
  title: string;
  paragraphs?: string[];
  list?: string[];
  ordered?: boolean;
  process?: 'centrifuge' | 'injection' | 'stabilizer';
  notice?: string;
  recipes?: string[];
  image?: string;
}
export interface Article {
  slug: string;
  group: 'start' | 'play' | 'reference';
  title: string;
  description: string;
  image: string;
  sections: ArticleSection[];
  related: string[];
}
export const articles = { en, uk, ru } as Record<Locale, Article[]>;
