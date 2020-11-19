import { baseUrl } from "./constants.ts";

export function buildUrl({ page = 1 }: { [page: string]: number }): string {
  return `${baseUrl}/recettes${page > 1 ? `/page/${page}` : ""}`;
}

export function dateToTimestamp(date?: string): number | void {
  if (!date) {
    return;
  }

  return new Date(date).getTime() / 1000;
}
