// @flow
import React from 'react';
import styled from 'styled-components';
import ButtonBase from './Button-v2';
import { type ButtonProps } from '../types';
import getButtonProps from './getButtonProps';
import CustomComponentProxy from './CustomComponentProxy';
import getButtonStyles from '../styled/getButtonStyles';

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
    //CustomComponentProxy is absolutely valid here, so this seems a
    // problem with styled-components flow definitions
    // $FlowFixMe
    CustomComponentProxy,
  )`&,a&,&:hover,&:active,&:focus{${getButtonStyles}}`;
  component.displayName = 'StyledCustomComponent';
  return component;
};

class Button extends React.Component<ButtonProps> {
  static defaultProps = {
    appearance: 'default',
    isDisabled: false,
    isSelected: false,
    spacing: 'default',
    type: 'button',
    shouldFitContainer: false,
  };

  customComponent = null;

  componentWillReceiveProps(nextProps: ButtonProps) {
    if (this.props.component !== nextProps.component) {
      delete this.customComponent;
    }
  }

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

  render() {
    const StyledComponent = this.getStyledComponent();

    return (
      <ButtonBase
        {...this.props}
        components={{
          Root: StyledComponent,
        }}
      />
    );
  }
}

export default Button;
