import * as React from 'react';
import { EditorView } from 'prosemirror-view';
import { findCellRectClosestToPos, isCellSelection } from 'prosemirror-utils';
import {
  Popup,
  akEditorFloatingOverlapPanelZIndex,
} from '@atlaskit/editor-common';
import ContextualMenu from './ContextualMenu';
import { contextualMenuTriggerSize } from '../styles';
import { pluginKey } from '../../pm-plugins/main';
import { PluginConfig } from '../../types';
import { getSelectionRect } from '../../utils';

const DROPDOWN_OFFSET = contextualMenuTriggerSize + 1;
const popupMargin = 3;

// offset of the contextual menu dropdown
const calculateOffset = (targetCellRef, state) => {
  const { tableRef } = pluginKey.getState(state);
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

const FloatingContextualMenu = ({
  targetCellRef,
  mountPoint,
  boundariesElement,
  scrollableElement,
  editorView,
  isOpen,
  targetCellPosition,
  pluginConfig,
}: Props) => {
  if (!targetCellRef) {
    return null;
  }

  const { selection } = editorView.state;
  const selectionRect = isCellSelection(selection)
    ? getSelectionRect(selection)!
    : findCellRectClosestToPos(selection.$from);

  if (!selectionRect) {
    return null;
  }

  const width = targetCellRef.getBoundingClientRect().width;

  return (
    <Popup
      alignX="left"
      alignY="top"
      offset={[
        width - contextualMenuTriggerSize - popupMargin,
        -contextualMenuTriggerSize - popupMargin,
      ]}
      target={targetCellRef}
      mountTo={mountPoint}
      boundariesElement={boundariesElement}
      scrollableElement={scrollableElement}
      fitHeight={100}
      fitWidth={200}
      // z-index value below is to ensure that this menu is above other floating menu
      // in table, but below floating dialogs like typeaheads, pickers, etc.
      zIndex={akEditorFloatingOverlapPanelZIndex}
    >
      <ContextualMenu
        editorView={editorView}
        offset={calculateOffset(targetCellRef, editorView.state)}
        isOpen={isOpen}
        targetCellPosition={targetCellPosition}
        allowMergeCells={pluginConfig!.allowMergeCells}
        allowBackgroundColor={pluginConfig!.allowBackgroundColor}
        selectionRect={selectionRect}
      />
    </Popup>
  );
};

export default FloatingContextualMenu;
