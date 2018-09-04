import {
  EditorState,
  Plugin,
  PluginKey,
  Transaction,
  Selection,
} from 'prosemirror-state';
import { Node as PMNode, Fragment } from 'prosemirror-model';
import { EditorView, DecorationSet, Decoration } from 'prosemirror-view';
import { TableMap } from 'prosemirror-tables';
import {
  findTable,
  isCellSelection,
  forEachCellInRow,
  findParentNodeOfTypeClosestToPos,
} from 'prosemirror-utils';

import {
  Cell,
  PluginConfig,
  TableColumnTypesPluginState as PluginState,
} from '../types';
import { ReactNodeView } from '../../../nodeviews';
import { calculateSummary, maybeCreateText } from '../utils';

import { Dispatch } from '../../../event-dispatcher';
import { EventDispatcher } from '../../../event-dispatcher';
import { PortalProviderAPI } from '../../../ui/PortalProvider';
import { Command } from '../../../types';
import { pluginKey as tablePluginKey } from './main';
import TableHeaderView from '../nodeviews/tableHeader';
import CheckboxView from '../nodeviews/checkbox';

import { sliderNodeViewFactory } from '../nodeviews/slider';

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
      // this breakes chart property checkboxes
      // decorations: (state: EditorState) => createCellTypeDecoration(state),

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
        slider: sliderNodeViewFactory(portalProviderAPI),
        checkbox: ReactNodeView.fromComponent(CheckboxView, portalProviderAPI),
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

    // update summary cells on each table modification
    appendTransaction: (
      transactions: Transaction[],
      oldState: EditorState,
      newState: EditorState,
    ) => {
      const table = findTable(newState.selection);
      if (
        table &&
        table.node.attrs.isSummaryRowEnabled &&
        transactions.some(transaction => transaction.docChanged) &&
        // ignore the transaction that enables summary row (otherwise it goes into infinite loop)
        !transactions.some(transaction => {
          const meta = transaction.getMeta(pluginKey);
          return meta && meta.addedSummaryRow;
        }) &&
        // TODO: Need to find a better way to stop infinite loop
        !transactions.every(transaction =>
          transaction.getMeta('appendedTransaction'),
        )
      ) {
        const summary = calculateSummary(table.node);

        let { tr } = newState;
        let index = summary.length - 1;
        const createContent = maybeCreateText(newState.schema);

        forEachCellInRow(table.node.childCount - 1, (cell, tr) => {
          const ret = summary[index--].value;
          const content = createContent(
            // Handle average
            ret && ret.value ? ret.value / ret.count : ret,
          );
          const paragraph = cell.node.child(0);
          return content
            ? tr.replaceWith(
                cell.start,
                cell.start + paragraph.nodeSize - 1,
                content,
              )
            : tr;
        })(tr);

        return tr;
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
  const map = TableMap.get(table.node);
  const set: Decoration[] = [];

  for (let i = 0, rowCount = table.node.childCount; i < rowCount; i++) {
    const row = table.node.child(i);

    for (let j = 0, colsCount = row.childCount; j < colsCount; j++) {
      const cell = row.child(j);
      if (cell.type === state.schema.nodes.tableHeader) {
        continue;
      }
      const pos = table.start + map.map[j + i * map.width];
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
  const now = iso.split('-');
  const timestamp = Date.UTC(
    Number(now[0]),
    Number(now[1]) - 1,
    Number(now[2]),
  );
  const dateNode = schema.nodes.date.create({ timestamp });

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
