//@flow
import type { Path } from '../types';

/*
  Checking if two given path are equal
 */
export const isSamePath = (a: Path, b: Path): boolean => {
  if (a === b) {
    return true;
  }
  return a.length === b.length && a.every((v, i) => v === b[i]);
};

/*
  Checks if the two paths have the same parent
 */
export const hasSameParent = (a: Path, b: Path): boolean =>
  isSamePath(getParentPath(a), getParentPath(b));

/*
  Calculates the parent path for a path
*/
export const getParentPath = (child: Path): Path =>
  child.slice(0, child.length - 1);

/*
  It checks if the item is on top of a sub tree based on the two neighboring items, which are above or below the item.
*/
export const isTopOfSubtree = (abovePath: ?Path, belowPath: Path) =>
  !abovePath || isParentOf(abovePath, belowPath);

const isParentOf = (parent: Path, child: Path): boolean =>
  isSamePath(parent, getParentPath(child));
