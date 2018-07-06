// @flow

import React, { Component } from 'react';
import { Consumer, Provider, Themed } from '../src';

const defaultButtonTheme = (props: { hover?: boolean, primary?: boolean }) => {
  let backgroundColor;
  const textColor = props.primary ? '#fff' : '#333';

  if (props.hover) {
    backgroundColor = props.primary ? 'darkblue' : '#ddd';
  } else {
    backgroundColor = props.primary ? 'blue' : '#eee';
  }

  return {
    backgroundColor,
    textColor,
    ...props,
  };
};
const customButtonTheme = props =>
  defaultButtonTheme({
    backgroundColor: 'palevioletred',
    textColor: 'papayawhip',
    ...props,
  });
const AppTheme = props => <Provider button={defaultButtonTheme} {...props} />;

class Button extends Component<{ theme: React.Node }> {
  static defaultProps = {
    theme: defaultButtonTheme,
    type: 'button',
  };
  state: {
    hover: false,
  };
  onMouseEnter = () => this.setState({ hover: true });
  onMouseLeave = () => this.setState({ hover: false });
  render() {
    const {
      props: { theme, ...props },
      state,
    } = this;
    return (
      <Themed component={this} props={{ ...props, ...state }}>
        {t => (
          <button
            onMouseEnter={this.onMouseEnter}
            onMouseLeave={this.onMouseLeave}
            style={{
              backgroundColor: t.backgroundColor,
              border: 0,
              borderRadius: 3,
              color: t.textColor,
              cursor: 'pointer',
              marginRight: 10,
              padding: 10,
            }}
            {...props}
          />
        )}
      </Themed>
    );
  }
}

export default () => (
  <AppTheme>
    <Button>Default</Button>
    <Button primary>Primary</Button>
    <Button theme={customButtonTheme}>Custom</Button>
  </AppTheme>
);
