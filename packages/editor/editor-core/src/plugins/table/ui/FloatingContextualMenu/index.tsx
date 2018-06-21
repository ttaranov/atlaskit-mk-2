import * as React from 'react';
import { Component } from 'react';
import { EditorView } from 'prosemirror-view';
import { findCellRectClosestToPos, isCellSelection } from 'prosemirror-utils';
import { Popup } from '@atlaskit/editor-common';
import ContextualMenu from './ContextualMenu';
import { contextualMenuSize } from '../styles';
import { akEditorFloatingPanelZIndex } from '../../../../styles';
import {
  stateKey as tablePluginKey,
  PluginConfig,
} from '../../pm-plugins/main';
import { getSelectionRect } from '../../utils';

const DROPDOWN_OFFSET = contextualMenuSize + 1;
const popupMargin = 3;

export interface Props {
  editorView: EditorView;
  isOpen: boolean;
  targetCellRef?: HTMLElement;
  targetCellPosition?: number;
  mountPoint?: HTMLElement;
  boundariesElement?: HTMLElement;
  scrollableElement?: HTMLElement;
  pluginConfig?: PluginConfig;
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
      targetCellRef,
      mountPoint,
      boundariesElement,
      scrollableElement,
      editorView,
      isOpen,
      targetCellPosition,
      pluginConfig,
    } = this.props;
    if (!targetCellRef || !pluginConfig) {
      return null;
    }

    const zIndex = isOpen
      ? akEditorFloatingPanelZIndex
      : akEditorFloatingPanelZIndex - 10;

    const width = targetCellRef.getBoundingClientRect().width;

    const selectionRect = isCellSelection(editorView.state.selection)
      ? getSelectionRect(editorView.state.selection)!
      : findCellRectClosestToPos(editorView.state.selection.$from);

    return (
      <Popup
        alignX="left"
        alignY="top"
        offset={[
          width - contextualMenuSize - popupMargin,
          -contextualMenuSize - popupMargin,
        ]}
        target={targetCellRef}
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
          targetCellPosition={targetCellPosition}
          allowMergeCells={pluginConfig.allowMergeCells}
          allowBackgroundColor={pluginConfig.allowBackgroundColor}
          selectionRect={selectionRect}
        />
      </Popup>
    );
  }

  private calculateOffset = () => {
    const { targetCellRef, editorView } = this.props;
    const { tableRef } = tablePluginKey.getState(editorView.state);
    let top = -DROPDOWN_OFFSET;

    if (tableRef && targetCellRef) {
      const targetOffset = targetCellRef.getBoundingClientRect();
      const tableOffset = tableRef.getBoundingClientRect();
      let topDiff = targetOffset.top - tableOffset.top + DROPDOWN_OFFSET;
      if (topDiff < 200) {
        top -= topDiff + 2;
      }
    }

    return [DROPDOWN_OFFSET + popupMargin, top];
  };
}
