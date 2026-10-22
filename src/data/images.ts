import type { Locale } from './site';

export const homeImages = {
  hero: 'hero',
  abilities: 'home-abilities',
  laboratory: 'home-laboratory',
  catLife: 'home-cat-life',
  skins: 'home-skins',
} as const;

export const wikiOverviewImage = 'wiki-overview';

export const imageLabels: Record<Locale, Record<string, string>> = {
  en: {
    hero: 'Steve, Alex and a player in cat form on a village path beside a river.',
    'home-abilities':
      'A player in cat form jumping from a grassy mountain ledge.',
    'home-laboratory':
      'A calcite and spruce laboratory among the houses of a plains village.',
    'home-cat-life':
      'A player in cat form wearing an iron helmet and carrying a diamond pickaxe along a village path.',
    'home-skins':
      'Cats with different coats exploring the hay bales in a village.',
    'wiki-overview': 'Steve entering the laboratory with a Cat Nucleocard.',
    'getting-started': 'Alex offering fish to a cat outside a village house.',
    syringes:
      'Steve preparing syringe parts at a crafting table in the laboratory.',
    potions:
      'Alex adding an Amethyst Shard at the brewing stand in the laboratory.',
    laboratory:
      'Alex working beside the centrifuge and pneumatic stand inside the laboratory.',
    'lab-detail': 'Alex collecting a Neko Injection from the pneumatic stand.',
    transformation:
      'Steve using a Neko Injection in a naturally generated cherry grove.',
    abilities: 'Steve jumping above a flower-covered mountain slope.',
    'cat-life':
      'A player in cat form using a diamond hoe in a village crop field.',
    'skin-editor':
      'The in-game cat skin library and preview. Interface shown in English.',
    skins: 'A player with a white cat coat exploring a cherry grove.',
    settings:
      'The Nekogenix settings screen in Minecraft. Interface shown in English.',
    questions: 'Alex holding a bucket of milk beside a cow in a village.',
  },
  uk: {
    hero: 'Стів, Алекс і гравець у формі кота на сільській стежці біля річки.',
    'home-abilities':
      'Гравець у формі кота стрибає з трав’янистого гірського виступу.',
    'home-laboratory':
      'Лабораторія з кальциту та ялини серед будинків рівнинного села.',
    'home-cat-life':
      'Гравець у формі кота в залізному шоломі несе діамантове кайло сільською стежкою.',
    'home-skins': 'Коти різних забарвлень досліджують снопи сіна в селі.',
    'wiki-overview': 'Стів заходить до лабораторії з котячою нуклеокартою.',
    'getting-started': 'Алекс пропонує рибу коту біля сільського будинку.',
    syringes: 'Стів готує частини шприца біля верстака в лабораторії.',
    potions:
      'Алекс додає аметистовий уламок до варильної стійки в лабораторії.',
    laboratory:
      'Алекс працює біля центрифуги та пневматичної стійки в лабораторії.',
    'lab-detail': 'Алекс забирає неко-ін’єкцію з пневматичної стійки.',
    transformation:
      'Стів використовує неко-ін’єкцію в природно згенерованому вишневому гаю.',
    abilities: 'Стів стрибає над гірським схилом, вкритим квітами.',
    'cat-life':
      'Гравець у формі кота працює діамантовою мотикою на сільському полі.',
    'skin-editor':
      'Бібліотека котячих скінів і попередній перегляд у грі. Інтерфейс показано англійською.',
    skins: 'Гравець із білим котячим забарвленням досліджує вишневий гай.',
    settings:
      'Налаштування Nekogenix у Minecraft. Інтерфейс показано англійською.',
    questions: 'Алекс тримає відро молока біля корови в селі.',
  },
  ru: {
    hero: 'Стив, Алекс и игрок в форме кота на деревенской тропе у реки.',
    'home-abilities':
      'Игрок в форме кота прыгает с травянистого горного уступа.',
    'home-laboratory':
      'Лаборатория из кальцита и ели среди домов равнинной деревни.',
    'home-cat-life':
      'Игрок в форме кота в железном шлеме несёт алмазную кирку по деревенской тропе.',
    'home-skins': 'Коты разных расцветок исследуют снопы сена в деревне.',
    'wiki-overview': 'Стив входит в лабораторию с кошачьей нуклеокартой.',
    'getting-started': 'Алекс предлагает рыбу коту у деревенского дома.',
    syringes: 'Стив готовит части шприца у верстака в лаборатории.',
    potions:
      'Алекс добавляет осколок аметиста в варочную стойку в лаборатории.',
    laboratory:
      'Алекс работает у центрифуги и пневматической стойки в лаборатории.',
    'lab-detail': 'Алекс забирает неко-инъекцию из пневматической стойки.',
    transformation:
      'Стив использует неко-инъекцию в естественно сгенерированной вишнёвой роще.',
    abilities: 'Стив прыгает над горным склоном, покрытым цветами.',
    'cat-life':
      'Игрок в форме кота работает алмазной мотыгой на деревенском поле.',
    'skin-editor':
      'Библиотека кошачьих скинов и предпросмотр в игре. Интерфейс показан на английском.',
    skins: 'Игрок с белой кошачьей расцветкой исследует вишнёвую рощу.',
    settings:
      'Настройки Nekogenix в Minecraft. Интерфейс показан на английском.',
    questions: 'Алекс держит ведро молока рядом с коровой в деревне.',
  },
};
