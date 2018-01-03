// @flow
import React, { Component } from 'react';
import SingleLineTextInput from '@atlaskit/input';
import { InlineEdit } from '../src';

type State = {|
  editValue: string | number,
  readValue: string | number,
|};
export default class TextExample extends Component<void, State> {
  state = {
    value: '',
  };

  setValue = (e: any) => this.setState({ value: e.target.value });

  onConfirm = () => {
    this.setState(state => ({ readValue: state.editValue }));
  };

  onCancel = () => {
    this.setState(state => ({ editValue: state.readValue }));
  };

  renderInput = ({ isEditing, id }) => (
    <SingleLineTextInput
      id={id}
      isEditing={isEditing}
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
          State updated onChange with value: {this.state.value}
        </div>
      </div>
    );
  }
}
