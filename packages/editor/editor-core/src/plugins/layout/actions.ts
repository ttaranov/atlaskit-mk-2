import { safeInsert } from 'prosemirror-utils';
import { Node, Fragment, Slice } from 'prosemirror-model';
import { Command } from '../../types';
import { pluginKey, LayoutState } from './pm-plugins/main';
import { EditorState, Transaction } from 'prosemirror-state';
import { mapChildren } from '../../utils/slice';
import { isEmptyDocument } from '../../utils';

export type PredefinedLayout = 'two_equal' | 'three_equal';

const PredefinedLayoutFilters = (
  widths,
): { [key in PredefinedLayout]: boolean } => {
  return {
    two_equal: widths.length === 2 && widths.every(width => width === 50),
    three_equal: widths.length === 3 && widths.every(width => width === 33.33),
  };
};

export const getPredefinedLayout = (section: Node) => {
  const widths = mapChildren(section, column => column.attrs.width);
  const matchingFilters = PredefinedLayoutFilters(widths);
  return Object.keys(matchingFilters).find(name => matchingFilters[name]);
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

// FIXME: update column widths
export function forceSectionToPredefinedLayout(
  state: EditorState,
  node: Node,
  pos: number,
  predefinedLayout: PredefinedLayout,
): Transaction | undefined {
  const tr = state.tr;
  if (predefinedLayout === 'two_equal' && node.childCount === 3) {
    const thirdColumn = node.content.child(2);
    const insideRightEdgeOfLayoutSection = pos + node.nodeSize - 1;
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
  } else if (predefinedLayout === 'three_equal' && node.childCount === 2) {
    const insideRightEdgeOfLayoutSection = pos + node.nodeSize - 1;
    tr.replaceWith(
      tr.mapping.map(insideRightEdgeOfLayoutSection),
      tr.mapping.map(insideRightEdgeOfLayoutSection),
      state.schema.nodes.layoutColumn.createAndFill() as Node,
    );
  }
  return tr.docChanged ? tr : undefined;
}

export const setPredefinedLayout = (layout: PredefinedLayout): Command => (
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
  const tr = forceSectionToPredefinedLayout(state, node, pos, layout);
  if (tr) {
    dispatch(tr);
    return true;
  }

  return false;
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
