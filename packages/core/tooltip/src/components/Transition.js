// @flow
/* eslint-disable react/prefer-stateless-function */

import React, { Component, type ComponentType } from 'react';
import { withRenderTarget } from '@atlaskit/layer-manager';
import { Slide } from './Animation';
import type { CoordinatesType, PositionType, PositionTypeBase } from '../types';

type Props = {
  children: string,
  component: ComponentType<*>,
  immediatelyHide: boolean,
  immediatelyShow: boolean,
  position: PositionType,
  mousePosition: PositionTypeBase,
  // eslint-disable-next-line react/no-unused-prop-types
  coordinates: CoordinatesType,
  truncate: boolean,
};

class Tip extends Component<Props> {
  render() {
    const {
      children,
      component,
      coordinates,
      immediatelyHide,
      immediatelyShow,
      mousePosition,
      position,
      truncate,
    } = this.props;

    // NOTE: `props.in` is NOT public API
    const transitionIn: boolean = (this.props: any).in;

    return (
      <Slide
        component={component}
        immediatelyHide={immediatelyHide}
        immediatelyShow={immediatelyShow}
        in={transitionIn}
        mousePosition={mousePosition}
        position={position}
        style={coordinates}
        truncate={truncate}
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
