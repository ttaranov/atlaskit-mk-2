// @flow
import React, { PureComponent } from 'react';
import FieldTextArea from '../src/FieldTextArea';

type State = {
  onChangeResult: string,
};

export default class BasicExample extends PureComponent<void, State> {
  state = {
    onChangeResult: 'Type in the Field Text Area above to trigger onChange',
  };

  onChange = (event: any) => {
    this.setState({
      onChangeResult: `onChange called with value: ${event.target.value}`,
    });
  };

  render() {
    return (
      <div>
        <FieldTextArea
          autoFocus
          value=""
          label="Autofocus, placeholder text & onChange handler shown below"
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
        <div>
          <FieldTextArea
            label="Required, Spell check disabled & max length"
            isSpellCheckEnabled={false}
            required
          />
          <FieldTextArea
            label="hidden label"
            isLabelHidden
            placeholder="Hidden Label"
            maxLength={10}
          />
          <FieldTextArea disabled label="disabled" value="Disabled" />
          <FieldTextArea
            isInvalid
            label="Is Invalid & showing message"
            invalidMessage="An invalid message example"
          />
        </div>
      </div>
    );
  }
}
