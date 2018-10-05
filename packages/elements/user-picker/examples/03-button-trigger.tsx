import * as React from 'react';
import Button from '@atlaskit/button';
import { UserPicker } from '../src/components/UserPicker';
import { User } from '../src/types';
import { exampleUsers } from '../example-helpers';

export interface State {
  isInputFocused: boolean;
  users?: User[];
}

export default class Example extends React.Component<{}, State> {
  state = {
    isInputFocused: false,
    users: undefined,
  };

  toggleUserPicker = () => {
    this.setState(
      state => ({
        isInputFocused: !state.isInputFocused,
        users: undefined,
      }),
      () => {
        if (this.state.isInputFocused) {
          setTimeout(() => {
            this.setState({ users: exampleUsers });
          }, 1500);
        }
      },
    );
  };

  render() {
    const { isInputFocused, users } = this.state;
    return (
      <UserPicker
        trigger={<Button onClick={this.toggleUserPicker}>Click me!</Button>}
        open={isInputFocused}
        users={users}
      />
    );
  }
}
