import { hasParentNodeOfType, findParentNodeOfType } from 'prosemirror-utils';
import { EditorView } from 'prosemirror-view';
import { EditorState, Transaction } from 'prosemirror-state';
import { AlignmentState } from '../pm-plugins/main';

export const canApplyAlignment = (view: EditorView): boolean => {
  const { schema, selection } = view.state;

  const parent = selection.$from.node(selection.$from.depth - 1);
  const isParentInTable =
    parent &&
    (parent.type === schema.nodes.tableCell ||
      parent.type === schema.nodes.tableHeader);

  return (
    !!hasParentNodeOfType([schema.nodes.heading, schema.nodes.paragraph])(
      selection,
    ) &&
    (isParentInTable || view.state.selection.$from.depth === 1)
  );
};

export const removeAlignment = (
  state: EditorState,
): Transaction | undefined => {
  const { selection, schema } = state;
  let { tr } = state;

  /** Saves an extra dispatch */
  let alignmentExists = false;

  /**
   * When you need to toggle the selection
   * when another type which does not allow alignment is applied
   */
  state.doc.nodesBetween(selection.from, selection.to, (node, pos) => {
    if (
      node.type === state.schema.nodes.paragraph &&
      node.marks.some(mark => mark.type === schema.marks.alignment)
    ) {
      alignmentExists = true;
      const resolvedPos = state.doc.resolve(pos);
      const withoutAlignmentMark = node.marks.filter(
        mark => mark.type !== schema.marks.alignment,
      );
      tr = tr.setNodeMarkup(
        resolvedPos.pos,
        undefined,
        node.attrs,
        withoutAlignmentMark,
      );
    }
  });
  return alignmentExists ? tr : undefined;
};

export const isAlignmentAllowed = (state, node, resolvedPos) => {
  /**
   * Alignment is allowed under the following conditions
   */

  const { schema } = state;
  const { depth, parent } = resolvedPos;

  const isParagraphOrHeading =
    node.type === schema.nodes.paragraph || node.type === schema.nodes.heading;

  /** Case 1: Is top level paragraphs */
  const isTopLevelParagraphInDoc = depth === 0 && isParagraphOrHeading;

  /** Case 2: Inside table cells on para */
  const isTopLevelParagraphInTable =
    parent &&
    isParagraphOrHeading &&
    (parent.type === schema.nodes.tableCell ||
      parent.type === schema.nodes.tableHeader);

  /** Case 3: Inside layouts */
  const isTopLevelParagraphInLayouts =
    parent && isParagraphOrHeading && parent.type === schema.nodes.layoutColumn;

  return (
    isTopLevelParagraphInDoc ||
    isTopLevelParagraphInTable ||
    isTopLevelParagraphInLayouts
  );
};

export const getActiveAlignment = (state): AlignmentState | undefined => {
  const node = findParentNodeOfType([
    state.schema.nodes.paragraph,
    state.schema.nodes.heading,
  ])(state.selection);
  const getMark =
    node &&
    node.node.marks.filter(
      mark => mark.type === state.schema.marks.alignment,
    )[0];

  return (getMark && getMark.attrs.align) || 'left';
};
