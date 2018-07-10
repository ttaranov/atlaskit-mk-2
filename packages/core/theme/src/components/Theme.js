// @flow

import React from 'react';
import { Consumer, Provider } from '../components/Context';

type Props = {
  children: (*) => React.Node | React.Node,
};

const noop = () => null;

export default function Theme({ children, ...props }: Props) {
  return (
    <Consumer>
      {theme => {
        const merged = { ...theme };

        Object.keys(props).forEach(k => {
          const v = props[k];
          merged[k] =
            typeof v === 'function' ? state => v(state, theme[k] || noop) : v;
        });

        return typeof children === 'function' ? (
          children(merged)
        ) : (
          <Provider value={merged}>{children}</Provider>
        );
      }}
    </Consumer>
  );
}
