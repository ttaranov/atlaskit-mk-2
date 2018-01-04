// @flow
import React, { Component } from 'react';
import SingleLineTextInput from '@atlaskit/input';
import InlineEdit from '../src';

type State = {|
  editValue: string | number,
  readValue: string | number,
  onEventResult: string,
|};
export default class TextExample extends Component<void, State> {
  state = {
    editValue: '',
    readValue: '',
    onEventResult: '',
  };

  onConfirm = () => {
    this.setState(state => ({ readValue: state.editValue }));
  };

  onCancel = () => {
    this.setState(state => ({ editValue: state.readValue }));
  };

  onChange = (event: any) => {
    this.setState({
      editValue: event.target.value,
      onEventResult: `onChange called with value: ${event.target.value}`,
    });
  };

  renderInput = (options: { isEditing: boolean, id: string }) => (
    <SingleLineTextInput
      id={options.id}
      isEditing={options.isEditing}
      isInitiallySelected
      value={this.state.editValue}
      onChange={this.onChange}
    />
  );

  render() {
    const id = 'inline-edit-single';
    return (
      <div>
        <InlineEdit
          label="With Text Input"
          labelHtmlFor={id}
          editView={this.renderInput({ isEditing: true, id })}
          readView={this.renderInput({ isEditing: false, id })}
          onConfirm={this.onConfirm}
          onCancel={this.onCancel}
          {...this.props}
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
