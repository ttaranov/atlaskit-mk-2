import * as getTime from 'date-fns/get_time';
import {
  EditorState,
  Plugin,
  PluginKey,
  Transaction,
  Selection,
  TextSelection,
} from 'prosemirror-state';
import { Node as PMNode, Fragment } from 'prosemirror-model';
import { EditorView, DecorationSet, Decoration } from 'prosemirror-view';
import { TableMap } from 'prosemirror-tables';
import {
  findTable,
  isCellSelection,
  findParentNodeOfTypeClosestToPos,
} from 'prosemirror-utils';
import {
  Cell,
  PluginConfig,
  TableColumnTypesPluginState as PluginState,
} from '../types';

import { Dispatch } from '../../../event-dispatcher';
import { EventDispatcher } from '../../../event-dispatcher';
import { PortalProviderAPI } from '../../../ui/PortalProvider';
import { Command } from '../../../types';
import { pluginKey as tablePluginKey } from './main';
import TableHeaderView from '../nodeviews/tableHeader';

export const pluginKey = new PluginKey('tableColumnTypesPlugin');

export const createColumnTypesPlugin = (
  dispatch: Dispatch,
  portalProviderAPI: PortalProviderAPI,
  eventDispatcher: EventDispatcher,
  pluginConfig: PluginConfig,
) =>
  new Plugin({
    state: {
      init: (): PluginState => ({
        clickedCell: undefined,
      }),
      apply(tr: Transaction, pluginState: PluginState, _, state: EditorState) {
        const nextState = tr.getMeta(pluginKey) as PluginState | undefined;
        if (nextState !== undefined) {
          dispatch(pluginKey, nextState);
          return nextState;
        }

        return pluginState;
      },
    },
    key: pluginKey,

    props: {
      decorations: (state: EditorState) => createCellTypeDecoration(state),

      handleDOMEvents: {
        click(view: EditorView, event: MouseEvent) {
          const { state, dispatch } = view;
          const { tableRef } = tablePluginKey.getState(state);
          const posAtCoords = view.posAtCoords({
            left: event.clientX,
            top: event.clientY,
          });
          if (
            !tableRef ||
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
            [
              'summary',
              'date',
              'link',
              'mention',
              'checkbox',
              'emoji',
              'slider',
            ].indexOf(cell.node.attrs.cellType) === -1
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
      },

      nodeViews: {
        // slider: nodeViewFactory(providerFactory, { slider: sliderNodeView }),

        tableHeader: (node: PMNode, view: EditorView, getPos: () => number) => {
          return new TableHeaderView({
            node,
            view,
            getPos,
            portalProviderAPI,
          }).init();
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

export const getPluginState = (state: EditorState) => {
  return pluginKey.getState(state);
};

export const createCellTypeDecoration = (
  state: EditorState,
): DecorationSet | null => {
  const table = findTable(state.selection);
  if (!table) {
    return null;
  }
  const { start } = table;
  const map = TableMap.get(table.node);
  const set: Decoration[] = [];

  for (let i = 0, rowCount = table.node.childCount; i < rowCount; i++) {
    const row = table.node.child(i);

    for (let j = 0, colsCount = row.childCount; j < colsCount; j++) {
      const cell = row.child(j);
      if (cell.type === state.schema.nodes.tableHeader) {
        continue;
      }
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

export const makeNumber = (text: String, currency?: boolean): Number | null => {
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

export const setClickedCell = (clickedCell?: Cell): Command => (
  state: EditorState,
  dispatch: (tr: Transaction) => void,
): boolean => {
  const pluginState = pluginKey.getState(state);
  if (pluginState.clickedCell !== clickedCell) {
    if (
      clickedCell &&
      clickedCell.node.type === state.schema.nodes.tableHeader
    ) {
      return false;
    }
    let { tr } = state;
    tr.setMeta(pluginKey, {
      ...pluginState,
      clickedCell,
    });

    // insert mention on click on cellType="mention"
    if (clickedCell && clickedCell.node.attrs.cellType === 'mention') {
      const mark = state.schema.mark('mentionQuery', { active: true });
      const query = state.schema.text('@', [mark]);
      tr = setCellContent(query, clickedCell)(tr);
    }

    // insert emoji on click on cellType="emoji"
    if (clickedCell && clickedCell.node.attrs.cellType === 'emoji') {
      const mark = state.schema.mark('emojiQuery');
      const query = state.schema.text(':', [mark]);
      tr = setCellContent(query, clickedCell)(tr);
    }

    dispatch(tr);
    return true;
  }
  return false;
};

export const setCellContent = (nodes: PMNode | PMNode[], clickedCell: Cell) => (
  tr: Transaction,
) => {
  const { pos, start } = clickedCell;
  const { paragraph } = clickedCell.node.type.schema.nodes;
  const content = Fragment.from(nodes);
  const newCell = clickedCell.node.type.create(
    clickedCell.node.attrs,
    paragraph.create({}, content),
  );

  return tr
    .replaceWith(pos, pos + clickedCell.node.nodeSize, newCell)
    .setSelection(Selection.near(tr.doc.resolve(start + content.size + 1)));
};

export const setDateIntoClickedCell = (iso: string): Command => (
  state: EditorState,
  dispatch: (tr: Transaction) => void,
): boolean => {
  const pluginState = pluginKey.getState(state);
  const { tr, schema } = state;
  const dateNode = schema.nodes.date.create({ timestamp: getTime(iso) });

  dispatch(
    setCellContent(dateNode, pluginState.clickedCell)(tr).setMeta(pluginKey, {
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

  dispatch(
    setCellContent([node, text], pluginState.clickedCell)(tr).setMeta(
      pluginKey,
      {
        ...pluginState,
        clickedCell: undefined,
      },
    ),
  );
  return true;
};
