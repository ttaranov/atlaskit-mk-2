// @flow
import React, { Component } from 'react';
import InlineEdit, { SingleLineTextInput } from '../src';

type State = {
  onEventResult: string,
};
export default class WaitingExample extends Component<void, State> {
  state = {
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

  render() {
    return (
      <div style={{ padding: '0 16px' }}>
        <InlineEdit
          label="Waiting State"
          isWaiting
          editView={<SingleLineTextInput isEditing isInitiallySelected />}
          readView={
            <SingleLineTextInput
              isEditing={false}
              value={'Click to edit & field will be styled as disabled'}
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
