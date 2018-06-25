import styled from 'styled-components';
import { HTMLAttributes, ComponentClass, Component } from 'react';
import * as React from 'react';
import { EditorView } from 'prosemirror-view';
import { hasParentNodeOfType } from 'prosemirror-utils';

import {
  Popup,
  TableLayout,
  tableBackgroundColorPalette,
  tableBackgroundBorderColors,
} from '@atlaskit/editor-common';
import RemoveIcon from '@atlaskit/icon/glyph/editor/remove';
import FullWidthIcon from '@atlaskit/icon/glyph/editor/media-full-width';
import WideIcon from '@atlaskit/icon/glyph/editor/media-wide';
import CenterIcon from '@atlaskit/icon/glyph/editor/media-center';

import { PluginConfig } from '../../pm-plugins/main';
import { ToolbarButton, ToolbarButtonDanger, Separator } from './styles';
import AdvanceMenu from './AdvanceMenu';
import BackgroundColorMenu from './BackgroundColorMenu';
import DisplayOptionsMenu from './DisplayOptionsMenu';
import { dropShadow } from '../../../../ui/styles';

import {
  hoverTable,
  resetHoverSelection,
  deleteTable,
  setTableLayout,
} from '../../actions';

// `Popup` doesn't work with -ve `offset` if it goes outside of the container hence the -ve margin
export const Toolbar: ComponentClass<HTMLAttributes<{}>> = styled.div`
  margin-top: -8px;
  background-color: white;
  border-radius: 3px;
  ${dropShadow} padding: 4px 8px;
  display: flex;

  & > div:last-child button {
    margin-right: 0;
  }
  & > div:first-child button {
    margin-left: 0;
  }
`;

export interface Props {
  editorView: EditorView;
  popupsMountPoint?: HTMLElement;
  popupsBoundariesElement?: HTMLElement;
  popupsScrollableElement?: HTMLElement;
  tableRef?: HTMLElement;
  tableLayout?: TableLayout;
  pluginConfig?: PluginConfig;
  updateLayout?: (layoutName: TableLayout) => void;
}

export interface State {
  isOpen?: boolean;
}

type TableLayoutInfo = { [K in TableLayout]: any };

const tableLayouts: TableLayoutInfo = {
  default: {
    icon: CenterIcon,
    label: 'inline',
  },
  wide: {
    icon: WideIcon,
    label: 'wide',
  },
  'full-width': {
    icon: FullWidthIcon,
    label: 'full width',
  },
};

export default class TableFloatingToolbar extends Component<Props, State> {
  state: State = {
    isOpen: false,
  };

  render() {
    const {
      popupsMountPoint,
      popupsBoundariesElement,
      popupsScrollableElement,
      tableRef,
      editorView,
      tableLayout,
      pluginConfig,
    } = this.props;

    if (!tableRef || !pluginConfig) {
      return null;
    }

    const {
      allowHeaderRow,
      allowNumberColumn,
      allowMergeCells,
      allowHeaderColumn,
      permittedLayouts,
      stickToolbarToBottom,
      allowBackgroundColor,
    } = pluginConfig!;

    let availableLayouts: TableLayout[] = [];
    if (permittedLayouts) {
      if (permittedLayouts === 'all') {
        availableLayouts = Object.keys(tableLayouts) as TableLayout[];
      } else {
        availableLayouts = permittedLayouts;
      }
    }

    const layoutButtons = Array.from(new Set(availableLayouts)).map(
      layoutName => {
        const label = `Change layout to ${tableLayouts[layoutName].label}`;
        const Icon = tableLayouts[layoutName].icon;
        const onClick = () => {
          setTableLayout!(layoutName)(editorView.state, editorView.dispatch);
        };

        return (
          <ToolbarButton
            spacing="compact"
            disabled={!this.isLayoutSupported()}
            selected={tableLayout === layoutName}
            onClick={onClick}
            title={label}
            key={layoutName}
            iconBefore={<Icon label={label} />}
          />
        );
      },
    );

    return (
      <Popup
        offset={[0, 20]}
        target={tableRef}
        mountTo={popupsMountPoint}
        boundariesElement={popupsBoundariesElement}
        scrollableElement={popupsScrollableElement}
        stickToBottom={stickToolbarToBottom}
        alignY="bottom"
        alignX="center"
        ariaLabel="Table floating controls"
      >
        <Toolbar>
          {allowBackgroundColor && (
            <BackgroundColorMenu
              editorView={editorView}
              palette={tableBackgroundColorPalette}
              mountPoint={popupsMountPoint}
              borderColors={tableBackgroundBorderColors}
            />
          )}
          {(allowNumberColumn || allowHeaderRow || allowHeaderColumn) && (
            <DisplayOptionsMenu
              editorView={editorView}
              mountPoint={popupsMountPoint}
              allowNumberColumn={allowNumberColumn}
              allowHeaderRow={allowHeaderRow}
              allowHeaderColumn={allowHeaderColumn}
            />
          )}
          {allowMergeCells && (
            <AdvanceMenu
              editorView={editorView}
              mountPoint={popupsMountPoint}
              allowMergeCells={allowMergeCells}
            />
          )}
          {(allowBackgroundColor ||
            allowNumberColumn ||
            allowHeaderRow ||
            allowHeaderColumn ||
            allowMergeCells) && <Separator style={{ height: 'auto' }} />}
          {layoutButtons}
          {layoutButtons.length ? (
            <Separator style={{ height: 'auto' }} />
          ) : null}
          <div
            onMouseEnter={this.hoverTable}
            onMouseLeave={this.resetHoverSelection}
          >
            <ToolbarButtonDanger
              spacing="compact"
              onClick={this.removeTable}
              title="Remove table"
              iconBefore={<RemoveIcon label="Remove table" />}
            />
          </div>
        </Toolbar>
      </Popup>
    );
  }

  private isLayoutSupported = () => {
    const { selection, schema } = this.props.editorView.state;
    const { layoutSection, bodiedExtension } = schema.nodes;
    return (
      !hasParentNodeOfType(layoutSection)(selection) &&
      !hasParentNodeOfType(bodiedExtension)(selection)
    );
  };

  private hoverTable = () => {
    const { state, dispatch } = this.props.editorView;
    hoverTable(true)(state, dispatch);
  };

  private resetHoverSelection = () => {
    const { state, dispatch } = this.props.editorView;
    resetHoverSelection(state, dispatch);
  };

  private removeTable = () => {
    const { state, dispatch } = this.props.editorView;
    deleteTable(state, dispatch);
    this.resetHoverSelection();
  };
}
