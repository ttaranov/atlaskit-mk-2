import * as React from 'react';
import { HTMLAttributes, ComponentClass, PureComponent } from 'react';
import styled from 'styled-components';
import { ToolbarContext, ToolbarContextValue } from '../Toolbar/ToolbarContext';
import ToolbarButton from '../ToolbarButton';

const ButtonGroupSpan: ComponentClass<
  HTMLAttributes<{}> & { width?: 'small' | 'large' }
> = styled.span`
  display: inline-flex;
  align-items: center;

  & > div {
    display: flex;
  }
`;

export interface Props {
  width?: 'small' | 'large';
}

export interface State {
  selectedButton?: React.ReactChild;
}

export default class ButtonGroup extends PureComponent<
  Props,
  { selectedButton }
> {
  state = {
    selectedButton: undefined,
  };
  constructor(props) {
    super(props);
  }
  private buttonClicked = consumerValue => (
    button: ToolbarButton,
    delta: number,
  ) => {
    const children: React.ReactChild[] = React.Children.toArray(
      this.props.children,
    );

    const buttonProps = button.props;
    // @ts-ignore
    const allButtonProps = children.map(item => item.props);
    const buttonKeypressOriginIndex = allButtonProps.indexOf(buttonProps);
    if (buttonKeypressOriginIndex === -1) {
      console.log("Our button wasn't clicked, bailing from buttonClicked");
      return null;
    }
    console.log('Keypress by button', buttonKeypressOriginIndex);
    console.log('Delta is ', delta);
    const selectedIndex = buttonKeypressOriginIndex + delta;
    console.log('selectedIndex', selectedIndex);
    if (selectedIndex >= 0 && selectedIndex < children.length) {
      console.log('setting state');
      this.setState({
        selectedButton: children[selectedIndex],
      });
    }

    if (selectedIndex < 0) {
      consumerValue.buttonClickCallback(this, -1);
    }
    if (selectedIndex >= children.length) {
      consumerValue.buttonClickCallback(this, -1);
    }
    return null;
  };

  render() {
    const { width } = this.props;
    const { selectedButton } = this.state;

    return (
      <ToolbarContext.Consumer>
        {value => (
          <ToolbarContext.Provider
            value={{
              buttonClickCallback: this.buttonClicked(value),
              selectedButton,
            }}
          >
            <ButtonGroupSpan width={width}>
              {this.props.children}
            </ButtonGroupSpan>
          </ToolbarContext.Provider>
        )}
      </ToolbarContext.Consumer>
    );
  }
}

// value.buttonClickCallback
