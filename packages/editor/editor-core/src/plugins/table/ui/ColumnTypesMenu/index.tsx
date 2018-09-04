import * as React from 'react';
import { Component } from 'react';
import { EditorView } from 'prosemirror-view';
import { Node as PmNode } from 'prosemirror-model';
import { Selection } from 'prosemirror-state';
import {
  forEachCellInColumn,
  setCellAttrs,
  getCellsInColumn,
  findTable,
} from 'prosemirror-utils';
import {
  Popup,
  akEditorFloatingOverlapPanelZIndex,
} from '@atlaskit/editor-common';

import EditorTextStyleIcon from '@atlaskit/icon/glyph/editor/text-style';
import EditorMentionIcon from '@atlaskit/icon/glyph/editor/mention';
import EditorTaskIcon from '@atlaskit/icon/glyph/editor/task';
import EditorEmojiIcon from '@atlaskit/icon/glyph/editor/emoji';
import DecisionIcon from '@atlaskit/icon/glyph/editor/decision';
import Date from '../../icons/Date';
import Number from '../../icons/Number';
import Slider from '../../icons/Slider';
import Currency from '../../icons/Currency';

import DropdownMenu from '../../../../ui/DropdownMenu';
import withOuterListeners from '../../../../ui/with-outer-listeners';
import { pluginKey } from '../../pm-plugins/column-types';

const PopupWithListeners = withOuterListeners(Popup);

export interface Props {
  editorView: EditorView;
  columnIndex: number;
  mountPoint?: HTMLElement;
  boundariesElement?: HTMLElement;
  scrollableElement?: HTMLElement;
  targetColumnRef?: HTMLElement;
}

function getDefaultSummaryTypeFromCellType(type: string) {
  switch (type) {
    case 'number':
    case 'currency':
      return 'total';
    case 'mention':
      return 'people';
    default:
      return;
  }
}

export default class ColumnTypesMenu extends Component<Props> {
  render() {
    const {
      targetColumnRef,
      mountPoint,
      boundariesElement,
      scrollableElement,
    } = this.props;
    const items = this.createItems();
    if (!items || !targetColumnRef) {
      return null;
    }

    return (
      <PopupWithListeners
        alignX="left"
        alignY="top"
        offset={[14, -12]}
        target={targetColumnRef}
        mountTo={mountPoint}
        boundariesElement={boundariesElement}
        scrollableElement={scrollableElement}
        fitHeight={100}
        fitWidth={200}
        // z-index value below is to ensure that this menu is above other floating menu
        // in table, but below floating dialogs like typeaheads, pickers, etc.
        zIndex={akEditorFloatingOverlapPanelZIndex}
        handleClickOutside={this.hideMenu}
      >
        <DropdownMenu
          items={items}
          mountTo={this.props.mountPoint}
          isOpen={true}
          onItemActivated={this.onMenuItemActivated}
          fitHeight={188}
          fitWidth={180}
          offset={[13, -20]}
        />
      </PopupWithListeners>
    );
  }

  private hideMenu = () => {
    const { dispatch, state } = this.props.editorView;
    dispatch(
      state.tr.setMeta(pluginKey, {
        targetColumnRef: undefined,
        columnIndex: undefined,
      }),
    );
  };

  private createItems = () => {
    const items: any[] = [];

    items.push({
      content: 'Normal text',
      value: { name: 'text' },
      elemBefore: <EditorTextStyleIcon label="Normal text" />,
    });

    items.push({
      content: 'Number',
      value: { name: 'number' },
      elemBefore: <Number label="Number" />,
    });

    items.push({
      content: 'Currency',
      value: { name: 'currency' },
      elemBefore: <Currency label="Currency" />,
    });

    items.push({
      content: 'Date',
      value: { name: 'date' },
      elemBefore: <Date label="Date" />,
    });

    items.push({
      content: 'Person',
      value: { name: 'mention' },
      elemBefore: <EditorMentionIcon label="Person" />,
    });

    items.push({
      content: 'Checkbox',
      value: { name: 'checkbox' },
      elemBefore: <EditorTaskIcon label="Checkbox" />,
    });

    items.push({
      content: 'Slider',
      value: { name: 'slider' },
      elemBefore: <Slider label="Slider" />,
    });

    items.push({
      content: 'Emoji',
      value: { name: 'emoji' },
      elemBefore: <EditorEmojiIcon label="Emoji" />,
    });

    items.push({
      content: 'Decision',
      value: { name: 'decision' },
      elemBefore: <DecisionIcon label="Decision" />,
    });

    return items.length ? [{ items }] : null;
  };

