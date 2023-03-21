export function getScreenWidth(maxWidth?: number): number {
  const totalWidth = window.screen.width;
  if (maxWidth && maxWidth < totalWidth) {
    return maxWidth;
  }
  return totalWidth;
}
