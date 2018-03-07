import * as React from 'react';
import {
  table,
  tableCell,
  tableHeader,
  tableRow,
} from '@atlaskit/editor-common';
import { tableEditing, columnResizing } from 'prosemirror-tables';
import { EditorPlugin } from '../../types';
import { plugin, PluginConfig, stateKey } from '../../../plugins/table';
import { keymapPlugin } from '../../../plugins/table/keymap';
import hoverSelectionPlugin from './hover-selection-plugin';
import tableNumberColumnPlugin from './number-column-plugin';
import tableColumnResizingPlugin from './table-column-resizing-plugin';
import TableFloatingToolbar from '../../../ui/TableFloatingToolbar';
import WithPluginState from '../../ui/WithPluginState';

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
        plugin: ({ props: { allowTables } }) => {
          return plugin(pluginConfig(allowTables));
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

  contentComponent({
    editorView,
    eventDispatcher,
    popupsMountPoint,
    popupsBoundariesElement,
  }) {
    return (
      <WithPluginState
        editorView={editorView}
        eventDispatcher={eventDispatcher}
        plugins={{ tablesState: stateKey }}
        render={({ tablesState }) => (
          <TableFloatingToolbar
            editorView={editorView}
            popupsMountPoint={popupsMountPoint}
            popupsBoundariesElement={popupsBoundariesElement}
            tableElement={tablesState.tableElement}
            tableActive={tablesState.tableActive}
            cellSelection={tablesState.cellSelection}
            remove={tablesState.remove}
            allowMergeCells={tablesState.allowMergeCells}
            allowNumberColumn={tablesState.allowNumberColumn}
            allowBackgroundColor={tablesState.allowBackgroundColor}
            allowHeaderRow={tablesState.allowHeaderRow}
            allowHeaderColumn={tablesState.allowHeaderColumn}
          />
        )}
      />
    );
  },
};

export default tablesPlugin;
