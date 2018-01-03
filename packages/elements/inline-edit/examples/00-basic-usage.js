// @flow
import React, { PureComponent } from 'react';
import SingleLineTextInput from '@atlaskit/input';
import InlineEdit from '../src';

type State = {
  onEventResult: string,
  editValue: string | number,
};

export default class BasicExample extends PureComponent<void, State> {
  state = {
    editValue: '',
    onEventResult:
      'Type in the InlinEdit above to trigger onComfirm and onCancel',
  };

  onConfirm = (event: any) => {
    this.setState({
      onEventResult: `onConfirm called with value: ${event.target.value}`,
    });
  };

  onCancel = (event: any) => {
    this.setState({
      onEventResult: `onCancel called with value: ${event.target.value}`,
    });
  };

  onChange = (event: any) => {
    this.setState({
      editValue: event.target.value,
      onEventResult: `onChange called with value: ${event.target.value}`,
    });
  };

  render() {
    return (
      <div>
        <InlineEdit
          label="With read only view"
          readView="Read view with no edit"
          onConfirm={this.onConfirmH}
          onCancel={this.onCancel}
        />

        <InlineEdit
          label="With edit & read views"
          readView="Read view"
          editView={
            <SingleLineTextInput
              id="inline-edit-text-input"
              isEditing
              isInitiallySelected
              value={this.state.editValue}
              onChange={this.onChange}
            />
          }
          onConfirm={this.onConfirm}
          onCancel={this.onCancel}
        />
        <InlineEdit
          label="With an invalid message shown when in focus"
          isInvalid
          invalidMessage="This error message is shown when the field is focused"
        />
        <InlineEdit
          shouldConfirmOnEnter
          editView={
            <SingleLineTextInput
              id="inline-confirm-enter"
              isEditing
              isInitiallySelected
              value={this.state.editValue}
              onChange={this.onChange}
            />
          }
        />
        <div
          style={{
            borderStyle: 'dashed',
            borderWidth: '1px',
            borderColor: '#ccc',
            padding: '0.5em',
            color: '#ccc',
            margin: '0.5em',
          }}
        >
          {this.state.onEventResult}
        </div>
        <div />
      </div>
    );
  }
}
