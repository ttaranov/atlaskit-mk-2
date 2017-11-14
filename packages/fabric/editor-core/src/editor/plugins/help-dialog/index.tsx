import * as React from 'react';
import { EditorPlugin } from '../../types';
import { keymap } from 'prosemirror-keymap';
import { Schema } from 'prosemirror-model';
import { Plugin, PluginKey, Transaction, EditorState } from 'prosemirror-state';
import { EditorView } from 'prosemirror-view';
import WithPluginState from '../../ui/WithPluginState';
import HelpDialog from './ui';
import * as keymaps from '../../../keymaps';
import { EventDispatcher } from '../../event-dispatcher';
import { analyticsService } from '../../../analytics';

export const pluginKey = new PluginKey('helpDialogPlugin');

export const openHelpCommand = (tr: Transaction, dispatch: Function): void => {
  tr = tr.setMeta(pluginKey, true);
  dispatch(tr);
};

export const closeHelpCommand = (tr: Transaction, dispatch: Function): void => {
  tr = tr.setMeta(pluginKey, false);
  dispatch(tr);
};

export const stopPropagationCommand = (e: any): void => e.stopPropagation();

export function createPlugin(dispatch: Function) {
  return new Plugin({
    key: pluginKey,
    state: {
      init() {
        return { isVisible: false };
      },
      apply(tr: Transaction, value: any, state: EditorState) {
        const isVisible = tr.getMeta(pluginKey);
        const currentState = pluginKey.getState(state);
        if (isVisible !== undefined && isVisible !== currentState.isVisible) {
          const newState = { isVisible };
          dispatch(pluginKey, newState);
          return newState;
        }
        return currentState;
      }
    }
  });
}

const helpDialog: EditorPlugin = {
  pmPlugins() {
    return [
      { rank: 2200, plugin: (schema, props, dispatch) => createPlugin(dispatch) },
      { rank: 2210, plugin: (schema, props) => keymapPlugin(schema) },
    ];
  },

  contentComponent(editorView: EditorView, eventDispatcher: EventDispatcher) {
    return <WithPluginState
      editorView={editorView}
      eventDispatcher={eventDispatcher}
      plugins={{
        helpDialog: pluginKey
      }}
      // tslint:disable-next-line:jsx-no-lambda
      render={({ helpDialog = {} as any }) => <HelpDialog editorView={editorView} isVisible={helpDialog.isVisible} />}
    />;
  }
};

const  keymapPlugin = (schema: Schema): Plugin => {
  const list = {};
  keymaps.bindKeymapWithCommand(
    keymaps.openHelp.common!,
    (state: any, dispatch: Function): boolean => {
      let { tr } = state;
      const isVisible = tr.getMeta(pluginKey);
      if (!isVisible) {
        analyticsService.trackEvent('atlassian.editor.help.keyboard');
        openHelpCommand(tr, dispatch);
      }
      return true;
    }, list);
  return keymap(list);
};

export default helpDialog;
