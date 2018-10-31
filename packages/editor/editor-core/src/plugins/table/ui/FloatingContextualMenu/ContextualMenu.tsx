import * as React from 'react';
import { Component } from 'react';
import { defineMessages, injectIntl, InjectedIntlProps } from 'react-intl';
import { EditorView } from 'prosemirror-view';
import { splitCell, mergeCells } from 'prosemirror-tables';
import { colors } from '@atlaskit/theme';
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
import { CellRect, TableCssClassName as ClassName } from '../../types';
import { contextualMenuDropdownWidth } from '../styles';
import { Shortcut } from '../../../../ui/styles';
import DropdownMenu from '../../../../ui/DropdownMenu';
import {
  analyticsDecorator,
  analyticsService as analytics,
} from '../../../../analytics';
import ColorPalette from '../../../../ui/ColorPalette';
import tableMessages from '../messages';

export const messages = defineMessages({
  cellBackground: {
    id: 'fabric.editor.cellBackground',
    defaultMessage: 'Cell background',
    description: 'Change the background color of a table cell.',
  },
  mergeCells: {
    id: 'fabric.editor.mergeCells',
    defaultMessage: 'Merge cells',
    description: 'Merge tables cells together.',
  },
  splitCell: {
    id: 'fabric.editor.splitCell',
    defaultMessage: 'Split cell',
    description: 'Split a merged table cell.',
  },
  clearCells: {
    id: 'fabric.editor.clearCells',
    defaultMessage: 'Clear {0, plural, one {cell} other {cells}}',
    description:
      'Clears the contents of the selected cells (this does not delete the cells themselves).',
  },
});

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

class ContextualMenu extends Component<Props & InjectedIntlProps, State> {
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
        />
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
      intl: { formatMessage },
    } = this.props;
    const items: any[] = [];
    const { isSubmenuOpen } = this.state;
    if (allowBackgroundColor) {
      const node =
        isOpen && targetCellPosition
          ? state.doc.nodeAt(targetCellPosition)
          : null;
      const background =
        node && node.attrs.background ? node.attrs.background : '#ffffff';
      items.push({
        content: formatMessage(messages.cellBackground),
        value: { name: 'background' },
        elemAfter: (
          <div>
            <div
              className={ClassName.CONTEXTUAL_MENU_ICON}
              style={{ background }}
            />
            {isSubmenuOpen && (
              <div
                className={ClassName.CONTEXTUAL_SUBMENU}
                ref={this.handleSubMenuRef}
              >
                <ColorPalette
                  palette={tableBackgroundColorPalette}
                  borderColors={tableBackgroundBorderColors}
                  onClick={this.setColor}
                  selectedColor={background}
                  checkMarkColor={colors.N500}
                />
              </div>
            )}
          </div>
        ),
      });
    }

    items.push({
      content: formatMessage(tableMessages.insertColumn),
      value: { name: 'insert_column' },
    });

    items.push({
      content: formatMessage(tableMessages.insertRow),
      value: { name: 'insert_row' },
    });

    const { right, left, top, bottom } = selectionRect;
    const noOfColumns = right - left;
    const noOfRows = bottom - top;

    items.push({
      content: formatMessage(tableMessages.removeColumns, {
        0: noOfColumns,
      }),
      value: { name: 'delete_column' },
    });

    items.push({
      content: formatMessage(tableMessages.removeRows, {
        0: noOfRows,
      }),
      value: { name: 'delete_row' },
    });

    if (allowMergeCells) {
      items.push({
        content: formatMessage(messages.mergeCells),
        value: { name: 'merge' },
        isDisabled: !mergeCells(state),
      });
      items.push({
        content: formatMessage(messages.splitCell),
        value: { name: 'split' },
        isDisabled: !splitCell(state),
      });
    }

    items.push({
      content: formatMessage(messages.clearCells, {
        0: Math.max(noOfColumns, noOfRows),
      }),
      value: { name: 'clear' },
      elemAfter: <Shortcut>⌫</Shortcut>,
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
    toggleContextualMenu(state, dispatch);
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
    toggleContextualMenu(state, dispatch);
    this.setState({ isSubmenuOpen: false });
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

export default injectIntl(ContextualMenu);
