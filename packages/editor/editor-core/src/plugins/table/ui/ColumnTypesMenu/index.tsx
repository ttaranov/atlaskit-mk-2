import * as React from 'react';
import { Component } from 'react';
import { EditorView } from 'prosemirror-view';
import {
  forEachCellInColumn,
  setCellAttrs,
  getCellsInColumn,
} from 'prosemirror-utils';
import EditorTextStyleIcon from '@atlaskit/icon/glyph/editor/text-style';
import EditorTextColorIcon from '@atlaskit/icon/glyph/editor/text-color';
import CalendarIcon from '@atlaskit/icon/glyph/calendar';
// import EditorLinkIcon from '@atlaskit/icon/glyph/editor/link';
import EditorMentionIcon from '@atlaskit/icon/glyph/editor/mention';
import EditorTaskIcon from '@atlaskit/icon/glyph/editor/task';
import EditorEmojiIcon from '@atlaskit/icon/glyph/editor/emoji';
import DropdownMenu from '../../../../ui/DropdownMenu';
import EditorHorizontalRuleIcon from '@atlaskit/icon/glyph/editor/horizontal-rule';
import DecisionIcon from '@atlaskit/icon/glyph/editor/decision';

export interface Props {
  editorView: EditorView;
  isOpen: boolean;
  toggleOpen: () => void;
  columnIndex: number;
}

export default class ColumnTypesMenu extends Component<Props, any> {
  render() {
    const items = this.createItems();
    if (!items) {
      return null;
    }

    return (
      <DropdownMenu
        items={items}
        isOpen={this.props.isOpen}
        onItemActivated={this.onMenuItemActivated}
        fitHeight={188}
        fitWidth={180}
        offset={[13, -20]}
      />
    );
  }

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
      elemBefore: <EditorTextColorIcon label="Number" />,
    });

    items.push({
      content: 'Currency',
      value: { name: 'currency' },
      elemBefore: <EditorTextColorIcon label="Currency" />,
    });

    items.push({
      content: 'Date',
      value: { name: 'date' },
      elemBefore: <CalendarIcon label="Date" />,
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
      elemBefore: <EditorHorizontalRuleIcon label="Slider" />,
    });

    items.push({
      content: 'Emoji',
      value: { name: 'emoji' },
      elemBefore: <EditorEmojiIcon label="Emoji" />,
    });

    // items.push({
    //   content: 'Link',
    //   value: { name: 'link' },
    //   elemBefore: <EditorLinkIcon label="Link" />,
    // });

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
        schema: { nodes: { slider, checkbox, tableCell, decisionItem } },
      },
      dispatch,
    } = editorView;
    const attrs = { cellType: item.value.name };

    if (columnIndex !== null) {
      let tr = forEachCellInColumn(columnIndex, cell => {
        // setting cellType only for tableCell so that we can still type in table headers
        return setCellAttrs(
          cell,
          cell.node.type === tableCell && cell.node.attrs.cellType != 'summary'
            ? attrs
            : {},
        );
      })(editorView.state.tr);

      const nodemap = {
        slider: slider,
        checkbox: checkbox,
        decision: decisionItem,
      };

      // filldown for node type
      const cellType = item.value.name;
      if (Object.keys(nodemap).indexOf(cellType) !== -1) {
        // const node = nodemap[item.value.name].createChecked();
        let node;
        const cells = getCellsInColumn(columnIndex)(tr.selection)!;
        cells.forEach(cell => {
          if (
            cell.node.type !== tableCell ||
            cell.node.attrs.cellType === 'summary'
          ) {
            return;
          }

          if (item.value.name === 'decision') {
            node = editorView.state.schema.nodes.decisionList.createAndFill();
            tr = tr.replaceWith(
              tr.mapping.map(cell.pos),
              tr.mapping.map(cell.pos + cell.node.nodeSize - 1),
              node,
            );
          } else {
            node = nodemap[cellType].createChecked();
            tr = tr.insert(tr.mapping.map(cell.pos + 1), node);
          }
        });
      }

      dispatch(tr);
      this.props.toggleOpen();
    }
  };
}
