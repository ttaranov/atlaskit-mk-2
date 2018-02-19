// @flow
import React, { Component } from 'react';
import SingleLineTextInput from '@atlaskit/input';
import FieldText from '@atlaskit/field-text';
import InlineEdit from '../src';

type State = {
  inputValue: string,
  editInputValue: string,
  fieldTextValue: string,
  editFieldTextValue: string,
};

export default class extends Component<*, State> {
  state = {
    inputValue: 'Input value',
    editInputValue: 'Input value',
    fieldTextValue: 'Field text value',
    editFieldTextValue: 'Field text value',
  };

  onInputChange = (e: SyntheticInputEvent<>) => {
    this.setState({
      editInputValue: e.target.value,
    });
  };

  onFieldTextChange = (e: any) => {
    this.setState({
      editFieldTextValue: e.target.value,
    });
  };

  onInputConfirm = () => {
    this.setState({
      inputValue: this.state.editInputValue,
    });
  };

  onInputCancel = () => {
    this.setState({
      editInputValue: this.state.inputValue,
    });
  };

  onFieldTextConfirm = () => {
    this.setState({
      fieldTextValue: this.state.editFieldTextValue,
    });
  };

  onFieldTextCancel = () => {
    this.setState({
      editFieldTextValue: this.state.fieldTextValue,
    });
  };

  render() {
    return (
      <div>
        <InlineEdit
          label="Input edit view"
          readView={
            <SingleLineTextInput
              isEditing={false}
              value={this.state.inputValue}
              onChange={this.onInputChange}
            />
          }
          isFitContainerWidthReadView
          editView={
            <SingleLineTextInput
              isEditing
              value={this.state.editInputValue}
              onChange={this.onInputChange}
            />
          }
          onConfirm={this.onInputConfirm}
          onCancel={this.onInputCancel}
        />
        <InlineEdit
          label="FieldText edit view"
          readView={this.state.fieldTextValue}
          isFitContainerWidthReadView
          disableEditViewFieldBase
          editView={
            <FieldText
              shouldFitContainer
              isLabelHidden
              value={this.state.editFieldTextValue}
              onChange={this.onFieldTextChange}
            />
          }
          onConfirm={this.onFieldTextConfirm}
          onCancel={this.onFieldTextCancel}
        />
      </div>
    );
  }
}
