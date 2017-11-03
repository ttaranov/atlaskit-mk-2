import * as React from 'react';
import { table, tableCell, tableHeader, tableRow } from '@atlaskit/editor-common';
import { tableEditing } from 'prosemirror-tables';
import { EditorPlugin } from '../../types';
import { plugin, stateKey } from '../../../plugins/table';
import TableFloatingControls from '../../../ui/TableFloatingControls';
import TableFloatingToolbar from '../../../ui/TableFloatingToolbar';

const tablesPlugin: EditorPlugin = {
  nodes() {
    return [
      { rank: 1700, name: 'table', node: table },
      { rank: 1800, name: 'tableHeader', node: tableHeader },
      { rank: 1900, name: 'tableRow', node: tableRow },
      { rank: 2000, name: 'tableCell', node: tableCell }
    ];
  },

  pmPlugins() {
    return [
      { rank: 900, plugin: () => plugin() },
      { rank: 910, plugin: () => tableEditing() },
    ];
  },

  contentComponent(editorView, eventDispatcher, providerFactory, appearance, popupsMountPoint, popupsBoundariesElement) {
    const pluginState = stateKey.getState(editorView.state);

    return (
      <div>
        <TableFloatingControls editorView={editorView} pluginState={pluginState} />
        <TableFloatingToolbar editorView={editorView} pluginState={pluginState} popupsMountPoint={popupsMountPoint} popupsBoundariesElement={popupsBoundariesElement} />
      </div>
    );
  }
};

export default tablesPlugin;
