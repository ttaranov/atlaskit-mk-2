// @flow
import React, { PureComponent } from 'react';
import Select from '@atlaskit/select';
import FieldText from '@atlaskit/field-text';
import Button from '@atlaskit/button';
import isEmail from 'validator/lib/isEmail';
import Form, {
  Field,
  FormHeader,
  FormSection,
  FormFooter,
  Validator,
} from '../src';

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
  validateOnChange: boolean,
  eventResult: string,
  title: string,
};

// CUSTOM VALIDATOR EXAMPLES
// Example shared data source to validate against.
const mojitoIngredients = [
  { label: 'Mint', value: 'mint' },
  { label: 'Lime', value: 'lime' },
  { label: 'Sugar', value: 'sugar' },
  { label: 'Soda Water', value: 'soda water' },
  { label: 'White Rum', value: 'white rum' },
];

const mixedIngredients = [
  ...mojitoIngredients,
  { label: 'Durian', value: 'durian' },
  { label: 'Salt', value: 'salt' },
  { label: 'Tears of a clown ', value: 'clown tears' },
];

// Simple validator examples to check for the number of values.
const isNumValues = (
  values: Array<*>,
  options?: { min: number, max?: number },
): boolean => {
  const min = options && options.min ? options.min : 0;
  const max = options && options.max ? options.max : undefined;
  const numValues = values instanceof Array ? values.length : 0;

  return numValues >= min && (!max || numValues <= max);
};

// Validator function that will return as valid if it's in our list of ingredient values
const isMojitoIngredientValue = (value: string): boolean => {
  return mojitoIngredients.map(item => item.value).indexOf(value) > -1;
};

// Validator function that will return as valid if it's in our list of ingredients
const isMojitoIngredient = (value: {
  label: string,
  value: string,
}): boolean => {
  return mojitoIngredients.map(item => item.value).indexOf(value.value) > -1;
};

// Example of validating multi-select values
const isMojitoRecipe = (
  items: Array<{ label: string, value: string }>,
): boolean => {
  // Check every selected option value exists in our valid ingredients
  if (items.length === mojitoIngredients.length) {
    return items.map(item => item.value).every(value => {
      return mojitoIngredients.map(item => item.value).indexOf(value) >= 0;
    });
  }
  return false;
};

// Simplified example Validator that will return as valid for string con
const isAtlassian = (value: string): boolean => {
  return value.indexOf('atlassian.com') >= 0;
};

export default class ValidatorsExample extends PureComponent<void, State> {
  state = {
    validateOnChange: true,
    eventResult:
      'Click into and out of the input above to trigger onBlur & onFocus in the Fieldbase',
    title: '',
  };

  formRef: any;

  // Form Event Handlers

  // If you provide a submit handler you can do any custom data handling & validation
  onSubmitHandler = () => {
    console.log('onSubmitHandler');
    // Calling validate on the form will update it's fields state
    const validateResult = this.formRef.validate();
    console.log(validateResult);

    if (validateResult.isInvalid) {
      console.log('onSubmitHandler = Form Fields Invalid');
    } else {
      // Now call submit when your done
      this.formRef.submit();
    }
  };

  onValidateHandler = () => {
    console.log('onValidateHandler');
  };

  onResetHandler = () => {
    console.log('onResetHandler');
  };

  onChangeHandler = () => {
    console.log('onChangeHandler');
  };
  onBlurHandler = () => {
    console.log('onBlurHandler');
  };
  onFocusHandler = () => {
    console.log('onFocusHandler');
  };

  // Footer Button Handlers
  submitClickHandler = () => {
    return this.formRef.validate();
  };

  validateClickHandler = () => {
    this.formRef.validate();
    console.log(this.formRef);
  };

  onStatelessChangeHandler = (event: SyntheticInputEvent<HTMLInputElement>) => {
    this.setState({ title: event.currentTarget.value });
  };
  render() {
    return (
      <div
        style={{ display: 'flex', minHeight: '100vh', flexDirection: 'column' }}
      >
        <Form
          name="layout-example"
          onSubmit={this.onSubmitHandler}
          onReset={this.onResetHandler}
          ref={form => {
            this.formRef = form;
          }}
          action="//httpbin.org/get"
          method="GET"
          target="submitFrame"
        >
          <FormHeader
            title="Making a Mojito"
            description="An example form using Field & Validators"
          />

          <FormSection
            name="ingredients"
            title="Ingredients"
            description="Do you know what & what NOT to throw in?"
          >
            <Field
              label="Name a mojito ingredient"
              helperText="With validateOnChange enabled validators are called onChange"
              isRequired
              validators={[
                <Validator
                  func={isMojitoIngredientValue}
                  invalid="Not Valid! Try lime, mint, white rum, sugar or soda water."
                  valid="Correct!"
                />,
              ]}
            >
              <FieldText name="myMojito" id="myMojito" value="" />
            </Field>

            <Field
              label="Select an Ingredient NOT in a Mojito"
              helperText="With validOnFalse enabled the validator result is inverted"
              required
              validateOnChange
              validators={[
                <Validator
                  func={isMojitoIngredient}
                  invalid="Must NOT be a mojito ingredient."
                  valid="Great!"
                  validOnFalse
                />,
              ]}
            >
              <Select
                name="selectNot"
                options={mixedIngredients}
                placeholder="Select your ingredients"
              />
            </Field>

            <Field
              label="Make a Mojito"
              helperText="Using multiple custom validators & validator options"
              validateOnChange
              validators={[
                <Validator
                  func={isNumValues}
                  options={{ min: 5 }}
                  invalid="Need MOAR ingredients!"
                />,
                <Validator
                  func={isNumValues}
                  options={{ max: 5 }}
                  invalid="Too many things!"
                />,
                <Validator
                  func={isMojitoRecipe}
                  invalid="NOT a mojito"
                  valid="A legit Mojito!"
                />,
              ]}
            >
              <Select
                name="selectAll"
                options={mixedIngredients}
                isMulti
                placeholder="Select your ingredients"
              />
            </Field>

            <Field
              label="Name"
              validateOnChange
              description="validateOnChange using stateless component"
              isRequired
            >
              <FieldText
                name="title"
                id="title"
                value={this.state.title}
                onChange={this.onChangeHandler}
              />
            </Field>

            <Field
              label="Atlassian Email"
              helperText="Uses a custom validator & isEmail"
              validators={[
                <Validator
                  func={isEmail}
                  invalid="Must be a valid email."
                  valid="Valid Email"
                />,
                <Validator
                  func={isAtlassian}
                  invalid="And it must be an Atlassian address."
                  valid="Atlassian address too!"
                />,
              ]}
            >
              <FieldText
                name="myEmail"
                id="myId"
                onChange={this.onChangeHandler}
                onBlur={this.onBlurHandler}
                onFocus={this.onFocusHandler}
                value=""
                placeholder="email@atlassian.com"
              />
            </Field>
          </FormSection>

          <FormFooter actions={{}}>
            <Button type="submit" appearance="primary">
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
          id="submitMojitoFrame"
          name="submitFrame"
          style={{ resultBoxStyle }}
        />
      </div>
    );
  }
}
