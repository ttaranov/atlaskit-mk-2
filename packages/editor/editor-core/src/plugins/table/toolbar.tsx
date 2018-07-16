import * as React from 'react';
import styled from 'styled-components';
import { EditorState, Transaction } from 'prosemirror-state';
import { splitCell, mergeCells } from 'prosemirror-tables';
import { hasParentNodeOfType } from 'prosemirror-utils';
import {
  tableBackgroundColorPalette,
  tableBackgroundBorderColors,
  TableLayout,
} from '@atlaskit/editor-common';
import CenterIcon from '@atlaskit/icon/glyph/editor/media-center';
import WideIcon from '@atlaskit/icon/glyph/editor/media-wide';
import FullWidthIcon from '@atlaskit/icon/glyph/editor/media-full-width';
import RemoveIcon from '@atlaskit/icon/glyph/editor/remove';
import TableDisplayOptionsIcon from '@atlaskit/icon/glyph/editor/table-display-options';
import EditorMoreIcon from '@atlaskit/icon/glyph/editor/more';
import BackgroundColorIcon from '@atlaskit/icon/glyph/editor/background-color';

import { Command } from '../../types';
import ColorPalette from '../../ui/ColorPalette';
import {
  analyticsService as analytics,
  AnalyticsProperties,
} from '../../analytics';
import {
  FloatingToolbarHandler,
  RenderOptionsProps,
} from '../floating-toolbar/types';
import { pluginKey, TablePluginState } from './pm-plugins/main';
import {
  hoverTable,
  deleteTable,
  setCellAttr,
  setTableLayout,
  resetHoverSelection,
  toggleHeaderRow,
  toggleHeaderColumn,
  toggleNumberColumn,
} from './actions';
import {
  checkIfHeaderRowEnabled,
  checkIfHeaderColumnEnabled,
  checkIfNumberColumnEnabled,
} from './utils';

const getTableLayout = (tableState: TablePluginState) =>
  tableState.tableNode!.attrs.layout;

const ColorPaletteContainer = styled.div`
  width: 144px;
`;

const colorPaletteOptions = ({ hide, dispatchCommand }: RenderOptionsProps) => (
  <ColorPaletteContainer>
    <ColorPalette
      palette={tableBackgroundColorPalette}
      borderColors={tableBackgroundBorderColors}
      onClick={color => {
        hide();
        dispatchCommand(setCellAttr('background', color));
      }}
    />
  </ColorPaletteContainer>
);

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

export const getToolbarConfig: FloatingToolbarHandler = state => {
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
      target: tableState.tableRef,
      items: [
        {
          type: 'dropdown',
          title: 'Cell background color',
          icon: BackgroundColorIcon,
          options: colorPaletteOptions,
          hidden: !pluginConfig.allowBackgroundColor,
        },
        {
          type: 'dropdown',
          title: 'Table display options',
          icon: TableDisplayOptionsIcon,
          hidden: !(
            pluginConfig.allowHeaderRow && pluginConfig.allowHeaderColumn
          ),
          options: [
            {
              title: 'Header row',
              onClick: withAnalytics(
                toggleHeaderRow,
                'atlassian.editor.format.table.toggleHeaderRow.button',
              ),
              selected: checkIfHeaderRowEnabled(state),
              hidden: !pluginConfig.allowHeaderRow,
            },
            {
              title: 'Header column',
              onClick: withAnalytics(
                toggleHeaderColumn,
                'atlassian.editor.format.table.toggleHeaderColumn.button',
              ),
              selected: checkIfHeaderColumnEnabled(state),
              hidden: !pluginConfig.allowHeaderColumn,
            },
            {
              title: 'Number column',
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
          type: 'dropdown',
          title: 'More',
          icon: EditorMoreIcon,
          hideExpandIcon: true,
          hidden: !pluginConfig.allowMergeCells,
          options: [
            {
              title: 'Merge cells',
              onClick: withAnalytics(
                mergeCells,
                'atlassian.editor.format.table.merge.button',
              ),
              // Move the logic inside plugin
              disabled: !mergeCells(state),
            },
            {
              title: 'Split cell',
              onClick: withAnalytics(
                splitCell,
                'atlassian.editor.format.table.split.button',
              ),
              disabled: !splitCell(state),
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
          title: 'Center',
          hidden: !isLayoutSupported('default'),
        },
        {
          type: 'button',
          icon: WideIcon,
          onClick: setTableLayout('wide'),
          selected: currentLayout === 'wide',
          title: 'Wide',
          hidden: !isLayoutSupported('wide'),
        },
        {
          type: 'button',
          icon: FullWidthIcon,
          onClick: setTableLayout('full-width'),
          selected: currentLayout === 'full-width',
          title: 'Full width',
          hidden: !isLayoutSupported('full-width'),
        },
        {
          type: 'separator',
          hidden: !pluginConfig.permittedLayouts,
        },
        {
          type: 'button',
          appearance: 'danger',
          icon: RemoveIcon,
          onClick: deleteTable,
          onMouseEnter: hoverTable(true),
          onMouseLeave: resetHoverSelection,
          title: 'Remove table',
        },
      ],
    };
  }
};
