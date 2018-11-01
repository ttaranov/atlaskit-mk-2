import { Plugin, PluginKey, Transaction, EditorState } from 'prosemirror-state';
import { Dispatch } from '../../../event-dispatcher';
import {
  TypeAheadHandler,
  TypeAheadItem,
  TypeAheadItemsLoader,
} from '../types';
import { dismissCommand } from '../commands/dismiss';
import { itemsListUpdated } from '../commands/items-list-updated';
import { isQueryActive } from '../utils/is-query-active';
import { findTypeAheadQuery } from '../utils/find-query-mark';

export const pluginKey = new PluginKey('typeAheadPlugin');

export type PluginState = {
  active: boolean;
  prevActiveState: boolean;
  query: string | null;
  trigger: string | null;
  typeAheadHandler: TypeAheadHandler | null;
  items: Array<TypeAheadItem>;
  itemsLoader: TypeAheadItemsLoader;
  currentIndex: number;
  queryMarkPos: number | null;
};

export const ACTIONS = {
  SELECT_PREV: 'SELECT_PREV',
  SELECT_NEXT: 'SELECT_NEXT',
  SELECT_CURRENT: 'SELECT_CURRENT',
  SET_CURRENT_INDEX: 'SET_CURRENT_INDEX',
  ITEMS_LIST_UPDATED: 'ITEMS_LIST_UPDATED',
};

export function createInitialPluginState(prevActiveState = false): PluginState {
  return {
    active: false,
    prevActiveState,
    query: null,
    trigger: null,
    typeAheadHandler: null,
    currentIndex: 0,
    items: [],
    itemsLoader: null,
    queryMarkPos: null,
  };
}

export function createPlugin(
  dispatch: Dispatch,
  reactContext: () => { [key: string]: any },
  typeAhead,
): Plugin {
  return new Plugin({
    key: pluginKey,
    state: {
      init() {
        return createInitialPluginState();
      },

      apply(tr, pluginState, oldState, state) {
        const meta = tr.getMeta(pluginKey) || {};
        const { action, params } = meta;

        switch (action) {
          case ACTIONS.SET_CURRENT_INDEX:
            return setCurrentItemIndex({
              dispatch,
              pluginState,
              tr,
              params,
            });

          case ACTIONS.SELECT_PREV:
            return selectPrevActionHandler({ dispatch, pluginState, tr });

          case ACTIONS.SELECT_NEXT:
            return selectNextActionHandler({ dispatch, pluginState, tr });

          case ACTIONS.ITEMS_LIST_UPDATED:
            return itemsListUpdatedActionHandler({ dispatch, pluginState, tr });

          case ACTIONS.SELECT_CURRENT:
            return selectCurrentActionHandler({ dispatch, pluginState, tr });

          default:
            return defaultActionHandler({
              dispatch,
              reactContext,
              typeAhead,
              state,
              pluginState,
            });
        }
      },
    },

    view() {
      return {
        update(editorView) {
          const pluginState = pluginKey.getState(editorView.state);
          if (!pluginState) {
            return;
          }

          const { state, dispatch } = editorView;
          const { doc, selection } = state;
          const { from, to } = selection;
          const { typeAheadQuery } = state.schema.marks;

          // Disable type ahead query when the first character is a space.
          if (pluginState.active && pluginState.query.indexOf(' ') === 0) {
            dismissCommand()(state, dispatch);
            return;
          }

          // Disable type ahead query when removing trigger.
          if (pluginState.active && !pluginState.query) {
            const { nodeBefore } = selection.$from;
            if (nodeBefore && !(nodeBefore.text || '').replace(/\s/g, '')) {
              dismissCommand()(state, dispatch);
              return;
            }
          }

          // Optimization to not call dismissCommand if plugin is in an inactive state.
          if (!pluginState.active && pluginState.prevActiveState) {
            if (!doc.rangeHasMark(from - 1, to, typeAheadQuery)) {
              dismissCommand()(state, dispatch);
              return;
            }
          }

          // Fetch type ahead items if handler returned a promise.
          if (pluginState.active && pluginState.itemsLoader) {
            pluginState.itemsLoader.promise.then(items =>
              itemsListUpdated(items)(editorView.state, dispatch),
            );
          }
        },
      };
    },
  });
}

/**
 *
 * Action Handlers
 *
 */

export type ActionHandlerParams = {
  dispatch: Dispatch;
  pluginState: PluginState;
  tr: Transaction;
  params?: {
    currentIndex?: number;
  };
};

export function createItemsLoader(
  promiseOfItems: Promise<Array<TypeAheadItem>>,
): TypeAheadItemsLoader {
  let canceled = false;

  return {
    promise: new Promise((resolve, reject) => {
      promiseOfItems
        .then(result => !canceled && resolve(result))
        .catch(error => !canceled && reject(error));
    }),
    cancel() {
      canceled = true;
    },
  };
}

