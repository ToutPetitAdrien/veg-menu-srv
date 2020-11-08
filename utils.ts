import { baseUrl } from "./constants.ts";

export function buildUrl({ page }: { [page: string]: number }): string {
  return `${baseUrl}/recettes${page > 1 ? `/page/${page}` : ""}`;
}
