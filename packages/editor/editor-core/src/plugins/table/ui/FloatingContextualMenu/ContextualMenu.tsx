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
  analyticsService as analytics,
  withAnalytics,
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
  boundariesElement?: HTMLElement;
  offset?: Array<number>;
}

export interface State {
  isSubmenuOpen: boolean;
}

export default class ContextualMenu extends Component<Props, State> {
  state: State = {
    isSubmenuOpen: false,
  };

  static defaultProps = {
    boundariesElement: document.body,
  };

  render() {
    const { isOpen, mountPoint, offset, boundariesElement } = this.props;
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
          boundariesElement={boundariesElement}
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

  private handleSubMenuRef = ref => {
    const { boundariesElement } = this.props;

    if (!(boundariesElement && ref)) {
      return;
    }

    const boundariesRect = boundariesElement.getBoundingClientRect();
    const rect = ref.getBoundingClientRect();

    if (rect.left + rect.width - boundariesRect.left > boundariesRect.width) {
      ref.style.left = `-${rect.width}px`;
    }
  };

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
        content: 'Cell background',
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
              <div
                className="ProseMirror-table-contextual-submenu"
                ref={this.handleSubMenuRef}
              >
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
      content: 'Insert column',
      value: { name: 'insert_column' },
    });

    items.push({
      content: 'Insert row',
      value: { name: 'insert_row' },
    });

    const { right, left, top, bottom } = selectionRect;
    items.push({
      content: `Delete column${right - left > 1 ? 's' : ''}`,
      value: { name: 'delete_column' },
    });

    items.push({
      content: `Delete row${bottom - top > 1 ? 's' : ''}`,
      value: { name: 'delete_row' },
    });

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

  private setColor = withAnalytics(
    'atlassian.editor.format.table.backgroundColor.button',
    color => {
      const { targetCellPosition, editorView } = this.props;
      const { state, dispatch } = editorView;
      setMultipleCellAttrs({ background: color }, targetCellPosition)(
        state,
        dispatch,
      );
      this.toggleOpen();
    },
  );
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
