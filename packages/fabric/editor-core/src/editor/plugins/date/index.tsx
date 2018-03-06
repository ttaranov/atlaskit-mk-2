import * as React from 'react';
import { date } from '@atlaskit/editor-common';
import { EditorPlugin } from '../../types';
import createPlugin, { DateState, pluginKey } from './plugin';
import WithPluginState from '../../ui/WithPluginState';
import DatePicker from '../../../ui/DatePicker';
import { insertDate, selectElement } from '../date/actions';

const datePlugin: EditorPlugin = {
  nodes() {
    return [{ rank: 2400, name: 'date', node: date }];
  },

  pmPlugins() {
    return [
      {
        rank: 2410,
        plugin: ({ schema, props, dispatch, providerFactory }) =>
          createPlugin(dispatch, providerFactory),
      },
    ];
  },

  contentComponent({
    editorView,
    eventDispatcher,
    providerFactory,
    appearance,
  }) {
    const { dispatch } = editorView;
    return (
      <WithPluginState
        editorView={editorView}
        eventDispatcher={eventDispatcher}
        plugins={{
          dateState: pluginKey,
        }}
        render={({ dateState = {} as DateState }) =>
          dateState.element ? (
            <DatePicker
              element={dateState.element}
              onSelect={({ iso }) =>
                insertDate(iso)(editorView.state, dispatch)
              }
              onClickOutside={() =>
                selectElement(null)(editorView.state, dispatch)
              }
            />
          ) : null
        }
      />
    );
  },
};

export default datePlugin;
