import * as React from 'react';
import { tableEditing, columnResizing } from 'prosemirror-tables';
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
import { createTableNode } from './utils';
import { createPlugin, PluginConfig, stateKey } from './pm-plugins/main';
import { keymapPlugin } from './pm-plugins/keymap';
import hoverSelectionPlugin from './pm-plugins/hover-selection-plugin';
import tableNumberColumnPlugin from './pm-plugins/number-column-plugin';
import tableColumnResizingPlugin from './pm-plugins/table-column-resizing-plugin';

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
            ? columnResizing({ handleWidth: 6 })
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
      {
        rank: 920,
        plugin: ({ props: { allowTables } }) =>
          pluginConfig(allowTables).allowNumberColumn
            ? tableNumberColumnPlugin
            : undefined,
      },
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
            tableElement={tablesState.tableElement}
            tableActive={tablesState.tableActive}
            cellSelection={tablesState.cellSelection}
            removeTable={tablesState.removeTable}
            tableLayout={tablesState.tableLayout}
            updateLayout={tablesState.setTableLayout}
            isLayoutSupported={tablesState.isLayoutSupported}
            allowMergeCells={tablesState.allowMergeCells}
            allowNumberColumn={tablesState.allowNumberColumn}
            allowBackgroundColor={tablesState.allowBackgroundColor}
            allowHeaderRow={tablesState.allowHeaderRow}
            allowHeaderColumn={tablesState.allowHeaderColumn}
            stickToolbarToBottom={tablesState.stickToolbarToBottom}
            permittedLayouts={tablesState.permittedLayouts}
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
          return insert(createTableNode(3, 3, state.schema));
        },
      },
    ],
  },
};

export default tablesPlugin;
