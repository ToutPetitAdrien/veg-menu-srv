import { algoliasearch, log } from "../deps.ts";

import * as fetch from "./requests.ts";

const { ALGOLIASEARCH_APPLICATION_ID } = Deno.env.toObject();
const { ALGOLIASEARCH_API_KEY } = Deno.env.toObject();

const algoliaConfig = JSON.parse(
  Deno.readTextFileSync("src/config/algolia.json"),
);

const client = algoliasearch(
  ALGOLIASEARCH_APPLICATION_ID,
  ALGOLIASEARCH_API_KEY,
);

type ResponsePutSettings = {
  updatedAt: string;
  taskID: string;
};

export let indices: Record<string, any>;

export async function initAlgolia(): Promise<void> {
  for (const [index, settings] of Object.entries(algoliaConfig.indices)) {
    indices = {
      ...indices,
      [index]: client.initIndex(index),
    };
    await putToAlgolia(`/indexes/${index}/settings`, settings);
  }
}

export async function putToAlgolia(
  path: string,
  payload: any,
): Promise<ResponsePutSettings> {
  const baseUrl: string =
    `https://${ALGOLIASEARCH_APPLICATION_ID}-dsn.algolia.net/1`;
  const url: string = baseUrl + path;
  const response = await fetch.put<unknown, ResponsePutSettings>(url, payload, {
    headers: {
      "X-Algolia-API-Key": ALGOLIASEARCH_API_KEY,
      "X-Algolia-Application-Id": ALGOLIASEARCH_APPLICATION_ID,
    },
  });
  return response;
}

export async function saveObjects(
  index: string,
  objects: unknown[],
): Promise<void> {
  log.info(
    `Indexing ${objects.length} objects in index ${index}...`,
  );

  indices[index].saveObjects(objects).then(({ objectIDs }: any) => {
    log.info(`${objectIDs} has been saved in Algolia`);
  });
}
