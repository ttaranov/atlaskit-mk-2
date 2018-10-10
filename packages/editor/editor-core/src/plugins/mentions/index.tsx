import * as React from 'react';
import { Plugin, PluginKey, StateField } from 'prosemirror-state';
import MentionIcon from '@atlaskit/icon/glyph/editor/mention';
import {
  MentionProvider,
  MentionItem,
  isSpecialMention,
  MentionDescription,
} from '@atlaskit/mention';
import {
  mention,
  ProviderFactory,
  ContextIdentifierProvider,
} from '@atlaskit/editor-common';

import { analyticsService } from '../../analytics';
import { EditorPlugin, Command } from '../../types';
import { Dispatch } from '../../event-dispatcher';
import { PortalProviderAPI } from '../../ui/PortalProvider';
import WithPluginState from '../../ui/WithPluginState';
import {
  pluginKey as typeAheadPluginKey,
  PluginState as TypeAheadPluginState,
  createInitialPluginState,
} from '../type-ahead/pm-plugins/main';
import { messages } from '../insert-block/ui/ToolbarInsertBlock';
import { ReactNodeView } from '../../nodeviews';
import ToolbarMention from './ui/ToolbarMention';
import mentionNodeView from './nodeviews/mention';

const mentionsPlugin: EditorPlugin = {
  nodes() {
    return [{ name: 'mention', node: mention }];
  },

  pmPlugins() {
    return [
      {
        name: 'mention',
        plugin: ({ providerFactory, dispatch, portalProviderAPI }) =>
          mentionPluginFactory(dispatch, providerFactory, portalProviderAPI),
      },
    ];
  },

  secondaryToolbarComponent({ editorView, disabled }) {
    return (
      <WithPluginState
        editorView={editorView}
        plugins={{
          typeAheadState: typeAheadPluginKey,
          mentionState: mentionPluginKey,
        }}
        render={(
          {
            typeAheadState,
            mentionState,
          }: {
            typeAheadState: TypeAheadPluginState;
            mentionState: MentionPluginState;
          } = {
            typeAheadState: createInitialPluginState(),
            mentionState: {},
          },
        ) =>
          !mentionState.provider ? null : (
            <ToolbarMention
              editorView={editorView}
              isDisabled={disabled || !typeAheadState.isAllowed}
            />
          )
        }
      />
    );
  },

  pluginsOptions: {
    quickInsert: ({ formatMessage }) => [
      {
        title: formatMessage(messages.mention),
        priority: 400,
        icon: () => <MentionIcon label={formatMessage(messages.mention)} />,
        action(insert, state) {
          const mark = state.schema.mark('typeAheadQuery', {
            trigger: '@',
          });
          const mentionText = state.schema.text('@', [mark]);
          return insert(mentionText);
        },
      },
    ],
    typeAhead: {
      trigger: '@',
      getItems(query, state, intl, { prevActive, queryChanged }) {
        if (!prevActive && queryChanged) {
          analyticsService.trackEvent(
            'atlassian.fabric.mention.picker.trigger.shortcut',
          );
        }

        const pluginState = getPluginState(state);
        const mentions =
          !prevActive && queryChanged ? [] : pluginState.mentions || [];

        if (queryChanged && pluginState.provider) {
          pluginState.provider.filter(query || '');
        }

        return mentions.map(mention => ({
          title: mention.name || '',
          keywords: [mention.mentionName, mention.nickname],
          render: ({ isSelected, onClick, onMouseMove }) => (
            <MentionItem
              mention={mention}
              selected={isSelected}
              onMouseMove={onMouseMove}
              onSelection={onClick}
            />
          ),
          mention,
        }));
      },
      selectItem(state, item, insert) {
        const pluginState = getPluginState(state);
        const { id, name, nickname, accessLevel, userType } = item.mention;
        const renderName = nickname ? nickname : name;

        analyticsService.trackEvent('atlassian.fabric.mention.picker.insert', {
          isSpecial: isSpecialMention(item.mention) || false,
          accessLevel: accessLevel || '',
          mentionee: id,
          ...(pluginState.contextIdentifier as any),
        });

        return insert(
          state.schema.nodes.mention.createChecked({
            text: `@${renderName}`,
            id,
            accessLevel,
            userType: userType === 'DEFAULT' ? null : userType,
          }),
        );
      },
    },
  },
};

export default mentionsPlugin;

/**
 * Actions
 */

