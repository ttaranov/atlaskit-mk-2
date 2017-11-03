import DecisionIcon from '@atlaskit/icon/glyph/editor/decision';
import * as React from 'react';
import { PureComponent } from 'react';
import { EditorView } from 'prosemirror-view';
import { analyticsDecorator as analytics } from '../../analytics';
import ToolbarButton from '../ToolbarButton';
import { changeToTaskDecision } from '../../plugins/tasks-and-decisions/commands';

export interface Props {
  editorView?: EditorView;
}

export interface State {
  disabled: boolean;
}

export default class ToolbarDecision extends PureComponent<Props, State> {
  state: State = { disabled: false };

  render() {
    const { disabled } = this.state;

    return (
      <ToolbarButton
        onClick={this.handleInsertDecision}
        disabled={disabled}
        title="Create decision (<>)"
        iconBefore={<DecisionIcon label="Create decision" />}
      />
    );
  }

  @analytics('atlassian.fabric.decision.trigger.button')
  private handleInsertDecision = (): boolean => {
    const { editorView } = this.props;
    if (!editorView) {
      return false;
    }
    changeToTaskDecision(editorView, 'decisionList');
    return true;
  }
}
