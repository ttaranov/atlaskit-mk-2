// @flow

import React, { Component, type Node } from 'react';
import { Consumer, Provider } from '../components/Context';

type Props = {
  /** A function that returns children or children. If a function, the theme is executecd and resulting values are passed in. If nodes, the theme is executed and passed down via context. */
  children: ((*) => Node) | Node,

  /** Any props that should be passed into the theme function. */
  props: { [string]: any },

  /** A function that returns the theme values. */
  theme: (*) => *,
};

export default class Theme extends Component<Props> {
  static defaultProps = {
    children: () => null,
    props: {},
    theme: (v: *): * => v,
  };
  render() {
    const { children, props, theme } = this.props;
    return (
      <Consumer>
        {parent => {
          const merged = theme(parent, props);
          return typeof children === 'function' ? (
            children(merged)
          ) : (
            <Provider value={merged}>{children}</Provider>
          );
        }}
      </Consumer>
    );
  }
}
