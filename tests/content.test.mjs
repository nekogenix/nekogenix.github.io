import assert from 'node:assert/strict';
import { test } from 'node:test';
import { readFileSync, existsSync } from 'node:fs';
import { copy, locales } from '../src/data/site.ts';
import { inlineParts } from '../src/lib/inline.ts';
import {
  imageLabels,
  homeImages,
  wikiOverviewImage,
} from '../src/data/images.ts';
import { createHash } from 'node:crypto';

const read = (name) =>
  JSON.parse(
    readFileSync(new URL(`../src/data/${name}.json`, import.meta.url), 'utf8'),
  );
const recipes = read('recipes');
const items = read('items');
const laboratory = read('laboratory');
const articles = Object.fromEntries(
  locales.map((locale) => [locale, read(`articles.${locale}`)]),
);

test('the laboratory includes every base mod item with a model, translation and guide', () => {
  const ids = new Set(laboratory.map((entry) => entry.id));
  assert.equal(ids.size, laboratory.length);
  for (const id of Object.keys(items)) {
    if (id.startsWith('nekogenix:') && !/splash|lingering/.test(id))
      assert.ok(ids.has(id), id);
  }
  for (const entry of laboratory) {
    assert.ok(items[entry.id], entry.id);
    assert.ok(!/splash|lingering/.test(entry.id));
    const file = readFileSync(
      new URL(
        `../public/models/laboratory/${entry.id.split(':')[1]}.glb`,
        import.meta.url,
      ),
    );
    assert.equal(file.readUInt32LE(0), 0x46546c67);
    const [page, section] = entry.guide.replace('wiki/', '').split('#');
    for (const locale of locales) {
      assert.ok(entry.description[locale]?.trim(), `${entry.id}: ${locale}`);
      assert.ok(
        articles[locale]
          .find((article) => article.slug === page)
          ?.sections.some((item) => item.id === section),
        entry.guide,
      );
    }
  }
});

function structure(value) {
  if (Array.isArray(value)) return value.map(structure);
  if (value && typeof value === 'object')
    return Object.fromEntries(
      Object.entries(value).map(([key, child]) => [key, structure(child)]),
    );
  return typeof value;
}

test('each locale has complete interface copy and the same wiki structure', () => {
  const shape = (pages) =>
    pages.map((page) => ({
      slug: page.slug,
      group: page.group,
      related: page.related,
      sections: page.sections.map((section) => ({
        id: section.id,
        recipes: section.recipes,
        paragraphs: section.paragraphs?.length,
        list: section.list?.length,
        ordered: section.ordered,
        process: section.process,
        image: section.image,
      })),
    }));
  for (const locale of locales) {
    assert.deepEqual(structure(copy[locale]), structure(copy.en), locale);
    assert.deepEqual(shape(articles[locale]), shape(articles.en), locale);
    const slugs = new Set(articles[locale].map((article) => article.slug));
    assert.equal(slugs.size, articles[locale].length);
    for (const article of articles[locale]) {
      assert.ok(article.title.trim() && article.description.trim());
      assert.equal(
        new Set(article.sections.map((section) => section.id)).size,
        article.sections.length,
      );
      for (const related of article.related) assert.ok(slugs.has(related));
      for (const section of article.sections)
        for (const id of section.recipes ?? [])
          assert.ok(
            recipes.some((recipe) => recipe.slug === id),
            id,
          );
    }
  }
});

test('contextual wiki links point to existing pages and sections in every language', () => {
  function strings(value) {
    if (typeof value === 'string') return [value];
    if (!value || typeof value !== 'object') return [];
    return Object.values(value).flatMap(strings);
  }
  for (const locale of locales) {
    for (const value of strings([copy[locale], articles[locale]])) {
      for (const { target } of inlineParts(value)) {
        if (!target?.startsWith('wiki')) continue;
        const [path, anchor] = target.split('#');
        if (path === 'wiki') {
          assert.equal(anchor, undefined);
          continue;
        }
        const page = articles[locale].find(
          (article) => path === `wiki/${article.slug}`,
        );
        assert.ok(page, `${locale}: ${target}`);
        if (anchor)
          assert.ok(
            page.sections.some((section) => section.id === anchor),
            `${locale}: ${target}`,
          );
      }
    }
  }
});

