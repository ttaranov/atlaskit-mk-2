import {
  Plugin,
  PluginKey,
  EditorState,
  Transaction,
  Selection,
  TextSelection,
} from 'prosemirror-state';
import { EditorView, DecorationSet, Decoration } from 'prosemirror-view';
import { Node as PMNode, Fragment } from 'prosemirror-model';
import {
  columnResizingPluginKey as resizingPluginKey,
  CellSelection,
  TableMap,
} from 'prosemirror-tables';
import {
  isCellSelection,
  findDomRefAtPos,
  removeSelectedColumns,
  removeSelectedRows,
  findParentNodeOfTypeClosestToPos,
  removeColumnClosestToPos,
  removeRowClosestToPos,
  removeColumnAt,
  removeRowAt,
  emptyCell,
  findCellClosestToPos,
  setCellAttrs,
  findTable,
} from 'prosemirror-utils';
import { ProviderFactory } from '@atlaskit/editor-common';
import * as getTime from 'date-fns/get_time';
import { Dispatch } from '../../../event-dispatcher';
import { Command } from '../../../types';
import { stateKey as tablePluginKey } from './main';
import sliderNodeView from '../nodeviews/slider';
import { nodeViewFactory } from '../../../nodeviews';

export type Cell = { pos: number; node: PMNode };
export type CellTransform = (cell: Cell) => (tr: Transaction) => Transaction;

export const pluginKey = new PluginKey('tableContextualMenuPlugin');

export type PluginState = {
  isOpen: boolean;
  // context menu button is positioned relatively to this DOM node. It is updated on hover over table cells and controls
  targetRef?: HTMLElement;
  // position of a target cell where context menu is drawn
  targetPosition?: number;
  // clicked cell needed to position cellType dropdowns (date, emoji, mention, link)
  clickedCell?: Cell;
};

