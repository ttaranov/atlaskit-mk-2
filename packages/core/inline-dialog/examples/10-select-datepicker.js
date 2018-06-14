// @flow
import React, { Component } from 'react';
import Select from '@atlaskit/select';
import Button from '@atlaskit/button';
import { DatePicker } from '@atlaskit/datetime-picker';
import InlineDialog from '../src';

type State = {
  isDialogOpen: boolean,
};

export default class SingleSelectDialog extends Component<{}, State> {
  state = {
    isDialogOpen: true,
  };

  openDialog = () => {
    this.setState({ isDialogOpen: true });
  };
  dialogClosed = () => {
    this.setState(prevState => ({ isDialogOpen: !prevState.isDialogOpen }));
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
      >
        <Button onClick={this.openDialog} isDisabled={this.state.isDialogOpen}>
          Open Dialog
        </Button>
      </InlineDialog>
    );
  }
}
