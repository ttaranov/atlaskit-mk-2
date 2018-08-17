import * as React from 'react';
import { Component } from 'react';
import { EditorView } from 'prosemirror-view';
import { splitCell, mergeCells } from 'prosemirror-tables';
import ExpandIcon from '@atlaskit/icon/glyph/chevron-down';
import {
  tableBackgroundColorPalette,
  tableBackgroundBorderColors,
} from '@atlaskit/editor-common';
import {
  hoverColumns,
  hoverRows,
  clearHoverSelection,
  insertColumn,
  insertRow,
  toggleContextualMenu,
  deleteColumns,
  deleteRows,
  emptyMultipleCells,
  setMultipleCellAttrs,
} from '../../actions';
import { CellRect } from '../../types';
import { contextualMenuDropdownWidth } from '../styles';

import ToolbarButton from '../../../../ui/ToolbarButton';
import DropdownMenu from '../../../../ui/DropdownMenu';
import {
  analyticsDecorator,
  analyticsService as analytics,
} from '../../../../analytics';
import ColorPalette from '../../../../ui/ColorPalette';

export interface Props {
  editorView: EditorView;
  isOpen: boolean;
  selectionRect: CellRect;
  targetCellPosition?: number;
  mountPoint?: HTMLElement;
  allowMergeCells?: boolean;
  allowBackgroundColor?: boolean;
  offset?: Array<number>;
}

export interface State {
  isSubmenuOpen: boolean;
}

export default class ContextualMenu extends Component<Props, State> {
  state: State = {
    isSubmenuOpen: false,
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
          fitWidth={contextualMenuDropdownWidth}
          offset={offset}
        >
          <div className="ProseMirror-table-contextual-menu-trigger">
            <ToolbarButton
              selected={isOpen}
              intlTitle="table_contextual_menu"
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
      editorView: { state },
      targetCellPosition,
      isOpen,
      selectionRect,
    } = this.props;
    const items: any[] = [];
    const { isSubmenuOpen } = this.state;
    if (allowBackgroundColor) {
      const node =
        isOpen && targetCellPosition
          ? state.doc.nodeAt(targetCellPosition)
          : null;
      items.push({
        key: 'table_background',
        intlTitle: 'table_cell_background',
        value: { name: 'background' },
        elemAfter: (
          <div>
            <div
              className={`ProseMirror-contextual-submenu-icon`}
              style={{
                background: `${node ? node.attrs.background : 'white'}`,
              }}
            />
            {isSubmenuOpen && (
              <div className="ProseMirror-table-contextual-submenu">
                <ColorPalette
                  palette={tableBackgroundColorPalette}
                  borderColors={tableBackgroundBorderColors}
                  onClick={this.setColor}
                />
              </div>
            )}
          </div>
        ),
      });
    }

    items.push({
      key: 'table_insert_column',
      intlTitle: 'table_insert_column',
      value: { name: 'insert_column' },
    });

    items.push({
      key: 'table_insert_row',
      intlTitle: 'table_insert_row',
      value: { name: 'insert_row' },
    });

    const { right, left, top, bottom } = selectionRect;
    items.push({
      key: 'remove_column',
      intlTitle:
        right - left > 1 ? 'table_remove_column' : 'table_remove_columns',
      value: { name: 'delete_column' },
    });

    items.push({
      key: 'remove_row',
      intlTitle: bottom - top > 1 ? 'table_remove_row' : 'table_remove_rows',
      value: { name: 'delete_row' },
    });

    if (allowMergeCells) {
      items.push({
        key: 'table_merge',
        intlTitle: 'table_merge',
        value: { name: 'merge' },
        isDisabled: !mergeCells(state),
      });
      items.push({
        key: 'table_split_cell',
        intlTitle: 'table_split_cell',
        value: { name: 'split' },
        isDisabled: !splitCell(state),
      });
    }

    items.push({
      intlTitle: 'table_clear_cell',
      shortcut: '⌫',
      value: { name: 'clear' },
    });

    return items.length ? [{ items }] : null;
  };

  private onMenuItemActivated = ({ item }) => {
    const { editorView, selectionRect, targetCellPosition } = this.props;
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
        emptyMultipleCells(targetCellPosition)(state, dispatch);
        this.toggleOpen();
        break;
      case 'insert_column':
        insertColumn(selectionRect.right)(state, dispatch);
        this.toggleOpen();
        break;
      case 'insert_row':
        insertRow(selectionRect.bottom)(state, dispatch);
        this.toggleOpen();
        break;
      case 'delete_column':
        analytics.trackEvent(
          'atlassian.editor.format.table.delete_column.button',
        );
        deleteColumns(getSelectedColumnIndexes(selectionRect))(state, dispatch);
        this.toggleOpen();
        break;
      case 'delete_row':
        analytics.trackEvent('atlassian.editor.format.table.delete_row.button');
        deleteRows(getSelectedRowIndexes(selectionRect))(state, dispatch);
        this.toggleOpen();
        break;
    }
  };

  private toggleOpen = () => {
    const {
      isOpen,
      editorView: { state, dispatch },
    } = this.props;
    toggleContextualMenu(!isOpen)(state, dispatch);
    if (!isOpen) {
      this.setState({
        isSubmenuOpen: false,
      });
    }
  };

  private handleOpenChange = ({ isOpen }) => {
    const {
      editorView: { state, dispatch },
    } = this.props;
    const { isSubmenuOpen } = this.state;
    toggleContextualMenu(isOpen)(state, dispatch);
    this.setState({ isSubmenuOpen: isOpen ? isSubmenuOpen : false });
  };

  private handleItemMouseEnter = ({ item }) => {
    const {
      editorView: { state, dispatch },
      selectionRect,
    } = this.props;

    if (item.value.name === 'background') {
      if (!this.state.isSubmenuOpen) {
        this.setState({ isSubmenuOpen: true });
      }
    }

    if (item.value.name === 'delete_column') {
      hoverColumns(getSelectedColumnIndexes(selectionRect), true)(
        state,
        dispatch,
      );
    }
    if (item.value.name === 'delete_row') {
      hoverRows(getSelectedRowIndexes(selectionRect), true)(state, dispatch);
    }
  };

  private handleItemMouseLeave = ({ item }) => {
    const { state, dispatch } = this.props.editorView;
    if (item.value.name === 'background') {
      this.closeSubmenu();
    }
    if (
      item.value.name === 'delete_column' ||
      item.value.name === 'delete_row'
    ) {
      clearHoverSelection(state, dispatch);
    }
  };

  private closeSubmenu = () => {
    if (this.state.isSubmenuOpen) {
      this.setState({ isSubmenuOpen: false });
    }
  };

  @analyticsDecorator('atlassian.editor.format.table.backgroundColor.button')
  private setColor = color => {
    const { targetCellPosition, editorView } = this.props;
    const { state, dispatch } = editorView;
    setMultipleCellAttrs({ background: color }, targetCellPosition)(
      state,
      dispatch,
    );
    this.toggleOpen();
  };
}

export const getSelectedColumnIndexes = (selectionRect: CellRect): number[] => {
  const columnIndexes: number[] = [];
  for (let i = selectionRect.left; i < selectionRect.right; i++) {
    columnIndexes.push(i);
  }
  return columnIndexes;
};

export const getSelectedRowIndexes = (selectionRect: CellRect): number[] => {
  const rowIndexes: number[] = [];
  for (let i = selectionRect.top; i < selectionRect.bottom; i++) {
    rowIndexes.push(i);
  }
  return rowIndexes;
};
