// @flow

import { Theme } from '@atlaskit/theme';
import React, { type ComponentType } from 'react';
import styled from 'styled-components';
import CustomComponentProxy from '../components/CustomComponentProxy';

// This is necessary because we don't know what DOM element the custom component will render.
export default (styles: Function) => {
  const StyledCustomComponent = styled(
    CustomComponentProxy,
  )`&,&:hover,&:active,&:focus{${styles}}`;
  const StyledButton = styled.button`
    ${styles};
  `;
  const StyledLink = styled.a`
    a& {
      ${styles};
    }
  `;
  const StyledSpan = styled.span`
    ${styles};
  `;

  return function getStyled({
    component,
    href,
    onClick,
    theme,
  }: {
    component?: ComponentType<*>,
    href?: string,
    onClick?: Function,
    theme?: Function,
  }) {
    let Ret = StyledSpan;

    if (component) {
      Ret = StyledCustomComponent;
    } else if (href) {
      Ret = StyledLink;
    } else if (onClick) {
      Ret = StyledButton;
    }

    return theme
      ? props => (
          <Theme theme={theme}>{t => <Ret {...props} theme={t} />}</Theme>
        )
      : Ret;
  };
};
