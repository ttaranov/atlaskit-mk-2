// @flow
import React, { Component } from 'react';
import styled from 'styled-components';
import {
  withAnalyticsEvents,
  withAnalyticsContext,
  createAndFireEvent,
} from '@atlaskit/analytics-next';
import withDeprecationWarnings from './withDeprecationWarnings';
import getButtonProps from './getButtonProps';
import CustomComponentProxy from './CustomComponentProxy';
import getButtonStyles from '../styled/getButtonStyles';
import ButtonContent from '../styled/ButtonContent';
import ButtonWrapper from '../styled/ButtonWrapper';
import IconWrapper from '../styled/IconWrapper';
import LoadingSpinner from '../styled/LoadingSpinner';

import type { ButtonProps } from '../types';

const {
  name: packageName,
  version: packageVersion,
} = require('../../package.json');

const StyledButton = styled.button`
  ${getButtonStyles};
`;
StyledButton.displayName = 'StyledButton';

// Target the <a> here to override a:hover specificity.
const StyledLink = styled.a`
  a& {
    ${getButtonStyles};
  }
`;
StyledLink.displayName = 'StyledLink';

const StyledSpan = styled.span`
  ${getButtonStyles};
`;
StyledSpan.displayName = 'StyledSpan';

const createStyledComponent = () => {
  // Override pseudo-state specificity.
  // This is necessary because we don't know what DOM element the custom component will render.
  const component = styled(
    CustomComponentProxy,
  )`&,a&,&:hover,&:active,&:focus{${getButtonStyles}}`;
  component.displayName = 'StyledCustomComponent';
  return component;
};

type State = {
  isActive: boolean,
  isFocus: boolean,
  isHover: boolean,
};

export const defaultProps = {
  appearance: 'default',
  isDisabled: false,
  isSelected: false,
  isLoading: false,
  spacing: 'default',
  type: 'button',
  shouldFitContainer: false,
  autoFocus: false,
};

class Button extends Component<ButtonProps, State> {
  button: HTMLElement;

  static defaultProps = defaultProps;

  state = {
    isActive: false,
    isFocus: false,
    isHover: false,
  };

  componentWillReceiveProps(nextProps: ButtonProps) {
    if (this.props.component !== nextProps.component) {
      delete this.customComponent;
    }
  }

  componentDidMount() {
    if (this.props.autoFocus && this.button) {
      this.button.focus();
    }
  }

  customComponent = null;

  isInteractive = () => !this.props.isDisabled && !this.props.isLoading;

  onMouseEnter = () => {
    this.setState({ isHover: true });
  };

  onMouseLeave = () => this.setState({ isHover: false, isActive: false });

  onMouseDown = (e: Event) => {
    e.preventDefault();
    this.setState({ isActive: true });
  };

  onMouseUp = () => this.setState({ isActive: false });

  onFocus = (event: SyntheticEvent<>) => {
    this.setState({ isFocus: true });
    if (this.props.onFocus) {
      this.props.onFocus(event);
    }
  };

  onBlur = (event: SyntheticEvent<>) => {
    this.setState({ isFocus: false });
    if (this.props.onBlur) {
      this.props.onBlur(event);
    }
  };

  /* Swallow click events when the button is disabled to prevent inner child clicks bubbling up */
  onInnerClick = (e: Event) => {
    if (!this.isInteractive()) {
      e.stopPropagation();
    }
    return true;
  };

  getStyledComponent() {
    if (this.props.component) {
      if (!this.customComponent) {
        this.customComponent = createStyledComponent();
      }
      return this.customComponent;
    }

    if (this.props.href) {
      return this.props.isDisabled ? StyledSpan : StyledLink;
    }

    return StyledButton;
  }

  getInnerRef = (ref: HTMLElement) => {
    this.button = ref;

    if (this.props.innerRef) this.props.innerRef(ref);
  };

  render() {
    const {
      children,
      iconBefore,
      iconAfter,
      isLoading,
      shouldFitContainer,
      spacing,
      appearance,
      isSelected,
      isDisabled,
    } = this.props;
    // $FlowFixMe - Cannot call `getButtonProps` with `this` bound to `component` because `Button` [1] is incompatible with `Button` [2].
    const buttonProps = getButtonProps(this);
    const StyledComponent = this.getStyledComponent();

    const iconIsOnlyChild: boolean = !!(
      (iconBefore && !iconAfter && !children) ||
      (iconAfter && !iconBefore && !children)
    );
    return (
      <StyledComponent innerRef={this.getInnerRef} {...buttonProps}>
        <ButtonWrapper onClick={this.onInnerClick} fit={!!shouldFitContainer}>
          {isLoading ? (
            <LoadingSpinner
              spacing={spacing}
              appearance={appearance}
              isSelected={isSelected}
              isDisabled={isDisabled}
            />
          ) : null}
          {iconBefore ? (
            <IconWrapper
              isLoading={isLoading}
              spacing={buttonProps.spacing}
              isOnlyChild={iconIsOnlyChild}
            >
              {iconBefore}
            </IconWrapper>
          ) : null}
          {children ? (
            <ButtonContent
              isLoading={isLoading}
              followsIcon={!!iconBefore}
              spacing={buttonProps.spacing}
            >
              {children}
            </ButtonContent>
          ) : null}
          {iconAfter ? (
            <IconWrapper
              isLoading={isLoading}
              spacing={buttonProps.spacing}
              isOnlyChild={iconIsOnlyChild}
            >
              {iconAfter}
            </IconWrapper>
          ) : null}
        </ButtonWrapper>
      </StyledComponent>
    );
  }
}

export type ButtonType = Button;
export const ButtonBase = Button;

export const ButtonWithoutAnalytics = withDeprecationWarnings(Button);
const createAndFireEventOnAtlaskit = createAndFireEvent('atlaskit');

export default withAnalyticsContext({
  componentName: 'button',
  packageName,
  packageVersion,
})(
  withAnalyticsEvents({
    onClick: createAndFireEventOnAtlaskit({
      action: 'clicked',
      actionSubject: 'button',

      attributes: {
        componentName: 'button',
        packageName,
        packageVersion,
      },
    }),
  })(ButtonWithoutAnalytics),
);
