// @flow

import React, {
  Component,
  Fragment,
  type ComponentType,
  type Node,
} from 'react';
import { Theme, type ThemeDefinition } from '../src';

type MyTheme = ThemeDefinition<{
  // eslint-disable-next-line react/no-unused-prop-types
  button: ({ hover: boolean }) => {
    backgroundColor: string,
    textColor: string,
  },
}>;

const DefaultButtonTheme = (props: MyTheme) => (
  <Theme
    values={{
      button: (state, { button }) => ({
        backgroundColor: state.hover ? '#ddd' : '#eee',
        textColor: '#333',
        ...button(state),
      }),
      ...props.values,
    }}
  >
    {props.children}
  </Theme>
);

const AppTheme = (props: MyTheme) => (
  <Theme
    values={{
      button: (state, { button }) => ({
        ...button(state),
        backgroundColor: state.hover ? 'rebeccapurple' : 'palevioletred',
        textColor: state.hover ? '#fff' : 'papayawhip',
      }),
      ...props.values,
    }}
  >
    {props.children}
  </Theme>
);

const CustomButtonTheme = (props: MyTheme) => (
  <DefaultButtonTheme>
    <Theme
      values={{
        button: (state, { button }) => ({
          ...button(state),
          backgroundColor: state.hover ? 'palevioletred' : 'rebeccapurple',
        }),
        ...props.values,
      }}
    >
      {props.children}
    </Theme>
  </DefaultButtonTheme>
);

type Props = {
  children: Node,
  theme: ComponentType<MyTheme>,
};

type State = {
  hover: boolean,
};

class Button extends Component<Props, State> {
  static defaultProps = {
    theme: DefaultButtonTheme,
  };
  state = {
    hover: false,
  };
  onMouseEnter = () => this.setState({ hover: true });
  onMouseLeave = () => this.setState({ hover: false });
  render() {
    const { props, state } = this;
    return (
      <props.theme>
        {({ button }) => {
          const { backgroundColor, textColor: color } = button(state);
          return (
            <button
              onMouseEnter={this.onMouseEnter}
              onMouseLeave={this.onMouseLeave}
              style={{
                backgroundColor,
                border: 0,
                borderRadius: 3,
                color,
                cursor: 'pointer',
                marginBottom: 10,
                marginRight: 10,
                padding: 10,
              }}
              type="button"
            >
              {props.children}
            </button>
          );
        }}
      </props.theme>
    );
  }
}

export default () => (
  <Fragment>
    <Button>Default</Button>
    <AppTheme>
      <Button>Context</Button>
      <Button theme={CustomButtonTheme}>Custom</Button>
    </AppTheme>
  </Fragment>
);
