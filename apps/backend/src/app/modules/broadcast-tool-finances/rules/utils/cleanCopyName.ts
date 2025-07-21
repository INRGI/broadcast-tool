export function cleanCopyName(copyName: string): string {
  // const nameMatch = copyName.match(/^[a-zA-Z]+/);
  // const product = nameMatch ? nameMatch[0] : "";
  // const liftMatch = copyName.match(/[a-zA-Z]+(\\d+)/);
  // const productLift = liftMatch ? liftMatch[1] : "";
  // return `${product}${productLift}`;

  const match = copyName.match(/^[a-zA-Z]+(\d+)[^a-zA-Z0-9]*/);
  if (match) {
    const result = match[1] ? match[0].replace(/[^a-zA-Z0-9]/g, "") : "";
    return result;
  } else {
    return "";
  }
}
