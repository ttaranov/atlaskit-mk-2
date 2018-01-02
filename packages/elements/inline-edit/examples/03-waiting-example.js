// @flow
import React, { Component } from 'react';
import { FieldTextAreaStateless } from '../src';

type State = {
  onEventResult: string,
};
export default class WaitingExample extends Component<void, State> {
  state = {
    onEventResult:
      'Type in the InlinEdit above to trigger onComfirm and onCancel',
  };

  onConfirmHandler = (event: any) => {
    this.setState({
      onEventResult: `onConfirm called with value: ${event.target.value}`,
    });
  };

  onCancelHandler = (event: any) => {
    this.setState({
      onEventResult: `onCancel called with value: ${event.target.value}`,
    });
  };

  render() {
    return (
      <div>
        <InlineEditor
          label="Waiting State"
          isWaiting
          editView={<SingleLineTextInput isEditing isInitiallySelected />}
          readView={
            <SingleLineTextInput
              isEditing={false}
              value={'This will be styled as disabled'}
            />
          }
          onConfirm={() => {}}
          onCancel={() => console.log('cancel')}
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
          {this.state.value}
        </div>
      </div>
    );
  }
}
