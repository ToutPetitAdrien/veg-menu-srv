import { R, log, DOMParser } from "../../deps.ts";

export const parsePagesNumber = async (html: string): Promise<number> => {
  const root = new DOMParser().parseFromString(
    html,
    "text/html",
  );
  const pageNumberNodes = root?.querySelectorAll(
    "nav.elementor-pagination a.page-numbers",
  );
  const lastPageNumber = R.last(pageNumberNodes).childNodes;
  const nbPages: number = Number(R.last(lastPageNumber).data);
  log.info(`menu-vegetarien.com has ${nbPages} recipes's pages`);

  return nbPages;
};
