import * as React from 'react';
import Objects24CalendarIcon from '@atlaskit/icon/glyph/objects/24/calendar';
import { colors } from '@atlaskit/theme';
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

  pluginsOptions: {
    quickInsert: [
      {
        title: 'Date',
        keywords: ['time'],
        icon: () => (
          <Objects24CalendarIcon label="Date" primaryColor={colors.R300} />
        ),
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
