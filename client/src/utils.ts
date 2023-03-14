

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

export function getScreenWidth(maxWidth?: number): number {
  const totalWidth = window.screen.width;
  if (maxWidth && maxWidth < totalWidth) {
    return maxWidth;
  }
  return totalWidth;
}