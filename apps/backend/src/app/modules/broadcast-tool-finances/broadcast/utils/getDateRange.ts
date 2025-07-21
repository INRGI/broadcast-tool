export function getDateRange(from: string, to: string): string[] {
  const result: string[] = [];
  const current = new Date(from);
  const end = new Date(to);

  while (current <= end) {
    result.push(current.toISOString().split("T")[0]);
    current.setDate(current.getDate() + 1);
  }

  return result;
}
