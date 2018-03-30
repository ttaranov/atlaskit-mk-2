import styled from 'styled-components';
// @ts-ignore: unused variable
// prettier-ignore
import { HTMLAttributes, ClassAttributes, ComponentClass, Component } from 'react';
import * as React from 'react';
import { CellSelection } from 'prosemirror-tables';
import { EditorView } from 'prosemirror-view';
import { Popup } from '@atlaskit/editor-common';
import RemoveIcon from '@atlaskit/icon/glyph/editor/remove';
import { tableBackgroundColorPalette } from '@atlaskit/editor-common';
import ToolbarButton from '../../../../ui/ToolbarButton';
import Separator from '../../../../ui/Separator';
import { checkIfNumberColumnSelected, checkIfTableSelected } from '../../utils';
import AdvanceMenu from './AdvanceMenu';
import BackgroundColorMenu from './BackgroundColorMenu';
import DisplayOptionsMenu from './DisplayOptionsMenu';
import FullWidthIcon from '@atlaskit/icon/glyph/editor/media-full-width';
import CenterIcon from '@atlaskit/icon/glyph/editor/media-center';
import { PermittedLayoutsDescriptor } from '../../pm-plugins/main';
import { TableLayout } from '@atlaskit/editor-common';

export const Toolbar: ComponentClass<HTMLAttributes<{}>> = styled.div`
  background-color: white;
  border-radius: 3px;
  box-shadow: 0 3px 6px rgba(0, 0, 0, 0.2);
  padding: 3px 6px;
  display: flex;
  > button {
    flex: 1;
  }
`;

export interface Props {
  editorView: EditorView;
  popupsMountPoint?: HTMLElement;
  popupsBoundariesElement?: HTMLElement;
  popupsScrollableElement?: HTMLElement;
  tableElement?: HTMLElement;
  tableActive?: boolean;
  tableLayout?: TableLayout;
  cellSelection?: CellSelection;
  allowMergeCells?: boolean;
  allowNumberColumn?: boolean;
  allowBackgroundColor?: boolean;
  allowHeaderRow?: boolean;
  allowHeaderColumn?: boolean;
  remove?: () => void;
  permittedLayouts?: PermittedLayoutsDescriptor;
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
      tableElement,
      editorView,
      allowMergeCells,
      tableActive,
      tableLayout,
      allowNumberColumn,
      allowBackgroundColor,
      allowHeaderRow,
      allowHeaderColumn,
    } = this.props;

    if (!tableElement || !tableActive) {
      return null;
    }

    let availableLayouts: TableLayout[] = [];
    if (this.props.permittedLayouts) {
      if (this.props.permittedLayouts === 'all') {
        availableLayouts = Object.keys(tableLayouts) as TableLayout[];
      } else {
        availableLayouts = this.props.permittedLayouts;
      }
    }

    const layoutButtons = Array.from(new Set(availableLayouts)).map(
      layoutName => {
        const label = `Change layout to ${tableLayouts[layoutName].label}`;
        const Icon = tableLayouts[layoutName].icon;
        const onClick = () => {
          this.props.updateLayout!(layoutName);
        };

        return (
          <ToolbarButton
            selected={tableLayout === layoutName}
            onClick={this.props.updateLayout ? onClick : undefined}
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
        target={tableElement}
        mountTo={popupsMountPoint}
        boundariesElement={popupsBoundariesElement}
        scrollableElement={popupsScrollableElement}
        alignY="bottom"
        alignX="center"
      >
        <Toolbar>
          {allowBackgroundColor && (
            <BackgroundColorMenu
              editorView={editorView}
              palette={tableBackgroundColorPalette}
              mountPoint={popupsMountPoint}
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
          <Separator style={{ height: 'auto' }} />
          {layoutButtons}
          {layoutButtons.length ? (
            <Separator style={{ height: 'auto' }} />
          ) : null}
          <ToolbarButton
            disabled={!this.canRemove()}
            onClick={this.props.remove}
            title="Remove selected cells"
            iconBefore={<RemoveIcon label="Remove selected cells" />}
          />
        </Toolbar>
      </Popup>
    );
  }

  private canRemove = (): boolean | undefined => {
    const { cellSelection, editorView: { state } } = this.props;
    if (
      !cellSelection ||
      (checkIfNumberColumnSelected(state) && !checkIfTableSelected(state))
    ) {
      return false;
    }
    return cellSelection.isColSelection() || cellSelection.isRowSelection();
  };
}
