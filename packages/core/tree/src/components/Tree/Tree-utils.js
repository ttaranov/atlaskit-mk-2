// @flow
import type { DragState } from './Tree-types';
import { getTreePosition } from '../../utils/tree';
import { getDestinationPath, getSourcePath } from '../../utils/flat-tree';
import type { Path, TreePosition, TreeData, FlattenedTree } from '../../types';

/*
    Translates a drag&drop movement from a purely index based flat list style to tree-friendly `TreePosition` data structure 
    to make it available in the onDragEnd callback.  
*/
export const calculateFinalDropPositions = (
  tree: TreeData,
  flattenedTree: FlattenedTree,
  dragState: DragState,
): { sourcePosition: TreePosition, destinationPosition: ?TreePosition } => {
  const { source, destination, horizontalLevel } = dragState;
  const sourcePath: Path = getSourcePath(flattenedTree, source.index);
  const sourcePosition: TreePosition = getTreePosition(tree, sourcePath);

  if (!destination) {
    return { sourcePosition, destinationPosition: null };
  }

  const destinationPath: Path = getDestinationPath(
    flattenedTree,
    source.index,
    destination.index,
    horizontalLevel,
  );
  const destinationPosition: ?TreePosition = getTreePosition(
    tree,
    destinationPath,
  );
  return { sourcePosition, destinationPosition };
};
