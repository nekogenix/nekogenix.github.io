import data from './recipes.json';
import itemData from './items.json';
import type { Locale } from './site';

export interface Ingredient {
  item?: string;
  tag?: string;
}

export interface Stack {
  id: string;
  count: number | string;
}

export interface Recipe {
  slug: string;
  type:
    | 'minecraft:crafting_shaped'
    | 'minecraft:crafting_shapeless'
    | 'brewing'
    | 'processing'
    | 'collecting'
    | 'cleaning';
  pattern?: string[];
  key?: Record<string, Ingredient>;
  displayItems?: Record<string, string>;
  ingredients?: Ingredient[];
  inputs?: Stack[];
  result: Stack;
  returns?: Stack[];
  machine?: string;
  fuel?: string;
  seconds?: number;
}

export const recipes = data as Recipe[];
export const items = itemData as Record<
  string,
  { image: string; names: Record<Locale, string> }
>;

export function craftingCells(recipe: Recipe): (string | undefined)[] {
  return Array.from({ length: 9 }, (_, index) => {
    if (recipe.type === 'minecraft:crafting_shapeless')
      return recipe.ingredients?.[index]?.item;
    const symbol = recipe.pattern?.[Math.floor(index / 3)]?.[index % 3];
    return symbol
      ? (recipe.key?.[symbol]?.item ?? recipe.displayItems?.[symbol])
      : undefined;
  });
}

export function recipeInputs(recipe: Recipe): Stack[] {
  if (recipe.inputs) return recipe.inputs;
  const counts = new Map<string, number>();
  for (const id of craftingCells(recipe))
    if (id) counts.set(id, (counts.get(id) ?? 0) + 1);
  return Array.from(counts, ([id, count]) => ({ id, count }));
}