test('all crafting, brewing and processing recipes have valid localized item assets', () => {
  assert.equal(
    new Set(recipes.map((recipe) => recipe.slug)).size,
    recipes.length,
  );
  const supported = new Set([
    'minecraft:crafting_shaped',
    'minecraft:crafting_shapeless',
    'brewing',
    'processing',
    'collecting',
    'cleaning',
  ]);
  for (const recipe of recipes) {
    assert.ok(supported.has(recipe.type), recipe.slug);
    assert.ok(recipe.result.count > 0 || recipe.result.count === '1–2');
    const ids = [
      recipe.result.id,
      ...Object.values(recipe.key ?? {}).map((key) => key.item),
      ...Object.values(recipe.displayItems ?? {}),
      ...(recipe.ingredients ?? []).map((item) => item.item),
      ...(recipe.inputs ?? []).map((item) => item.id),
      ...(recipe.returns ?? []).map((item) => item.id),
      recipe.machine,
      recipe.fuel,
    ].filter(Boolean);
    for (const id of ids) {
      assert.ok(items[id], id);
      const image = new URL(`../public${items[id].image}`, import.meta.url);
      assert.ok(existsSync(image), items[id].image);
      const png = readFileSync(image);
      assert.equal(png.readUInt32BE(16), 128, id);
      assert.equal(png.readUInt32BE(20), 128, id);
      assert.equal(png[25], 6, `${id}: icon must preserve RGBA transparency`);
      for (const locale of locales) assert.ok(items[id].names[locale].trim());
    }
    for (const row of recipe.pattern ?? []) {
      assert.ok(row.length <= 3);
      for (const symbol of row)
        if (symbol !== ' ') assert.ok(recipe.key[symbol], symbol);
    }
  }
});

test('every recipe appears once in each localized wiki', () => {
  const processes = {
    centrifuge: 'cat_nucleocard',
    injection: 'neko_injection',
    stabilizer: 'crystallizing_injection',
  };
  const expected = recipes.map((recipe) => recipe.slug).sort();
  for (const locale of locales) {
    const shown = articles[locale].flatMap((article) =>
      article.sections.flatMap((section) => [
        ...(section.recipes ?? []),
        ...(section.process ? [processes[section.process]] : []),
      ]),
    );
    assert.deepEqual(shown.sort(), expected, locale);
  }
});

test('every wiki screenshot has localized captions and all responsive sizes', () => {
  for (const locale of locales) {
    const names = [
      wikiOverviewImage,
      ...Object.values(homeImages),
      ...articles[locale].flatMap((article) => [
        ...(article.image ? [article.image] : []),
        ...article.sections.flatMap((section) =>
          section.image ? [section.image] : [],
        ),
      ]),
    ];
    const hashes = new Set();
    assert.equal(
      new Set(names).size,
      names.length,
      `${locale}: screenshot reused`,
    );
    for (const name of names) {
      assert.ok(imageLabels[locale][name], `${locale}: ${name}`);
      for (const width of [640, 1280, 1920, 3840]) {
        assert.ok(
          existsSync(
            new URL(`../public/media/${name}-${width}.webp`, import.meta.url),
          ),
        );
      }
      const hash = createHash('sha256')
        .update(
          readFileSync(
            new URL(`../public/media/${name}-3840.webp`, import.meta.url),
          ),
        )
        .digest('hex');
      assert.ok(!hashes.has(hash), `${locale}: copied screenshot ${name}`);
      hashes.add(hash);
    }
  }
});
