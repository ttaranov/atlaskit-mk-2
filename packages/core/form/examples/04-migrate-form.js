// @flow
/* eslint-disable no-unused-vars */ // Using while dev mode TODO: remove on release
import React, { PureComponent } from 'react';
import Select from '@atlaskit/select';
import FieldText from '@atlaskit/field-text';
import Toggle from '@atlaskit/toggle';
import { Checkbox } from '@atlaskit/checkbox';
import Button from '@atlaskit/button';
import isEmail from 'validator/lib/isEmail';
import Calendar from '@atlaskit/calendar';
import {
  DatePicker,
  DateTimePicker,
  TimePicker,
} from '@atlaskit/datetime-picker';
import Form, {
  Field,
  FormHeader,
  FormSection,
  FormFooter,
  Validator,
} from '../src';
//import type { FormRef } from '../src/Form';

const resultBoxStyle = {
  width: '95%',
  height: '400px',
  borderStyle: 'dashed',
  borderWidth: '1px',
  borderColor: '#ccc',
  padding: '0.5em',
  color: '#ccc',
  margin: '0.5em',
};

/**
 * This is a POC of how validators can be added to the Field wrapper and then validated on the field component
 * value change. Implementation for this might (likely will) change
 *
 */
type State = {
  isInvalid: boolean,
  isRequired: boolean,
  invalidMessage: string,
  validMessage: string,
  validatorInvalidMessage: string,
  validatorValidMessage: string,
  validateOnChange: boolean,
  validateOnBlur: boolean,
  validateOnSubmit: boolean,
  validatorOptions?: {},
  eventResult: string,
  checkboxChecked: boolean,
};

const configBoxStyle = {
  borderStyle: 'dashed',
  borderWidth: '1px',
  borderColor: '#ccc',
  padding: '0.5em',
  margin: '0.5em',
};

// CUSTOM VALIDATOR EXAMPLES
// Example shared data source to validate against.
const validValues = [
  { label: 'Mint', value: 'mint' },
  { label: 'Lime', value: 'lime' },
  { label: 'Sugar', value: 'sugar' },
  { label: 'Soda Water', value: 'soda water' },
  { label: 'White Rum', value: 'white rum' },
];

// Validator function that will return as valid if it's in our list of ingredient values
const isValidValue = (value: string): boolean => {
  return validValues.map(item => item.value).indexOf(value) > -1;
};

// Validator function that will return as valid if it's in our list of ingredients
const isValidObject = (value: { label: string, value: string }): boolean => {
  console.log(JSON.stringify(value));
  return validValues.map(item => item.value).indexOf(value.value) > -1;
};

// Validator function that will return as valid if it's in our list of ingredients
const isFutureDate = (value: string): boolean => {
  console.log(JSON.stringify(value));
  return Date.parse(value) > Date.now();
};

export default class FieldsExample extends PureComponent<void, State> {
  state = {
    validateOnChange: false,
    validateOnBlur: true,
    validateOnSubmit: true,
    validatorOptions: { validValue: 'lime' },
    isRequired: true,
    isInvalid: false,
    invalidMessage: 'Invalid Value',
    validatorValidMessage: 'Valid Value',
    validatorInvalidMessage: 'Invalid Value',
    validMessage: 'Valid Value',
    checkboxChecked: false,
    eventResult:
      'Click into and out of the input above to trigger onBlur & onFocus in the Fieldbase',
  };

  formRef: any;

  // Footer Button Handlers
  submitClickHandler = () => {
    return this.formRef.validate();
  };

  validateClickHandler = () => {
    this.formRef.validate();
  };

  toggleValidateOnBlur = (event: Event) => {
    this.setState({
      validateOnBlur: !this.state.validateOnBlur,
    });
  };

  toggleValidateOnChange = (event: Event) => {
    this.setState({
      validateOnChange: !this.state.validateOnChange,
    });
  };

  checkboxStatelessOnChange = (e: any) => {
    this.setState({
      checkboxChecked: !this.state.checkboxChecked,
    });
  };

  validatorMessageOnChange = (e: any) => {
    this.setState({
      invalidMessage: e.target.value,
    });
  };

