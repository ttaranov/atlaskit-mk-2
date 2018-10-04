import * as React from 'react';
import { HTMLAttributes, ComponentClass, PureComponent } from 'react';
// import styled from 'styled-components';
// import { ToolbarContext, ToolbarContextValue } from '../Toolbar/ToolbarContext';
// import ToolbarButton from '../ToolbarButton';

export interface Props {}

export interface State {}

export default class ToolbarComponentWrapper extends PureComponent<
  Props,
  { selectedButton }
> {
  state = {
    selectedButton: undefined,
  };
  constructor(props) {
    super(props);
  }
  // private buttonClicked = consumerValue => (
  //   button: ToolbarButton,
  //   delta: number,
  // ) => {
  //   const children: React.ReactChild[] = React.Children.toArray(
  //     this.props.children,
  //   );

  //   const buttonProps = button.props;
  //   // @ts-ignore
  //   const allButtonProps = children.map(item => item.props);
  //   const buttonKeypressOriginIndex = allButtonProps.indexOf(buttonProps);
  //   if (buttonKeypressOriginIndex === -1) {
  //     console.log("Our button wasn't clicked, bailing from buttonClicked");
  //     return null;
  //   }
  //   console.log('Keypress by button', buttonKeypressOriginIndex);
  //   console.log('Delta is ', delta);
  //   const selectedIndex = buttonKeypressOriginIndex + delta;
  //   console.log('selectedIndex', selectedIndex);
  //   if (selectedIndex >= 0 && selectedIndex < children.length) {
  //     console.log('setting state');
  //     this.setState({
  //       selectedButton: children[selectedIndex],
  //     });
  //   }

  //   if (selectedIndex < 0) {
  //     consumerValue.buttonClickCallback(this, -1);
  //   }
  //   if (selectedIndex >= children.length) {
  //     consumerValue.buttonClickCallback(this, -1);
  //   }
  //   return null;
  // };

  componentDidMount() {
    const children = React.Children.toArray(this.props.children).map(
      child => (child.props.title ? child.props.title : child),
    );
    console.log('Secondary toolbar mounted! Children:', children);

    // const { toolbarContext } = this.props;
    // if (toolbarContext && toolbarContext.registerButton) {
    //   // console.log('TOOLBARBUTTON: Mounting button ', this.props.title);
    //   toolbarContext.registerButton(this);
    // }
  }

  render() {
    // const titles = this.props.children ? this.props.children.map(child => child.props.title) : [];

    // console.log('Buttongroup children:', React.Children.toArray(this.props.children).map(child => child.props.title ? child.props.title : child));

    return <div>{this.props.children}</div>;
  }
}

// value.buttonClickCallback
