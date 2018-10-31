// @flow

import React, { Component, type ElementRef } from 'react';
import Button from '@atlaskit/button';
import Form, { Field, FormHeader } from '@atlaskit/form';
import TextField from '../src';

const iframeStyles = {
  width: '95%',
  height: '300px',
  borderStyle: 'dashed',
  borderWidth: '1px',
  borderColor: '#ccc',
  padding: '0.5em',
  color: '#ccc',
  margin: '0.5em',
};

type Props = {};

export default class extends Component<Props> {
  formRef: ElementRef<*>;
  constructor(props: Props) {
    super(props);
    this.formRef = React.createRef();
  }

  handleSubmit = () => {
    const validatedResult = this.formRef.validate();
    console.log('validatedResult', validatedResult);

    if (validatedResult.isInvalid) {
      console.log('Invalid field values');
    } else {
      this.formRef.submit();
    }
  };

  handleReset = () => {
    console.log('Reset form...');
  };

  render() {
    return (
      <div>
        <Form
          name="validation-example"
          onSubmit={this.handleSubmit}
          onReset={this.handleReset}
          ref={ref => (this.formRef = ref)}
          action="//httpbin.org/get"
          method="GET"
          target="submitFrame"
        >
          <FormHeader title="Validation" />
          <Field>
            <TextField name="valid-text" />
          </Field>
        </Form>
        <p>The data submitted by the form will appear below:</p>
        <iframe
          src=""
          title="Checkbox Resopnse Frame"
          id="submitMojitoFrame"
          name="submitFrame"
          style={iframeStyles}
        />
      </div>
    );
  }
}
