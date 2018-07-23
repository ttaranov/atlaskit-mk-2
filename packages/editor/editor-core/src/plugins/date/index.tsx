import * as React from 'react';
import EditorDateIcon from '@atlaskit/icon/glyph/editor/date';
import { date } from '@atlaskit/editor-common';
import { EditorPlugin } from '../../types';
import WithPluginState from '../../ui/WithPluginState';
import { insertDate, selectElement } from './actions';
import createDatePlugin, { DateState, pluginKey } from './plugin';
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
        plugin: createDatePlugin,
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
              closeDatePicker={() =>
                selectElement(null)(editorView.state, dispatch)
              }
            />
          ) : null
        }
      />
    );
  },

  pluginsOptions: {
    quickInsert: [
      {
        title: 'Date',
        priority: 800,
        keywords: ['time', '/'],
        icon: () => <EditorDateIcon label="Date" />,
        action(insert, state) {
          return insert(
            state.schema.nodes.date.createChecked({ timestamp: Date.now() }),
          );
        },
      },
    ],
  },
};

export default datePlugin;
