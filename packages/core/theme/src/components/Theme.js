// @flow

import React, { Component, type Node } from 'react';
import { Consumer, Provider } from '../components/Context';

type Props = {
  /**
   * Children to pass to the theme. If this is a function, the `theme`
   * function is called and passed to the children function. If it is anything
   * else, the `theme` function is called and set as context for all
   * descendants.
   */
  children: ((*) => Node) | Node,

  /**
   * The theme function that is called with the parent theme and returns the
   * theme values.
   */
  theme: (*) => *,

  /**
   * DEPRECATED. Alias for `theme`.
   */
  values?: (*) => *,
};

export default class Theme extends Component<Props> {
  static defaultProps = {
    theme: (v: *): * => v,
  };
  render() {
    const { children, theme, values } = this.props;
    return (
      <Consumer>
        {parent => {
          const merged = (values || theme)(parent);
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
