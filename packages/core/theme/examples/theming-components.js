// @flow

import React, {
  Component,
  Fragment,
  type Node,
  type ComponentType,
} from 'react';
import { Theme } from '../src';

type MyThemeProps = {
  children: Node,
  values: {
    // eslint-disable-next-line react/no-unused-prop-types
    button: ({ hover: boolean }) => {
      backgroundColor: string,
      textColor: string,
    },
  },
};

const DefaultButtonTheme = (props: MyThemeProps) => (
  <Theme
    values={{
      button: (state, { button }: MyTheme) => ({
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

const AppTheme = (props: MyThemeProps) => (
  <Theme
    values={{
      button: (state, { button }: MyTheme) => ({
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

const CustomButtonTheme = (props: MyThemeProps) => (
  <DefaultButtonTheme>
    <Theme
      values={{
        button: (state, { button }: MyTheme) => ({
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
  theme: ComponentType<*>,
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
        {({ button }: MyTheme) => {
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
