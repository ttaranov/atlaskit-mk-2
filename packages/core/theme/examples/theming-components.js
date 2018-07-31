// @flow

import React, {
  Component,
  Fragment,
  type ComponentType,
  type Node,
} from 'react';
import { Theme } from '../src';

type MyTheme = {
  button: ({ hover: boolean }) => {
    backgroundColor: string,
    textColor: string,
  },
};

// const DefaultButtonTheme = ({ children }: { children: * }) => (
//   <Theme
//     defaults={{ button: v => ({}) }}
//     values={(theme: MyTheme) => ({
//       button: state => ({
//         backgroundColor: state.hover ? '#ddd' : '#eee',
//         textColor: '#333',
//         ...theme.button(state),
//       }),
//       ...theme,
//     })}
//   >
//     {children}
//   </Theme>
// );

// const AppTheme = ({ children }: { children: * }) => (
//   <Theme
//     values={(theme: MyTheme) => ({
//       ...theme,
//       button: state => ({
//         ...theme.button(state),
//         backgroundColor: state.hover ? 'rebeccapurple' : 'palevioletred',
//         textColor: state.hover ? '#fff' : 'papayawhip',
//       }),
//     })}
//   >
//     {children}
//   </Theme>
// );

// const CustomButtonTheme = ({ children }: { children: * }) => (
//   <DefaultButtonTheme>
//     <Theme
//       values={(theme: MyTheme) => ({
//         ...theme,
//         button: state => ({
//           ...theme.button(state),
//           backgroundColor: state.hover ? 'palevioletred' : 'rebeccapurple',
//         }),
//       })}
//     >
//       {children}
//     </Theme>
//   </DefaultButtonTheme>
// );

const defaultButtonTheme = (theme: MyTheme) => ({
  button: state => ({
    backgroundColor: state.hover ? '#ddd' : '#eee',
    textColor: '#333',
    ...theme.button(state),
  }),
  ...theme,
});

const appTheme = (theme: MyTheme) => ({
  ...theme,
  button: state => ({
    ...theme.button(state),
    backgroundColor: state.hover ? 'rebeccapurple' : 'palevioletred',
    textColor: state.hover ? '#fff' : 'papayawhip',
  }),
});

const customButtonTheme = (theme: MyTheme) => ({
  ...theme,
  button: state => ({
    ...theme.button(state),
    backgroundColor: state.hover ? 'palevioletred' : 'rebeccapurple',
  }),
});

type Props = {
  children: Node,
  theme: (*) => MyTheme,
};

type State = {
  hover: boolean,
};

class Button extends Component<Props, State> {
  static defaultProps = {
    theme: defaultButtonTheme,
  };
  state = {
    hover: false,
  };
  onMouseEnter = () => this.setState({ hover: true });
  onMouseLeave = () => this.setState({ hover: false });
  render() {
    const { props, state } = this;
    return (
      <Theme values={props.theme}>
        {theme => {
          const { backgroundColor, textColor: color } = theme.button(state);
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
      </Theme>
    );
  }
}

export default () => (
  <Fragment>
    <Button>Default</Button>
    <Theme values={appTheme}>
      <Button>Context</Button>
      <Button theme={customButtonTheme}>Custom</Button>
    </Theme>
  </Fragment>
);
