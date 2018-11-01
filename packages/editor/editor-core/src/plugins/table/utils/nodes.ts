import { Node as PmNode } from 'prosemirror-model';
import { EditorState, Selection } from 'prosemirror-state';
import { TableMap } from 'prosemirror-tables';
import { findTable, hasParentNodeOfType } from 'prosemirror-utils';
import { pluginKey } from '../pm-plugins/main';

export const isIsolating = (node: PmNode): boolean => {
  return !!node.type.spec.isolating;
};

export const containsHeaderColumn = (
  state: EditorState,
  table: PmNode,
): boolean => {
  const { tableHeader } = state.schema.nodes;
  let contains = true;
  table.content.forEach(row => {
    if (row.firstChild!.type !== tableHeader) {
      contains = false;
    }
  });
  return contains;
};

export const containsHeaderRow = (
  state: EditorState,
  table: PmNode,
): boolean => {
  const map = TableMap.get(table);
  for (let i = 0; i < map.width; i++) {
    const cell = table.nodeAt(map.map[i]);
    if (cell && cell.type !== state.schema.nodes.tableHeader) {
      return false;
    }
  }
  return true;
};

export function filterNearSelection<T, U>(
  state: EditorState,
  findNode: (selection: Selection) => { pos: number; node: PmNode } | undefined,
  predicate: (state: EditorState, node: PmNode, pos?: number) => T,
  defaultValue: U,
): T | U {
  const found = findNode(state.selection);
  if (!found) {
    return defaultValue;
  }

  return predicate(state, found.node, found.pos);
}

export const checkIfHeaderColumnEnabled = (state: EditorState): boolean =>
  filterNearSelection(state, findTable, containsHeaderColumn, false);

export const checkIfHeaderRowEnabled = (state: EditorState): boolean =>
  filterNearSelection(state, findTable, containsHeaderRow, false);

export const checkIfNumberColumnEnabled = (state: EditorState): boolean =>
  filterNearSelection(
    state,
    findTable,
    (_, table) => !!table.attrs.isNumberColumnEnabled,
    false,
  );

export const isLayoutSupported = (state: EditorState): boolean => {
  const { permittedLayouts } = pluginKey.getState(state).pluginConfig;
  const { bodiedExtension, layoutSection } = state.schema.nodes;

  return (
    !hasParentNodeOfType([layoutSection, bodiedExtension])(state.selection) &&
    permittedLayouts &&
    (permittedLayouts === 'all' ||
      (permittedLayouts.indexOf('default') > -1 &&
        permittedLayouts.indexOf('wide') > -1 &&
        permittedLayouts.indexOf('full-page') > -1))
  );
};
