// @flow
import React, { PureComponent } from 'react';
import SingleLineTextInput from '@atlaskit/input';
import InlineEditor from '../src';

type State = {
  onEventResult: string,
  editValue: string | number,
};

export default class BasicExample extends PureComponent<void, State> {
  state = {
    editValue: '',
    onEventResult:
      'Type in the InlineEditor above to trigger onComfirm and onCancel',
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
        <InlineEditor
          label="Inline Edit Field"
          editView={
            <SingleLineTextInput
              isEditing
              isInitiallySelected
              onChange={e => this.setState({ editValue: e.target.value })}
            />
          }
          readView={
            <SingleLineTextInput
              isEditing={false}
              value={this.state.editValue || 'Field value'}
            />
          }
          onConfirm={() => {}}
          onCancel={() => console.log('cancel')}
        />

        <InlineEditor
          label="With read only view"
          readView="Read view with no edit"
          onConfirm={this.onConfirm}
          onCancel={this.onCancel}
        />

        <InlineEditor
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
        <InlineEditor
          label="With an invalid message shown when in focus"
          isInvalid
          invalidMessage="This error message is shown when the field is focused"
          onConfirm={this.onConfirm}
          onCancel={this.onCancel}
        />
        <InlineEditor
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
        <div />
      </div>
    );
  }
}
