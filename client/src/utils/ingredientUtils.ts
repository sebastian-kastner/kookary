import { RecipeIngredient  } from '../types'

export function getIngredientLabel(
  name?: string | null,
  unit?: string | null,
  quantity?: string | null
): string {
  let label = "";

  if (name) {
    label = name + " ";
    if (quantity || unit) {
      let space = "";
      if (quantity && unit) {
        space = " ";
      }
      const quantityLabel = quantity ? quantity.toString() : "";
      const unitLabel = unit ? unit.toString() : "";
      label += `(${quantityLabel}${space}${unitLabel})`;
    }
  }
  return label;
}

export function sortIngredients(ingredients: RecipeIngredient[]): RecipeIngredient[] {
  return ingredients.sort((a, b) => {
    if ((a.position && !isNaN(a.position)) && (b.position && !isNaN(b.position))) {
      return a.position - b.position;
    } else if (!a.position || isNaN(a.position)) {
      return -1;
    } else if (!b.position || isNaN(b.position)) {
      return 1;
    } else if (a.recipeIngredientId && b.recipeIngredientId) {
      return a.recipeIngredientId - b.recipeIngredientId;
    }
    return 0;
  });
}

// FIXME: remove this debugging function
export function checkIngredientPos(ingredients: RecipeIngredient[]): void {
  ingredients.forEach((ingredient, index) => {
    if(ingredient.position !== index) {
      let label = "";
      if (ingredient.ingredient && ingredient.ingredient.name) {
        label = ingredient.ingredient.name;
      } else if (ingredient.separatorLabel) {
        label = ingredient.separatorLabel;
      }
      console.warn("Position mismatch:", label, "Expected:", index, "Actual:", ingredient.position)
    }
  });
}