import * as React from 'react';
import { Node as PmNode } from 'prosemirror-model';
import { EditorView, NodeView } from 'prosemirror-view';
import Button from '@atlaskit/button';
import ReactNodeView from '../../../nodeviews/ReactNodeView';
import { PortalProviderAPI } from '../../../ui/PortalProvider';

import EditorTextStyleIcon from '@atlaskit/icon/glyph/editor/text-style';
import EditorTextColorIcon from '@atlaskit/icon/glyph/editor/text-color';
import CalendarIcon from '@atlaskit/icon/glyph/calendar';
import EditorMentionIcon from '@atlaskit/icon/glyph/editor/mention';
import EditorTaskIcon from '@atlaskit/icon/glyph/editor/task';
import EditorEmojiIcon from '@atlaskit/icon/glyph/editor/emoji';
import EditorHorizontalRuleIcon from '@atlaskit/icon/glyph/editor/horizontal-rule';
import DecisionIcon from '@atlaskit/icon/glyph/editor/decision';
import { pluginKey } from '../pm-plugins/column-types';
import { closestElement } from '../../../utils/';

export interface Props {
  node: PmNode;
  view: EditorView;
  portalProviderAPI: PortalProviderAPI;
  getPos: () => number;
}

export default class TableHeaderView extends ReactNodeView implements NodeView {
  constructor(props: Props) {
    super(props.node, props.view, props.getPos, props.portalProviderAPI, props);
    this.view = props.view;
  }
  view: EditorView;

  createDomRef() {
    return document.createElement('th');
  }

  getContentDOM() {
    const dom = document.createElement('div');
    dom.classList.add('tableHeaderWrapper');
    return { dom };
  }

  render(props, forwardRef) {
    let icon;
    switch (this.node.attrs.cellType) {
      case 'text':
        icon = <EditorTextStyleIcon label="Normal text" />;
        break;
      case 'number':
        icon = <EditorTextColorIcon label="Number" />;
        break;
      case 'currency':
        icon = <EditorTextColorIcon label="Currency" />;
        break;
      case 'date':
        icon = <CalendarIcon label="Date" />;
        break;
      case 'mention':
        icon = <EditorMentionIcon label="Person" />;
        break;
      case 'checkbox':
        icon = <EditorTaskIcon label="Checkbox" />;
        break;
      case 'slider':
        icon = <EditorHorizontalRuleIcon label="Slider" />;
        break;
      case 'emoji':
        icon = <EditorEmojiIcon label="Emoji" />;
        break;
      case 'decision':
        icon = <DecisionIcon label="Decision" />;
        break;
      default:
        icon = <EditorTextStyleIcon label="Normal text" />;
        break;
    }

    return (
      <div className="ProseMirror-tableHeader-nodeview">
        <div
          className="ProseMirror-tableHeader-nodeview-content"
          ref={forwardRef}
        />
        <div className="ProseMirror-tableHeader-button-container">
          <Button
            appearance="subtle"
            iconBefore={icon}
            spacing="none"
            onClick={this.handleClick}
          />
        </div>
      </div>
    );
  }

  ignoreMutation(record: MutationRecord) {
    return true;
  }

  private handleClick = event => {
    const { dispatch, state } = this.view;
    const { target } = event;
    const cell = (closestElement(target, 'td') ||
      closestElement(target, 'th')) as HTMLTableDataCellElement;
    const columnIndex = cell && cell.cellIndex;

    dispatch(
      state.tr.setMeta(pluginKey, {
        targetColumnRef: target,
        columnIndex,
      }),
    );
  };
}
