import * as React from 'react';
import { PureComponent } from 'react';
import { PluginKey } from 'prosemirror-state';
import { EditorView } from 'prosemirror-view';
import MentionIcon from '@atlaskit/icon/glyph/editor/mention';
import { analyticsDecorator as analytics } from '../../../../analytics';
import ToolbarButton from '../../../../ui/ToolbarButton';
import { insertMentionQuery } from '../../commands/insert-mention-query';

export interface Props {
  editorView?: EditorView;
  pluginKey: PluginKey;
  isDisabled?: boolean;
}

export interface State {
  disabled: boolean;
}

export default class ToolbarMention extends PureComponent<Props> {
  render() {
    return (
      <ToolbarButton
        spacing="none"
        onClick={this.handleInsertMention}
        disabled={this.props.isDisabled}
        title="Mention @"
        iconBefore={<MentionIcon label="Mention" />}
      />
    );
  }

  @analytics('atlassian.fabric.mention.picker.trigger.button')
  private handleInsertMention = (): boolean => {
    if (!this.props.editorView) {
      return false;
    }
    insertMentionQuery()(
      this.props.editorView.state,
      this.props.editorView.dispatch,
    );
    return true;
  };
}
