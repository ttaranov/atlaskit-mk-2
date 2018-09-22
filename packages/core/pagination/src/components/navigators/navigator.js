//@flow
import React, { Component } from 'react';
import { PaddedButton } from './styled';
import type { NavigatorPropsType } from '../../types';

export default class Navigator extends Component<NavigatorPropsType> {
  render() {
    const { children, isDisabled, label, onClick } = this.props;
    return (
      <PaddedButton
        appearance="subtle"
        ariaLabel={label}
        isDisabled={isDisabled}
        onClick={() => onClick && onClick(label)}
      >
        {children}
      </PaddedButton>
    );
  }
}
