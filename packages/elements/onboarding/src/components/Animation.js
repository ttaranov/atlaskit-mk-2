// @flow
import React, { type ComponentType } from 'react';
import { Transition } from 'react-transition-group';

const duration = 500;
type Props = {
  component: ComponentType<*>,
  in: boolean,
};

export const Fade = ({ component: Tag, in: hasEntered, ...props }: Props) => (
  <Transition
    in={hasEntered}
    mountOnEnter
    unmountOnExit
    appear
    timeout={duration}
  >
    {status => {
      if (status === 'exited') return null;

      const base = {
        transition: 'opacity 200ms',
        zIndex: 1,
      };
      const anim = {
        entering: { opacity: 0 },
        entered: { opacity: 1 },
        exiting: { opacity: 0 },
      };

      const style = { ...base, ...anim[status] };

      return <Tag style={style} {...props} />;
    }}
  </Transition>
);
