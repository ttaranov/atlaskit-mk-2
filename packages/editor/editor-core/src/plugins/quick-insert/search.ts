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

export function find(query, items, extractSearchString = item => item) {
  const itemsWithDistances = items
    .sort((a, b) => {
      const aStr = extractSearchString(a);
      const bStr = extractSearchString(b);
      return aStr > bStr ? 1 : aStr < bStr ? -1 : 0;
    })
    .map(item => {
      return {
        item,
        dist: distance(query, extractSearchString(item)),
      };
    });

  return itemsWithDistances
    .filter(item => item.dist !== Infinity)
    .sort((a, b) => (a.dist > b.dist ? 1 : a.dist < b.dist ? -1 : 0))
    .map(item => item.item);
}
