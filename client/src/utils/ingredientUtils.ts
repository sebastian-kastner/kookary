export function getIngredientLabel(name?: string | null, unit?: string | null, quantity?: string | null): string {
  let label = "";

  if (name) {
    label = name + " ";
    if (quantity || unit) {
      let space = "";
      if (quantity && unit) {
        space = " ";
      }
      label += `(${quantity}${space}${unit})`;
    }
  }
  return label;
}
