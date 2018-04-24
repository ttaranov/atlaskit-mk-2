export function distance(str1, str2) {
  const lowerStr2 = str2.toLowerCase();
  return str1
    .toLowerCase()
    .split('')
    .reduce((dist, char, index) => {
      const indexInStr2 = lowerStr2.indexOf(char);
      if (indexInStr2 === -1) {
        return Infinity;
      }

      if (index === indexInStr2) {
        return dist;
      }

      return dist + Math.abs(index - indexInStr2);
    }, 0);
}

export function find(query, items, extractSearchString = item => item) {
  const itemsWithDistances = items.map(item => {
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
