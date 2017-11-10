// @flow
/* eslint-disable react/prefer-stateless-function */

import React, { Component } from 'react';
import { withRenderTarget } from '@atlaskit/layer-manager';
import { Tooltip, TruncatedTooltip } from '../styled';
import { Slide } from './Animation';
import type { CoordinatesType, PositionType } from '../types';

type Props = {
  children: string,
  immediatelyHide: boolean,
  immediatelyShow: boolean,
  position: PositionType,
  // eslint-disable-next-line react/no-unused-prop-types
  coordinates: CoordinatesType,
  truncate: boolean,
};

class Tip extends Component<Props> {
  render() {
    const {
      children,
      coordinates,
      immediatelyHide,
      immediatelyShow,
      position,
      truncate,
    } = this.props;

    // NOTE: `props.in` is NOT public API
    const transitionIn: boolean = (this.props: any).in;

    return (
      <Slide
        component={truncate ? TruncatedTooltip : Tooltip}
        immediatelyHide={immediatelyHide}
        immediatelyShow={immediatelyShow}
        in={transitionIn}
        position={position}
        style={coordinates}
      >
        {children}
      </Slide>
    );
  }
}

export default withRenderTarget(
  {
    target: 'tooltip',
    withTransitionGroup: true,
  },
  Tip,
);
