// @flow

import React, { Component } from 'react';
import { FormSection } from '@atlaskit/form';
import TextField from '../src';

const eventResultStyle = {
  borderStyle: 'dashed',
  borderWidth: '1px',
  borderColor: '#ccc',
  padding: '0.5em',
  color: '#ccc',
  margin: '0.5em 0',
};

const Label = ({ title }) => (
  <div style={{ padding: '0.5em 0 0.2em' }}>{title}</div>
);

type Props = {};
type State = {| eventResult: string |};

export default class TextFieldExample extends Component<Props, State> {
  state = {
    eventResult:
      'Click into & out of the input above to trigger onBlur & onFocus.',
  };

  handleOnChange = (e: any) => {
    this.setState({
      eventResult: `onChange called with value: ${e.target.value}`,
    });
  };

  handleOnBlur = () => {
    this.setState({ eventResult: 'onBlur called' });
  };

  handleOnFocus = () => {
    this.setState({ eventResult: 'onFocus called' });
  };

  render() {
    const { eventResult } = this.state;

    return (
      <div>
        <FormSection title="onChange handlers">
          <TextField
            onChange={this.handleOnChange}
            onBlur={this.handleOnBlur}
            onFocus={this.handleOnFocus}
          />
          <div style={eventResultStyle}>{eventResult}</div>
        </FormSection>

        <FormSection title="Default value">
          <TextField defaultValue="candy" />
        </FormSection>

        <FormSection title="Disabled">
          <TextField isDisabled defaultValue="can't touch this..." />
        </FormSection>

        {/* TODO - we don't have a label so how do we indicate `required`??? */}
        <FormSection title="Required">
          <TextField isRequired />
        </FormSection>

        {/* TODO - validation */}
        <FormSection title="Invalid">
          <TextField autoFocus />
        </FormSection>

        <FormSection title="Sizes">
          <Label title="xsmall" />
          <TextField size="xsmall" />

          <Label title="small" />
          <TextField size="small" />

          <Label title="medium" />
          <TextField size="medium" />

          <Label title="large" />
          <TextField size="large" />

          <Label title="xlarge" />
          <TextField size="xlarge" />
        </FormSection>

        <FormSection title="HTML5 attributes">
          <Label title="Placeholder" />
          <TextField placeholder="Click here to input..." />

          {/* TODO - Not actually autofocusing when inside Form section... */}
          <Label title="Autofocus" />
          <TextField autoFocus />

          <Label title="Pattern" />
          <TextField pattern="[a-z]{4,8}" />
        </FormSection>
      </div>
    );
  }
}