export const createPlugin = (
  dispatch: Dispatch,
  providerFactory: ProviderFactory,
) =>
  new Plugin({
    state: {
      init: () => ({ isOpen: false }),

      apply(tr, cur: PluginState): PluginState {
        const nextState = tr.getMeta(pluginKey) as PluginState | undefined;
        if (nextState !== undefined) {
          dispatch(pluginKey, nextState);
          return nextState;
        }

        if (tr.docChanged) {
          return mapTargetPosition(cur, tr);
        }

        return cur;
      },
    },
    key: pluginKey,
    view: (view: EditorView) => {
      const domAtPos = view.domAtPos.bind(view);

      return {
        update: (view: EditorView) =>
          updateTargetRefOnRender(domAtPos)(view.state, view.dispatch),
      };
    },
    props: {
      // disable cells with cellType !== "text" from editing
      decorations: (state: EditorState) => createCellTypeDecoration(state),

      nodeViews: {
        slider: nodeViewFactory(providerFactory, { slider: sliderNodeView }),
        checkbox: (node, view, getPos: () => number) => {
          const dom = document.createElement('input');
          dom.type = 'checkbox';
          dom.checked = node.attrs.checked;

          dom.onclick = e => {
            const pos = getPos();

            view.dispatch(
              view.state.tr.setNodeMarkup(
                pos,
                node.type,
                {
                  ...node.attrs,
                  checked: !node.attrs.checked,
                },
                node.marks,
              ),
            );
          };
          return {
            dom,
            stopEvent: () => {
              return true;
            },
          };
        },
      },

      handleDOMEvents: {
        click(view: EditorView, event: MouseEvent) {
          const { state, dispatch } = view;
          const { tableElement } = tablePluginKey.getState(state);
          const posAtCoords = view.posAtCoords({
            left: event.clientX,
            top: event.clientY,
          });
          if (
            !tableElement ||
            isCellSelection(view.state.selection) ||
            !posAtCoords
          ) {
            return setClickedCell(undefined)(state, dispatch);
          }
          const $pos = state.doc.resolve(posAtCoords.pos);
          const cell = findParentNodeOfTypeClosestToPos($pos, [
            state.schema.nodes.tableCell,
          ]);
          if (
            !cell ||
            ['date', 'link', 'mention', 'checkbox', 'emoji', 'slider'].indexOf(
              cell.node.attrs.cellType,
            ) === -1
          ) {
            return setClickedCell(undefined)(state, dispatch);
          }
          if (cell.node.attrs.cellType === 'slider') {
            dispatch(
              state.tr.setSelection(
                Selection.near(state.doc.resolve(cell.pos)),
              ),
            );
          }
          return setClickedCell(cell)(state, dispatch);
        },

        mousemove(view: EditorView, event: MouseEvent) {
          const { state, dispatch } = view;
          if ((resizingPluginKey.getState(state) || {}).dragging) {
            return setTargetRef(undefined)(state, dispatch);
          }
          const pluginState = pluginKey.getState(state);
          const { tableElement } = tablePluginKey.getState(state);
          const posAtCoords = view.posAtCoords({
            left: event.clientX,
            top: event.clientY,
          });
          const { doc, schema } = state;
          const { tableCell, tableHeader } = schema.nodes;
          const target = event.target as HTMLElement;

          // handle slider target cell
          if (
            target.nodeName === 'INPUT' &&
            target.getAttribute('type') === 'range'
          ) {
            dispatch(
              state.tr.setMeta(resizingPluginKey, { setDragging: null }),
            );

            if (!posAtCoords) {
              return false;
            }
            const $pos = state.doc.resolve(posAtCoords.pos);
            const cell = findParentNodeOfTypeClosestToPos($pos, [tableCell]);
            if (!cell) {
              return false;
            }
            if (cell !== pluginState.clickedCell) {
              return setClickedCell(cell)(view.state, dispatch);
            }
          }

          if (
            !tableElement ||
            pluginState.isOpen ||
            isCellSelection(view.state.selection) ||
            !posAtCoords
          ) {
            return false;
          }
          const $pos = doc.resolve(posAtCoords.pos);
          const cell = findParentNodeOfTypeClosestToPos($pos, [
            tableCell,
            tableHeader,
          ]);
          if (!cell) {
            return false;
          }
          const targetPosition = cell.pos;
          const ref = findDomRefAtPos(targetPosition, view.domAtPos.bind(view));
          const targetRef = !targetPosition ? undefined : ref;
          return setTargetRef(targetRef as HTMLElement, targetPosition)(
            state,
            dispatch,
          );
        },
        blur(view: EditorView, event: MouseEvent) {
          const { state, dispatch } = view;
          return setTargetRef(undefined)(state, dispatch);
        },
      },
    },

    appendTransaction: (
      transactions: Transaction[],
      oldState: EditorState,
      newState: EditorState,
    ) => {
      const table = findTable(newState.selection);
      if (
        table &&
        transactions.some(transaction => transaction.docChanged) &&
        !transactions.some(transaction => transaction.getMeta(pluginKey))
      ) {
        const map = TableMap.get(table.node);
        const { pos: start } = findTable(newState.selection)!;
        const { tr } = newState;
        const { paragraph } = newState.schema.nodes;
        let updated = false;

        for (let i = 0; i < table.node.childCount; i++) {
          const row = table.node.child(i);
          row.forEach((cell, _, j) => {
            if (
              !(
                cell.attrs.cellType === 'number' ||
                cell.attrs.cellType === 'currency'
              )
            ) {
              return;
            }

            const from = tr.mapping.map(start + map.map[i * map.width + j]);
            const oldContent = cell.textContent;
            const num = makeNumber(
              oldContent,
              cell.attrs.cellType === 'currency',
            );

            if (oldContent.endsWith('.')) {
              return;
            }

            if (num) {
              const numString = num.toLocaleString();

              if (
                (num && numString !== cell.textContent) ||
                !oldContent.endsWith('.')
              ) {
                const sel = tr.selection;
                tr.replaceWith(
                  from + 1,
                  from + cell.nodeSize,
                  paragraph.create({}, newState.schema.text(numString)),
                );

                if (sel.from > from && sel.from < from + cell.nodeSize) {
                  const diff = oldContent.length - numString.length;
                  tr.setSelection(
                    new TextSelection(tr.doc.resolve(sel.to - diff)),
                  );
                }

                updated = true;
              }
            }
          });
        }

        if (updated) {
          return tr;
        }
      }
    },
  });

export default createPlugin;

export const toggleContextualMenu = (isOpen: boolean): Command => (
  state: EditorState,
  dispatch: (tr: Transaction) => void,
): boolean => {
  const pluginState = pluginKey.getState(state);
  dispatch(state.tr.setMeta(pluginKey, { ...pluginState, isOpen }));
  return true;
};

export const setTargetRef = (
  targetRef?: HTMLElement,
  targetPosition?: number,
): Command => (
  state: EditorState,
  dispatch: (tr: Transaction) => void,
): boolean => {
  const pluginState = pluginKey.getState(state);
  if (
    !targetRef ||
    (!pluginState.isOpen && pluginState.targetRef !== targetRef)
  ) {
    dispatch(
      state.tr.setMeta(pluginKey, {
        ...pluginState,
        targetRef,
        targetPosition,
        isOpen: false,
      }),
    );
    return true;
  }
  return false;
};

