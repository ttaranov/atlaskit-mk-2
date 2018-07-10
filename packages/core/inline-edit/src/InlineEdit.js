// @flow
import React, { Component } from 'react';
import InlineEditStateless from './InlineEditStateless';
import type { StatefulProps } from './types';

type State = {
  isEditing: boolean,
};

type DefaultProps = {
  label: string,
  readView: string,
  editButtonLabel: string,
  confirmButtonLabel: string,
  cancelButtonLabel: string,
};

export default class InlineEditor extends Component<StatefulProps, State> {
  state = {
    isEditing: false,
  };

  static defaultProps: DefaultProps = {
    label: '',
    readView: '',
    editButtonLabel: 'Edit',
    confirmButtonLabel: 'Confirm',
    cancelButtonLabel: 'Cancel',
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

  enterEditingMode = () => {
    this.setState({ isEditing: true });
  };

  exitEditingMode = () => {
    this.setState({ isEditing: false });
  };

  render() {
    return (
      <InlineEditStateless
        isEditing={this.state.isEditing}
        {...this.props}
        onEditRequested={this.enterEditingMode}
        onConfirm={this.onConfirm}
        onCancel={this.onCancel}
        editButtonLabel={this.props.editButtonLabel}
        confirmButtonLabel={this.props.confirmButtonLabel}
        cancelButtonLabel={this.props.cancelButtonLabel}
      />
    );
  }
}
