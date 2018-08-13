//@flow
import type { Path, FlattenedTree } from '../types';

import {
  isTopOfSubtree,
  hasSameParent,
  getPathOnLevel,
  moveAfterPath,
} from './path';

export const getFlatItemPath = (
  flattenedTree: FlattenedTree,
  sourceIndex: number,
): Path => flattenedTree[sourceIndex].path;

/*
  Calculates the source path after drag&drop ends
 */
export const getSourcePath = getFlatItemPath;

/*
    Calculates the destination path after drag&drop ends
  
    During dragging the items are displaced based on the location of the dragged item.
    Displacement depends on which direction the item is coming from.
  
    index
          -----------        -----------
    0     | item 0           | item 1 (displaced)
          -----------        -----------
    1     | item 1           | item 2 (displaced)
          -----------  --->  -----------      -----------
    2     | item 2                            | item 0 (dragged)
          -----------        -----------      -----------
    3     | item 3           | item 3
          -----------        -----------
  
   */
export const getDestinationPath = (
  flattenedTree: FlattenedTree,
  sourceIndex: number,
  destinationIndex: number,
  // level on the tree, starting from 1.
  level: ?number,
): Path => {
  // Moving down
  const down: boolean = destinationIndex > sourceIndex;
  // Path of the source location
  const sourcePath: Path = getSourcePath(flattenedTree, sourceIndex);
  // Stayed at the same place
  const sameIndex: boolean = destinationIndex === sourceIndex;
  // Stayed on the same level
  const sameLevel: boolean = !level || level === sourcePath.length;
  // Path of the upper item where the item was dropped
  const upperPath: ?Path = down
    ? flattenedTree[destinationIndex].path
    : flattenedTree[destinationIndex - 1] &&
      flattenedTree[destinationIndex - 1].path;
  // Path of the lower item where the item was dropped
  const lowerPath: ?Path =
    down || sameIndex
      ? flattenedTree[destinationIndex + 1] &&
        flattenedTree[destinationIndex + 1].path
      : flattenedTree[destinationIndex].path;

  if (sameIndex && sameLevel) {
    // We do nothing
    return sourcePath;
  }

  /*
      We are going to differentiate between 3 cases:
        - item moved to the top of a list
        - item moved between two items on the same level
        - item moved to the end of list. This is an ambiguous case.
     */

  // Top of the list
  if (lowerPath && isTopOfSubtree(upperPath, lowerPath)) {
    if (sameIndex) {
      return sourcePath;
    }
    return lowerPath;
  }

  // Between two items on the same level
  if (upperPath && lowerPath && hasSameParent(upperPath, lowerPath)) {
    if (sameIndex) {
      return sourcePath;
    }
    if (down && hasSameParent(upperPath, sourcePath)) {
      // if item was moved down within the list, it will replace the displaced item
      return upperPath;
    }
    return lowerPath;
  }

  if (upperPath) {
    // End of list
    // this means that the upper item is deeper in the tree.
    const finalLevel = calculateFinalLevel(
      upperPath,
      lowerPath,
      sourcePath,
      level,
    );

    if (finalLevel === upperPath.length) {
      // Insert to the upper list
      return moveAfterPath(upperPath, sourcePath);
    }

    // Insert to higher levels
    const previousPathOnTheFinalLevel: Path = getPathOnLevel(
      upperPath,
      finalLevel,
    );
    return moveAfterPath(previousPathOnTheFinalLevel, sourcePath);
  }

  // Impossible case
  return sourcePath;
};

const calculateFinalLevel = (
  upperPath: Path,
  lowerPath: ?Path,
  sourcePath: Path,
  level: ?number,
): number => {
  const upperLevel: number = upperPath.length;
  const lowerLevel: number = lowerPath ? lowerPath.length : 1;
  const sourceLevel: number = sourcePath.length;
  if (typeof level === 'number') {
    // Explicit disambiguation based on level
    // Final level has to be between the levels of bounding items, inclusive
    return Math.min(upperLevel, Math.max(lowerLevel, level));
  }
  // Automatic disambiguation based on the initial level
  return sourceLevel <= lowerLevel ? lowerLevel : upperLevel;
};
