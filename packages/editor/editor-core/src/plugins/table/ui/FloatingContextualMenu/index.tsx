import * as React from 'react';
import { Component } from 'react';
import { EditorView } from 'prosemirror-view';
import { Popup } from '@atlaskit/editor-common';
import ContextualMenu from '../ContextualMenu';
import { contextualMenuSize } from '../../styles';
import { akEditorFloatingPanelZIndex } from '../../../../styles';
import { stateKey as tablePluginKey } from '../../pm-plugins/main';

const DROPDOWN_OFFSET = contextualMenuSize + 7;
const popupMargin = 3;

const findIndexOf = (
  type: 'column' | 'row',
  targetRef: HTMLElement,
): number | null => {
  const controls = document.querySelector(`.table-${type}-controls>div`);
  if (controls && controls.contains(targetRef)) {
    const nodes = Array.prototype.slice.call(controls.childNodes);
    return nodes.indexOf(targetRef.parentNode);
  }
  return null;
};

export interface Props {
  editorView: EditorView;
  isOpen: boolean;
  targetRef?: HTMLElement;
  targetPosition?: number;
  mountPoint?: HTMLElement;
  boundariesElement?: HTMLElement;
  scrollableElement?: HTMLElement;
  allowMergeCells?: boolean;
  allowBackgroundColor?: boolean;
}

export interface State {
  dropdownRef: HTMLElement | null;
}

export default class FloatingContextualMenu extends Component<Props, State> {
  state = {
    dropdownRef: null,
  };

  render() {
    const {
      targetRef,
      mountPoint,
      boundariesElement,
      scrollableElement,
      editorView,
      isOpen,
      targetPosition,
      allowMergeCells,
      allowBackgroundColor,
    } = this.props;
    if (!targetRef) {
      return null;
    }
    const zIndex = isOpen ? akEditorFloatingPanelZIndex : 200;

    return (
      <Popup
        alignX="right"
        alignY="top"
        offset={[popupMargin - 1, -(contextualMenuSize + popupMargin)]}
        target={targetRef}
        mountTo={mountPoint}
        boundariesElement={boundariesElement}
        scrollableElement={scrollableElement}
        fitHeight={100}
        fitWidth={200}
        zIndex={zIndex}
      >
        <ContextualMenu
          editorView={editorView}
          offset={this.calculateOffset()}
          isOpen={isOpen}
          targetPosition={targetPosition}
          allowMergeCells={allowMergeCells}
          allowBackgroundColor={allowBackgroundColor}
          rowIndex={findIndexOf('row', targetRef)}
          columnIndex={findIndexOf('column', targetRef)}
        />
      </Popup>
    );
  }

  private calculateOffset = () => {
    const { targetRef, editorView } = this.props;
    const { tableElement } = tablePluginKey.getState(editorView.state);
    let top = -DROPDOWN_OFFSET;

    if (tableElement && targetRef) {
      const targetOffset = targetRef.getBoundingClientRect();
      const tableOffset = tableElement.getBoundingClientRect();
      let topDiff = targetOffset.top - tableOffset.top + DROPDOWN_OFFSET;
      if (topDiff < 200) {
        top -= topDiff + 2;
      }
    }

    return [DROPDOWN_OFFSET, top];
  };
}
