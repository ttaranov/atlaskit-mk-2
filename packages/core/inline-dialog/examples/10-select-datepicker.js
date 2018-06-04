// @flow
import React, { Component } from 'react';
import Select from '@atlaskit/select';
import { DatePicker } from '@atlaskit/datetime-picker';
import InlineDialog from '../src';

type State = {
  isDialogOpen: boolean,
  isSelectOpen: boolean,
};

export default class SingleSelectDialog extends Component<{}, State> {
  state = {
    isDialogOpen: true,
    isSelectOpen: true,
  };

  dialogClosed = () => {
    if (this.state.isSelectOpen) {
      this.setState(prevState => ({ isDialogOpen: !prevState.isDialogOpen }));
      console.log('Close');
    }
  };

  render() {
    const options = [
      {
        label: 'value 1',
        value: 1,
      },
      {
        label: 'value 2',
        value: 2,
      },
    ];

    const content = (
      <div style={{ width: '300px' }}>
        <h1>Using Select</h1>
        <Select options={options} />
        <DatePicker />
      </div>
    );

    return (
      <InlineDialog
        content={content}
        isOpen={this.state.isDialogOpen}
        onClose={this.dialogClosed}
      />
    );
  }
}
