// @flow
import type { DragState } from './Tree-types';
import { getTreePosition } from '../../utils/tree';
import { getDestinationPath, getSourcePath } from '../../utils/flat-tree';
import type {
  Path,
  TreeSourcePosition,
  TreeDestinationPosition,
  TreeData,
  FlattenedTree,
} from '../../types';

/*
    Translates a drag&drop movement from a purely index based flat list style to tree-friendly `TreePosition` data structure 
    to make it available in the onDragEnd callback.  
*/
export const calculateFinalDropPositions = (
  tree: TreeData,
  flattenedTree: FlattenedTree,
  dragState: DragState,
): {
  sourcePosition: TreeSourcePosition,
  destinationPosition: ?TreeDestinationPosition,
} => {
  const { source, destination, combine, horizontalLevel } = dragState;
  const sourcePath: Path = getSourcePath(flattenedTree, source.index);
  const sourcePosition: TreeSourcePosition = getTreePosition(tree, sourcePath);

  if (combine) {
    return {
      sourcePosition,
      destinationPosition: {
        parentId: combine.draggableId,
      },
    };
  }

  if (!destination) {
    return { sourcePosition, destinationPosition: null };
  }

  const destinationPath: Path = getDestinationPath(
    flattenedTree,
    source.index,
    destination.index,
    horizontalLevel,
  );
  const destinationPosition: ?TreeDestinationPosition = getTreePosition(
    tree,
    destinationPath,
  );
  return { sourcePosition, destinationPosition };
};
