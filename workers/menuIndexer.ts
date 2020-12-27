import { Index, Queue, WeeklyMenu } from "../types.ts";
import { sendToQueue } from "../rabbitmq/index.ts";
import { saveObjects } from "../algolia/index.ts";
import { setKey } from "../redis/index.ts";

export const queue = Queue.MenuIndexer;

export async function sendToMenuIndexer(menu: WeeklyMenu): Promise<void> {
  await sendToQueue(queue, menu);
}

export async function work(menu: WeeklyMenu): Promise<void> {
  await saveObjects(Index.Menus, [{ ...menu, objectID: menu.slug }]);
  await setKey(menu.slug, true);
}
