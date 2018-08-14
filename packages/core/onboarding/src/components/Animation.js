// @flow
import React, { type Node } from 'react';
import { Transition } from 'react-transition-group';
import { layers } from '@atlaskit/theme';

const duration = 100;
type Props = {
  in: boolean,
  children: Object => Node,
};

export const Fade = ({ in: hasEntered, children }: Props) => (
  <Transition in={hasEntered} timeout={duration} unmountOnExit appear>
    {status => {
      const base = {
        transition: `opacity ${duration}ms`,
        opacity: 0,
        zIndex: layers.spotlight(),
      };
      const anim = {
        entered: { opacity: 1 },
        exiting: { opacity: 0 },
      };

      const style = { ...base, ...anim[status] };

      return children(style);
    }}
  </Transition>
);