  private onMenuItemActivated = ({ item }) => {
    const { editorView, columnIndex } = this.props;
    const {
      state: {
        schema: {
          nodes: { slider, checkbox, tableCell, decisionItem },
        },
      },
      dispatch,
    } = editorView;
    let attrs = { cellType: item.value.name };
    const table = findTable(editorView.state.selection);
    if (!table) {
      return false;
    }

    if (columnIndex !== null) {
      const lastRowIndex = table.node.childCount - 1;
      let { tr } = editorView.state;

      // update attrs
      let cells = getCellsInColumn(columnIndex)(tr.selection)!;
      cells.forEach((cell, rowIndex) => {
        if (table.node.attrs.isSummaryRowEnabled && rowIndex === lastRowIndex) {
          attrs = { cellType: 'summary' };
        } else {
          attrs = { cellType: item.value.name };
        }
        const newCell = cell.node.type.create(
          { ...cell.node.attrs, ...attrs },
          cell.node.content,
        );
        tr = tr.replaceWith(
          tr.mapping.map(cell.pos),
          tr.mapping.map(cell.pos + cell.node.nodeSize),
          newCell,
        );
      });
      dispatch(tr);

      const nodemap = {
        slider: slider,
        checkbox: checkbox,
        decision: decisionItem,
      };

      // filldown for node type
      const cellType = item.value.name;
      const { paragraph, decisionList } = editorView.state.schema.nodes;
      tr = editorView.state.tr;
      cells = getCellsInColumn(columnIndex)(tr.selection)!;
      cells.forEach(cell => {
        let newCell;
        if (
          cell.node.type !== tableCell ||
          cell.node.attrs.cellType === 'summary'
        ) {
          newCell = cell.node.type.create(
            {
              ...cell.node.attrs,
              summaryType: getDefaultSummaryTypeFromCellType(cellType),
            },
            paragraph.create({}),
          );
        } else {
          // insert node to each cell
          if (Object.keys(nodemap).indexOf(cellType) !== -1) {
            if (item.value.name === 'decision') {
              const node = decisionList.createAndFill() as PmNode;
              newCell = cell.node.type.create(cell.node.attrs, node);
            } else {
              newCell = cell.node.type.create(
                cell.node.attrs,
                paragraph.create({}, nodemap[cellType].createChecked()),
              );
            }
          }
          // try to keep number content for "number" and "currency" columns
          else if (
            (item.value.name === 'number' || item.value.name === 'currency') &&
            cell.node.child(0).type.name === 'paragraph' &&
            `${parseInt(cell.node.textContent, 10)}` === cell.node.textContent
          ) {
            newCell = cell.node;
          }
          // otherwise clear the content
          else {
            newCell = cell.node.type.create(
              cell.node.attrs,
              paragraph.createAndFill() as PmNode,
            );
          }
        }
        tr = tr.replaceWith(
          tr.mapping.map(cell.pos),
          tr.mapping.map(cell.pos + cell.node.nodeSize),
          newCell,
        );
      });
      dispatch(tr);

      tr = editorView.state.tr;
      cells = getCellsInColumn(columnIndex)(tr.selection)!;
      if (cells[1]) {
        const { start } = cells[1];
        const newSelection = Selection.findFrom(
          editorView.state.doc.resolve(start),
          1,
          true,
        );
        if (newSelection) {
          tr = tr.setSelection(newSelection);
        }
      }

      dispatch(tr);
      this.hideMenu();
    }
  };
}
