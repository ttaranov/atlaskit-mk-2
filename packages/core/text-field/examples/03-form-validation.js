// @flow

import React, { Component, type ElementRef } from 'react';
import Button from '@atlaskit/button';
import Form, { Field, FormHeader, Validator } from '@atlaskit/form';
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

function openSesame(value) {
  if (value === 'open sesame') return true;
  else return false;
}

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
          <Field
            label="Only validates on input = open sesame"
            isRequired
            validators={[
              <Validator
                func={openSesame}
                invalid="Incorrect, try 'open sesame'"
                valid="Your wish granted"
              />,
            ]}
          >
            <TextField name="command" />
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
