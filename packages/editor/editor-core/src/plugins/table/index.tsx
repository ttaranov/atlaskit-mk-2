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
import { PluginConfig } from './types';
import { createPlugin, pluginKey } from './pm-plugins/main';
import {
  createColumnTypesPlugin,
  pluginKey as columnTypesPluginKey,
  setClickedCell,
  setDateIntoClickedCell,
} from './pm-plugins/column-types';
import { keymapPlugin } from './pm-plugins/keymap';
import tableColumnResizingPlugin from './pm-plugins/table-column-resizing-plugin';
import { getToolbarConfig } from './toolbar';
import FloatingContextualMenu from './ui/FloatingContextualMenu';
import WithPluginState from '../../ui/WithPluginState';
import DatePicker from './ui/DatePicker';
import SummaryMenu from './ui/SummaryMenu';
import ColumnTypesMenu from './ui/ColumnTypesMenu';

export const CELL_MIN_WIDTH = 128;

const pluginConfig = (tablesConfig?: PluginConfig | boolean) =>
  !tablesConfig || typeof tablesConfig === 'boolean' ? {} : tablesConfig;

const tablesPlugin = (options?: PluginConfig | boolean): EditorPlugin => ({
  nodes() {
    return [
      { name: 'table', node: table },
      { name: 'tableHeader', node: tableHeader },
      { name: 'tableRow', node: tableRow },
      { name: 'tableCell', node: tableCell },
    ];
  },

  pmPlugins() {
    return [
      {
        name: 'table',
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
        name: 'columnTypes',
        plugin: ({
          props: { allowTables },
          eventDispatcher,
          dispatch,
          portalProviderAPI,
        }) => {
          return createColumnTypesPlugin(
            dispatch,
            portalProviderAPI,
            eventDispatcher,
            pluginConfig(allowTables),
          );
        },
      },
      {
        name: 'tablePMColResizing',
        plugin: ({ props: { allowTables } }) =>
          pluginConfig(allowTables).allowColumnResizing
            ? columnResizing({ handleWidth: 6, cellMinWidth: CELL_MIN_WIDTH })
            : undefined,
      },
      {
        name: 'tableColResizing',
        plugin: ({ props: { allowTables } }) =>
          pluginConfig(allowTables).allowColumnResizing
            ? tableColumnResizingPlugin
            : undefined,
      },
      // Needs to be lower priority than prosemirror-tables.tableEditing
      // plugin as it is currently swallowing backspace events inside tables
      { name: 'tableKeymap', plugin: () => keymapPlugin() },
      { name: 'tableEditing', plugin: () => tableEditing() },
    ];
  },

  contentComponent({ editorView, popupsMountPoint, popupsBoundariesElement }) {
    const config = pluginConfig(options);
    if (!config.allowMergeCells && !config.allowBackgroundColor) {
      return null;
    }

    return (
      <WithPluginState
        plugins={{
          tablesState: pluginKey,
          columnTypesState: columnTypesPluginKey,
        }}
        render={({ tablesState, columnTypesState }) => {
          const { tableNode } = tablesState;
          if (tableNode && tableNode.attrs.viewMode !== 'table') {
            return null;
          }
          const { dispatch } = editorView;

          return (
            <>
              <FloatingContextualMenu
                editorView={editorView}
                mountPoint={popupsMountPoint}
                boundariesElement={popupsBoundariesElement}
                targetCellRef={tablesState.targetCellRef}
                targetCellPosition={tablesState.targetCellPosition}
                isOpen={tablesState.isContextualMenuOpen}
                pluginConfig={tablesState.pluginConfig}
              />
              <DatePicker
                editorView={editorView}
                clickedCell={columnTypesState.clickedCell}
                onSelect={({ iso }) => {
                  setDateIntoClickedCell(iso)(editorView.state, dispatch);
                }}
                onClickOutside={(event: Event) => {
                  if (!editorView.dom.contains(event.target as HTMLElement)) {
                    setClickedCell(undefined)(editorView.state, dispatch);
                  }
                }}
              />
              <SummaryMenu
                editorView={editorView}
                clickedCell={columnTypesState.clickedCell}
                onClickOutside={(event: Event) => {
                  if (!editorView.dom.contains(event.target as HTMLElement)) {
                    setClickedCell(undefined)(editorView.state, dispatch);
                  }
                }}
              />
              <ColumnTypesMenu
                editorView={editorView}
                mountPoint={popupsMountPoint}
                boundariesElement={popupsBoundariesElement}
                targetColumnRef={columnTypesState.targetColumnRef}
                columnIndex={columnTypesState.columnIndex}
              />
            </>
          );
        }}
      />
    );
  },

  pluginsOptions: {
    quickInsert: [
      {
        title: 'Table',
        priority: 600,
        icon: () => <TableIcon label="Table" />,
        action(insert, state) {
          return insert(createTable(state.schema));
        },
      },
    ],
    floatingToolbar: getToolbarConfig,
  },
});

export default tablesPlugin;
