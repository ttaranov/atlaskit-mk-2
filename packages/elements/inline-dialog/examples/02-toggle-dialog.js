// @flow
import React, { Component } from 'react';
import Button from '@atlaskit/button';
import InlineDialog from '../src';

type State = {
  dialogOpen: boolean,
};

const content = (
  <div>
    <h5>Title</h5>
    <p>Cheesecake gingerbread cupcake soufflé.</p>
    <p>
      Macaroon cupcake powder dragée liquorice fruitcake cookie sesame snaps
      cake.
    </p>
  </div>
);

export default class InlineDialogExample extends Component<{}, State> {
  state = {
    dialogOpen: true,
  };

  toggleDialog = () => this.setState({ dialogOpen: !this.state.dialogOpen });

  render() {
    return (
      <div style={{ minHeight: '120px' }}>
        <InlineDialog content={content} isOpen={this.state.dialogOpen}>
          <Button onClick={this.toggleDialog}>Toggle Dialog</Button>
        </InlineDialog>
      </div>
    );
  }
}
