import * as React from 'react';
import { Component } from 'react';
import { EditorView } from 'prosemirror-view';
import { splitCell, mergeCells } from 'prosemirror-tables';
import {
  emptyCell,
  forEachCellInColumn,
  forEachCellInRow,
  setCellAttrs,
} from 'prosemirror-utils';
import ExpandIcon from '@atlaskit/icon/glyph/chevron-down';
import { tableBackgroundColorPalette } from '@atlaskit/editor-common';

import ToolbarButton from '../../../../ui/ToolbarButton';
import DropdownMenu from '../../../../ui/DropdownMenu';
import {
  analyticsDecorator,
  analyticsService as analytics,
} from '../../../../analytics';
import ColorPalette from '../../../../ui/ColorPalette';
import {
  toggleContextualMenu,
  deleteColumn,
  deleteRow,
  emptyCells,
  setCellsAttrs,
} from '../../pm-plugins/contextual-menu-plugin';
import ColumnTypesMenu from '../ColumnTypesMenu';

export interface Props {
  editorView: EditorView;
  isOpen: boolean;
  rowIndex: number | null;
  columnIndex: number | null;
  targetPosition?: number;
  mountPoint?: HTMLElement;
  allowMergeCells?: boolean;
  allowBackgroundColor?: boolean;
  offset?: Array<number>;
}

export interface State {
  isColorMenuOpen: boolean;
  isColumnTypesMenuOpen: boolean;
}

export default class ContextualMenu extends Component<Props, State> {
  state: State = {
    isColorMenuOpen: false,
    isColumnTypesMenuOpen: false,
  };

  render() {
    const { isOpen, mountPoint, offset } = this.props;
    const items = this.createItems();
    if (!items) {
      return null;
    }

    return (
      <div onMouseLeave={this.closeSubmenu}>
        <DropdownMenu
          mountTo={mountPoint}
          items={items}
          isOpen={isOpen}
          onOpenChange={this.handleOpenChange}
          onItemActivated={this.onMenuItemActivated}
          onMouseEnter={this.handleItemMouseEnter}
          onMouseLeave={this.handleItemMouseLeave}
          fitHeight={188}
          fitWidth={180}
          offset={offset}
        >
          <div className="ProseMirror-table-contextual-menu-trigger">
            <ToolbarButton
              selected={isOpen}
              title="Toggle contextual menu"
              onClick={this.toggleOpen}
              iconBefore={<ExpandIcon label="expand-dropdown-menu" />}
            />
          </div>
        </DropdownMenu>
      </div>
    );
  }

  private createItems = () => {
    const {
      allowMergeCells,
      allowBackgroundColor,
      editorView,
      targetPosition,
      rowIndex,
      columnIndex,
      isOpen,
    } = this.props;
    const { state } = editorView;
    const items: any[] = [];
    const { isColorMenuOpen } = this.state;

    if (columnIndex !== null) {
      items.push({
        content: 'Column types',
        value: { name: 'column_types' },
        elemAfter: (
          <div className={`ProseMirror-column-types-submenu`}>
            <ColumnTypesMenu
              editorView={editorView}
              isOpen={this.state.isColumnTypesMenuOpen}
              toggleOpen={this.toggleColumnTypesMenu}
              columnIndex={columnIndex}
            />
          </div>
        ),
      });
    }

    if (allowBackgroundColor) {
      const node =
        isOpen && targetPosition ? state.doc.nodeAt(targetPosition - 1) : null;
      items.push({
        content: <div className="hello">{'Cell background'}</div>,
        value: { name: 'background' },
        elemAfter: (
          <div>
            <div
              className={`ProseMirror-contextual-submenu-icon`}
              style={{
                background: `${node ? node.attrs.background : 'white'}`,
              }}
            />
            <div
              className={`ProseMirror-table-contextual-submenu ${
                isColorMenuOpen ? '-open' : ''
              } ${columnIndex !== null ? '-with-column-types' : ''}`}
            >
              <ColorPalette
                palette={tableBackgroundColorPalette}
                onClick={this.setColor}
              />
            </div>
          </div>
        ),
      });
    }

    if (rowIndex === null) {
      items.push({
        content: 'Delete column',
        value: { name: 'delete_column' },
      });
    }

    if (columnIndex === null) {
      items.push({
        content: 'Delete row',
        value: { name: 'delete_row' },
      });
    }

    if (allowMergeCells) {
      items.push({
        content: 'Merge cells',
        value: { name: 'merge' },
        isDisabled: !mergeCells(state),
      });
      items.push({
        content: 'Split cell',
        value: { name: 'split' },
        isDisabled: !splitCell(state),
      });
    }

    items.push({
      content: 'Clear cell',
      value: { name: 'clear' },
      elemAfter: '⌫',
    });

    return items.length ? [{ items }] : null;
  };

