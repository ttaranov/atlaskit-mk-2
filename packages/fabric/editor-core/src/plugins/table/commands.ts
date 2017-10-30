import { EditorState, Selection, TextSelection, Transaction } from 'prosemirror-state';
import { CellSelection, goToNextCell as baseGotoNextCell, TableMap } from 'prosemirror-tables';
import { stateKey } from './';
import { createTableNode, isIsolating } from './utils';
import { analyticsService } from '../../analytics';

export interface Command {
  (state: EditorState, dispatch?: (tr: Transaction) => void): boolean;
}

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
    const tr = state.tr.replaceSelectionWith(table);
    tr.setSelection(Selection.near(tr.doc.resolve(state.selection.from)));
    dispatch(tr.scrollIntoView());
    return true;
  };
};

const goToNextCell = (direction: number): Command => {
  return (state: EditorState, dispatch: (tr: Transaction) => void): boolean => {
    const pluginState = stateKey.getState(state);
    if (!pluginState.tableNode) {
      return false;
    }
    const offset = pluginState.tableStartPos();
    if (!offset) {
      return false;
    }
    const map = TableMap.get(pluginState.tableNode);
    const start = pluginState.getCurrentCellStartPos();
    const firstCellPos =  map.positionAt(0, 0, pluginState.tableNode) + offset + 1;
    const lastCellPos =  map.positionAt(map.height - 1, map.width - 1, pluginState.tableNode) + offset + 1;

    const event = direction === TAB_FORWARD_DIRECTION ? 'next_cell' : 'previous_cell';
    analyticsService.trackEvent(`atlassian.editor.format.table.${event}.keyboard`);

    if (firstCellPos === start && direction === TAB_BACKWARD_DIRECTION) {
      pluginState.insertRow(0);
      return true;
    }

    if (lastCellPos === start && direction === TAB_FORWARD_DIRECTION) {
      pluginState.insertRow(map.height);
      return true;
    }
    if (!pluginState.view.hasFocus()) {
      pluginState.view.focus();
    }
    const result = baseGotoNextCell(direction)(state, dispatch);
    // cancel text selection that is created by default
    if (result) {
      const latestState = pluginState.view.state;
      dispatch(latestState.tr.setSelection(Selection.near(latestState.selection.$from)));
    }
    return result;
  };
};

const cut = (): Command => {
  return (state: EditorState, dispatch: (tr: Transaction) => void): boolean => {
    const pluginState = stateKey.getState(state);
    pluginState.closeFloatingToolbar();
    return true;
  };
};

const copy = (): Command => {
  return (state: EditorState, dispatch: (tr: Transaction) => void): boolean => {
    const pluginState = stateKey.getState(state);
    pluginState.closeFloatingToolbar();
    return true;
  };
};

const paste = (): Command => {
  return (state: EditorState, dispatch: (tr: Transaction) => void): boolean => {
    const pluginState = stateKey.getState(state);
    pluginState.closeFloatingToolbar();
    return true;
  };
};

const emptyCells = (): Command => {
  return (state: EditorState, dispatch: (tr: Transaction) => void): boolean => {
    const pluginState = stateKey.getState(state);
    if (!pluginState.cellSelection) {
      return false;
    }
    pluginState.resetHoverSelection();
    pluginState.emptySelectedCells();
    const { $head: { pos, parentOffset } } = (state.selection as any) as CellSelection;
    const newPos = pos - parentOffset;
    pluginState.moveCursorInsideTableTo(newPos);
    analyticsService.trackEvent('atlassian.editor.format.table.delete_content.keyboard');

    return true;
  };
};

const moveCursorBackward = (): Command => {
  return (state: EditorState, dispatch: (tr: Transaction) => void): boolean => {
    const pluginState = stateKey.getState(state);
    const { $cursor } = state.selection as TextSelection;
    // if cursor is in the middle of a text node, do nothing
    if (!$cursor || (pluginState.view ? !pluginState.view.endOfTextblock('backward', state) : $cursor.parentOffset > 0)) {
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
  cut,
  copy,
  paste,
  moveCursorBackward,
  emptyCells
};
