export function cleanProductName(copyName: string): string {
  const nameMatch = copyName.match(/^[a-zA-Z]+/);
  const product = nameMatch ? nameMatch[0] : "";

  return product;
}
