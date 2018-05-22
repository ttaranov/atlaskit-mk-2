import * as React from 'react';
import { date } from '@atlaskit/editor-common';
import { EditorPlugin } from '../../types';
import WithPluginState from '../../ui/WithPluginState';
import { insertDate, selectElement } from './actions';
import createPlugin, { DateState, pluginKey } from './plugin';
import DatePicker from './ui/DatePicker';

export type DateType = {
  year: number;
  month: number;
  day?: number;
};

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

  contentComponent({ editorView }) {
    const { dispatch } = editorView;
    return (
      <WithPluginState
        plugins={{
          dateState: pluginKey,
        }}
        render={({ dateState = {} as DateState }) =>
          dateState.element ? (
            <DatePicker
              element={dateState.element}
              onSelect={date => insertDate(date)(editorView.state, dispatch)}
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