export const ACTIONS = {
  SET_PROVIDER: 'SET_PROVIDER',
  SET_RESULTS: 'SET_RESULTS',
  SET_CONTEXT: 'SET_CONTEXT',
};

export const setProvider = (provider): Command => (state, dispatch) => {
  dispatch(
    state.tr.setMeta(mentionPluginKey, {
      action: ACTIONS.SET_PROVIDER,
      params: { provider },
    }),
  );
  return true;
};

export const setResults = (results): Command => (state, dispatch) => {
  dispatch(
    state.tr.setMeta(mentionPluginKey, {
      action: ACTIONS.SET_RESULTS,
      params: { results },
    }),
  );
  return true;
};

export const setContext = (context): Command => (state, dispatch) => {
  dispatch(
    state.tr.setMeta(mentionPluginKey, {
      action: ACTIONS.SET_CONTEXT,
      params: { context },
    }),
  );
  return true;
};

/**
 *
 * ProseMirror Plugin
 *
 */

export const mentionPluginKey = new PluginKey('mentionPlugin');

export function getPluginState(state) {
  return mentionPluginKey.getState(state) as MentionPluginState;
}

export type MentionPluginState = {
  provider?: MentionProvider;
  contextIdentifier?: ContextIdentifierProvider;
  mentions?: Array<MentionDescription>;
};

function mentionPluginFactory(
  dispatch: Dispatch,
  providerFactory: ProviderFactory,
  portalProviderAPI: PortalProviderAPI,
) {
  let mentionProvider: MentionProvider;

  return new Plugin({
    key: mentionPluginKey,
    state: {
      init() {
        return {} as MentionPluginState;
      },
      apply(tr, pluginState) {
        const { action, params } = tr.getMeta(mentionPluginKey) || {
          action: null,
          params: null,
        };

        let newPluginState = pluginState;

        switch (action) {
          case ACTIONS.SET_PROVIDER:
            newPluginState = {
              ...pluginState,
              provider: params.provider,
            };
            dispatch(mentionPluginKey, newPluginState);
            return newPluginState;

          case ACTIONS.SET_RESULTS:
            newPluginState = {
              ...pluginState,
              mentions: params.results,
            };
            dispatch(mentionPluginKey, newPluginState);
            return newPluginState;

          case ACTIONS.SET_CONTEXT:
            newPluginState = {
              ...pluginState,
              contextIdentifier: params.context,
            };
            dispatch(mentionPluginKey, newPluginState);
            return newPluginState;
        }

        return newPluginState;
      },
    } as StateField<MentionPluginState>,
    props: {
      nodeViews: {
        mention: ReactNodeView.fromComponent(
          mentionNodeView,
          portalProviderAPI,
          { providerFactory },
        ),
      },
    },
    view(editorView) {
      const providerHandler = (
        name: string,
        providerPromise?: Promise<MentionProvider | ContextIdentifierProvider>,
      ) => {
        switch (name) {
          case 'mentionProvider':
            if (!providerPromise) {
              return setProvider(undefined)(
                editorView.state,
                editorView.dispatch,
              );
            }

            providerPromise
              .then((provider: MentionProvider) => {
                if (mentionProvider) {
                  mentionProvider.unsubscribe('mentionPlugin');
                }

                mentionProvider = provider;
                setProvider(provider)(editorView.state, editorView.dispatch);

                provider.subscribe('mentionPlugin', result => {
                  setResults(result)(editorView.state, editorView.dispatch);
                });
              })
              .catch(() =>
                setProvider(undefined)(editorView.state, editorView.dispatch),
              );
            break;

          case 'contextIdentifierProvider':
            if (!providerPromise) {
              return setContext(undefined)(
                editorView.state,
                editorView.dispatch,
              );
            }
            providerPromise.then((provider: ContextIdentifierProvider) => {
              setContext(provider)(editorView.state, editorView.dispatch);
            });
            break;
        }
      };

      providerFactory.subscribe('mentionProvider', providerHandler);
      providerFactory.subscribe('contextIdentifierProvider', providerHandler);

      return {
        destroy() {
          if (providerFactory) {
            providerFactory.unsubscribe('mentionProvider', providerHandler);
            providerFactory.unsubscribe(
              'contextIdentifierProvider',
              providerHandler,
            );
          }
          if (mentionProvider) {
            mentionProvider.unsubscribe('mentionPlugin');
          }
        },
      };
    },
  });
}
