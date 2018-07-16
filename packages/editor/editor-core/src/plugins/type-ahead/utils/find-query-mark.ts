import { MarkType, Node } from 'prosemirror-model';

export function findQueryMark(
  mark: MarkType,
  doc: Node,
  from: number,
  to: number,
) {
  let queryMark = { start: -1, end: -1 };
  doc.nodesBetween(from, to, (node, pos) => {
    if (queryMark.start === -1 && mark.isInSet(node.marks)) {
      queryMark = {
        start: pos,
        end: pos + node.textContent.length,
      };
    }
  });

  return queryMark;
}
