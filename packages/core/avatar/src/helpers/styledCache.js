// @flow
import React, { type Node, type ComponentType, type ElementRef } from 'react';
import styled from 'styled-components';
import { css } from 'emotion';
import CustomComponentProxy from '../components/CustomComponentProxy';

// This is necessary because we don't know what DOM element the custom component will render.
export default (styles: Function) => {
  const StyledCustomComponent = styled(
    CustomComponentProxy,
  )`&,&:hover,&:active,&:focus{${styles}}`;
  const StyledButton = ({
    children,
    innerRef,
    ...props
  }: {
    children: Node,
    innerRef: ElementRef<*>,
  }) => (
    <button
      ref={innerRef}
      className={css({
        ...styles(props),
      })}
      {...props}
    >
      {children}
    </button>
  );
  const StyledLink = ({ children, ...props }: { children: Node }) => (
    <a
      className={css({
        'a&': {
          ...styles(props),
        },
      })}
      {...props}
    >
      {children}
    </a>
  );
  const scStyledLink = styled.a`
    a& {
      ${styles};
    }
  `;
  const StyledSpan = ({ children, ...props }: { children: Node }) => (
    <span
      className={css({
        ...styles(props),
      })}
    >
      {children}
    </span>
  );
  const scStyledSpan = styled.span`
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
