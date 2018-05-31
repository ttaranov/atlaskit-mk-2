// @flow
import React, { PureComponent } from 'react';
import Button from '@atlaskit/button';
import Avatar from '@atlaskit/avatar';
import EditRoom from '../src/components/EditRoom';

const atlaskit =
  'https://aes-artifacts--cdn.us-east-1.prod.public.atl-paas.net/hashed/h_WngH2CT14RPH8StumU3X9PIWPAgg0ilp176OeHaO8/17ae6f84-14c4-4e66-8f97-a05990ec1b3e.png';

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
        <h3>Edit room settings</h3>
        <Avatar src={atlaskit} size="xlarge" appearance="square" />
      </div>
    );
    return (
      <div>
        <Button onClick={this.open}>Edit Room</Button>

        {isOpen && <EditRoom onClose={this.close} header={header} />}
      </div>
    );
  }
}
