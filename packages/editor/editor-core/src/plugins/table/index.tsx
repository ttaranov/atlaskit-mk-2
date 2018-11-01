import * as React from 'react';
import {
  tableEditing,
  columnResizing,
  columnResizingPluginKey,
} from 'prosemirror-tables';
import { createTable } from 'prosemirror-utils';
import { PluginKey } from 'prosemirror-state';
import TableIcon from '@atlaskit/icon/glyph/editor/table';
import {
  table,
  tableCell,
  tableHeader,
  tableRow,
} from '@atlaskit/editor-common';

import LayoutButton from './ui/LayoutButton';
import { EditorPlugin } from '../../types';
import WithPluginState from '../../ui/WithPluginState';
import { messages } from '../insert-block/ui/ToolbarInsertBlock';
import { PluginConfig, PermittedLayoutsDescriptor } from './types';
import { createPlugin, pluginKey } from './pm-plugins/main';
import { keymapPlugin } from './pm-plugins/keymap';
import tableColumnResizingPlugin from './pm-plugins/table-column-resizing-plugin';
import {
  columnResizing as flexiResizing,
  key as flexiResizingPluginKey,
} from './pm-plugins/table-resizing';
import { getToolbarConfig } from './toolbar';
import FloatingContextualMenu from './ui/FloatingContextualMenu';
import { isLayoutSupported } from './utils';

export const CELL_MIN_WIDTH = 128;
export const getCellMinWidth = newResizing =>
  newResizing ? 48 : CELL_MIN_WIDTH;

export const pluginConfig = (tablesConfig?: PluginConfig | boolean) => {
  const config =
    !tablesConfig || typeof tablesConfig === 'boolean' ? {} : tablesConfig;
  return config.advanced
    ? {
        allowBackgroundColor: true,
        allowColumnResizing: true,
        allowHeaderColumn: true,
        allowHeaderRow: true,
        allowMergeCells: true,
        allowNumberColumn: true,
        stickToolbarToBottom: true,
        permittedLayouts: 'all' as PermittedLayoutsDescriptor,
        allowControls: true,
        ...config,
      }
    : config;
};

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
        name: 'tablePMColResizing',
        plugin: ({ props: { allowTables } }) =>
          getPMColResizingPlugin(pluginConfig(allowTables)),
      },
      {
        name: 'tableColResizing',
        plugin: ({ props: { allowTables } }) => {
          const config = pluginConfig(allowTables);

          return config.allowColumnResizing &&
            !config.UNSAFE_allowFlexiColumnResizing
            ? tableColumnResizingPlugin
            : undefined;
        },
      },
      // Needs to be lower priority than prosemirror-tables.tableEditing
      // plugin as it is currently swallowing backspace events inside tables
      { name: 'tableKeymap', plugin: () => keymapPlugin() },
      { name: 'tableEditing', plugin: () => tableEditing() },
    ];
  },

  contentComponent({
    editorView,
    popupsMountPoint,
    popupsBoundariesElement,
    popupsScrollableElement,
  }) {
    return (
      <WithPluginState
        plugins={{
          pluginState: pluginKey,
        }}
        render={({ pluginState }) => (
          <>
            <FloatingContextualMenu
              editorView={editorView}
              mountPoint={popupsMountPoint}
              boundariesElement={popupsBoundariesElement}
              targetCellPosition={pluginState.targetCellPosition}
              isOpen={pluginState.isContextualMenuOpen}
              pluginConfig={pluginState.pluginConfig}
            />
            {isLayoutSupported(editorView.state) && (
              <LayoutButton
                editorView={editorView}
                mountPoint={popupsMountPoint}
                boundariesElement={popupsBoundariesElement}
                scrollableElement={popupsScrollableElement}
                targetRef={pluginState.tableFloatingToolbarTarget}
              />
            )}
          </>
        )}
      />
    );
  },

  pluginsOptions: {
    quickInsert: ({ formatMessage }) => [
      {
        title: formatMessage(messages.table),
        priority: 600,
        icon: () => <TableIcon label={formatMessage(messages.table)} />,
        action(insert, state) {
          return insert(createTable(state.schema));
        },
      },
    ],
    floatingToolbar: getToolbarConfig,
  },
});

export const getColResizePluginKey = (pluginConfig: PluginConfig) => {
  if (pluginConfig.UNSAFE_allowFlexiColumnResizing) {
    return flexiResizingPluginKey as PluginKey;
  }

  return columnResizingPluginKey as PluginKey;
};

const getPMColResizingPlugin = (pluginConfig: PluginConfig) => {
  if (
    pluginConfig.UNSAFE_allowFlexiColumnResizing &&
    pluginConfig.allowColumnResizing
  ) {
    return flexiResizing({
      handleWidth: 6,
      cellMinWidth: getCellMinWidth(true),
    });
  } else if (pluginConfig.allowColumnResizing) {
    return columnResizing({
      handleWidth: 6,
      cellMinWidth: getCellMinWidth(false),
    });
  }
};

export default tablesPlugin;
