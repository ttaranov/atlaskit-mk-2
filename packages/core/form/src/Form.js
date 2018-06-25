// @flow
/* eslint-disable no-console */ // While in dev preview console.info will be used
/* eslint-disable react/no-unused-prop-types */
import React, { Component, type Node } from 'react';
import type { FieldState } from './Field';
import FormWrapper from './styled/Form';

type Props = {
  /** Specifies where to send the form-data when a form is submitted */
  action?: string,
  /** Specifies how the form-data should be encoded when submitting it to the server (only for method="post") */
  encType?: string,
  /** Specifies the HTTP method to use when sending form-data */
  method?: string,
  /** Specifies the name of a form */
  name: string,
  /** Specifies where to display the response that is received after submitting the form */
  target?: '_self' | '_blank' | '_parent' | '_top' | string,
  /** TODO: do we need to support this? */
  accept?: string,
  /** Specifies the character encodings that are to be used for the form submission */
  acceptCharset?: string,
  /** Specifies whether a form should have autocomplete on or off */
  autoComplete?: boolean,
  /** Field component to be wrapped */
  children: any,
  /** Handler for form submit event */
  onSubmit?: (event: SyntheticEvent<*>) => mixed,
  /** Provide a validation handler if you want manual control */
  onValidate?: (event: SyntheticEvent<*>) => mixed,
  /** Handle when the form is reset. NOT IMPLEMENTED */
  onReset?: (event: SyntheticEvent<*>) => mixed,
};

type State = {
  /** Name of form that fields will be registered to */
  name: string,
  /** Array of sections & fields */
  sections: [],
  /** Optional form header */
  header: Node,
  /** Optional formfooter */
  footer: Node,
  /** Flattened store of all field values. */
  fields: FormFields,
};

/** Our Form reference or API accessable by children via their form prop  */
export type FormRef = {
  name: string,
  registerField: (fieldState: FieldState) => any,
  unregisterField: (name: string) => any,
  getFieldByName: (name: string) => any,
  submit: () => any,
  validate: () => any,
  reset: () => any,
  fields: FormFields,
};

type FormFields = {
  /** Array of FieldStates for Fields & FieldGroups*/
  fieldStates: Array<FieldState>,
  /** Array of validated fields & fieldgroups */
  validFields: Array<any>,
  /** Array of invalid Fields */
  invalidFields: Array<any>,
  /** Current validation state of the form */
  isInvalid: boolean,
  /** Has the form fields & groups been validated?  */
  isValidated: boolean,
  /** Has the form been submitted yet */
  isSubmitted: boolean,
};

export default class Form extends Component<Props, State> {
  static defaultProps = {
    onSubmit: () => {},
    onReset: () => {},
    onValidate: () => {},
    target: '_self',
  };

  constructor(props: Props) {
    super(props);

    this.state = {
      name: this.props.name,
      sections: [],
      header: null,
      footer: null,
      fields: this.initFields(),
    };
  }

  // Reference to the form in the DOM so we can call submit, reset...
  form: HTMLFormElement;

  /** Extract Header, Footer & Sections */
  componentDidMount() {}

  // EVENT HANDLERS
  onSubmit = (event: SyntheticEvent<*>) => {
    if (this.props.onSubmit) this.props.onSubmit(event);
  };
  onValidate = (event: SyntheticEvent<*>) => {
    if (this.props.onValidate) this.props.onValidate(event);
  };
  /**
   * Init our form fields store
   */
  initFields = (): FormFields => {
    return {
      fieldStates: [],
      validFields: [],
      invalidFields: [],
      isInvalid: false,
      isValidated: false,
      isSubmitted: false,
    };
  };

  /** Returns the form state and methods accessed by children. With 16.3 we can look at using new context API */
  getForm = (): FormRef => {
    const { name, fields } = this.state;
    const {
      registerField,
      unregisterField,
      getFieldByName,
      submit,
      validate,
      reset,
    } = this;

    return {
      name,
      fields,
      registerField,
      unregisterField,
      getFieldByName,
      submit,
      validate,
      reset,
    };
  };

  /**
   * Register field with this form
   */
  registerField = (fieldState: FieldState) => {
    this.setState(prevState => ({
      fields: {
        ...prevState.fields,
        fieldStates: [...prevState.fields.fieldStates, fieldState],
      },
    }));
  };

  /** Update Field State */
  setFieldState = () => {};

  /** Remove field from form */
  unregisterField = (name: string) => {
    const { fieldStates } = this.state.fields;
    const fieldState = fieldStates.find(field => field.name === name);

    this.setState(prevState => ({
      fields: {
        ...prevState.fields,
        fieldStates: fieldStates.splice(fieldStates.indexOf(fieldState)),
      },
    }));

    return fieldState;
  };
  /** Method to get a field by name */
  getFieldByName = (name: string) => {
    return this.state.fields.fieldStates.find(
      fieldState => fieldState.name === name,
    );
  };
  /** Submit the form after passing validation */
  submit = () => {
    this.form.submit();
  };
  /** Reset the form after passing validation */
  reset = () => {
    this.form.reset();
  };
  /** Validate all fields for the form or hand validation to custom validate handler if defined */
  validate = () => {
    const fields = this.getForm().fields;
    for (let i = 0; i < fields.fieldStates.length; i++) {
      if (fields.fieldStates[i].validate) fields.fieldStates[i].validate();
    }
  };

  renderHeader = () => {};

  /** Inject the form object into children */
  renderChildren = () => {
    return React.Children.map(this.props.children, child => {
      return React.cloneElement(child, {
        form: this.getForm(),
      });
    });
  };

  /** The bulk of the rendering & layout for the forms childrens is done when the component mounts.
   * We inject references to the form via cloneElement
   */
  render() {
    const {
      action,
      encType,
      method,
      name,
      target,
      accept,
      acceptCharset,
      autoComplete,
    } = this.props;

    return (
      <FormWrapper>
        <form
          action={action}
          encType={encType}
          method={method}
          name={name}
          target={target}
          accept={accept}
          acceptCharset={acceptCharset}
          autoComplete={autoComplete}
          // $FlowFixMe Only for dev preview. TODO: resolve this type error
          ref={(form: HTMLFormElement) => {
            this.form = form;
          }}
        >
          {this.renderChildren()}
        </form>
      </FormWrapper>
    );
  }
}
