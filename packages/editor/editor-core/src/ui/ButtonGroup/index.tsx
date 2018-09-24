import * as React from 'react';
import { HTMLAttributes, ComponentClass, PureComponent } from 'react';
import styled from 'styled-components';
import ToolbarContext from '../Toolbar/ToolbarContext';

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

    const buttonClicked = button => {
      console.log('ButtonGroup button clicked, it is ', button);
      console.log('button index in children:', children.indexOf(button));
      console.log('children:', children);
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