  render() {
    const fieldProps = {
      isRequired: this.state.isRequired,
      isInvalid: this.state.isInvalid,
      invalidMessage: this.state.invalidMessage,
      validMessage: this.state.validMessage,
      validateOnChange: this.state.validateOnChange,
      validateOnBlur: this.state.validateOnBlur,
    };

    const validatorProps = {
      func: isValidValue,
      options: this.state.validatorOptions,
      invalid: this.state.validatorInvalidMessage,
      valid: this.state.validatorValidMessage,
    };
    return (
      <div
        style={{ display: 'flex', minHeight: '100vh', flexDirection: 'column' }}
      >
        <Form
          name="layout-example"
          ref={form => {
            this.formRef = form;
          }}
          action="//httpbin.org/get"
          method="GET"
          target="submitFrame"
        >
          <FormHeader
            title="Form Field Components"
            description="These are all the currently supported form components. By default validation is triggered by onBlur from the 
            field component. This can be disabled the validateOnBlur prop and you can force validation on value change using validateOnChange
            "
          >
            <div style={configBoxStyle}>
              Validate onChange
              <Toggle
                value="validateOnBlur"
                initiallyChecked={this.state.validateOnChange}
                onChange={this.toggleValidateOnChange}
                name="checkbox-change"
              />
              <FieldText
                name="validMessage"
                placeholder="Valid value message..."
                onChange={this.validatorMessageOnChange}
              />
            </div>
          </FormHeader>

          <FormSection
            name="text-fields"
            title="All Field Components"
            description=""
          >
            <Field
              label="Calendar"
              helperText="Select a date in the future"
              validateOnChange
              validators={[
                <Validator
                  func={isFutureDate}
                  invalid="Only dates in the future are valid"
                  valid="Valid date!"
                />,
              ]}
            >
              <Calendar />
            </Field>

            <Field
              label="Checkbox"
              helperText=""
              {...fieldProps}
              validateOnChange
              validators={[<Validator {...validatorProps} />]}
            >
              <Checkbox label="Lime" name="checkbox" value="lime" />
            </Field>

            <Field
              label="Controlled Checkbox"
              helperText=""
              {...fieldProps}
              validateOnChange
              validators={[<Validator {...validatorProps} />]}
            >
              <Checkbox
                label="Lime - Stateless 2"
                name="checkbox-stateless-2"
                value="lime"
                isChecked={this.state.checkboxChecked}
                onChange={this.checkboxStatelessOnChange}
              />
            </Field>

            <Field
              label="Datetime Picker - Controlled"
              helperText="Select a date in the future"
              {...fieldProps}
              validateOnChange
              validators={[
                <Validator
                  func={isFutureDate}
                  invalid="Only dates in the future are valid"
                  valid="Valid date!"
                />,
              ]}
            >
              <DatePicker defaultValue="2018-01-02" />
            </Field>

            <Field
              label="Datetime Picker - Uncontrolled"
              helperText="Select a date in the future"
              {...fieldProps}
              validateOnChange
              validators={[
                <Validator
                  func={isFutureDate}
                  invalid="Only dates in the future are valid"
                  valid="Valid date!"
                />,
              ]}
            >
              <DatePicker value="2018-01-02" />
            </Field>
            <Field
              label="Field Text"
              helperText="@atlaskit/field-text/FieldText"
              {...fieldProps}
              validators={[<Validator {...validatorProps} />]}
            >
              <FieldText name="" placeholder="placeholder text..." />
            </Field>

            <Field
              label="Field Text"
              helperText="@atlaskit/field-text/FieldText"
              {...fieldProps}
              validators={[<Validator {...validatorProps} />]}
            >
              <FieldText name="" placeholder="placeholder text..." />
            </Field>
          </FormSection>

          <FormFooter actions={{}}>
            <Button
              type="submit"
              appearance="primary"
              onClick={this.submitClickHandler}
            >
              Submit
            </Button>
            <Button appearance="subtle" onClick={this.validateClickHandler}>
              Validate
            </Button>
          </FormFooter>
        </Form>

        <p>The data submitted by the form will appear below:</p>
        <iframe
          src=""
          title="Checkbox Resopnse Frame"
          id="submitFrame"
          name="submitFrame"
          style={{ resultBoxStyle }}
        />
      </div>
    );
  }
}
