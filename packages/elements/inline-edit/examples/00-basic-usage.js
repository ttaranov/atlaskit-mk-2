// @flow
import React, { PureComponent } from 'react';
import InlineEdit from '../src';

type State = {
  onChangeResult: string,
};

export default class BasicExample extends PureComponent<void, State> {
  state = {
    onChangeResult:
      'Type in the InlinEdit above to trigger onComfirm and onCancel',
  };

  onConfirmHandler = (event: any) => {
    this.setState({
      onChangeResult: `onConfirm called with value: ${event.target.value}`,
    });
  };

  onCancelHandler = (event: any) => {
    this.setState({
      onChangeResult: `onCancel called with value: ${event.target.value}`,
    });
  };

  render() {
    return (
      <div>
        <InlineEdit
          label="With read only view"
          readView="Read view"
          onConfirm={() => {}}
          onCancel={() => {}}
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
          {this.state.onChangeResult}
        </div>
        <div />
      </div>
    );
  }
}
