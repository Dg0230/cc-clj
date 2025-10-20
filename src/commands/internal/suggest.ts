/**
 * Minimal suggestion helper derived from Commander bundle module `RjQ`.
 */
// TODO(RjQ): Port Levenshtein-based suggestion logic from cli-origin.js.
export function suggestSimilar<T extends string>(word: T, candidates: readonly T[]): T[] {
  if (word.length === 0) {
    return [...candidates];
  }

  const threshold = Math.max(1, Math.floor(word.length / 2));
  return candidates.filter((candidate) => {
    const distance = levenshtein(word.toLowerCase(), candidate.toLowerCase());
    return distance <= threshold;
  });
}

function levenshtein(a: string, b: string): number {
  const matrix: number[][] = Array.from({ length: a.length + 1 }, () => new Array(b.length + 1).fill(0));

  for (let i = 0; i <= a.length; i += 1) {
    matrix[i][0] = i;
  }
  for (let j = 0; j <= b.length; j += 1) {
    matrix[0][j] = j;
  }

  for (let i = 1; i <= a.length; i += 1) {
    for (let j = 1; j <= b.length; j += 1) {
      const cost = a[i - 1] === b[j - 1] ? 0 : 1;
      matrix[i][j] = Math.min(
        matrix[i - 1][j] + 1,
        matrix[i][j - 1] + 1,
        matrix[i - 1][j - 1] + cost,
      );
    }
  }

  return matrix[a.length][b.length];
}
