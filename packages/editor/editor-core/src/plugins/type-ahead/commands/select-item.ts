import { Selection, EditorState, NodeSelection } from 'prosemirror-state';
import { Fragment, Node } from 'prosemirror-model';
import { safeInsert } from 'prosemirror-utils';
import { analyticsService } from '../../../analytics';
import { Command } from '../../../types';
import { isChromeWithSelectionBug } from '../../../utils';
import { pluginKey, ACTIONS } from '../pm-plugins/main';
import { TypeAheadHandler, TypeAheadItem } from '../types';
import { findTypeAheadQuery } from '../utils/find-query-mark';
import { dismissCommand } from './dismiss';

export const selectCurrentItem = (): Command => (state, dispatch) => {
  const { active, currentIndex, items, typeAheadHandler } = pluginKey.getState(
    state,
  );

  if (!active || !typeAheadHandler) {
    return false;
  }

  if (!typeAheadHandler.selectItem || !items[currentIndex]) {
    return withTypeAheadQueryMarkPosition(state, (start, end) =>
      insertFallbackCommand(start, end)(state, dispatch),
    );
  }

  return selectItem(typeAheadHandler, items[currentIndex])(state, dispatch);
};

export const selectSingleItemOrDismiss = (): Command => (state, dispatch) => {
  const { active, items, typeAheadHandler } = pluginKey.getState(state);

  if (!active || !typeAheadHandler || !typeAheadHandler.selectItem) {
    return false;
  }

  if (items.length === 1) {
    return selectItem(typeAheadHandler, items[0])(state, dispatch);
  }

  if (!items || items.length === 0) {
    return dismissCommand()(state, dispatch);
  }

  return false;
};

export const selectByIndex = (index: number): Command => (state, dispatch) => {
  const { active, items, typeAheadHandler } = pluginKey.getState(state);

  if (
    !active ||
    !typeAheadHandler ||
    !typeAheadHandler.selectItem ||
    !items[index]
  ) {
    return false;
  }

  return selectItem(typeAheadHandler, items[index])(state, dispatch);
};

export const selectItem = (
  handler: TypeAheadHandler,
  item: TypeAheadItem,
): Command => (state, dispatch) => {
  return withTypeAheadQueryMarkPosition(state, (start, end) => {
    const insert = (
      maybeNode?: Node | Object | string,
      opts: { [key: string]: boolean } = {},
    ) => {
      let tr = state.tr;

      tr = tr
        .setMeta(pluginKey, { action: ACTIONS.SELECT_CURRENT })
        .replaceWith(start, end, Fragment.empty);

      if (!maybeNode) {
        return tr;
      }

      let node;
      try {
        node =
          maybeNode instanceof Node
            ? maybeNode
            : typeof maybeNode === 'string'
              ? state.schema.text(maybeNode)
              : Node.fromJSON(state.schema, maybeNode);
      } catch (e) {
        // tslint:disable-next-line:no-console
        console.error(e);
        return tr;
      }

      if (node.isText) {
        tr = tr.replaceWith(start, start, node);

        /**
         *
         * Replacing a type ahead query mark with a block node.
         *
         */
      } else if (node.isBlock) {
        tr = safeInsert(node)(tr);

        /**
         *
         * Replacing a type ahead query mark with an inline node.
         *
         */
      } else if (node.isInline) {
        const fragment = Fragment.fromArray([
          node,
          ...(opts.addTrailingSpace ? [state.schema.text(' ')] : []),
        ]);

        tr = tr.replaceWith(start, start, fragment);

        // This problem affects Chrome v58-62. See: https://github.com/ProseMirror/prosemirror/issues/710
        if (isChromeWithSelectionBug) {
          const selection = document.getSelection();
          if (selection) {
            selection.empty();
          }
        }

        if (opts.selectInlineNode) {
          // Select inserted node
          tr = tr.setSelection(NodeSelection.create(tr.doc, start));
        } else {
          // Placing cursor after node + space.
          tr = tr.setSelection(
            Selection.near(tr.doc.resolve(start + fragment.size)),
          );
        }
      }

      return tr;
    };

    analyticsService.trackEvent('atlassian.editor.typeahead.select', {
      item: item.title,
    });

    const tr = handler.selectItem(state, item, insert);

    if (tr === false) {
      return insertFallbackCommand(start, end)(state, dispatch);
    }

    dispatch(tr);
    return true;
  });
};

export const insertFallbackCommand = (start: number, end: number): Command => (
  state,
  dispatch,
) => {
  const { query, trigger } = pluginKey.getState(state);
  const node = state.schema.text(trigger + query);
  dispatch(state.tr.replaceWith(start, end, node));
  return true;
};

export const withTypeAheadQueryMarkPosition = (
  state: EditorState,
  cb: (start: number, end: number) => boolean,
) => {
  const queryMark = findTypeAheadQuery(state);

  if (!queryMark || queryMark.start === -1) {
    return false;
  }

  return cb(queryMark.start, queryMark.end);
};
