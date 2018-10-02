// @flow
import React, { PureComponent } from 'react';
import Checkbox from '../src/Checkbox';

type State = {
  onChangeResult: string,
};

export default class UncontrolledExample extends PureComponent<void, State> {
  state = {
    onChangeResult: 'Check & Uncheck to trigger onChange',
  };
  onChange = () => {
    this.setState({
      onChangeResult: `Checkbox only updates when updating isChecked property`,
    });
  };

  render() {
    return (
      <div>
        <Checkbox
          isChecked={false}
          onChange={this.onChange}
          label="Uncontrolled Checkbox"
          value="Uncontrolled Checkbox"
          name="uncontrolled-checkbox"
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