export const updateTargetRefOnRender = (domAtPos): Command => (
  state: EditorState,
  dispatch: (tr: Transaction) => void,
): boolean => {
  if (isCellSelection(state.selection)) {
    // draw contextual menu button when cell selection changes
    const targetRef = findDomRefAtPos(
      (state.selection as any).$headCell.pos + 1,
      domAtPos,
    );
    return setTargetRef(targetRef as HTMLElement)(state, dispatch);
  }
  return false;
};

export const deleteColumn = (columnIndex: number | null): Command => (
  state: EditorState,
  dispatch: (tr: Transaction) => void,
): boolean => {
  if (columnIndex !== null) {
    dispatch(removeColumnAt(columnIndex)(state.tr));
    return true;
  }
  if (isCellSelection(state.selection)) {
    dispatch(removeSelectedColumns(state.tr));
    return true;
  }
  const { targetPosition } = pluginKey.getState(state);
  if (targetPosition) {
    dispatch(
      removeColumnClosestToPos(state.doc.resolve(targetPosition))(state.tr),
    );
    return true;
  }
  return false;
};

export const deleteRow = (rowIndex: number | null): Command => (
  state: EditorState,
  dispatch: (tr: Transaction) => void,
): boolean => {
  if (rowIndex !== null) {
    dispatch(removeRowAt(rowIndex)(state.tr));
    return true;
  }
  if (isCellSelection(state.selection)) {
    dispatch(removeSelectedRows(state.tr));
    return true;
  }
  const { targetPosition } = pluginKey.getState(state);
  if (targetPosition) {
    dispatch(
      removeRowClosestToPos(state.doc.resolve(targetPosition))(state.tr),
    );
    return true;
  }
  return false;
};

export const mapTargetPosition = (
  pluginState: PluginState,
  tr: Transaction,
) => {
  if (typeof pluginState.targetPosition === 'number') {
    const { pos, deleted } = tr.mapping.mapResult(pluginState.targetPosition);
    return { ...pluginState, targetPosition: deleted ? undefined : pos };
  }
  return pluginState;
};

export const emptyCells: Command = (
  state: EditorState,
  dispatch: (tr: Transaction) => void,
): boolean => {
  const { targetPosition } = pluginKey.getState(state);
  let cursorPos;
  let { tr } = state;

  if (isCellSelection(tr.selection)) {
    const selection = (tr.selection as any) as CellSelection;
    selection.forEachCell((node, pos) => {
      const $pos = state.doc.resolve(pos + 1);
      tr = emptyCell(findCellClosestToPos($pos)!, state.schema)(tr);
    });
    cursorPos = selection.$headCell.pos;
  } else if (targetPosition) {
    const cell = findCellClosestToPos(tr.doc.resolve(targetPosition))!;
    tr = emptyCell(cell, state.schema)(tr);
    // position directly before the cell
    cursorPos = cell.pos - 1;
  }
  if (tr.docChanged) {
    const $pos = tr.doc.resolve(tr.mapping.map(cursorPos));
    // searching for a valid cursor pos
    const selection = Selection.findFrom($pos, 1, true);
    if (selection) {
      tr.setSelection(selection);
    }
    dispatch(tr);
    return true;
  }
  return false;
};

export const setCellsAttrs = (attrs: Object): Command => (
  state: EditorState,
  dispatch: (tr: Transaction) => void,
): boolean => {
  const { targetPosition } = pluginKey.getState(state);
  let cursorPos;
  let { tr } = state;

  if (isCellSelection(tr.selection)) {
    const selection = (tr.selection as any) as CellSelection;
    selection.forEachCell((cell, pos) => {
      const $pos = tr.doc.resolve(tr.mapping.map(pos + 1));
      tr = setCellAttrs(findCellClosestToPos($pos)!, attrs)(tr);
    });
    cursorPos = selection.$headCell.pos;
  } else if (targetPosition) {
    const cell = findCellClosestToPos(tr.doc.resolve(targetPosition))!;
    tr = setCellAttrs(cell, attrs)(tr);
    cursorPos = cell.pos;
  }
  if (tr.docChanged) {
    const $pos = tr.doc.resolve(tr.mapping.map(cursorPos));
    dispatch(tr.setSelection(Selection.near($pos)));
    return true;
  }
  return false;
};

