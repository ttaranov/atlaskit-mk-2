import * as React from 'react';
import { Component } from 'react';
import { CellSelection } from 'prosemirror-tables';
import { EditorView } from 'prosemirror-view';
import ToolbarButton from '../ToolbarButton';
import RemoveIcon from '@atlaskit/icon/glyph/editor/remove';
import { Popup } from '@atlaskit/editor-common';
import { tableBackgroundColorPalette } from '@atlaskit/editor-common';
import styled from 'styled-components';
import AdvanceMenu from './AdvanceMenu';
import Separator from '../Separator';
import BackgroundColorMenu from './BackgroundColorMenu';
import DisplayOptionsMenu from './DisplayOptionsMenu';
import {
  checkIfNumberColumnSelected,
  checkIfTableSelected,
} from '../../editor/plugins/table/utils';

export const Toolbar = styled.div`
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
  cellSelection?: CellSelection;
  allowMergeCells?: boolean;
  allowNumberColumn?: boolean;
  allowBackgroundColor?: boolean;
  allowHeaderRow?: boolean;
  allowHeaderColumn?: boolean;
  remove?: () => void;
}

export interface State {
  isOpen?: boolean;
}

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
      allowNumberColumn,
      allowBackgroundColor,
      allowHeaderRow,
      allowHeaderColumn,
    } = this.props;

    if (!tableElement || !tableActive) {
      return null;
    }

    return (
      <Popup
        target={tableElement.parentElement || tableElement}
        offset={[0, -10]}
        mountTo={popupsMountPoint}
        boundariesElement={popupsBoundariesElement}
        scrollableElement={popupsScrollableElement}
        alignY="bottom"
        alignX="right"
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
