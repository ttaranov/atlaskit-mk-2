// @flow
import React, { type Node, type ComponentType, type ElementRef } from 'react';
import { css } from 'emotion';
import CustomComponentProxy from '../components/CustomComponentProxy';

type StyledComponentType = {
  children: Node,
  innerRef: ElementRef<*>,
  backgroundColor: string,
  borderColor: string,
  groupAppearance: string,
  isActive: boolean,
  isDisabled: boolean,
  isFocus: boolean,
  isHover: boolean,
  isInteractive: boolean,
  isSelected: boolean,
  stackIndex: boolean,
};

// This is necessary because we don't know what DOM element the custom component will render.
export default (styles: Function) => {
  const StyledCustomComponent = props => (
    <CustomComponentProxy
      className={css({
        '&,&:hover,&:active,&:focus': styles(props),
      })}
      {...props}
    />
  );
  const StyledButton = ({
    children,
    innerRef,
    backgroundColor,
    borderColor,
    groupAppearance,
    isActive,
    isDisabled,
    isFocus,
    isHover,
    isInteractive,
    isSelected,
    stackIndex,
    ...props
  }: StyledComponentType) => {
    return (
      <button
        ref={innerRef}
        className={css(
          styles({
            backgroundColor,
            borderColor,
            groupAppearance,
            isActive,
            isDisabled,
            isFocus,
            isHover,
            isInteractive,
            isSelected,
            stackIndex,
            ...props,
          }),
        )}
        {...props}
      >
        {children}
      </button>
    );
  };
  const StyledLink = ({
    children,
    innerRef,
    backgroundColor,
    borderColor,
    groupAppearance,
    isActive,
    isDisabled,
    isFocus,
    isHover,
    isInteractive,
    isSelected,
    stackIndex,
    ...props
  }: StyledComponentType) => (
    <a
      ref={innerRef}
      className={css({
        'a&': styles(props),
      })}
      {...props}
    >
      {children}
    </a>
  );

  const StyledSpan = ({
    children,
    innerRef,
    backgroundColor,
    borderColor,
    groupAppearance,
    isActive,
    isDisabled,
    isFocus,
    isHover,
    isInteractive,
    isSelected,
    stackIndex,
    ...props
  }: StyledComponentType) => (
    <span ref={innerRef} className={css(styles(props))} {...props}>
      {children}
    </span>
  );

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
