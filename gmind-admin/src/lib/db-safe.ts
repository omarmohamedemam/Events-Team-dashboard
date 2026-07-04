export function emptyOnDbError<T>(fallback: T) {
  return (error: unknown): T => {
    console.warn("Database unavailable; rendering empty dev state.", error);
    return fallback;
  };
}
