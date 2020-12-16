import * as log from "https://deno.land/std@0.76.0/log/mod.ts";

import { sendToQueue } from "../rabbitmq/index.ts";
import { Queue } from "../types.ts";
import { sendToRecipeIndexer } from './recipeIndexer.ts';
import { dateToTimestamp } from "../utils.ts";
import { parseRecipe } from "../parsers/recipe.ts";
import { Recipe } from "../types.ts";
import { api } from "../api/index.ts";

export const queue = Queue.RecipeParser;

export async function sendToRecipeParser(slug: string): Promise<void> {
  await sendToQueue(queue, slug);
}

export async function work(slug: string): Promise<void> {
  const recipe = await getRecipe(slug);
  await sendToRecipeIndexer(recipe);
}

export async function getRecipe(slug: string): Promise<Recipe> {
  const html = await api(`/recettes/${slug}`);
  const recipe = parseRecipe(html);
  const createdAtTimestamp = dateToTimestamp(recipe.createdAt);

  const fullRecipe: Recipe = {
    ...recipe,
    slug,
    createdAtTimestamp: createdAtTimestamp as number,
  };
  return fullRecipe;
}
