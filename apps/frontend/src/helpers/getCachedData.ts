export function getCachedData<T>(key: string, ttlMs: number): T | null {
  const raw = localStorage.getItem(key);
  if (!raw) return null;

  try {
    const { data, expiresAt } = JSON.parse(raw);
    if (Date.now() > expiresAt) {
      localStorage.removeItem(key);
      return null;
    }
    return data;
  } catch {
    localStorage.removeItem(key);
    return null;
  }
}

export function setCachedData<T>(key: string, data: T, ttlMs: number) {
  const expiresAt = Date.now() + ttlMs;
  localStorage.setItem(key, JSON.stringify({ data, expiresAt }));
}
