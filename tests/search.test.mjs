import assert from 'node:assert/strict';
import { test } from 'node:test';
import { searchPages } from '../src/lib/search.ts';
import { pathFor } from '../src/data/site.ts';

const pages = [
  {
    title: 'Котячий зір',
    description: 'Як бачити в темряві',
    text: 'Потрібна здібність котячого зору',
    url: '/uk/wiki/abilities/',
  },
  {
    title: 'Лабораторія',
    description: 'Приготування ін’єкції',
    text: 'Здібність зору з’являється пізніше',
    url: '/uk/wiki/laboratory/',
  },
];
test('search matches Ukrainian apostrophes and ranks the relevant title first', () => {
  assert.deepEqual(
    searchPages(pages, 'котячий ЗІР').map((page) => page.url),
    ['/uk/wiki/abilities/'],
  );
  assert.equal(searchPages(pages, "ін'єкції")[0].title, 'Лабораторія');
  assert.equal(searchPages(pages, 'пізніше')[0].title, 'Лабораторія');
});
test('empty and unmatched searches remain deliberate states', () => {
  assert.deepEqual(searchPages(pages, '  '), pages);
  assert.deepEqual(searchPages(pages, 'not present'), []);
});
test('localized routes preserve the article instead of returning to the home page', () => {
  assert.equal(pathFor('en', 'wiki/cat-skins'), '/wiki/cat-skins/');
  assert.equal(pathFor('uk', 'wiki/cat-skins'), '/uk/wiki/cat-skins/');
  assert.equal(pathFor('ru', '/wiki/cat-skins/'), '/ru/wiki/cat-skins/');
});
