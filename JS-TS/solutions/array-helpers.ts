export function mapArray<T, R>(source: readonly T[], mapper: (item: T, index: number) => R): R[] {
  if (source == null) {
    throw new TypeError('mapArray: source is null or undefined');
  }

  const result: R[] = [];
  let index = 0;

  for (let i = 0; i < source.length; i++) {
    result.push(mapper(source[i], i));
  }

  return result;
}

export function filterArray<T>(source: readonly T[], predicate: (item: T, index: number) => boolean): T[] {
  if (source == null) {
    throw new TypeError('filterArray: source is null or undefined');
  }

  const result: T[] = [];

  for (let i = 0; i < source.length; i++) {
    if (predicate(source[i], i)) {
      result.push(source[i]);
    }
  }

  return result;
}

export function reduceArray<T, R>(source: readonly T[], reducer: (acc: R, item: T, index: number) => R, initial: R): R {
  if (source == null) {
    throw new TypeError('reduceArray: source is null or undefined');
  }

  let result: R = initial;

  for (let i = 0; i < source.length; i++) {
    result = reducer(result, source[i], i);
  }

  return result;
}

export function partition<T>(source: readonly T[], predicate: (item: T) => boolean): [T[], T[]] {
  if (source == null) {
    throw new TypeError('partition: source is null or undefined');
  }

  const matches: T[] = [], nonMatches: T[] = [];

  for (const item of source) {
    if (predicate(item)) {
      matches.push(item);
    } else {
      nonMatches.push(item);
    }
  }

  return [matches, nonMatches];
}

export function groupBy<T, K extends PropertyKey>(source: readonly T[], keySelector: (item: T) => K): Record<K, T[]> {
  if (source == null) {
    throw new TypeError('groupBy: source is null or undefined');
  }

  const result: Record<K, T[]> = {} as Record<K, T[]>;

  for (const item of source){
    const key = keySelector(item);
    if (!result[key]){
      result[key] = [];
    }
    result[key].push(item);
  }
  return result;
}
