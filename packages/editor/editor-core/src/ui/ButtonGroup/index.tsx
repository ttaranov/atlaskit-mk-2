import * as React from 'react';
import { HTMLAttributes, ComponentClass, PureComponent } from 'react';
import styled from 'styled-components';
import ToolbarContext from '../Toolbar/ToolbarContext';
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

export default class ButtonGroup extends PureComponent<Props, {}> {
  constructor(props) {
    super(props);
  }

  render() {
    const { width } = this.props;
    const children = React.Children.toArray(this.props.children);

    const buttonClicked = (button: ToolbarButton, delta: number) => {
      const buttonProps = button.props;
      // @ts-ignore
      const allButtonProps = children.map(item => item.props);
      const buttonKeypressOriginIndex = allButtonProps.indexOf(buttonProps);
      console.log('Keypress by button', buttonKeypressOriginIndex);
      console.log('Delta is ', delta);
    };

    return (
      <ToolbarContext.Provider
        value={{ buttonClickCallback: buttonClicked, currentlySelected: null }}
      >
        <ButtonGroupSpan width={width}>{this.props.children}</ButtonGroupSpan>
      </ToolbarContext.Provider>
    );
  }
}
