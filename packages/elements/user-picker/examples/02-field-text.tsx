import * as React from 'react';
import FieldText from '@atlaskit/field-text';
import { UserPicker } from '../src/components/UserPicker';
import { exampleUsers } from '../example-helpers';

export interface State {
  isInputFocused: boolean;
}

export default class Example extends React.Component<{}, State> {
  state = {
    isInputFocused: false,
  };

  onInputFocus = () => {
    this.setState({
      isInputFocused: true,
    });
  };

  onInputBlur = () => {
    this.setState({
      isInputFocused: false,
    });
  };

  render() {
    const { isInputFocused } = this.state;
    return (
      <UserPicker
        trigger={
          <FieldText onFocus={this.onInputFocus} onBlur={this.onInputBlur} />
        }
        open={isInputFocused}
        users={exampleUsers}
        onRequestClose={this.onInputBlur}
        onSelection={console.log}
      />
    );
  }
}
