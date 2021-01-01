import { R, DOMParser } from "../../deps.ts";

import { Ingredient, Recipe } from "../types.ts";
import { parseIngredient } from "./ingredient.ts";

const TITLE_SELECTOR = "div.blog-main h1";
const DESCRIPTION_SELECTOR = "span.wpurp-recipe-description";
const PHOTO_SELECTOR = "div.blog-main div.blog-rightsidebar-img img";
const CREATED_AT_SELECTOR = "div.blog-main div.fancy_categories time";
const PREPARATION_TIME_SELECTOR = "span.wpurp-recipe-prep-time";
const COOKING_TIME_SELECTOR = "span.wpurp-recipe-cook-time";
const SERVINGS_SELECTOR = "input.advanced-adjust-recipe-servings";
const INGREDIENTS_SELECTOR = "wpurp-recipe-ingredients";
const INGREDIENTS_GROUP_SELECTOR = "wpurp-recipe-ingredient-group-container";
const INGREDIENTS_ROW_SELECTOR = "wpurp-rows-row";
const INGREDIENTS_LIST_SELECTOR = "wpurp-recipe-ingredient-container";
const INGREDIENTS_LIST_ITEM_SELECTOR = "wpurp-recipe-ingredient";
const INSTRUCTIONS_ITEM_SELECTOR = "wpurp-recipe-instruction";
const INSTRUCTIONS_TEXT_SELECTOR = "span.wpurp-recipe-instruction-text";

export const parseRecipe = (
  html: string,
): Omit<Recipe, "slug" | "createdAtTimestamp"> => {
  const root = new DOMParser().parseFromString(
    html,
    "text/html",
  );
  if (!root) {
    throw new Error("Parsed DOM is null");
  }
  const title = root.querySelector(TITLE_SELECTOR)?.textContent;
  const description = root.querySelector(DESCRIPTION_SELECTOR)?.textContent;
  const photoUrl = root.querySelector(PHOTO_SELECTOR)?.getAttribute("src");
  const createdAt = root.querySelector(CREATED_AT_SELECTOR)?.getAttribute(
    "datetime",
  );

  const preparationTime = R.head(
    root.querySelectorAll(PREPARATION_TIME_SELECTOR),
  )?.textContent;
  const cookingTime = R.head(root.querySelectorAll(COOKING_TIME_SELECTOR))
    ?.textContent;
  const servings = Number(
    root.querySelector(SERVINGS_SELECTOR)?.getAttribute("value"),
  );

  let ingredients: Array<Ingredient> = [];
  let otherIngredients: Array<Ingredient> = [];

  const ingredientsSelector =
    root.getElementsByClassName(INGREDIENTS_SELECTOR)[1];
  const ingredientsGroupSelector = ingredientsSelector.getElementsByClassName(
    INGREDIENTS_GROUP_SELECTOR,
  );

  for (const ingrdGroup of ingredientsGroupSelector) {
    const currentIngredients = [];
    const [titleSelector, ingredientsSelector] = ingrdGroup
      .getElementsByClassName(
        INGREDIENTS_ROW_SELECTOR,
      );
    const title = titleSelector.textContent.trim();

    const ingredientsListSelector = R.head(
      ingredientsSelector.getElementsByClassName(INGREDIENTS_LIST_SELECTOR),
    );
    const ingredientsListItemsSelector = ingredientsListSelector
      .getElementsByClassName(INGREDIENTS_LIST_ITEM_SELECTOR);

    for (const ingrd of ingredientsListItemsSelector) {
      const ingredient = ingrd.textContent;
      if (ingredient) {
        currentIngredients.push(parseIngredient(ingredient));
      }
    }

    // Main ingredients
    if (!title) {
      ingredients.push(...currentIngredients);
      continue;
    }

    otherIngredients.push(...currentIngredients);
  }

  const instructions = [];
  const instructionsItemSelector = root.getElementsByClassName(
    INSTRUCTIONS_ITEM_SELECTOR,
  );
  for (const instructionSelector of instructionsItemSelector) {
    const text = instructionSelector.querySelector(INSTRUCTIONS_TEXT_SELECTOR)
      ?.textContent;
    if (!text) {
      continue;
    }
    instructions.push(text);
  }

  if (!title || !photoUrl || !createdAt || !servings) {
    throw new Error(
      `Miss some critical recipe's info to make parsing successful, title: ${title}, description: ${description}, photoUrl: ${photoUrl}, createdAt: ${createdAt}, servings: ${servings}`,
    );
  }

  return {
    title,
    description,
    photoUrl,
    preparationTime,
    cookingTime,
    servings,
    ingredients,
    otherIngredients,
    instructions,
    createdAt,
  };
};
