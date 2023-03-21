export function getIngredientLabel(name?: string | null, unit?: string | null, quantity?: string | null): string {
  let label = "";

  if (name) {
    label = name + " ";
    if (quantity || unit) {
      let space = "";
      if (quantity && unit) {
        space = " ";
      }
      const quantityLabel = (quantity) ? quantity.toString() : "";
      const unitLabel = (unit) ? unit.toString() : "";
      label += `(${quantityLabel}${space}${unitLabel})`;
    }
  }
  return label;
}
