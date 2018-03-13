import * as React from 'react';
import { PureComponent } from 'react';
import { ActionMarkAttributes, EventHandlers } from '@atlaskit/editor-common';

export interface Props extends ActionMarkAttributes {
  markKey?: string;
  eventHandlers?: EventHandlers;
  children?: any;
}

export default class Action extends PureComponent<Props, {}> {
  onClick = () => {
    if (
      this.props.eventHandlers &&
      this.props.eventHandlers.action &&
      this.props.eventHandlers.action.onClick
    ) {
      this.props.eventHandlers.action.onClick({
        key: this.props.markKey,
        target: this.props.target,
        parameters: this.props.parameters,
      });
    }
  };

  render() {
    return (
      <span className="akActionMark" onClick={this.onClick}>
        {this.props.children}
      </span>
    );
  }
}
