import {
  EditorState,
  Selection,
  TextSelection,
  Transaction,
} from 'prosemirror-state';
import { goToNextCell as baseGotoNextCell, TableMap } from 'prosemirror-tables';
import { findTable, findParentNodeOfType } from 'prosemirror-utils';
import { Command } from '../../types';
import { analyticsService } from '../../analytics';
import { stateKey } from './pm-plugins/main';
import { insertRow } from './actions';
import { createTableNode, isIsolating } from './utils';
import { outdentList } from '../../commands';

const TAB_FORWARD_DIRECTION = 1;
const TAB_BACKWARD_DIRECTION = -1;

const createTable = (): Command => {
  return (state: EditorState, dispatch: (tr: Transaction) => void): boolean => {
    const pluginState = stateKey.getState(state);
    if (pluginState.tableDisabled || pluginState.tableElement) {
      return false;
    }
    pluginState.focusEditor();
    const table = createTableNode(3, 3, state.schema);
    const {
      tr,
      selection: { $from },
      storedMarks,
    } = state;
    const marks =
      storedMarks && storedMarks.length ? storedMarks : $from.marks();
    if (marks && marks.length) {
      // @see https://product-fabric.atlassian.net/browse/ED-3516
      tr.setStoredMarks([]);
    }
    dispatch(
      tr
        .replaceSelectionWith(table)
        .setSelection(Selection.near(tr.doc.resolve($from.pos)))
        .scrollIntoView(),
    );
    return true;
  };
};

const goToNextCell = (direction: number): Command => {
  return (state: EditorState, dispatch: (tr: Transaction) => void): boolean => {
    const table = findTable(state.selection);
    if (!table) {
      return false;
    }
    const pluginState = stateKey.getState(state);
    const map = TableMap.get(table.node);
    const { tableCell, tableHeader } = state.schema.nodes;
    const cell = findParentNodeOfType([tableCell, tableHeader])(
      state.selection,
    )!;
    const firstCellPos = map.positionAt(0, 0, table.node) + table.pos + 1;
    const lastCellPos =
      map.positionAt(map.height - 1, map.width - 1, table.node) + table.pos + 1;

    const event =
      direction === TAB_FORWARD_DIRECTION ? 'next_cell' : 'previous_cell';
    analyticsService.trackEvent(
      `atlassian.editor.format.table.${event}.keyboard`,
    );

    if (firstCellPos === cell.pos && direction === TAB_BACKWARD_DIRECTION) {
      insertRow(0)(state, dispatch);
      return true;
    }

    if (lastCellPos === cell.pos && direction === TAB_FORWARD_DIRECTION) {
      insertRow(map.height)(state, dispatch);
      return true;
    }
    if (!pluginState.view.hasFocus()) {
      pluginState.view.focus();
    }
    const result = baseGotoNextCell(direction)(state, dispatch);
    // cancel text selection that is created by default
    if (result) {
      const latestState = pluginState.view.state;
      dispatch(
        latestState.tr.setSelection(
          Selection.near(latestState.selection.$from),
        ),
      );
    }
    return result;
  };
};

const moveCursorBackward = (): Command => {
  return (state: EditorState, dispatch: (tr: Transaction) => void): boolean => {
    const pluginState = stateKey.getState(state);
    const { $cursor } = state.selection as TextSelection;
    // if cursor is in the middle of a text node, do nothing
    if (
      !$cursor ||
      (pluginState.view
        ? !pluginState.view.endOfTextblock('backward', state)
        : $cursor.parentOffset > 0)
    ) {
      return false;
    }

    // find the node before the cursor
    let before;
    let cut;
    if (!isIsolating($cursor.parent)) {
      for (let i = $cursor.depth - 1; !before && i >= 0; i--) {
        if ($cursor.index(i) > 0) {
          cut = $cursor.before(i + 1);
          before = $cursor.node(i).child($cursor.index(i) - 1);
        }
        if (isIsolating($cursor.node(i))) {
          break;
        }
      }
    }

    // if the node before is not a table node - do nothing
    if (!before || before.type !== state.schema.nodes.table) {
      return false;
    }

    // ensure we're just at a top level paragraph
    // otherwise, perform regular backspace behaviour
    const grandparent = $cursor.node($cursor.depth - 1);
    const { listItem } = state.schema.nodes;

    if (
      $cursor.parent.type !== state.schema.nodes.paragraph ||
      (grandparent && grandparent.type !== state.schema.nodes.doc)
    ) {
      if (grandparent && grandparent.type === listItem) {
        return outdentList()(state, dispatch);
      } else {
        return false;
      }
    }

    const { tr } = state;
    const lastCellPos = cut - 4;
    // need to move cursor inside the table to be able to calculate table's offset
    tr.setSelection(new TextSelection(state.doc.resolve(lastCellPos)));
    const { $from } = tr.selection;
    const start = $from.start(-1);
    const pos = start + $from.parent.nodeSize - 1;
    // move cursor to the last cell
    // it doesn't join node before (last cell) with node after (content after the cursor)
    // due to ridiculous amount of PM code that would have been required to overwrite
    dispatch(tr.setSelection(new TextSelection(state.doc.resolve(pos))));

    return true;
  };
};

export default {
  createTable,
  goToNextCell,
  moveCursorBackward,
};
