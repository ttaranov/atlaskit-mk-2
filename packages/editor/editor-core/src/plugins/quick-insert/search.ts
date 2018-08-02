import { QuickInsertItem } from './types';

export function distance(str1, str2) {
  const lowerStr2 = str2.toLowerCase().replace(/\s/g, '');
  return str1
    .replace(/\s/g, '')
    .toLowerCase()
    .split('')
    .reduce(
      (acc, char, index) => {
        if (acc.dist === Infinity) {
          return acc;
        }

        const indexInStr2 = lowerStr2.indexOf(char, acc.offset);

        if (indexInStr2 === -1) {
          return { dist: Infinity, offset: 0 };
        }

        return {
          offset: indexInStr2 + 1,
          dist:
            acc.dist +
            (index !== indexInStr2 ? Math.abs(index - indexInStr2) : 0),
        };
      },
      { dist: 0, offset: 0 },
    ).dist;
}

export function find(query, items) {
  const getItemSearchStrings = (item: QuickInsertItem) =>
    item.keywords ? [item.title].concat(item.keywords) : [item.title];

  const itemsWithDistances = items
    .sort((a, b) => {
      const aPriority = a.priority || Number.POSITIVE_INFINITY;
      const bPriority = b.priority || Number.POSITIVE_INFINITY;
      const priorityDiff = bPriority - aPriority;
      return priorityDiff
        ? priorityDiff
        : a.title > b.title
          ? -1
          : a.title < b.title
            ? 1
            : 0;
    })
    .map(item => {
      const dist = getItemSearchStrings(item).reduce((acc, keyword) => {
        const interimDist = distance(query, keyword);
        return interimDist < acc ? interimDist : acc;
      }, Infinity);

      return { item, dist };
    });

  const res = itemsWithDistances
    .filter(item => item.dist !== Infinity)
    .sort((a, b) => {
      const aPriority = a.item.priority || Number.POSITIVE_INFINITY;
      const bPriority = b.item.priority || Number.POSITIVE_INFINITY;
      return a.dist > b.dist ? 1 : a.dist < b.dist ? -1 : aPriority - bPriority;
    });

  return res.map(item => item.item);
}
