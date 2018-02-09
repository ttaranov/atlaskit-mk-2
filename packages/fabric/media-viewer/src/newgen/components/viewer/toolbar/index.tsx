import * as React from 'react';
import { Component } from 'react';
import { Wrapper, Button } from './styled';
import { Action } from '../../../domain';

export interface ToolbarState {}

export interface ToolbarProps {
  actions: Action[];
  onAction: (action: Action) => void;
}

export class Toolbar extends Component<ToolbarProps, ToolbarState> {
  render() {
    const { actions } = this.props;
    return <Wrapper>{this.addActions(actions)}</Wrapper>;
  }

  private addButton(action: Action, key: number) {
    return (
      <Button
        active={action.active}
        onClick={() => this.onAction(action)}
        key={key}
      >
        {action.text}
      </Button>
    );
  }

  private addActions(actions: Action[]) {
    return actions.map((action, key) => this.addButton(action, key));
  }

  private onAction(action: Action) {
    const { onAction } = this.props;
    if (onAction) {
      onAction(action);
    }
  }
}
