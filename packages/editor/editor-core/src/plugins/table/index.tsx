import * as React from 'react';
import { tableEditing, columnResizing } from 'prosemirror-tables';
import { createTable } from 'prosemirror-utils';
import TableIcon from '@atlaskit/icon/glyph/editor/table';
import {
  table,
  tableCell,
  tableHeader,
  tableRow,
} from '@atlaskit/editor-common';
import { EditorPlugin } from '../../types';
import WithPluginState from '../../ui/WithPluginState';
import TableFloatingToolbar from './ui/TableFloatingToolbar';
import { createPlugin, PluginConfig, stateKey } from './pm-plugins/main';
import { keymapPlugin } from './pm-plugins/keymap';
import hoverSelectionPlugin from './pm-plugins/hover-selection-plugin';
import tableColumnResizingPlugin from './pm-plugins/table-column-resizing-plugin';

export const CELL_MIN_WIDTH = 128;

const pluginConfig = (tablesConfig?: PluginConfig | boolean) =>
  !tablesConfig || typeof tablesConfig === 'boolean' ? {} : tablesConfig;

const tablesPlugin: EditorPlugin = {
  nodes() {
    return [
      { rank: 1700, name: 'table', node: table },
      { rank: 1800, name: 'tableHeader', node: tableHeader },
      { rank: 1900, name: 'tableRow', node: tableRow },
      { rank: 2000, name: 'tableCell', node: tableCell },
    ];
  },

  pmPlugins() {
    return [
      {
        rank: 900,
        plugin: ({
          props: { allowTables },
          eventDispatcher,
          dispatch,
          portalProviderAPI,
        }) => {
          return createPlugin(
            dispatch,
            portalProviderAPI,
            eventDispatcher,
            pluginConfig(allowTables),
          );
        },
      },
      {
        rank: 910,
        plugin: ({ props: { allowTables } }) =>
          pluginConfig(allowTables).allowColumnResizing
            ? columnResizing({ handleWidth: 6, cellMinWidth: CELL_MIN_WIDTH })
            : undefined,
      },
      {
        rank: 920,
        plugin: ({ props: { allowTables } }) =>
          pluginConfig(allowTables).allowColumnResizing
            ? tableColumnResizingPlugin
            : undefined,
      },
      // Needs to be lower priority than prosemirror-tables.tableEditing
      // plugin as it is currently swallowing backspace events inside tables
      { rank: 905, plugin: () => keymapPlugin() },
      { rank: 930, plugin: () => tableEditing() },
      { rank: 940, plugin: () => hoverSelectionPlugin },
    ];
  },

  contentComponent({ editorView, popupsMountPoint, popupsBoundariesElement }) {
    return (
      <WithPluginState
        plugins={{ tablesState: stateKey }}
        render={({ tablesState }) => (
          <TableFloatingToolbar
            editorView={editorView}
            popupsMountPoint={popupsMountPoint}
            popupsBoundariesElement={popupsBoundariesElement}
            pluginConfig={tablesState.pluginConfig}
            tableRef={tablesState.tableRef}
            tableLayout={
              tablesState.tableNode
                ? tablesState.tableNode.attrs.layout
                : undefined
            }
            // pass `tableNode` to control re-render
            tableNode={tablesState.tableNode}
          />
        )}
      />
    );
  },

  pluginsOptions: {
    quickInsert: [
      {
        title: 'Table',
        icon: () => <TableIcon label="Table" />,
        action(insert, state) {
          return insert(createTable(state.schema));
        },
      },
    ],
  },
};

export default tablesPlugin;
