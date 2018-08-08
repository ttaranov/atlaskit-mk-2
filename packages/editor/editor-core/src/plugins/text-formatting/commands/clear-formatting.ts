import { EditorState, Transaction } from 'prosemirror-state';
import { liftTarget } from 'prosemirror-transform';
import { Command } from '../../../commands';

export const FORMATTING_NODE_TYPES = [
  'heading',
  'codeBlock',
  'blockquote',
  'panel',
];
export const FORMATTING_MARK_TYPES = [
  'em',
  'code',
  'strike',
  'strong',
  'underline',
  'textColor',
  'subsup',
];

export function clearFormatting(): Command {
  return function(
    state: EditorState,
    dispatch: (tr: Transaction) => void,
  ): boolean {
    const { tr } = state;

    FORMATTING_MARK_TYPES.forEach(mark => {
      const { from, to } = tr.selection;
      if (state.schema.marks[mark]) {
        tr.removeMark(from, to, state.schema.marks[mark]);
      }
    });

    FORMATTING_NODE_TYPES.forEach(nodeName => {
      const formattedNodeType = state.schema.nodes[nodeName];
      const { $from, $to } = tr.selection;
      tr.doc.nodesBetween($from.pos, $to.pos, (node, pos) => {
        if (node.hasMarkup(formattedNodeType)) {
          if (formattedNodeType.isTextblock) {
            tr.setNodeMarkup(pos, state.schema.nodes.paragraph);
            return false;
          } else {
            let fromPos = tr.doc.resolve(pos + 1);
            let toPos = tr.doc.resolve(pos + node.nodeSize - 1);
            const nodeRange = fromPos.blockRange(toPos);
            if (nodeRange) {
              const targetLiftDepth = liftTarget(nodeRange);
              if (targetLiftDepth || targetLiftDepth === 0) {
                tr.lift(nodeRange, targetLiftDepth!);
              }
            }
          }
        }
        return true;
      });
    });

    tr.setStoredMarks([]);
    dispatch(tr);
    return true;
  };
}
