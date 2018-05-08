import styled from 'styled-components';
// @ts-ignore: unused variable
// prettier-ignore
import { HTMLAttributes, ClassAttributes, ComponentClass, Component } from 'react';
import * as React from 'react';
import { CellSelection } from 'prosemirror-tables';
import { EditorView } from 'prosemirror-view';
import RemoveIcon from '@atlaskit/icon/glyph/editor/remove';
import { Popup, TableLayout } from '@atlaskit/editor-common';
import ToolbarButton from '../../../../ui/ToolbarButton';
import DisplayOptionsMenu from './DisplayOptionsMenu';
import LayoutMenu from './LayoutMenu';
import { PermittedLayoutsDescriptor } from '../../pm-plugins/main';

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
  allowNumberColumn?: boolean;
  allowHeaderRow?: boolean;
  allowHeaderColumn?: boolean;
  stickToolbarToBottom?: boolean;
  remove?: () => void;
  permittedLayouts?: PermittedLayoutsDescriptor;
  updateLayout?: (layoutName: TableLayout) => void;
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
      tableActive,
      permittedLayouts,
      updateLayout,
      tableLayout,
      allowNumberColumn,
      allowHeaderRow,
      allowHeaderColumn,
      stickToolbarToBottom,
    } = this.props;

    if (!tableElement || !tableActive) {
      return null;
    }

    return (
      <Popup
        offset={[0, 20]}
        target={tableElement}
        mountTo={popupsMountPoint}
        boundariesElement={popupsBoundariesElement}
        scrollableElement={popupsScrollableElement}
        stickToBottom={stickToolbarToBottom}
        alignY="bottom"
        alignX="center"
        ariaLabel="Table floating controls"
      >
        <Toolbar>
          {(allowNumberColumn || allowHeaderRow || allowHeaderColumn) && (
            <DisplayOptionsMenu
              editorView={editorView}
              mountPoint={popupsMountPoint}
              allowNumberColumn={allowNumberColumn}
              allowHeaderRow={allowHeaderRow}
              allowHeaderColumn={allowHeaderColumn}
            />
          )}
          {permittedLayouts &&
            !!permittedLayouts.length && (
              <LayoutMenu
                tableLayout={tableLayout}
                updateLayout={updateLayout}
                permittedLayouts={permittedLayouts}
              />
            )}
          <ToolbarButton
            onClick={this.props.remove}
            title="Remove table"
            iconBefore={<RemoveIcon label="Remove table" />}
          />
        </Toolbar>
      </Popup>
    );
  }
}
