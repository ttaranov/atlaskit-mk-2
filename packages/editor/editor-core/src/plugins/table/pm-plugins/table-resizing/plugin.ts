import { Plugin, PluginKey } from 'prosemirror-state';
import { Decoration, DecorationSet } from 'prosemirror-view';
import { TableMap } from 'prosemirror-tables';
import { findParentNodeOfType, hasParentNodeOfType } from 'prosemirror-utils';
import {
  getLayoutSize,
  pointsAtCell,
  edgeCell,
  currentColWidth,
  domCellAround,
} from './utils';
import {
  updateControls,
  handleBreakoutContent,
  updateColumnWidth,
  resizeColumn,
} from './actions';

import Resizer from './resizer/resizer';
import { contentWidth } from './resizer/contentWidth';

import { pluginKey as widthPluginKey } from '../../../width';
import {
  ColumnResizingPlugin,
  TableCssClassName as ClassName,
} from '../../types';

import {
  pluginKey as editorDisabledPluginKey,
  EditorDisabledPluginState,
} from '../../../editor-disabled';

export const key = new PluginKey('tableFlexiColumnResizing');

export function columnResizing({
  handleWidth = 5,
  cellMinWidth = 25,
  lastColumnResizable = true,
}: ColumnResizingPlugin = {}) {
  return new Plugin({
    key,
    state: {
      init() {
        return new ResizeState(-1, false);
      },
      apply(tr, prev, oldState, newState) {
        return prev.apply(tr, newState);
      },
    },
    view() {
      return {
        update(view) {
          const { doc, selection, schema } = view.state;
          const table = findParentNodeOfType(schema.nodes.table)(selection);
          const isInsideCells = hasParentNodeOfType([
            schema.nodes.tableRow,
            schema.nodes.tableHeader,
          ])(selection);

          if (table && isInsideCells) {
            const $cell = doc.resolve(selection.from);
            const start = $cell.start(-1);
            const elem = view.domAtPos(start).node as HTMLElement;
            const { minWidth } = contentWidth(elem, elem);

            // if the contents of the element are wider than the cell
            // we resize the cell to the new min cell width.
            // which should cater to the nowrap element and wrap others.
            if (elem && elem.offsetWidth < minWidth) {
              handleBreakoutContent(
                view,
                elem,
                table.pos + 1,
                minWidth,
                table.node,
              );
            }
          }
        },
      };
    },
    props: {
      attributes(state) {
        let pluginState = key.getState(state);
        return pluginState.activeHandle > -1
          ? { class: `${ClassName.RESIZING} resize-cursor` }
          : { class: ClassName.RESIZING };
      },

      handleDOMEvents: {
        mousemove(view, event) {
          handleMouseMove(view, event, handleWidth, lastColumnResizable);
          const { dragging } = key.getState(view.state);
          if (dragging) {
            updateControls(view.state);
          }
          return false;
        },
        mouseleave(view) {
          handleMouseLeave(view);
          updateControls(view.state);
          return true;
        },
        mousedown(view, event) {
          return handleMouseDown(view, event, cellMinWidth);
        },
      },

      decorations(state) {
        let pluginState = key.getState(state);
        if (pluginState.activeHandle > -1) {
          return handleDecorations(state, pluginState.activeHandle);
        }
      },

      nodeViews: {},
    },
  });
}

class ResizeState {
  activeHandle: number;
  dragging: boolean;

  constructor(activeHandle, dragging) {
    this.activeHandle = activeHandle;
    this.dragging = dragging;
  }

  apply(tr, newState) {
    let state: ResizeState = this;
    let action = tr.getMeta(key);

    const editorDisabledPluginState: EditorDisabledPluginState = editorDisabledPluginKey.getState(
      newState,
    );

    // Disable table resizing if the editor is disabled
    if (editorDisabledPluginState.editorDisabled) {
      return new ResizeState(-1, null);
    }

    if (action && action.setHandle !== undefined) {
      return new ResizeState(action.setHandle, null);
    }

    if (action && action.setDragging !== undefined) {
      return new ResizeState(state.activeHandle, action.setDragging);
    }

    if (state.activeHandle > -1 && tr.docChanged) {
      let handle = tr.mapping.map(state.activeHandle, -1);
      if (!pointsAtCell(tr.doc.resolve(handle))) {
        handle = null;
      }

      state = new ResizeState(handle, state.dragging);
    }
    return state;
  }
}

