import { Node, Mark, MarkType } from 'prosemirror-model';
import { SelectionRange } from 'prosemirror-state';

export const isMarkAllowedInRange = (
  doc: Node,
  ranges: Array<SelectionRange>,
  type: MarkType,
): boolean => {
  for (let i = 0; i < ranges.length; i++) {
    const { $from, $to } = ranges[i];
    let can = $from.depth === 0 ? doc.type.allowsMarkType(type) : false;
    doc.nodesBetween($from.pos, $to.pos, node => {
      if (can) {
        return false;
      }
      can = node.inlineContent && node.type.allowsMarkType(type);
    });
    if (can) {
      return can;
    }
  }
  return false;
};

export const isMarkExcluded = (
  type: MarkType,
  marks?: Array<Mark> | null,
): boolean => {
  if (marks) {
    return marks.some(mark => mark.type !== type && mark.type.excludes(type));
  }
  return false;
};
