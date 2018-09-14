// @flow

import React, { Component, type Node } from 'react';
import { Consumer, Provider } from '../components/Context';

type Props = {
  children: ((*) => Node) | Node,
  state: { [string]: any },
  values: (*) => *,
};

export default class Theme extends Component<Props> {
  static defaultProps = {
    state: {},
    values: (v: *): * => v,
  };
  render() {
    const { children, state, values } = this.props;
    return (
      <Consumer>
        {theme => {
          const merged = values(theme, state);
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
