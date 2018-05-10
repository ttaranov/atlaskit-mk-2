import * as React from 'react';
import { tableEditing, columnResizing } from 'prosemirror-tables';
import { removeTable } from 'prosemirror-utils';
import {
  table,
  tableCell,
  tableHeader,
  tableRow,
  slider,
  checkbox,
} from '@atlaskit/editor-common';
import { EditorPlugin } from '../../types';
import WithPluginState from '../../ui/WithPluginState';
import TableFloatingToolbar from './ui/TableFloatingToolbar';
import { createPlugin, PluginConfig, stateKey } from './pm-plugins/main';
import { keymapPlugin } from './pm-plugins/keymap';
import hoverSelectionPlugin from './pm-plugins/hover-selection-plugin';
import tableNumberColumnPlugin from './pm-plugins/number-column-plugin';
import tableColumnResizingPlugin from './pm-plugins/table-column-resizing-plugin';
import FloatingContextualMenu from './ui/FloatingContextualMenu';
import contextualMenu, {
  pluginKey as contextualMenuPluginkey,
  setClickedCell,
  setDateIntoClickedCell,
} from './pm-plugins/contextual-menu-plugin';
import { pluginKey as datePluginKey } from '../date/plugin';
import DatePicker from './ui/DatePicker';

const pluginConfig = (tablesConfig?: PluginConfig | boolean) =>
  !tablesConfig || typeof tablesConfig === 'boolean' ? {} : tablesConfig;

const tablesPlugin: EditorPlugin = {
  nodes() {
    return [
      { rank: 1700, name: 'slider', node: slider },
      { rank: 1700, name: 'checkbox', node: checkbox },
      { rank: 1710, name: 'table', node: table },
      { rank: 1800, name: 'tableHeader', node: tableHeader },
      { rank: 1900, name: 'tableRow', node: tableRow },
      { rank: 2000, name: 'tableCell', node: tableCell },
    ];
  },

  pmPlugins() {
    return [
      {
        rank: 900,
        plugin: ({ props: { allowTables }, eventDispatcher, dispatch }) => {
          return createPlugin(
            dispatch,
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
      { rank: 50, plugin: ({ dispatch }) => contextualMenu(dispatch) },
    ];
  },

  contentComponent({
    editorView,
    providerFactory,
    popupsMountPoint,
    popupsBoundariesElement,
  }) {
    const { dispatch } = editorView;

    return (
      <WithPluginState
        plugins={{
          tablesState: stateKey,
          tableContextualMenuState: contextualMenuPluginkey,
          dateState: datePluginKey,
        }}
        render={({ tablesState, tableContextualMenuState }) => (
          <div>
            <TableFloatingToolbar
              editorView={editorView}
              popupsMountPoint={popupsMountPoint}
              popupsBoundariesElement={popupsBoundariesElement}
              tableElement={tablesState.tableElement}
              tableActive={tablesState.tableActive}
              cellSelection={tablesState.cellSelection}
              remove={() => dispatch(removeTable(editorView.state.tr))}
              tableLayout={tablesState.tableLayout}
              updateLayout={tablesState.setTableLayout}
              allowNumberColumn={tablesState.allowNumberColumn}
              allowHeaderRow={tablesState.allowHeaderRow}
              allowHeaderColumn={tablesState.allowHeaderColumn}
              stickToolbarToBottom={tablesState.stickToolbarToBottom}
              permittedLayouts={tablesState.permittedLayouts}
            />
            <FloatingContextualMenu
              editorView={editorView}
              targetRef={tableContextualMenuState.targetRef}
              targetPosition={tableContextualMenuState.targetPosition}
              isOpen={tableContextualMenuState.isOpen}
              allowMergeCells={tablesState.allowMergeCells}
              allowBackgroundColor={tablesState.allowBackgroundColor}
            />
            <DatePicker
              editorView={editorView}
              clickedCell={tableContextualMenuState.clickedCell}
              onSelect={({ iso }) => {
                setDateIntoClickedCell(iso)(editorView.state, dispatch);
              }}
              onClickOutside={(event: Event) => {
                if (!editorView.dom.contains(event.target as HTMLElement)) {
                  setClickedCell(undefined)(editorView.state, dispatch);
                }
              }}
            />
          </div>
        )}
      />
    );
  },
};

export default tablesPlugin;
