import * as React from 'react';
import { PureComponent } from 'react';
import { EditorView } from 'prosemirror-view';
import DecisionIcon from '@atlaskit/icon/glyph/editor/decision';
import { analyticsDecorator as analytics } from '../../../../analytics';
import ToolbarButton from '../../../../ui/ToolbarButton';
import { insertTaskDecision } from '../../commands';

export interface Props {
  editorView?: EditorView;
  isDisabled?: boolean;
  isReducedSpacing?: boolean;
}

export interface State {
  disabled: boolean;
}

export default class ToolbarDecision extends PureComponent<Props, State> {
  state: State = { disabled: false };

  render() {
    const { disabled } = this.state;
    const { isDisabled, isReducedSpacing } = this.props;

    return (
      <ToolbarButton
        onClick={this.handleInsertDecision}
        disabled={disabled || isDisabled}
        spacing={isReducedSpacing ? 'none' : 'default'}
        title="Decision <>"
        iconBefore={<DecisionIcon label="Decision" />}
      />
    );
  }

  @analytics('atlassian.fabric.decision.trigger.button')
  private handleInsertDecision = (): boolean => {
    const { editorView } = this.props;
    if (!editorView) {
      return false;
    }
    insertTaskDecision(editorView, 'decisionList');
    return true;
  };
}
