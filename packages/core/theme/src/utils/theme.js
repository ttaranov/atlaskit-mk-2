// @flow

import React, { type Node } from 'react';
import { Consumer, Provider } from '../components/Context';
import Theme from '../components/Theme';
import type { ThemeDefinition } from '../types';

type Merge = (*) => *;
type Children = { children: Node };

export default function theme(merge: Merge) {
  return function component(props: Merge | Children) {
    if (typeof props === 'function') {
      // $FlowFixMe
      return theme(v => props(merge(v)));
    }

    const { children, ...rest } = props;
    return (
      <Consumer>
        {(v: *) => {
          const merged = merge({ ...v, ...rest });
          return typeof children === 'function' ? (
            children(merged)
          ) : (
            <Provider value={merged}>{children}</Provider>
          );
        }}
      </Consumer>
    );
  };
}
