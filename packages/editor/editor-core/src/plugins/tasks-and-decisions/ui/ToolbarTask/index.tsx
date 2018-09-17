import * as React from 'react';
import { PureComponent } from 'react';
import { EditorView } from 'prosemirror-view';
import TaskIcon from '@atlaskit/icon/glyph/editor/task';
import { withAnalytics } from '../../../../analytics';
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
        title="Create action []"
        iconBefore={<TaskIcon label="Create action" />}
      />
    );
  }

  private handleInsertTask = withAnalytics(
    'atlassian.fabric.action.trigger.button',
    (): boolean => {
      const { editorView } = this.props;
      if (!editorView) {
        return false;
      }
      changeToTaskDecision(editorView, 'taskList');
      return true;
    },
  );
}
