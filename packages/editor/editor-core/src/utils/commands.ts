import { EditorState, Transaction } from 'prosemirror-state';
import { EditorView } from 'prosemirror-view';
import { ResolvedPos } from 'prosemirror-model';

type Command = (
  state: EditorState,
  dispatch: (tr: Transaction) => void,
  view?: EditorView,
) => boolean;
type Predicate = (state: EditorState, view?: EditorView) => boolean;

const filter = (predicates: Predicate[] | Predicate, cmd: Command): Command => {
  return function(
    state: EditorState,
    dispatch: (tr: Transaction) => void,
    view?: EditorView,
  ): boolean {
    if (!Array.isArray(predicates)) {
      predicates = [predicates];
    }

    if (predicates.some(pred => !pred(state, view))) {
      return false;
    }

    return cmd(state, dispatch, view) || false;
  };
};

const isEmptySelectionAtStart = (
  state: EditorState,
  view?: EditorView,
): boolean => {
  const { empty, $from } = state.selection;
  return empty && $from.parentOffset === 0;
};

const isFirstChildOfParent = (
  state: EditorState,
  view?: EditorView,
): boolean => {
  const { $from } = state.selection;
  return $from.depth > 1 ? $from.index($from.depth - 1) === 0 : true;
};

/**
 * Creates a filter that checks if the node at a given number of parents above the current
 * selection is of the correct node type.
 * @param nodeType The node type to compare the nth parent against
 * @param depthAway How many levels above the current node to check against. 0 refers to
 * the current selection's parent, which will be the containing node when the selection
 * is usually inside the text content.
 */
const isNthParentOfType = (
  nodeType,
  depthAway,
): ((state: EditorState, view?: EditorView) => boolean) => {
  return (state: EditorState, view?: EditorView): boolean => {
    const { $from } = state.selection;
    const parent = $from.node($from.depth - depthAway);

    return !!parent && parent.type === state.schema.nodes[nodeType];
  };
};

// https://github.com/ProseMirror/prosemirror-commands/blob/master/src/commands.js#L90
// Keep going left up the tree, without going across isolating boundaries, until we
// can go along the tree at that same level
//
// You can think of this as, if you could construct each document like we do in the tests,
// return the position of the first ) backwards from the current selection.
function findCutBefore($pos: ResolvedPos): ResolvedPos | null {
  // parent is non-isolating, so we can look across this boundary
  if (!$pos.parent.type.spec.isolating) {
    // search up the tree from the pos's *parent*
    for (let i = $pos.depth - 1; i >= 0; i--) {
      // starting from the inner most node's parent, find out
      // if we're not its first child
      if ($pos.index(i) > 0) {
        return $pos.doc.resolve($pos.before(i + 1));
      }

      if ($pos.node(i).type.spec.isolating) {
        break;
      }
    }
  }

  return null;
}

export {
  filter,
  isEmptySelectionAtStart,
  isFirstChildOfParent,
  isNthParentOfType,
  findCutBefore,
};
