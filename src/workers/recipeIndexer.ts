import { Index, Queue, Recipe } from "../types.ts";
import { sendToQueue } from "../rabbitmq.ts";
import { saveObjects } from "../algolia.ts";
import { redisService } from "../redis.ts";

export const queue = Queue.RecipeIndexer;

export async function sendToRecipeIndexer(recipe: Recipe): Promise<void> {
  await sendToQueue(queue, recipe);
}

export async function work(recipe: Recipe): Promise<void> {
  const redis = redisService();
  await saveObjects(Index.Recipes, [{ ...recipe, objectID: recipe.slug }]);
  await redis.setKey(recipe.slug, true);
}
