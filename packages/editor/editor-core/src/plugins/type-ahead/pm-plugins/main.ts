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

export const pluginKey = new PluginKey('typeAheadPlugin');

export type PluginState = {
  active: boolean;
  prevActiveState: boolean;
  query: string;
  trigger: string | null;
  typeAheadHandler: TypeAheadHandler | null;
  items: Array<TypeAheadItem>;
  itemsLoader: TypeAheadItemsLoader;
  currentIndex: number;
};

export const ACTIONS = {
  SELECT_PREV: 'SELECT_PREV',
  SELECT_NEXT: 'SELECT_NEXT',
  SELECT_CURRENT: 'SELECT_CURRENT',
  ITEMS_LIST_UPDATED: 'ITEMS_LIST_UPDATED',
};

export function createInitialPluginState(prevActiveState = false): PluginState {
  return {
    active: false,
    prevActiveState,
    query: '',
    trigger: null,
    typeAheadHandler: null,
    currentIndex: 0,
    items: [],
    itemsLoader: null,
  };
}

export function createPlugin(dispatch: Dispatch, typeAhead): Plugin {
  return new Plugin({
    key: pluginKey,
    state: {
      init() {
        return createInitialPluginState();
      },

      apply(tr, pluginState, oldState, state) {
        const action = (tr.getMeta(pluginKey) || {}).action;

        switch (action) {
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

          const dispatch = editorView.dispatch;
          const state = editorView.state;
          const { doc, selection } = state;
          const { from, to } = selection;
          const { typeAheadQuery } = state.schema.marks;

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
  typeAhead,
  pluginState,
  state,
}: {
  dispatch: Dispatch;
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
    .replace(trigger, '')
    .replace(/^([^\x00-\xFF]|[\s\n])+/g, '');

  const typeAheadHandler = typeAhead.find(t => t.trigger === trigger)!;
  let typeAheadItems: Array<TypeAheadItem> | Promise<Array<TypeAheadItem>> = [];
  let itemsLoader: TypeAheadItemsLoader = null;

  try {
    typeAheadItems = typeAheadHandler.getItems(query, state);

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

  const newPluginState = {
    query,
    trigger,
    typeAheadHandler,
    active: true,
    prevActiveState: pluginState.active,
    items: typeAheadItems as Array<TypeAheadItem>,
    itemsLoader: itemsLoader,
    currentIndex: pluginState.currentIndex,
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
  const newPluginState = {
    ...pluginState,
    itemsLoader: null,
    items: tr.getMeta(pluginKey).items,
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
