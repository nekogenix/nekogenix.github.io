import data from './laboratory.json';
import type { Locale } from './site';

export const laboratoryCopy = {
  en: {
    inventory: 'Laboratory items',
    rotate: 'Rotate item',
    drag: 'Drag to rotate',
    previous: 'Previous item',
    next: 'Next item',
    guide: 'Recipe and use',
    groups: {
      equipment: 'Equipment',
      samples: 'Samples & cards',
      syringes: 'Syringes',
      ingredients: 'Bottles & ingredients',
    },
  },
  uk: {
    inventory: 'Лабораторні предмети',
    rotate: 'Повернути предмет',
    drag: 'Потягніть, щоб повернути',
    previous: 'Попередній предмет',
    next: 'Наступний предмет',
    guide: 'Рецепт і використання',
    groups: {
      equipment: 'Обладнання',
      samples: 'Зразки й карти',
      syringes: 'Шприци',
      ingredients: 'Пляшечки й інгредієнти',
    },
  },
  ru: {
    inventory: 'Лабораторные предметы',
    rotate: 'Повернуть предмет',
    drag: 'Потяните, чтобы повернуть',
    previous: 'Предыдущий предмет',
    next: 'Следующий предмет',
    guide: 'Рецепт и применение',
    groups: {
      equipment: 'Оборудование',
      samples: 'Образцы и карты',
      syringes: 'Шприцы',
      ingredients: 'Бутылочки и ингредиенты',
    },
  },
} as const;

export interface LaboratoryItem {
  id: string;
  group: keyof typeof laboratoryCopy.en.groups;
  guide: string;
  description: Record<Locale, string>;
}

export const laboratoryItems = data as LaboratoryItem[];
