// @flow
import React, { Component } from 'react';
import SingleSelect from '@atlaskit/single-select';
import InlineDialog from '../src';

type State = {
  isDialogOpen: boolean,
};

export default class SingleSelectDialog extends Component<{}, State> {
  state = {
    isDialogOpen: true,
  };

  dialogClosed = () => {
    this.setState(prevState => ({ isDialogOpen: !prevState.isDialogOpen }));
  };

  render() {
    const items = [
      {
        items: [
          {
            value: 'selectItem',
            content: 'selectItem',
          },
        ],
      },
    ];
    const content = (
      <div>
        <h1>Hello World</h1>
        <SingleSelect items={items} />
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
