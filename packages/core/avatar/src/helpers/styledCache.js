// @flow
import styled from 'styled-components';
import { type ComponentType } from 'react';
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
  }: {
    component?: ComponentType<*>,
    href?: string,
    onClick?: Function,
  }) {
    if (component) {
      return StyledCustomComponent;
    } else if (href) {
      return StyledLink;
    } else if (onClick) {
      return StyledButton;
    }
    return StyledSpan;
  };
};
