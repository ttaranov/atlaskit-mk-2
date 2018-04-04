// @flow
import React, { Component } from 'react';
import styled from 'styled-components';
import { colors, gridSize } from '@atlaskit/theme';
import ErrorIcon from '@atlaskit/icon/glyph/error';
import SuccessIcon from '@atlaskit/icon/glyph/editor/success';

/**
    Displays a Validation Message for a Field, FieldGroup or Section
*/

type Props = {
  /** Message to be displayed when field is invalid */
  invalidMessage: string,
  /** Message to be displayed when field is valid */
  validMessage?: string,
  /** Validation state */
  isInvalid?: boolean,
};

const Message = styled.div`
  align-items: center;
  color: ${props => (props.invalid ? colors.R400 : colors.G400)};
  display: flex;
  margin-top: ${gridSize}px;
`;

export default class ValidatorMessage extends Component<Props> {
  static defaultProps = {
    invalidMessage: '',
    validMessage: '',
    isInvalid: undefined,
    type: 'field',
  };

  render() {
    const { invalidMessage, validMessage, isInvalid } = this.props;

    // Validation state is invalid, valid or not validated (null)
    if (isInvalid) {
      return (
        <Message invalid>
          <ErrorIcon label="error icon" role="presentation" />
          {invalidMessage}
        </Message>
      );
      // If the field hasn't been validated yet then isInvalid will be undefined
    } else if (
      this.props.isInvalid !== undefined &&
      validMessage &&
      validMessage.length
    ) {
      return (
        <Message>
          <SuccessIcon label="success icon" role="presentation" />
          {validMessage}
        </Message>
      );
    }
    return null;
  }
}
