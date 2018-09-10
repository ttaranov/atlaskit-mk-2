// @flow
import React, { PureComponent } from 'react';
import InlineEdit, { SingleLineTextInput } from '../src';

type State = {
  onEventResult: string,
  editValue: string | number,
};

export default class BasicExample extends PureComponent<void, State> {
  state = {
    editValue: '',
    onEventResult: 'Click on a field above to show edit view',
  };

  onConfirm = () => {
    this.setState({
      onEventResult: `onConfirm called`,
    });
  };

  onCancel = () => {
    this.setState({
      onEventResult: `onCancel called`,
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
      <div style={{ padding: '0 16px' }}>
        <InlineEdit
          label="Inline Edit Field"
          editView={
            <SingleLineTextInput
              isEditing
              isInitiallySelected
              onChange={this.onChange}
            />
          }
          readView={
            <SingleLineTextInput
              isEditing={false}
              value={this.state.editValue || 'Field value'}
            />
          }
          onConfirm={this.onConfirm}
          onCancel={this.onCancel}
        />

        <InlineEdit
          label="With read only view"
          readView="Read view with no edit"
          onConfirm={this.onConfirm}
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
          readView="Click to edit and show invalid message"
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
          label="With confirm on enter enabled "
          shouldConfirmOnEnter
          readView="Click to edit and enter to confirm"
          editView={
            <SingleLineTextInput
              id="inline-confirm-enter"
              isEditing
              isInitiallySelected
              value={this.state.editValue}
              onChange={this.onChange}
            />
          }
          onConfirm={this.onConfirm}
          onCancel={this.onCancel}
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
      </div>
    );
  }
}
