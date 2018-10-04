import { EditorState, Transaction } from 'prosemirror-state';
import { hasParentNodeOfType } from 'prosemirror-utils';
import { TableLayout } from '@atlaskit/editor-common';
import { defineMessages } from 'react-intl';

import CenterIcon from '@atlaskit/icon/glyph/editor/media-center';
import WideIcon from '@atlaskit/icon/glyph/editor/media-wide';
import FullWidthIcon from '@atlaskit/icon/glyph/editor/media-full-width';
import RemoveIcon from '@atlaskit/icon/glyph/editor/remove';
import TableDisplayOptionsIcon from '@atlaskit/icon/glyph/editor/table-display-options';

import commonMessages from '../../messages';
import { Command } from '../../types';
import {
  analyticsService as analytics,
  AnalyticsProperties,
} from '../../analytics';
import { FloatingToolbarHandler } from '../floating-toolbar/types';
import { TablePluginState } from './types';
import { pluginKey } from './pm-plugins/main';
import {
  hoverTable,
  deleteTable,
  setTableLayout,
  clearHoverSelection,
  toggleHeaderRow,
  toggleHeaderColumn,
  toggleNumberColumn,
} from './actions';
import {
  checkIfHeaderRowEnabled,
  checkIfHeaderColumnEnabled,
  checkIfNumberColumnEnabled,
} from './utils';

export const messages = defineMessages({
  tableOptions: {
    id: 'fabric.editor.tableOptions',
    defaultMessage: 'Table options',
    description: 'Opens a menu with additional table options',
  },
  headerRow: {
    id: 'fabric.editor.headerRow',
    defaultMessage: 'Header row',
    description: 'Marks the first table row as a header row',
  },
  headerColumn: {
    id: 'fabric.editor.headerColumn',
    defaultMessage: 'Header column',
    description: 'Marks the first table column as a header row',
  },
  numberedColumn: {
    id: 'fabric.editor.numberedColumn',
    defaultMessage: 'Numbered column',
    description: 'Adds an auto-numbering column to your table',
  },
});

const getTableLayout = (tableState: TablePluginState) =>
  tableState.tableNode!.attrs.layout;

const withAnalytics = (
  command: Command,
  eventName: string,
  properties?: AnalyticsProperties,
) => (state: EditorState, dispatch: (tr: Transaction) => void) => {
  analytics.trackEvent(eventName, properties);
  return command(state, dispatch);
};

export const supportsTableLayout = (state: EditorState) => (
  layoutName: TableLayout,
) => {
  const {
    pluginConfig: { permittedLayouts },
  } = pluginKey.getState(state);
  const { bodiedExtension, layoutSection } = state.schema.nodes;
  return (
    !hasParentNodeOfType([layoutSection, bodiedExtension])(state.selection) &&
    (permittedLayouts === 'all' ||
      (permittedLayouts && permittedLayouts.indexOf(layoutName) > -1))
  );
};

export const getToolbarConfig: FloatingToolbarHandler = (
  state,
  { formatMessage },
) => {
  const tableState: TablePluginState | undefined = pluginKey.getState(state);
  if (
    tableState &&
    tableState.tableRef &&
    tableState.tableNode &&
    tableState.pluginConfig
  ) {
    const currentLayout = getTableLayout(tableState);
    const { pluginConfig } = tableState;
    const isLayoutSupported = supportsTableLayout(state);
    return {
      title: 'Table floating controls',
      getDomRef: () => tableState.tableFloatingToolbarTarget!,
      nodeType: state.schema.nodes.table,
      items: [
        {
          type: 'dropdown',
          title: formatMessage(messages.tableOptions),
          icon: TableDisplayOptionsIcon,
          hidden: !(
            pluginConfig.allowHeaderRow && pluginConfig.allowHeaderColumn
          ),
          options: [
            {
              title: formatMessage(messages.headerRow),
              onClick: withAnalytics(
                toggleHeaderRow,
                'atlassian.editor.format.table.toggleHeaderRow.button',
              ),
              selected: checkIfHeaderRowEnabled(state),
              hidden: !pluginConfig.allowHeaderRow,
            },
            {
              title: formatMessage(messages.headerColumn),
              onClick: withAnalytics(
                toggleHeaderColumn,
                'atlassian.editor.format.table.toggleHeaderColumn.button',
              ),
              selected: checkIfHeaderColumnEnabled(state),
              hidden: !pluginConfig.allowHeaderColumn,
            },
            {
              title: formatMessage(messages.numberedColumn),
              selected: checkIfNumberColumnEnabled(state),
              onClick: withAnalytics(
                toggleNumberColumn,
                'atlassian.editor.format.table.toggleNumberColumn.button',
              ),
              hidden: !pluginConfig.allowNumberColumn,
            },
          ],
        },
        {
          type: 'separator',
          hidden: !(
            pluginConfig.allowBackgroundColor &&
            pluginConfig.allowHeaderRow &&
            pluginConfig.allowHeaderColumn &&
            pluginConfig.allowMergeCells
          ),
        },
        {
          type: 'button',
          icon: CenterIcon,
          onClick: setTableLayout('default'),
          selected: currentLayout === 'default',
          title: formatMessage(commonMessages.layoutFixedWidth),
          hidden: !isLayoutSupported('default'),
        },
        {
          type: 'button',
          icon: WideIcon,
          onClick: setTableLayout('wide'),
          selected: currentLayout === 'wide',
          title: formatMessage(commonMessages.layoutWide),
          hidden: !isLayoutSupported('wide'),
        },
        {
          type: 'button',
          icon: FullWidthIcon,
          onClick: setTableLayout('full-width'),
          selected: currentLayout === 'full-width',
          title: formatMessage(commonMessages.layoutFullWidth),
          hidden: !isLayoutSupported('full-width'),
        },
        {
          type: 'separator',
          hidden:
            !pluginConfig.permittedLayouts ||
            (!isLayoutSupported('default') &&
              !isLayoutSupported('wide') &&
              !isLayoutSupported('full-width')),
        },
        {
          type: 'button',
          appearance: 'danger',
          icon: RemoveIcon,
          onClick: deleteTable,
          onMouseEnter: hoverTable(true),
          onMouseLeave: clearHoverSelection,
          title: formatMessage(commonMessages.remove),
        },
      ],
    };
  }
};
