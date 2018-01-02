// @flow
import React, { Component } from 'react';
import InlineEditStateless from './InlineEditStateless';

type Props = {
  /** Function passed to stateless component, isEditing will be set to false
   before the passed function is called. */
  onConfirm: any => mixed,
  /** Function passed to stateless component, isEditing will be set to false
   before the passed function is called. */
  onCancel: any => mixed,
};

type State = {
  isEditing?: boolean,
};

export default class InlineEdit extends Component<Props, State> {
  state = {
    isEditing: false,
  };

  onConfirm = () => {
    this.exitEditingMode();
    const cancelConfirmation = this.enterEditingMode;
    this.props.onConfirm(cancelConfirmation);
  };

  onCancel = () => {
    this.exitEditingMode();
    this.props.onCancel();
  };

  enterEditingMode = () => this.setState({ isEditing: true });

  exitEditingMode = () => this.setState({ isEditing: false });

  render() {
    return (
      <InlineEditStateless
        isEditing={this.state.isEditing}
        {...this.props}
        onEditRequested={this.enterEditingMode}
        onConfirm={this.onConfirm}
        onCancel={this.onCancel}
      />
    );
  }
}
