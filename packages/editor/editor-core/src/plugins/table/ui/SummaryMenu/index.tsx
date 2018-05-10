import * as React from 'react';
import { Component } from 'react';
import { EditorView } from 'prosemirror-view';
import { Node as PMNode } from 'prosemirror-model';
import { findDomRefAtPos } from 'prosemirror-utils';
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
    if (targetRef) {
      return null;
    }

    return (
      <PopupWithListeners
        target={targetRef!}
        offset={[0, 2]}
        handleClickOutside={onClickOutside}
        handleEscapeKeydown={onClickOutside}
      >
        <DropdownMenu
          items={items}
          onItemActivated={this.onMenuItemActivated}
          fitHeight={188}
          fitWidth={180}
          offset={[13, -20]}
        />
      </PopupWithListeners>
    );
  }

  private createItems = () => {
    const items: any[] = [];

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

  private onMenuItemActivated = ({ item }) => {
    console.log(item.name.value);
  };
}
