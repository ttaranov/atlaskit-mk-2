// @flow
import React, { Component } from 'react';
import styled from 'styled-components';
import Spinner from '@atlaskit/spinner';

type Props = {
  spacing: string,
  appearance?: string,
  isDisabled: boolean,
  isSelected: boolean,
};

const LoadingDiv = styled.div`
  display: flex;
  position: absolute;
  left: 50%;
  top: 50%;
  transform: translate(-50%, -50%);
`;

export default class LoadingSpinner extends Component<Props, *> {
  invertSpinner = () => {
    const { appearance, isSelected, isDisabled } = this.props;
    if (isSelected) return true;
    else if (isDisabled) return false;
    else if (
      appearance === 'primary' ||
      appearance === 'danger' ||
      appearance === 'help'
    )
      return true;
    return false;
  };

  render() {
    const { spacing } = this.props;
    let spinnerSize = 'medium';
    if (spacing !== 'default') {
      spinnerSize = 'small';
    }
    return (
      <LoadingDiv spacing={this.props.spacing}>
        <Spinner size={spinnerSize} invertColor={this.invertSpinner()} />
      </LoadingDiv>
    );
  }
}
