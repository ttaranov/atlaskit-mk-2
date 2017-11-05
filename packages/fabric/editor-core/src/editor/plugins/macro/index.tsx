import * as React from 'react';
import { EditorPlugin } from '../../types';
import { inlineMacro } from '@atlaskit/editor-common';
import { createPlugin, pluginKey, MacroState } from './plugin';
import MacroEdit from '../../../ui/MacroEdit';
import WithPluginState from '../../ui/WithPluginState';
import { insertMacroFromMacroBrowser, removeMacro } from '../macro/actions';

const macroPlugin: EditorPlugin = {
  nodes() {
    return [
      { rank: 2300, name: 'inlineMacro', node: inlineMacro  },
    ];
  },

  pmPlugins() {
    return [
      { rank: 2310, plugin: (schema, props, dispatch, providerFactory) => createPlugin(dispatch, providerFactory) }
    ];
  },

  contentComponent(editorView, eventDispatcher, providerFactory, appearance) {
    return (
      <WithPluginState
        editorView={editorView}
        eventDispatcher={eventDispatcher}
        plugins={{ macroState: pluginKey }}
        // tslint:disable-next-line:jsx-no-lambda
        render={({ macroState = {} as MacroState }) => (
          <MacroEdit
            editorView={editorView}
            macroElement={macroState.macroElement}
            macroProvider={macroState.macroProvider}
            onRemoveMacro={removeMacro}
            onInsertMacroFromMacroBrowser={insertMacroFromMacroBrowser}
          />
        )}
      />
    );
  }
};

export default macroPlugin;
