// @flow
import React, { Component } from 'react';
import Button from '@atlaskit/button';
import Form, { Field, FormFooter } from '@atlaskit/form';
import { Radio, RadioGroup } from '../src';
import type { OptionsPropType } from '../src/types';

const formTestUrl = '//httpbin.org/get';
const colorItems: OptionsPropType = [
  { name: 'color', value: 'red', label: 'Red' },
  { name: 'color', value: 'blue', label: 'Blue', defaultChecked: true },
  { name: 'color', value: 'yellow', label: 'Yellow' },
  { name: 'color', value: 'green', label: 'Green' },
];
const fruitItems: OptionsPropType = [
  { name: 'fruit', value: 'apple', label: 'Apple' },
  { name: 'fruit', value: 'orange', label: 'Orange' },
  { name: 'fruit', value: 'peach', label: 'Peach', defaultChecked: true },
  { name: 'fruit', value: 'pair', label: 'Pair' },
];

export default class FormExample extends Component<
  void,
  { isChecked: boolean },
> {
  form: any;
  state = {
    isChecked: false,
  };
  onChange = (event: SyntheticEvent<*>) => {
    if (event.currentTarget.value === 'single-radio') {
      this.setState({
        isChecked: true,
      });
    }
    console.log(event.currentTarget.value);
  };
  getFormRef = (form: any) => {
    this.form = form;
  };
  render() {
    return (
      <div>
        <Form
          ref={this.getFormRef}
          name="form-example"
          action={formTestUrl}
          method="GET"
          target="submitFrame"
        >
          <Field label="standalone radio">
            <Radio
              isChecked={this.state.isChecked}
              name="standalone"
              value="single-radio"
              onChange={this.onChange}
            >
              Single Radio button
            </Radio>
          </Field>
          <Field label="required radio group" isRequired>
            <RadioGroup options={colorItems} onChange={this.onChange} />
          </Field>
          <Field label="regular radio group">
            <RadioGroup options={fruitItems} onChange={this.onChange} />
          </Field>
          <FormFooter
            actionsContent={[
              {
                id: 'submit-button',
              },
            ]}
          >
            <Button type="submit" appearance="primary">
              Submit
            </Button>
          </FormFooter>
        </Form>

        <p>The data submitted by the form will appear below:</p>
        <iframe
          src=""
          title="Radio Response Frame"
          id="submitFrame"
          name="submitFrame"
          style={{
            width: '95%',
            height: '300px',
            borderStyle: 'dashed',
            borderWidth: '1px',
            borderColor: '#ccc',
            padding: '0.5em',
            color: '#ccc',
            margin: '0.5em',
          }}
        />
      </div>
    );
  }
}
