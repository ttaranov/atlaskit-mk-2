import * as React from 'react';
import { Mark } from 'prosemirror-model';
import { link, WithProviders } from '@atlaskit/editor-common';
import { EditorPlugin } from '../../types';
import WithPluginState from '../../ui/WithPluginState';
import { createInputRulePlugin } from './pm-plugins/input-rule';
import { createKeymapPlugin } from './pm-plugins/keymap';
import {
  plugin,
  stateKey,
  HyperlinkState,
  InsertStatus,
} from './pm-plugins/main';
import {
  AddLinkDisplayTextToolbar,
  EditLinkHrefToolbar,
  InsertLinkToolbar,
  ActivityPoweredInsertLinkToolbar,
} from './ui';
import { normalizeUrl } from './utils';
import fakeCursorToolbarPlugin from './pm-plugins/fake-cursor-for-toolbar';

const hyperlinkPlugin: EditorPlugin = {
  marks() {
    return [{ name: 'link', mark: link, rank: 100 }];
  },

  pmPlugins() {
    return [
      { rank: 900, plugin: ({ dispatch }) => plugin(dispatch) },
      { rank: 905, plugin: () => fakeCursorToolbarPlugin },
      { rank: 910, plugin: ({ schema }) => createInputRulePlugin(schema) },
      {
        rank: 920,
        plugin: ({ schema, props }) => createKeymapPlugin(schema, props),
      },
    ];
  },

  contentComponent({
    editorView,
    popupsMountPoint,
    popupsBoundariesElement,
    providerFactory,
  }) {
    const renderToolbar = providers => (
      <WithPluginState
        plugins={{ hyperlinkState: stateKey }}
        render={({ hyperlinkState }: { hyperlinkState?: HyperlinkState }) => {
          if (hyperlinkState && hyperlinkState.activeLinkMark) {
            if (
              hyperlinkState.activeLinkMark.type ===
              InsertStatus.EDIT_LINK_TOOLBAR
            ) {
              const { node, pos } = hyperlinkState.activeLinkMark;
              const mark = editorView.state.schema.marks.link.isInSet(
                node.marks,
              ) as Mark;
              const isLinkTextTheSameAsTheLinkUrl =
                mark.attrs.href === normalizeUrl(node.text!);
              const Toolbar = isLinkTextTheSameAsTheLinkUrl
                ? AddLinkDisplayTextToolbar
                : EditLinkHrefToolbar;
              return (
                <Toolbar
                  pos={pos}
                  node={node}
                  view={editorView}
                  popupsMountPoint={popupsMountPoint}
                  popupsBoundariesElement={popupsBoundariesElement}
                />
              );
            } else if (
              hyperlinkState.activeLinkMark.type ===
              InsertStatus.INSERT_LINK_TOOLBAR
            ) {
              const { from, to } = hyperlinkState.activeLinkMark;
              if (providers && providers.activityProvider) {
                return (
                  <ActivityPoweredInsertLinkToolbar
                    from={from}
                    to={to}
                    view={editorView}
                    popupsMountPoint={popupsMountPoint}
                    popupsBoundariesElement={popupsBoundariesElement}
                    activityProvider={providers.activityProvider}
                  />
                );
              } else {
                return (
                  <InsertLinkToolbar
                    from={from}
                    to={to}
                    view={editorView}
                    popupsMountPoint={popupsMountPoint}
                    popupsBoundariesElement={popupsBoundariesElement}
                  />
                );
              }
            }
          }
          return null;
        }}
      />
    );

    return (
      <WithProviders
        providerFactory={providerFactory}
        providers={['activityProvider']}
        renderNode={renderToolbar}
      />
    );
  },
};

export default hyperlinkPlugin;
