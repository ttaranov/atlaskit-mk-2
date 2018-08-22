// @flow
import React, { Component } from 'react';
import Button from '@atlaskit/button';
import Form, { Field, FormFooter } from '@atlaskit/form';
import { Radio, RadioGroup } from '../src';
import type { ItemsPropType } from '../src/types';

const formTestUrl = '//httpbin.org/get';
const colorItems: ItemsPropType = [
  { name: 'color', value: 'red', label: 'Red' },
  { name: 'color', value: 'blue', label: 'Blue', defaultSelected: true },
  { name: 'color', value: 'yellow', label: 'Yellow' },
  { name: 'color', value: 'green', label: 'Green' },
];
const fruitItems: ItemsPropType = [
  { name: 'fruit', value: 'apple', label: 'Apple' },
  { name: 'fruit', value: 'orange', label: 'Orange' },
  { name: 'fruit', value: 'peach', label: 'Peach', defaultSelected: true },
  { name: 'fruit', value: 'pair', label: 'Pair' },
];

export default class FormExample extends Component<void, void> {
  form: any;
  onRadioChange = (event: any) => {
    console.log(event.target.value);
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
          method="POST"
          target="submitFrame"
        >
          <Field label="standalone radio">
            <Radio
              name="standalone"
              value="single-radio"
              onChange={this.onRadioChange}
            >
              Single Radio button
            </Radio>
          </Field>
          <Field label="required radio group" isRequired required>
            <RadioGroup items={colorItems} onChange={this.onRadioChange} />
          </Field>
          <Field label="regular radio group">
            <RadioGroup items={fruitItems} onChange={this.onRadioChange} />
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
