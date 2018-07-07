// @flow

import React, { Component, Fragment } from 'react';
import { Provider, Themed } from '../src';

const defaultButtonTheme = (
  theme,
  props: { hover?: boolean, primary?: boolean },
) => {
  let backgroundColor;
  const textColor = props.primary ? '#fff' : '#333';

  if (props.hover) {
    backgroundColor = props.primary ? 'navy' : '#ddd';
  } else {
    backgroundColor = props.primary ? 'skyblue' : '#eee';
  }

  return {
    ...theme,
    backgroundColor,
    textColor,
  };
};
const contextButtonTheme = () => ({
  backgroundColor: 'rebeccapurple',
});
const customButtonTheme = () => ({
  backgroundColor: 'palevioletred',
});
const AppTheme = props => <Provider MyButton={contextButtonTheme} {...props} />;

class Button extends Component<*> {
  static displayName = 'MyButton';
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
    const { props, state } = this;
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
              marginBottom: 10,
              marginRight: 10,
              padding: 10,
            }}
            type={props.type}
          >
            {props.children}
          </button>
        )}
      </Themed>
    );
  }
}

export default () => (
  <Fragment>
    <Button>Default</Button>
    <Button primary>Default primary</Button>
    <AppTheme>
      <Button>Context</Button>
      <Button primary>Context primary</Button>
      <Button theme={customButtonTheme}>Custom</Button>
      <Button primary theme={customButtonTheme}>
        Custom primary
      </Button>
    </AppTheme>
  </Fragment>
);
