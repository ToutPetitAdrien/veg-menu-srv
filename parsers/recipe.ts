import * as R from "https://x.nest.land/ramda@0.27.0/source/index.js";
import { parse } from "https://cdn.skypack.dev/node-html-parser?dts";

import { Recipe } from "../types.ts";
import { parseIngredient } from "./ingredient.ts";

const TITLE_SELECTOR = "div.blog-main > h1";
const DESCRIPTION_SELECTOR = "span.wpurp-recipe-description";
const PHOTO_SELECTOR = "div.blog-main > div.blog-rightsidebar-img > img";
const CREATED_AT_SELECTOR = "div.blog-main > div.fancy_categories time";
const PREPARATION_TIME_SELECTOR = "span.wpurp-recipe-prep-time";
const COOKING_TIME_SELECTOR = "span.wpurp-recipe-cook-time";
const SERVINGS_SELECTOR = "input.advanced-adjust-recipe-servings";
const INGREDIENTS_SELECTOR = "div.wpurp-recipe-ingredients";
const INGREDIENTS_GROUP_SELECTOR =
  "div.wpurp-recipe-ingredient-group-container";
const INGREDIENTS_ROW_SELECTOR = "div.wpurp-rows-row";
const INGREDIENTS_LIST_SELECTOR = "ul.wpurp-recipe-ingredient-container";
const INGREDIENTS_LIST_ITEM_SELECTOR = "li.wpurp-recipe-ingredient";
const INSTRUCTIONS_ITEM_SELECTOR =
  "ol.wpurp-recipe-instruction-container li.wpurp-recipe-instruction";
const INSTRUCTIONS_TEXT_SELECTOR = "span.wpurp-recipe-instruction-text";

export const parseRecipe = (html: string): Recipe => {
  const root = parse(html);

  const title = root.querySelector(TITLE_SELECTOR).rawText;
  const description = root.querySelector(DESCRIPTION_SELECTOR).rawText;
  const photoUrl = root.querySelector(PHOTO_SELECTOR).attributes.src;
  const createdAt = root.querySelector(CREATED_AT_SELECTOR).attributes.datetime;

  const preparationTime =
    R.head(root.querySelectorAll(PREPARATION_TIME_SELECTOR)).rawText;
  const cookingTime =
    R.head(root.querySelectorAll(COOKING_TIME_SELECTOR)).rawText;
  const servings = root.querySelector(SERVINGS_SELECTOR).attributes.value;

  const ingredients = [];
  const otherIngredients = [];

  const ingredientsSelector = root.querySelectorAll(INGREDIENTS_SELECTOR)[1];
  const ingredientsGroupSelector = ingredientsSelector.querySelectorAll(
    INGREDIENTS_GROUP_SELECTOR,
  );
  for (const ingrd of ingredientsGroupSelector) {
    const currentIngredients = [];
    const ingredientsRowSelector = ingrd.querySelector(
      INGREDIENTS_ROW_SELECTOR,
    );
    const title = R.head(ingredientsRowSelector).rawText.trim();

    const ingredientsListSelector = R.head(
      ingredientsRowSelector.querySelectorAll(INGREDIENTS_LIST_SELECTOR),
    );
    const ingredientsListItemSelector = ingredientsListSelector
      .querySelectorAll(INGREDIENTS_LIST_ITEM_SELECTOR);

    for (const ingrd of ingredientsListItemSelector) {
			const ingredient = ingrd.rawText;
			if (ingredient) {
				currentIngredients.push(parseIngredient(ingredient));
			} 
    }

    // Main ingredients
    if (!title) {
      ingredients.push(...currentIngredients);
      return;
    }

    otherIngredients.push({
      title,
      ingredients: currentIngredients,
    });
  }

  const instructions = [];
  const instructionsItemSelector = root.querySelectorAll(
    INSTRUCTIONS_ITEM_SELECTOR,
  );
  for (const instructionSelector of instructionsItemSelector) {
    const text =
      instructionSelector.querySelector(INSTRUCTIONS_TEXT_SELECTOR).rawText;
    instructions.push(text);
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
    slug: null,
    createdAtTimestamp: null,
  };
};
