import { Transaction } from 'prosemirror-state';
import { filterChildrenBetween } from '../../../utils';

const SMART_TO_ASCII = {
  '…': '...',
  '→': '->',
  '←': '<-',
  '–': '--',
  '“': '"',
  '”': '"',
  '‘': "'",
  '’': "'",
};

const FIND_SMART_CHAR = new RegExp(
  `[${Object.keys(SMART_TO_ASCII).join('')}]`,
  'g',
);

export function transformToCodeAction(
  from: number,
  to: number,
  tr: Transaction,
): Transaction {
  const { schema } = tr.doc.type;
  const { mention, text, emoji } = schema.nodes;

  // Traverse through all the nodes within the range and replace them with their plaintext counterpart
  const children = filterChildrenBetween(
    tr.doc,
    from,
    to,
    (node, _, parent) => {
      if (node.type === mention || node.type === emoji || node.type === text) {
        return parent.isTextblock;
      }
    },
  );

  children.forEach(({ node, pos }) => {
    if (node.type === mention || node.type === emoji) {
      const currentPos = tr.mapping.map(pos);
      tr.replaceWith(
        currentPos,
        currentPos + node.nodeSize,
        schema.text(node.attrs.text),
      );
    } else if (node.type === text) {
      if (node.text) {
        const start = pos > from ? pos : from;
        const text = node.text.substr(start - 1);
        let match: RegExpExecArray | null;
        while ((match = FIND_SMART_CHAR.exec(text))) {
          const { 0: smartChar, index: offset } = match;
          const replacePos = tr.mapping.map(start + offset);
          const replacementText = schema.text(SMART_TO_ASCII[smartChar]);
          tr.replaceWith(
            replacePos,
            replacePos + smartChar.length,
            replacementText,
          );
        }
      }
    }
  });

  if (schema.marks.code) {
    const codeMark = schema.marks.code.create();
    tr
      .addMark(tr.mapping.map(from), tr.mapping.map(to), codeMark)
      .setStoredMarks([codeMark]);
  }
  return tr;
}
