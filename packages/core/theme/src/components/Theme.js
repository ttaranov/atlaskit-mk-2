// @flow

import React from 'react';
import { Consumer, Provider } from '../components/Context';

type Props = {
  children: (*) => React.Node | React.Node,
};

export default function Theme({ children, ...props }: Props) {
  return (
    <Consumer>
      {theme => {
        const merged = { ...theme, ...props };
        return typeof children === 'function' ? (
          children(merged)
        ) : (
          <Provider value={merged}>{children}</Provider>
        );
      }}
    </Consumer>
  );
}
