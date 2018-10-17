import * as React from 'react';
import { keymap } from 'prosemirror-keymap';
import { Schema } from 'prosemirror-model';
import { Plugin, PluginKey, Transaction, EditorState } from 'prosemirror-state';
import { EditorPlugin } from '../../types';
import * as keymaps from '../../keymaps';
import { analyticsService } from '../../analytics';
import WithPluginState from '../../ui/WithPluginState';
import { HelpDialogLoader } from './ui/HelpDialogLoader';
import { pluginKey as quickInsertPluginKey } from '../quick-insert';

export const pluginKey = new PluginKey('helpDialogPlugin');

export const openHelpCommand = (tr: Transaction, dispatch: Function): void => {
  tr = tr.setMeta(pluginKey, true);
  dispatch(tr);
};

export const closeHelpCommand = (tr: Transaction, dispatch: Function): void => {
  tr = tr.setMeta(pluginKey, false);
  dispatch(tr);
};

export const stopPropagationCommand = (e: Event): void => e.stopPropagation();

export function createPlugin(dispatch: Function, imageEnabled: boolean) {
  return new Plugin({
    key: pluginKey,
    state: {
      init() {
        return { isVisible: false, imageEnabled };
      },
      apply(tr: Transaction, value: any, state: EditorState) {
        const isVisible = tr.getMeta(pluginKey);
        const currentState = pluginKey.getState(state);
        if (isVisible !== undefined && isVisible !== currentState.isVisible) {
          const newState = { ...currentState, isVisible };
          dispatch(pluginKey, newState);
          return newState;
        }
        return currentState;
      },
    },
  });
}

const helpDialog: EditorPlugin = {
  pmPlugins() {
    return [
      {
        name: 'helpDialog',
        plugin: ({ dispatch, props: { legacyImageUploadProvider } }) =>
          createPlugin(dispatch, !!legacyImageUploadProvider),
      },
      {
        name: 'helpDialogKeymap',
        plugin: ({ schema }) => keymapPlugin(schema),
      },
    ];
  },

  contentComponent({ editorView, appearance }) {
    return (
      <WithPluginState
        plugins={{
          helpDialog: pluginKey,
          quickInsert: quickInsertPluginKey,
        }}
        render={({ helpDialog = {} as any, quickInsert }) => (
          <HelpDialogLoader
            appearance={appearance}
            editorView={editorView}
            isVisible={helpDialog.isVisible}
            quickInsertEnabled={!!quickInsert}
            imageEnabled={helpDialog.imageEnabled}
          />
        )}
      />
    );
  },
};

const keymapPlugin = (schema: Schema): Plugin => {
  const list = {};
  keymaps.bindKeymapWithCommand(
    keymaps.openHelp.common!,
    (state, dispatch) => {
      let { tr } = state;
      const isVisible = tr.getMeta(pluginKey);
      if (!isVisible) {
        analyticsService.trackEvent('atlassian.editor.help.keyboard');
        openHelpCommand(tr, dispatch);
      }
      return true;
    },
    list,
  );
  return keymap(list);
};

export default helpDialog;