  private onMenuItemActivated = ({ item }) => {
    const { editorView, columnIndex, rowIndex } = this.props;
    const { state, dispatch } = editorView;
    switch (item.value.name) {
      case 'merge':
        analytics.trackEvent('atlassian.editor.format.table.merge.button');
        mergeCells(state, dispatch);
        this.toggleOpen();
        break;
      case 'split':
        analytics.trackEvent('atlassian.editor.format.table.split.button');
        splitCell(state, dispatch);
        this.toggleOpen();
        break;
      case 'clear':
        analytics.trackEvent('atlassian.editor.format.table.split.button');
        if (columnIndex !== null) {
          dispatch(
            forEachCellInColumn(
              columnIndex,
              cell => emptyCell(cell, state.schema),
              true,
            )(state.tr),
          );
        } else if (rowIndex !== null) {
          dispatch(
            forEachCellInRow(
              rowIndex,
              cell => emptyCell(cell, state.schema),
              true,
            )(state.tr),
          );
        } else {
          emptyCells(state, dispatch);
        }
        this.toggleOpen();
        break;
      case 'delete_column':
        analytics.trackEvent(
          'atlassian.editor.format.table.delete_column.button',
        );
        deleteColumn!(columnIndex)(state, dispatch);
        this.toggleOpen();
        break;
      case 'delete_row':
        analytics.trackEvent('atlassian.editor.format.table.delete_row.button');
        deleteRow!(rowIndex)(state, dispatch);
        this.toggleOpen();
        break;
    }
  };

  private toggleOpen = () => {
    const { isOpen, editorView: { state, dispatch } } = this.props;
    toggleContextualMenu(!isOpen)(state, dispatch);
    if (!isOpen) {
      this.setState({
        isColorMenuOpen: false,
        isColumnTypesMenuOpen: false,
      });
    }
  };

  private toggleColumnTypesMenu = () => {
    this.setState({ isColumnTypesMenuOpen: !this.state.isColumnTypesMenuOpen });
  };

  private handleOpenChange = ({ isOpen }) => {
    const { editorView: { state, dispatch } } = this.props;
    toggleContextualMenu(isOpen)(state, dispatch);
  };

  private handleItemMouseEnter = ({ item }) => {
    if (item.value.name === 'background') {
      this.setState({ isColorMenuOpen: true });
    }
    if (item.value.name === 'column_types') {
      this.setState({ isColumnTypesMenuOpen: true });
    }
  };

  private handleItemMouseLeave = ({ item }) => {
    if (item.value.name === 'background') {
      this.setState({ isColorMenuOpen: false });
    }
    if (item.value.name === 'column_types') {
      this.setState({ isColumnTypesMenuOpen: false });
    }
  };

  private closeSubmenu = () => {
    this.setState({
      isColorMenuOpen: false,
      isColumnTypesMenuOpen: false,
    });
  };

  @analyticsDecorator('atlassian.editor.format.table.backgroundColor.button')
  private setColor = color => {
    const { editorView, columnIndex, rowIndex } = this.props;
    const { state, dispatch } = editorView;
    const attrs = { background: color };

    if (columnIndex !== null) {
      dispatch(
        forEachCellInColumn(columnIndex, cell => setCellAttrs(cell, attrs))(
          state.tr,
        ),
      );
    } else if (rowIndex !== null) {
      dispatch(
        forEachCellInRow(rowIndex, cell => setCellAttrs(cell, attrs))(state.tr),
      );
    } else {
      setCellsAttrs(attrs)(editorView.state, dispatch);
    }

    this.toggleOpen();
  };
}
