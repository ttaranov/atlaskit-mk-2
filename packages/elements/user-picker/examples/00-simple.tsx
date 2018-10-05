import * as React from 'react';

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

  componentDidUpdate() {
    setTimeout(() => {
      this.setState({ users: exampleUsers });
    }, 1500);
  }

  onInputFocus = () => {
    this.setState({
      isInputFocused: true,
    });
  };

  onInputBlur = () => {
    this.setState({
      isInputFocused: false,
      users: undefined,
    });
  };

  render() {
    const { isInputFocused, users } = this.state;
    return (
      <UserPicker
        trigger={
          <input onFocus={this.onInputFocus} onBlur={this.onInputBlur} />
        }
        open={isInputFocused}
        users={users}
      />
    );
  }
}
