export const ALPHABET = "ABCDEFGHIJKLMNÑOPQRSTUVWXYZ";

export interface NameDNA {
  raw: string;
  normalized: string;
  letters: string[];
  values: number[];
  sum: number;
  digitalRoot: number;
  length: number;
  vowels: number;
  consonants: number;
  uniqueCount: number;
  repetitions: Record<string, number>;
  initial: string;
  final: string;
  axes: number;
  rings: number;
  outerSides: number;
  vowelRatio: number;
  entropy: number;
  rhythm: string;
  code: string;
  sequence: string;
  seed: number;
}

export function normalizeName(input: string): string {
  return (input || "AEON")
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .toUpperCase()
    .replace(/Ü/g, "U")
    .replace(/[^A-ZÑ\s'-]/g, "")
    .replace(/\s+/g, " ")
    .trim() || "AEON";
}

export function letterValue(letter: string): number {
  const index = ALPHABET.indexOf(letter);
  return index >= 0 ? index + 1 : 0;
}

export function fnv1a(input: string): number {
  let hash = 2166136261 >>> 0;
  for (let i = 0; i < input.length; i += 1) {
    hash ^= input.charCodeAt(i);
    hash = Math.imul(hash, 16777619);
  }
  return hash >>> 0;
}

export function digitalRoot(value: number): number {
  let result = value;
  while (result > 9) {
    result = String(result).split("").reduce((sum, digit) => sum + Number(digit), 0);
  }
  return result;
}

export function analyzeName(raw: string): NameDNA {
  const normalized = normalizeName(raw);
  const letters = [...normalized].filter((letter) => ALPHABET.includes(letter));
  const values = letters.map(letterValue);
  const sum = values.reduce((acc, value) => acc + value, 0);
  const root = digitalRoot(sum);
  const vowelSet = new Set(["A", "E", "I", "O", "U"]);
  const vowels = letters.filter((letter) => vowelSet.has(letter)).length;
  const consonants = letters.length - vowels;
  const uniqueCount = new Set(letters).size;
  const repetitions: Record<string, number> = {};
  for (const letter of letters) repetitions[letter] = (repetitions[letter] || 0) + 1;
  const sequence = values.map((value) => String(value).padStart(2, "0")).join(".");
  const rhythm = letters.map((letter) => vowelSet.has(letter) ? "V" : "C").join("");
  const code = `LG-${String(letters.length).padStart(2, "0")}-${String(sum).padStart(3, "0")}-${root}-${vowels}-${uniqueCount}`;
  const seed = fnv1a(`${normalized}|${sequence}|${rhythm}|V10`);

  return {
    raw,
    normalized,
    letters,
    values,
    sum,
    digitalRoot: root,
    length: letters.length,
    vowels,
    consonants,
    uniqueCount,
    repetitions,
    initial: letters[0] ?? "A",
    final: letters.at(-1) ?? "A",
    axes: 4 + (uniqueCount % 5),
    rings: 1 + (root % 4),
    outerSides: 3 + (sum % 7),
    vowelRatio: letters.length ? vowels / letters.length : 0,
    entropy: letters.length ? uniqueCount / letters.length : 0,
    rhythm,
    code,
    sequence,
    seed
  };
}
