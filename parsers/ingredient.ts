import { Ingredient } from "../types.ts";

const regex = /(\d*,?\d*)?\s?(.*)/;

export const parseIngredient = (text: string): Ingredient => {
  const result = regex.exec(text) || [];

  const [, quantity, label] = result;

  return {
    label,
    quantity: quantity ? Number(quantity.replace(/,/g, ".")) : undefined,
  };
};
