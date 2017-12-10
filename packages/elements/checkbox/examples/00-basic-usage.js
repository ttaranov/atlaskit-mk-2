// @flow
import React, { PureComponent } from 'react';
import Checkbox, { CheckboxGroup } from '../src';

type Props = {};
type State = {
  onChangeResult: string,
};

const BasicUsageExample = class extends PureComponent<Props, State> {
  state = {
    onChangeResult: 'Check & Uncheck to trigger onChange',
  };

  onChange = (event: object) => {
    this.setState({
      onChangeResult:
        'onChange called with value: ' +
        event.value +
        ', isChecked:' +
        event.isChecked,
    });
  };

  render() {
    return (
      <div>
        <Checkbox
          value="Basic checkbox"
          label="Basic checkbox"
          onChange={this.onChange}
        />
        <Checkbox
          initiallyChecked
          label="Checked by default"
          value="Checked by default"
          onChange={this.onChange}
        />
        <Checkbox
          isDisabled
          label="Disabled"
          value="Disabled"
          onChange={this.onChange}
        />
        <Checkbox
          isInvalid
          label="Invalid"
          value="Invalid"
          onChange={this.onChange}
        />
        <Checkbox
          isFullWidth
          label="Full Width"
          value="Full Width"
          onChange={this.onChange}
        />

        <div
          style={{
            borderStyle: 'dashed',
            borderWidth: '1px',
            borderColor: '#ccc',
            padding: '0.5em',
            color: '#ccc',
            margin: '0.5em',
          }}
        >
          {this.state.onChangeResult}
        </div>
      </div>
    );
  }
};

export default BasicUsageExample;
