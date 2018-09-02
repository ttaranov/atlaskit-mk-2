import * as React from 'react';
import { Component } from 'react';
import { EditorView } from 'prosemirror-view';
import { Node as PMNode } from 'prosemirror-model';
import { findDomRefAtPos, findTable } from 'prosemirror-utils';
import { Popup } from '@atlaskit/editor-common';
import DropdownMenu from '../../../../ui/DropdownMenu';
import withOuterListeners from '../../../../ui/with-outer-listeners';

const findIndexOf = (targetRef: HTMLElement): number | null => {
  const nodes = Array.prototype.slice.call(targetRef.parentNode!.childNodes);
  return nodes.indexOf(targetRef);
};

export interface Props {
  editorView: EditorView;
  clickedCell?: { pos: number; node: PMNode };
  onClickOutside: (event: Event) => void;
}

export interface State {
  isOpen: boolean;
  targetRef?: HTMLElement;
  columnIndex: number | null;
}

const PopupWithListeners = withOuterListeners(Popup);

export default class SummaryMenu extends Component<Props, State> {
  state = {
    isOpen: false,
    targetRef: undefined,
    columnIndex: null,
  };

  componentWillReceiveProps(nextProps) {
    const { clickedCell, editorView } = nextProps;
    if (
      clickedCell &&
      clickedCell.node &&
      clickedCell.node.attrs.cellType === 'summary'
    ) {
      const targetRef = findDomRefAtPos(
        clickedCell.pos,
        editorView.domAtPos.bind(editorView),
      ) as HTMLElement;

      const columnIndex = findIndexOf(targetRef);

      this.setState({
        isOpen: true,
        targetRef,
        columnIndex,
      });
    }
  }

  render() {
    const items = this.createItems();
    if (!items) {
      return null;
    }
    const { onClickOutside } = this.props;
    if (!this.state.targetRef) {
      return null;
    }

    return (
      <PopupWithListeners
        target={this.state.targetRef}
        offset={[0, -6]}
        handleClickOutside={onClickOutside}
        handleEscapeKeydown={onClickOutside}
      >
        <DropdownMenu
          items={items}
          onItemActivated={this.onMenuItemActivated}
          fitHeight={188}
          fitWidth={180}
          isOpen={this.state.isOpen}
        />
      </PopupWithListeners>
    );
  }

  private createItems = () => {
    const items: any[] = [];

    const {
      editorView: { state },
    } = this.props;
    const { columnIndex } = this.state;
    if (columnIndex === null) {
      return;
    }
    const table = findTable(state.tr.selection)!;
    if (!table) {
      return;
    }
    let cellType;
    for (let i = 0, count = table.node.childCount; i < count; i++) {
      const row = table.node.child(i);
      const cell = row.child(columnIndex);
      if (
        cell &&
        cell.type === state.schema.nodes.tableCell &&
        cell.attrs.cellType !== 'text' &&
        cell.attrs.cellType !== 'summary'
      ) {
        cellType = cell.attrs.cellType;
      }
    }

    switch (cellType) {
      case 'number':
      case 'currency':
      case 'slider':
        items.push({ content: 'Total', value: { name: 'total' } });
        items.push({ content: 'Average', value: { name: 'average' } });
        items.push({ content: 'Min', value: { name: 'min' } });
        items.push({ content: 'Max', value: { name: 'max' } });
        break;
      case 'date':
        items.push({ content: 'Min', value: { name: 'min' } });
        items.push({ content: 'Max', value: { name: 'max' } });
        break;
      case 'mention':
      case 'emoji':
      case 'checkbox':
      case 'decision':
        items.push({ content: 'Total', value: { name: 'total' } });
        break;
    }

    return items.length ? [{ items }] : null;
  };

  private toggleOpen = () => {
    const { isOpen } = this.state;
    this.setState({
      isOpen: !isOpen,
    });
  };

  private onMenuItemActivated = ({ item }) => {
    const { editorView, clickedCell } = this.props;
    const { state, dispatch } = editorView;
    if (clickedCell) {
      dispatch(
        state.tr.setNodeMarkup(
          clickedCell.pos - 1,
          clickedCell.node.type,
          Object.assign({}, clickedCell.node.attrs, {
            summaryType: item.value.name,
          }),
        ),
      );
    }

    this.toggleOpen();
  };
}
