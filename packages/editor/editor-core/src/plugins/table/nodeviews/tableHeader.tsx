import * as React from 'react';
import * as ReactDOM from 'react-dom';
import { Node as PmNode } from 'prosemirror-model';
import { EditorView, NodeView } from 'prosemirror-view';
import { EventDispatcher } from '../../../event-dispatcher';
import ContentNodeView from '../../../nodeviews/contentNodeView';

import EditorTextStyleIcon from '@atlaskit/icon/glyph/editor/text-style';
import EditorTextColorIcon from '@atlaskit/icon/glyph/editor/text-color';
import CalendarIcon from '@atlaskit/icon/glyph/calendar';
import EditorMentionIcon from '@atlaskit/icon/glyph/editor/mention';
import EditorTaskIcon from '@atlaskit/icon/glyph/editor/task';
import EditorEmojiIcon from '@atlaskit/icon/glyph/editor/emoji';
import DropdownMenu from '../../../../ui/DropdownMenu';
import EditorHorizontalRuleIcon from '@atlaskit/icon/glyph/editor/horizontal-rule';
import DecisionIcon from '@atlaskit/icon/glyph/editor/decision';

export interface Props {
  node: PmNode;
  view: EditorView;
  eventDispatcher?: EventDispatcher;
  getPos: () => number;
}

export default class TableHeaderView extends ContentNodeView
  implements NodeView {
  private node: PmNode;
  private domRef: HTMLElement | null;

  constructor(props: Props) {
    super(props.node, props.view);
    this.node = props.node;

    this.domRef = document.createElement('th');

    this.render();
  }

  get dom() {
    return this.domRef;
  }

  update(node: PmNode, decorations) {
    if (node.type !== this.node.type) {
      return false;
    }

    this.node = node;
    this.render();
    return true;
  }

  render() {
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

    ReactDOM.render(
      <div className="ProseMirror-tableHeader-nodeview">
        <div
          className="ProseMirror-tableHeader-nodeview-content"
          ref={elem => {
            this.handleRef(elem ? elem : undefined);
          }}
        />
        {icon}
      </div>,
      this.domRef,
    );
  }

  ignoreMutation(record: MutationRecord) {
    return true;
  }

  destroy() {
    ReactDOM.unmountComponentAtNode(this.domRef);
    this.domRef = null;
  }
}
