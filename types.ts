export interface PageSlugs {
  page: number;
  slugsList: Array<string>;
}

export enum Queue {
  RecipeFilterer = "recipe-filterer",
  RecipeParser = "recipe-parser",
  RecipeIndexer = "recipe-indexer",
  MenuParser = "menu-parser",
  MenuIndexer = "menu-indexer",
}

export interface Ingredient {
  quantity?: number;
  label: string;
}

export interface Recipe {
  title: string;
  slug: string;
  description?: string;
  photoUrl?: string;
  preparationTime?: number;
  cookingTime?: number;
  servings: number;
  ingredients: Array<Ingredient>;
  otherIngredients: Array<Ingredient>;
  instructions: Array<string>;
  createdAt: string;
  createdAtTimestamp: number;
}

export interface WeeklyMenu {
  title: string
  slug: string
  description?: string
  photoUrl?: string
  url: string
  date: string
  dateTimestamp: number
  dailyMenus: Array<Array<Recipe>>
}

export interface Ingredient {
  quantity?: number;
  label: string;
}

export enum Index {
  Recipes = "recipes",
  Menus = "menus",
}
