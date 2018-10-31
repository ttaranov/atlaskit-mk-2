import { safeInsert } from 'prosemirror-utils';
import { Node, Fragment, Slice, Schema } from 'prosemirror-model';
import { Command } from '../../types';
import { pluginKey, LayoutState } from './pm-plugins/main';
import { EditorState, Transaction } from 'prosemirror-state';
import { mapChildren, flatmap } from '../../utils/slice';
import { isEmptyDocument, getStepRange } from '../../utils';

export type PresetLayout = 'two_equal' | 'three_equal';

export const getPresetLayout = (section: Node): PresetLayout | undefined => {
  const widths = mapChildren(section, column => column.attrs.width);
  if (widths.length === 2 && widths.every(width => width === 50)) {
    return 'two_equal';
  } else if (widths.every(width => Number(width.toFixed(2)) === 33.33)) {
    return 'three_equal';
  }
};

export const createDefaultLayoutSection = (state: EditorState) => {
  const { layoutSection, layoutColumn } = state.schema.nodes;

  // create a 50-50 layout by default
  const columns = Fragment.fromArray([
    layoutColumn.createAndFill({ width: 50 }) as Node,
    layoutColumn.createAndFill({ width: 50 }) as Node,
  ]);

  return layoutSection.createAndFill(undefined, columns) as Node;
};

export const insertLayoutColumns: Command = (state, dispatch) => {
  dispatch(safeInsert(createDefaultLayoutSection(state))(state.tr));
  return true;
};

function forceColumnStructure(
  state: EditorState,
  node: Node,
  pos: number,
  presetLayout: PresetLayout,
): Transaction {
  const tr = state.tr;
  const insideRightEdgeOfLayoutSection = pos + node.nodeSize - 1;

  if (presetLayout === 'two_equal' && node.childCount === 3) {
    const thirdColumn = node.content.child(2);
    const thirdColumnPos =
      insideRightEdgeOfLayoutSection - thirdColumn.nodeSize;
    if (isEmptyDocument(thirdColumn)) {
      tr.replaceRange(
        // end pos of second column
        tr.mapping.map(thirdColumnPos - 1),
        tr.mapping.map(insideRightEdgeOfLayoutSection),
        Slice.empty,
      );
    } else {
      tr.replaceRange(
        // end pos of second column
        tr.mapping.map(thirdColumnPos - 1),
        // start pos of third column
        tr.mapping.map(thirdColumnPos + 1),
        Slice.empty,
      );
    }
  } else if (presetLayout === 'three_equal' && node.childCount === 2) {
    tr.replaceWith(
      tr.mapping.map(insideRightEdgeOfLayoutSection),
      tr.mapping.map(insideRightEdgeOfLayoutSection),
      state.schema.nodes.layoutColumn.createAndFill() as Node,
    );
  }

  return tr;
}

function equalColumnWidth(node: Node, schema: Schema, width: number): Fragment {
  const { layoutColumn } = schema.nodes;
  const truncatedWidth = Number(width.toFixed(2));

  return flatmap(node.content, column =>
    layoutColumn.create(
      {
        ...column.attrs,
        width: truncatedWidth,
      },
      column.content,
      column.marks,
    ),
  );
}

function forceColumnWidths(
  state: EditorState,
  tr: Transaction,
  pos: number,
  presetLayout: PresetLayout,
) {
  const width = presetLayout === 'two_equal' ? 50 : 33.33;
  const node = tr.doc.nodeAt(pos);
  if (!node) {
    return tr;
  }

  if (getPresetLayout(node) === presetLayout) {
    return tr;
  }

  return tr.replaceWith(
    pos + 1,
    pos + node.nodeSize - 1,
    equalColumnWidth(node, state.schema, width),
  );
}

export function forceSectionToPresetLayout(
  state: EditorState,
  node: Node,
  pos: number,
  presetLayout: PresetLayout,
): Transaction {
  const tr = forceColumnStructure(state, node, pos, presetLayout);

  // save the selection here, since forcing column widths causes a change over the
  // entire layoutSection, which remaps selection to the end. not remapping here
  // is safe because the structure is no longer changing.
  const selection = tr.selection;

  return forceColumnWidths(state, tr, pos, presetLayout).setSelection(
    selection,
  );
}

export const setPresetLayout = (layout: PresetLayout): Command => (
  state,
  dispatch,
) => {
  const { pos } = pluginKey.getState(state) as LayoutState;
  if (pos === null) {
    return false;
  }

  const node = state.doc.nodeAt(pos);
  if (!node) {
    return false;
  }
  const tr = forceSectionToPresetLayout(state, node, pos, layout);
  if (tr) {
    dispatch(tr.scrollIntoView());
    return true;
  }

  return false;
};

export const fixColumnSizes = (changedTr: Transaction, state: EditorState) => {
  const { layoutSection } = state.schema.nodes;
  let change;
  const range = getStepRange(changedTr);
  if (!range) {
    return undefined;
  }

  changedTr.doc.nodesBetween(range.from, range.to, (node, pos) => {
    if (node.type === layoutSection) {
      const widths = mapChildren(node, column => column.attrs.width);
      const totalWidth = Math.round(
        widths.reduce((acc, width) => acc + width, 0),
      );
      if (totalWidth !== 100) {
        const fixedColumns = equalColumnWidth(
          node,
          state.schema,
          100 / node.childCount,
        );
        change = {
          from: pos + 1,
          to: pos + node.nodeSize - 1,
          slice: new Slice(fixedColumns, 0, 0),
        };

        return false;
      }
    } else {
      return true;
    }
  });

  return change;
};

export const deleteActiveLayoutNode: Command = (state, dispatch) => {
  const { pos } = pluginKey.getState(state) as LayoutState;
  if (pos !== null) {
    const node = state.doc.nodeAt(pos) as Node;
    dispatch(state.tr.delete(pos, pos + node.nodeSize));
    return true;
  }
  return false;
};
