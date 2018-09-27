// @flow
import React, { Component } from 'react';
import FieldText from '@atlaskit/field-text';
import FieldRadioGroup from '@atlaskit/field-radio-group';
import InlineEdit, { SingleLineTextInput } from '../src';

const radioItems = [
  {
    name: 'shouldFitContainer',
    value: 'true',
    label: 'true',
  },
  {
    name: 'shouldFitContainer',
    value: 'false',
    label: 'false',
    defaultSelected: true,
  },
];

type State = {
  inputValue: string,
  editInputValue: string,
  fieldTextValue: string,
  editFieldTextValue: string,
  shouldFitContainer: boolean,
};

export default class extends Component<*, State> {
  state = {
    inputValue: 'Input value',
    editInputValue: 'Input value',
    fieldTextValue: 'Field text value',
    editFieldTextValue: 'Field text value',
    shouldFitContainer: false,
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

  onShouldFitContainerChange = (e: any) => {
    this.setState({
      shouldFitContainer: e.target.value === 'true',
    });
  };

  render() {
    return (
      <div style={{ padding: '0 16px' }}>
        <p>
          The <code>isFitContainerWidthReadView</code> prop controls whether the
          read view width should stretch to fit the parent container. You can
          see this while hovering.
          <br />
          The edit view width will always stretch to fit the container and
          should work regardless of what edit view component you use, provided
          that it stretches to fit its container.
        </p>

        <FieldRadioGroup
          items={radioItems}
          label="Should read view width fit container:"
          onRadioChange={this.onShouldFitContainerChange}
        />
        <InlineEdit
          label="Input edit view"
          readView={
            <SingleLineTextInput
              isEditing={false}
              value={this.state.inputValue}
              onChange={this.onInputChange}
            />
          }
          isFitContainerWidthReadView={this.state.shouldFitContainer}
          editView={
            <SingleLineTextInput
              isEditing
              isInitiallySelected
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
          isFitContainerWidthReadView={this.state.shouldFitContainer}
          disableEditViewFieldBase
          editView={
            <FieldText
              shouldFitContainer
              isLabelHidden
              autoFocus
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
