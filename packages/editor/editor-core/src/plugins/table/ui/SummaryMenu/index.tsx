import * as React from 'react';
import { Component } from 'react';
import { EditorView } from 'prosemirror-view';
import { Node as PMNode } from 'prosemirror-model';
import { findDomRefAtPos, findTable } from 'prosemirror-utils';
import { Popup } from '@atlaskit/editor-common';
import DropdownMenu from '../../../../ui/DropdownMenu';
import withOuterListeners from '../../../../ui/with-outer-listeners';

export interface Props {
  editorView: EditorView;
  clickedCell?: { pos: number; node: PMNode };
  onClickOutside: (event: Event) => void;
}

const PopupWithListeners = withOuterListeners(Popup);

export default class SummaryMenu extends Component<Props, any> {
  state = {
    isOpen: false,
  };

  componentWillReceiveProps(nextProps) {
    const { clickedCell } = nextProps;
    if (
      clickedCell &&
      clickedCell.node &&
      clickedCell.node.attrs.cellType === 'summary'
    ) {
      this.setState({
        isOpen: true,
      });
    }
  }

  render() {
    const items = this.createItems();
    if (!items) {
      return null;
    }
    const { clickedCell, onClickOutside, editorView } = this.props;
    let targetRef;
    if (
      clickedCell &&
      clickedCell.node &&
      clickedCell.node.attrs.cellType === 'summary'
    ) {
      targetRef = findDomRefAtPos(
        clickedCell.pos,
        editorView.domAtPos.bind(editorView),
      );
    }
    if (!targetRef) {
      return null;
    }

    return (
      <PopupWithListeners
        target={targetRef}
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

    // const { editorView } = this.props;

    // const table = findTable(editorView.state.selection);
    // if (!table) {
    //   return false;
    // }

    items.push({
      content: 'Count',
      value: { name: 'count' },
    });

    items.push({
      content: 'Average',
      value: { name: 'average' },
    });

    items.push({
      content: 'Sum',
      value: { name: 'sum' },
    });

    items.push({
      content: 'Min',
      value: { name: 'min' },
    });

    items.push({
      content: 'Max',
      value: { name: 'max' },
    });

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