export const createCellTypeDecoration = (
  state: EditorState,
): DecorationSet | null => {
  const table = findTable(state.selection);
  if (!table) {
    return null;
  }
  const { pos: start } = table;
  const map = TableMap.get(table.node);
  const set: Decoration[] = [];

  for (let i = 0, rowCount = table.node.childCount; i < rowCount; i++) {
    const row = table.node.child(i);

    for (let j = 0, colsCount = row.childCount; j < colsCount; j++) {
      const cell = row.child(j);
      const pos = start + map.map[i * map.width];
      let contentEditable = true;
      const classNames: string[] = [];

      if (
        ['text', 'currency', 'number', 'mention', 'slider', 'decision'].indexOf(
          cell.attrs.cellType,
        ) === -1
      ) {
        contentEditable = false;
      }

      if (cell.attrs.cellType === 'mention') {
        const paragraph = cell.child(0);
        if (!paragraph || !paragraph.childCount) {
          continue;
        }
        const node = paragraph.child(0);
        if (node) {
          contentEditable =
            node.type === state.schema.nodes.mention ? false : true;
        }
      }

      if (cell.attrs.cellType === 'emoji') {
        const paragraph = cell.child(0);
        if (!paragraph || !paragraph.childCount) {
          continue;
        }
        const node = paragraph.child(0);
        if (node) {
          contentEditable =
            node.type === state.schema.nodes.emoji ? false : true;
        }
      }

      if (cell.attrs.cellType === 'number' && cell.textContent) {
        const num = makeNumber(cell.textContent);
        if (num === null) {
          classNames.push('invalid');
        }
      }

      if (cell.attrs.cellType === 'currency' && cell.textContent) {
        const num = makeNumber(cell.textContent, true);
        if (num === null) {
          classNames.push('invalid');
        }
      }

      if (!contentEditable || classNames.length !== 0) {
        set.push(
          Decoration.node(pos, pos + cell.nodeSize, {
            contentEditable: contentEditable.toString(),
            class: classNames.join(' '),
          } as any),
        );
      }
    }
  }

  return DecorationSet.create(state.doc, set);
};

const makeNumber = (text: String, currency?: boolean): Number | null => {
  text = text.replace(/[, ]/g, '');
  if (currency) {
    text = text.replace(/$\$/, '');
  }

  const num = Number(text);
  if (num.toString() === 'NaN') {
    return null;
  }

  return num;
};

export const setClickedCell = (clickedCell?: {
  pos: number;
  node: PMNode;
}): Command => (
  state: EditorState,
  dispatch: (tr: Transaction) => void,
): boolean => {
  const pluginState = pluginKey.getState(state);
  if (pluginState.clickedCell !== clickedCell) {
    let { tr } = state;
    tr.setMeta(pluginKey, {
      ...pluginState,
      clickedCell,
    });

    // insert mention on click on cellType="mention"
    if (clickedCell && clickedCell.node.attrs.cellType === 'mention') {
      const mark = state.schema.mark('mentionQuery', { active: true });
      const query = state.schema.text('@', [mark]);
      clearAndInsertNode(query, clickedCell)(tr);
    }

    // insert emoji on click on cellType="emoji"
    if (clickedCell && clickedCell.node.attrs.cellType === 'emoji') {
      const mark = state.schema.mark('emojiQuery');
      const query = state.schema.text(':', [mark]);
      clearAndInsertNode(query, clickedCell)(tr);
    }

    dispatch(tr);
    return true;
  }
  return false;
};

export const clearAndInsertNode = (
  nodes: PMNode | PMNode[],
  clickedCell: Cell,
) => (tr: Transaction) => {
  const paragraph = clickedCell.node.child(0);
  const paragraphStart = clickedCell.pos + 1;
  const content = Fragment.from(nodes);
  return tr
    .delete(
      // beginning of the paragraph
      paragraphStart,
      paragraphStart + paragraph.nodeSize,
    )
    .insert(paragraphStart, content)
    .setSelection(
      Selection.near(tr.doc.resolve(paragraphStart + content.size)),
    );
};

export const setDateIntoClickedCell = (iso: string): Command => (
  state: EditorState,
  dispatch: (tr: Transaction) => void,
): boolean => {
  const pluginState = pluginKey.getState(state);
  const { tr, schema } = state;
  const dateNode = schema.nodes.date.create({ timestamp: getTime(iso) });

  clearAndInsertNode(dateNode, pluginState.clickedCell)(tr);

  dispatch(
    tr.setMeta(pluginKey, {
      ...pluginState,
      clickedCell: undefined,
    }),
  );
  return true;
};

export const setEmojiIntoClickedCell = (emojiId, emoji): Command => (
  state: EditorState,
  dispatch: (tr: Transaction) => void,
): boolean => {
  const pluginState = pluginKey.getState(state);
  const { tr, schema } = state;

  const node = schema.nodes.emoji.create({
    ...emojiId,
    text: emojiId.fallback || emojiId.shortName,
  });
  const text = schema.text(' ');

  clearAndInsertNode([node, text], pluginState.clickedCell)(tr);

  dispatch(
    tr.setMeta(pluginKey, {
      ...pluginState,
      clickedCell: undefined,
    }),
  );
  return true;
};
