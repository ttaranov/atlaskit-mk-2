export const shallowEqual = (objA: Object, objB: Object) => {
  if (objA === objB) {
    return true;
  }

  const keysA = Object.keys(objA);
  const keysB = Object.keys(objB);

  if (keysA.length !== keysB.length) {
    return false;
  }

  const bHasOwnProperty = Object.prototype.hasOwnProperty.bind(objB);

  for (let idx = 0; idx < keysA.length; idx++) {
    const key = keysA[idx];

    if (!bHasOwnProperty(key)) {
      return false;
    }

    if (objA[key] !== objB[key]) {
      return false;
    }
  }

  return true;
};

export const compareArrays = (left: Array<any>, right: Array<any>) => {
  if (left.length !== right.length) {
    return false;
  }

  for (let idx = 0; idx < left.length; idx++) {
    if (!shallowEqual(left[idx], right[idx])) {
      return false;
    }
  }

  return true;
};
