import * as React from 'react';
import Button from '@atlaskit/button';
import { UserPicker } from '../src/components/UserPicker';
import { exampleUsers } from '../example-helpers';

export interface State {
  isInputFocused: boolean;
}

export default class Example extends React.Component<{}, State> {
  state = {
    isInputFocused: false,
  };

  toggleUserPicker = () => {
    this.setState(state => ({
      isInputFocused: !state.isInputFocused,
    }));
  };

  render() {
    const { isInputFocused } = this.state;
    return (
      <UserPicker
        trigger={<Button onClick={this.toggleUserPicker}>Click me!</Button>}
        open={isInputFocused}
        users={exampleUsers}
        onSelection={console.log}
      />
    );
  }
}