function handleMouseMove(view, event, handleWidth, lastColumnResizable) {
  let pluginState = key.getState(view.state);

  if (!pluginState.dragging) {
    let target = domCellAround(event.target);
    let cell = -1;

    if (target) {
      let { left, right } = target.getBoundingClientRect();
      if (event.clientX - left <= handleWidth) {
        cell = edgeCell(view, event, 'left');
      } else if (right - event.clientX <= handleWidth) {
        cell = edgeCell(view, event, 'right');
      }
    }

    if (cell !== pluginState.activeHandle) {
      if (!lastColumnResizable && cell !== -1) {
        let $cell = view.state.doc.resolve(cell);
        let table = $cell.node(-1);
        let map = TableMap.get(table);
        let start = $cell.start(-1);
        let col =
          map.colCount($cell.pos - start) + $cell.nodeAfter.attrs.colspan - 1;

        if (col === map.width - 1) {
          return;
        }
      }

      view.dispatch(view.state.tr.setMeta(key, { setHandle: cell }));
    }
  }
}

function handleMouseLeave(view) {
  let pluginState = key.getState(view.state);
  if (pluginState.activeHandle > -1 && !pluginState.dragging) {
    view.dispatch(view.state.tr.setMeta(key, { setHandle: -1 }));
  }
}

function handleMouseDown(view, event, cellMinWidth) {
  let pluginState = key.getState(view.state);
  if (pluginState.activeHandle === -1 || pluginState.dragging) {
    return false;
  }

  let cell = view.state.doc.nodeAt(pluginState.activeHandle);

  let $cell = view.state.doc.resolve(pluginState.activeHandle);
  let dom = view.domAtPos($cell.start(-1)).node;
  while (dom.nodeName !== 'TABLE') {
    dom = dom.parentNode;
  }

  const containerWidth = widthPluginKey.getState(view.state).width;
  const resizer = new Resizer(dom, {
    minWidth: cellMinWidth,
    maxSize: getLayoutSize(dom.getAttribute('data-layout'), containerWidth),
    node: $cell.node(-1),
  });

  resizer.apply(resizer.currentState!);

  let width = currentColWidth(view, pluginState.activeHandle, cell.attrs);
  view.dispatch(
    view.state.tr.setMeta(key, {
      setDragging: { startX: event.clientX, startWidth: width },
    }),
  );

  function finish(event) {
    window.removeEventListener('mouseup', finish);
    window.removeEventListener('mousemove', move);
    let pluginState = key.getState(view.state);
    if (pluginState.dragging) {
      updateColumnWidth(
        view,
        pluginState.activeHandle,
        event.clientX - pluginState.dragging.startX,
        resizer,
      );
      view.dispatch(view.state.tr.setMeta(key, { setDragging: null }));
    }
  }

  function move(event) {
    if (!event.which) {
      return finish(event);
    }

    let pluginState = key.getState(view.state);
    resizeColumn(
      view,
      pluginState.activeHandle,
      event.clientX - pluginState.dragging.startX,
      resizer,
    );
  }

  window.addEventListener('mouseup', finish);
  window.addEventListener('mousemove', move);
  event.preventDefault();
  return true;
}

function handleDecorations(state, cell) {
  let decorations = [] as Decoration[];
  let $cell = state.doc.resolve(cell);
  let table = $cell.node(-1);
  let map = TableMap.get(table);
  let start = $cell.start(-1);
  let col = map.colCount($cell.pos - start) + $cell.nodeAfter.attrs.colspan;
  for (let row = 0; row < map.height; row++) {
    let index = col + row * map.width - 1;
    // For positions that are have either a different cell or the end
    // of the table to their right, and either the top of the table or
    // a different cell above them, add a decoration
    if (
      (col === map.width || map.map[index] !== map.map[index + 1]) &&
      (row === 0 || map.map[index - 1] !== map.map[index - 1 - map.width])
    ) {
      let cellPos = map.map[index];
      let pos = start + cellPos + table.nodeAt(cellPos).nodeSize - 1;
      let dom = document.createElement('div');
      dom.className = ClassName.COLUMN_RESIZE_HANDLE;
      decorations.push(Decoration.widget(pos, dom));
    }
  }
  return DecorationSet.create(state.doc, decorations);
}
