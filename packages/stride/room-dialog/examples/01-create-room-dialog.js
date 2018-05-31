// @flow
import React, { PureComponent } from 'react';
import Button from '@atlaskit/button';
import CreateRoom from '../src';

type State = {
  isOpen: boolean,
};
export default class ExampleBasic extends PureComponent<{}, State> {
  state: State = { isOpen: false };
  open = () => this.setState({ isOpen: true });
  close = () => this.setState({ isOpen: false });
  render() {
    const { isOpen } = this.state;
    /* It needs some ADG styling */
    const header = () => (
      <div>
        <h3>Create a room</h3>
        <div>Make a home base for your team, project, or idea. </div>
      </div>
    );
    return (
      <div>
        <Button onClick={this.open}>Create Room</Button>

        {isOpen && <CreateRoom onClose={this.close} header={header} />}
      </div>
    );
  }
}
