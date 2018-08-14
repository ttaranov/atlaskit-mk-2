// @flow
import React, { Component, type Node } from 'react';
import memoizeOne from 'memoize-one';
import {
  Popper as ReactPopper,
  type PopperChildrenProps,
  type PopperProps,
} from 'react-popper';
import type { Placement } from './types';

export { Manager, Reference } from 'react-popper';

type State = {};

type Props = {
  children: PopperChildrenProps => Node,
  placement: Placement,
};

const getFlipBehavior = (side: string) =>
  ({
    top: ['top', 'bottom', 'top'],
    right: ['right', 'left', 'right'],
    bottom: ['bottom', 'top', 'bottom'],
    left: ['left', 'right', 'left'],
  }[side]);

export class Popper extends Component<Props, State> {
  static defaultProps: Props = {
    children: () => {},
    placement: 'bottom-start',
  };

  getModifiers = memoizeOne((placement: Placement): $ElementType<
    PopperProps,
    'modifiers',
  > => {
    const flipBehavior = getFlipBehavior(placement.split('-')[0]);
    const modifiers: $ElementType<PopperProps, 'modifiers'> = {
      flip: {
        enabled: true,
        behavior: flipBehavior,
        boundariesElement: 'viewport',
      },
      hide: {
        enabled: true,
        boundariesElement: 'scrollParent',
      },
      offset: {
        enabled: true,
        offset: 0,
      },
      preventOverflow: {
        enabled: true,
        escapeWithReference: false,
        boundariesElement: 'window',
      },
    };

    return modifiers;
  });

  render() {
    const { placement, children } = this.props;
    const modifiers: $ElementType<PopperProps, 'modifiers'> = this.getModifiers(
      this.props.placement,
    );

    return (
      <ReactPopper positionFixed modifiers={modifiers} placement={placement}>
        {children}
      </ReactPopper>
    );
  }
}
