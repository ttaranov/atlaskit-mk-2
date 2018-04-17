// @flow
import React, { type Node, type ElementType, type Element } from 'react';
import styled from 'styled-components';

// THEME SECTION

const gridSize = 8;

// PROPS SECTION

type InteractionProps = {
  /** Handler to be called on blur */
  onBlur?: (e: SyntheticEvent<>) => void,
  /** Handler to be called on click. The second argument can be used to track analytics data. See the tutorial in the analytics-next package for details. */
  onClick?: (e: SyntheticEvent<>) => void,
  /** Handler to be called on focus */
  onFocus?: (e: SyntheticEvent<>) => void,
};

type A11yProps = {
  /** Pass aria-controls to underlying html button. */
  ariaControls?: string,
  /** Pass aria-expanded to underlying html button. */
  ariaExpanded?: boolean,
  /** Pass aria-haspopup to underlying html button. */
  ariaHaspopup?: boolean,
};

type BaseProps = {
  children?: Node,
  iconBefore?: Element<any>,
  iconAfter?: Element<any>,
  shouldFitContainer?: boolean,
  components?: {
    Root?: ElementType,
    IconBefore?: ElementType,
    IconAfter?: ElementType,
  },
  styles?: {
    root?: any[],
    iconBefore?: any[],
    iconAfter?: any[],
  },
};

type AllProps = BaseProps & A11yProps & InteractionProps;

// BUTTON SECTION

const ButtonComponent = (props: AllProps) => {
  const { Root: RootComponent } = props.components || {};
  const { root: rootStyles } = props.styles || {};
  if (RootComponent) {
    return <RootComponent {...props} />;
  }
  const StyledButton = styled.button`
    width: ${props.shouldFitContainer ? '100%' : 'auto'};
    ${rootStyles};
  `;
  return <StyledButton {...props} />;
};

const ButtonWrapper = styled.span`
  align-self: center;
  display: inline-flex;
  flex-wrap: nowrap;
  justify-content: ${props =>
    props.shouldFitContainer ? 'center' : 'flex-start'};
  max-width: 100%;
  width: ${props => (props.shouldFitContainer ? '100%' : 'auto')};
`;

const ButtonContent = styled.span`
  align-items: ${props => (!props.iconBefore ? 'baseline' : 'center')};
  align-self: ${props => (!props.iconBefore ? 'baseline' : 'center')};
  flex: 1 1 auto;
  margin: 0 ${gridSize / 2}px;
  max-width: 100%;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
`;

// ICON SECTION

const isOnlyChild = ({ iconBefore, iconAfter, children }: AllProps) =>
  !!(
    (iconBefore && !iconAfter && !children) ||
    (iconAfter && !iconBefore && !children)
  );

const StyledIcon = styled.span`
  align-self: center;
  display: flex;
  flex-shrink: 0;
  line-height: 0;
  margin: ${props =>
    props.isOnlyChild ? `0 -${gridSize / 4}px` : `0 ${gridSize / 2}px`};
  font-size: 0;
  user-select: none;
`;

const IconBefore = (props: AllProps) => {
  const { IconBefore: IconBeforeComponent } = props.components || {};
  const { iconBefore } = props;
  if (IconBeforeComponent) {
    return <IconBeforeComponent {...props} />;
  } else if (iconBefore) {
    return (
      <StyledIcon isOnlyChild={isOnlyChild(props)}>{iconBefore}</StyledIcon>
    );
  }
  return null;
};

const IconAfter = (props: AllProps) => {
  const { IconAfter: IconAfterComponent } = props.components || {};
  const { iconAfter } = props;
  if (IconAfterComponent) {
    return <IconAfterComponent {...props} />;
  } else if (iconAfter) {
    return (
      <StyledIcon isOnlyChild={isOnlyChild(props)}>{iconAfter}</StyledIcon>
    );
  }
  return null;
};

// COMPONENT SECTION

const Button = (props: AllProps) => (
  <ButtonComponent {...props}>
    <ButtonWrapper shouldFitContainer={props.shouldFitContainer}>
      <IconBefore {...props} />
      <ButtonContent iconBefore={props.iconBefore}>
        {props.children}
      </ButtonContent>
      <IconAfter {...props} />
    </ButtonWrapper>
  </ButtonComponent>
);

export default Button;
