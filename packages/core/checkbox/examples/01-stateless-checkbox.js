// @flow
import React, { PureComponent } from 'react';
import { CheckboxStateless } from '../src';

type State = {
  isChecked: boolean,
  onChangeResult: string,
};

export default class StatelessExample extends PureComponent<void, State> {
  state = {
    isChecked: false,
    onChangeResult: 'Check & Uncheck to trigger onChange',
  };
  // flowlint-next-line unclear-type:off
  onChange = (event: any) => {
    this.setState({
      isChecked: !this.state.isChecked,
      onChangeResult: `onChange Event with currentTarget.checked: ${
        event.currentTarget.checked
      }`,
    });
  };

  render() {
    return (
      <div>
        <CheckboxStateless
          isChecked={this.state.isChecked}
          onChange={this.onChange}
          label="Stateless Checkbox"
          value="Stateless Checkbox"
          name="stateless-checkbox"
        />

        <div
          style={{
            borderStyle: 'dashed',
            borderWidth: '1px',
            borderColor: '#ccc',
            padding: '0.5em',
            margin: '0.5em',
            color: '#ccc',
          }}
        >
          {this.state.onChangeResult}
        </div>
      </div>
    );
  }
}
