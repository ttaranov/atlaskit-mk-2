//@flow
import React, { Component } from 'react';
import { PaddedButton } from './styled';
import type { NavigatorPropsType } from '../../types';

export default class Navigator extends Component<NavigatorPropsType> {
  render() {
    const { children, isDisabled, ariaLabel, onClick } = this.props;
    return (
      <PaddedButton
        appearance="subtle"
        ariaLabel={ariaLabel}
        isDisabled={isDisabled}
        onClick={() => onClick && onClick(ariaLabel)}
      >
        {children}
      </PaddedButton>
    );
  }
}
