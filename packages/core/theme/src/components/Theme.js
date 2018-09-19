// @flow

import React, { Component, type Node } from 'react';
import { Consumer, Provider } from '../components/Context';

type Props = {
  children: ((*) => Node) | Node,
  theme: (*) => *,
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