export function defaultActionHandler({
  dispatch,
  reactContext,
  typeAhead,
  pluginState,
  state,
}: {
  dispatch: Dispatch;
  reactContext: () => { [key: string]: any };
  typeAhead: Array<TypeAheadHandler>;
  pluginState: PluginState;
  state: EditorState;
}): PluginState {
  const { typeAheadQuery } = state.schema.marks;
  const { doc, selection } = state;
  const { from, to } = selection;

  const isActive = isQueryActive(typeAheadQuery, doc, from - 1, to);
  const { nodeBefore } = selection.$from;

  if (!isActive || !nodeBefore || !pluginState) {
    const newPluginState = createInitialPluginState(
      pluginState ? pluginState.active : false,
    );
    if (!pluginState || pluginState.active) {
      dispatch(pluginKey, newPluginState);
    }
    return newPluginState;
  }

  const typeAheadMark = typeAheadQuery.isInSet(nodeBefore.marks || []);
  if (!typeAheadMark || !typeAheadMark.attrs.trigger) {
    return pluginState;
  }

  const trigger = typeAheadMark.attrs.trigger.replace(
    /([^\x00-\xFF]|[\s\n])+/g,
    '',
  );
  const query = (nodeBefore.textContent || '')
    .replace(/^([^\x00-\xFF]|[\s\n])+/g, '')
    .replace(trigger, '');

  const typeAheadHandler = typeAhead.find(t => t.trigger === trigger)!;
  let typeAheadItems: Array<TypeAheadItem> | Promise<Array<TypeAheadItem>> = [];
  let itemsLoader: TypeAheadItemsLoader = null;

  try {
    const { intl } = reactContext();
    typeAheadItems = typeAheadHandler.getItems(query, state, intl, {
      prevActive: pluginState.prevActiveState,
      queryChanged: query !== pluginState.query,
    });

    if (pluginState.itemsLoader) {
      pluginState.itemsLoader.cancel();
    }

    if ((typeAheadItems as Promise<Array<TypeAheadItem>>).then) {
      itemsLoader = createItemsLoader(typeAheadItems as Promise<
        Array<TypeAheadItem>
      >);
      typeAheadItems = pluginState.items;
    }
  } catch (e) {}

  const queryMark = findTypeAheadQuery(state);

  const newPluginState = {
    query,
    trigger,
    typeAheadHandler,
    active: true,
    prevActiveState: pluginState.active,
    items: typeAheadItems as Array<TypeAheadItem>,
    itemsLoader: itemsLoader,
    currentIndex: pluginState.currentIndex,
    queryMarkPos: queryMark !== null ? queryMark.start : null,
  };

  dispatch(pluginKey, newPluginState);
  return newPluginState;
}

export function setCurrentItemIndex({
  dispatch,
  pluginState,
  params,
}: ActionHandlerParams) {
  if (!params) {
    return pluginState;
  }

  const newPluginState = {
    ...pluginState,
    currentIndex:
      params.currentIndex || params.currentIndex === 0
        ? params.currentIndex
        : pluginState.currentIndex,
  };

  dispatch(pluginKey, newPluginState);
  return newPluginState;
}

export function selectPrevActionHandler({
  dispatch,
  pluginState,
}: ActionHandlerParams): PluginState {
  const newIndex = pluginState.currentIndex - 1;
  const newPluginState = {
    ...pluginState,
    currentIndex: newIndex < 0 ? pluginState.items.length - 1 : newIndex,
  };
  dispatch(pluginKey, newPluginState);
  return newPluginState;
}

export function selectNextActionHandler({
  dispatch,
  pluginState,
}: ActionHandlerParams): PluginState {
  const newIndex = pluginState.currentIndex + 1;
  const newPluginState = {
    ...pluginState,
    currentIndex: newIndex > pluginState.items.length - 1 ? 0 : newIndex,
  };
  dispatch(pluginKey, newPluginState);
  return newPluginState;
}

export function itemsListUpdatedActionHandler({
  dispatch,
  pluginState,
  tr,
}: ActionHandlerParams): PluginState {
  const items = tr.getMeta(pluginKey).items;
  const newPluginState = {
    ...pluginState,
    items,
    itemsLoader: null,
    currentIndex:
      pluginState.currentIndex > items.length ? 0 : pluginState.currentIndex,
  };
  dispatch(pluginKey, newPluginState);
  return newPluginState;
}

export function selectCurrentActionHandler({
  dispatch,
  pluginState,
}: ActionHandlerParams): PluginState {
  const newPluginState = createInitialPluginState(pluginState.active);
  dispatch(pluginKey, newPluginState);
  return newPluginState;
}
