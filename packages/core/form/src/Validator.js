//@flow
/* eslint-disable no-console */ // While in dev preview console.info will be used
/* eslint-disable react/no-unused-prop-types */
import { PureComponent } from 'react';

/**
 * Result that is returned by any Validator
 */
export type ValidatorType = {
  /**
   * Validator function that takes a value and returns a boolean for valid | invalid
   */
  func?: (value: any, options?: any) => boolean,

  /**
   * NOT IMPLEMENTED - Validate using a reg expression.
   */
  // TODO: Implement this
  regex?: string,

  /**
   * Additional options that can be passed to the validator function
   */
  options?: any,
  /**
   * Message to be displayed if invalid
   */
  invalid?: string,
  /**
   * Message to be displayed if valid
   */
  valid?: string,
  /**
   * Allows you to invert the validator result by defining validOn: false
   */
  validOnFalse?: boolean,
};

/**
 * Result that is returned by any Validator
 */
export type ValidatorResult = {
  /** The result of the validation */
  valid: boolean,
  /** Validation message */
  message?: string,
};

export default class Validator extends PureComponent<ValidatorType, void> {
  static defaultProps = {
    func: {},
    validOnFalse: false,
    valid: '',
    invalid: '',
  };

  /** Valiate a value using the function & options passed in as props  */
  /*validate = (value:string) => {
    let valid:boolean = this.props.func(value, this.props.options);
    // Invert result if validOn prop is false
    //if(!this.props.validOn && !valid) valid = true;
    return {
        valid,
        message: (valid)? this.props.valid : this.props.invalid
    }
  };
  */

  render() {
    return null;
  }
}
