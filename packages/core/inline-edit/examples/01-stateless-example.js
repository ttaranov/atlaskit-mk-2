// @flow
import React, { Component } from 'react';
import { InlineEditStateless, SingleLineTextInput } from '../src';

type State = {|
  value: string | number,
  isEditing: boolean,
  onEventResult: string,
|};

export default class StatelessExample extends Component<void, State> {
  state = {
    value: '',
    isEditing: false,
    onEventResult: 'Click on a field above to show edit view',
  };

  onEditRequested = () => {
    this.setState({
      isEditing: true,
      onEventResult: `onEditRequested called`,
    });
  };
  onConfirm = () => {
    this.setState({
      isEditing: false,
      onEventResult: `onConfirm called`,
    });
  };

  onCancel = () => {
    this.setState({
      isEditing: false,
      onEventResult: `onCancel called`,
    });
  };

  onChange = (event: any) => {
    this.setState({
      value: event.target.value,
      onEventResult: `onChange called with value: ${event.target.value}`,
    });
  };

  render() {
    return (
      <div style={{ padding: '0 16px' }}>
        <InlineEditStateless
          label="Stateless Inline Edit"
          isEditing={this.state.isEditing}
          onEditRequested={this.onEditRequested}
          onCancel={this.onCancel}
          onConfirm={this.onConfirm}
          readView={
            <SingleLineTextInput
              isEditing={false}
              value={this.state.value || 'A field value'}
            />
          }
          editView={
            <SingleLineTextInput
              isEditing
              isInitiallySelected
              value={this.state.value}
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
      </div>
    );
  }
}
