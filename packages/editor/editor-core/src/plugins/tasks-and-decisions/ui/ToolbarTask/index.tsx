import * as React from 'react';
import { PureComponent } from 'react';
import { EditorView } from 'prosemirror-view';
import TaskIcon from '@atlaskit/icon/glyph/editor/task';
import { analyticsDecorator as analytics } from '../../../../analytics';
import ToolbarButton from '../../../../ui/ToolbarButton';
import { changeToTaskDecision } from '../../commands';

export interface Props {
  editorView?: EditorView;
  isDisabled?: boolean;
  isReducedSpacing?: boolean;
}

export interface State {
  disabled: boolean;
}

export default class ToolbarTask extends PureComponent<Props, State> {
  state: State = { disabled: false };

  render() {
    const { disabled } = this.state;
    const { isDisabled, isReducedSpacing } = this.props;

    return (
      <ToolbarButton
        onClick={this.handleInsertTask}
        disabled={disabled || isDisabled}
        spacing={isReducedSpacing ? 'none' : 'default'}
        title="Action item []"
        iconBefore={<TaskIcon label="Action item" />}
      />
    );
  }

  @analytics('atlassian.fabric.action.trigger.button')
  private handleInsertTask = (): boolean => {
    const { editorView } = this.props;
    if (!editorView) {
      return false;
    }
    changeToTaskDecision(editorView, 'taskList');
    return true;
  };
}
