import { Index, Queue, Recipe } from "../types.ts";
import { sendToQueue } from "../rabbitmq/index.ts";
import { saveObjects } from '../algolia/index.ts';
import { setKey } from "../redis/index.ts";

export const queue = Queue.RecipeIndexer;

export async function sendToRecipeIndexer(recipe: Recipe): Promise<void> {
  await sendToQueue(queue, recipe);
}

export async function work(recipe: Recipe): Promise<void> {
  await saveObjects(Index.Recipes, [{ ...recipe, objectID: recipe.slug }])
  await setKey(recipe.slug, true);
}
