// @flow

import React, { Component, type Node } from 'react';
import { Consumer, Provider } from '../components/Context';

type Props = {
  children: ((*) => Node) | Node,
  values: (*) => *,
};

export default class Theme extends Component<Props> {
  static defaultProps = {
    values: (v: *): * => v,
  };
  render() {
    const { children, values } = this.props;
    return (
      <Consumer>
        {theme => {
          const merged = values(theme);
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
