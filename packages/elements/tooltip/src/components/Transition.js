// @flow
/* eslint-disable react/prefer-stateless-function */

import React, { Component } from 'react';
import { withRenderTarget } from '@atlaskit/layer-manager';
import { Tooltip } from '../styled';
import { Slide } from './Animation';
import type { PlacementType } from '../types';

type Props = {|
  children: string,
  immediatelyHide: boolean,
  immediatelyShow: boolean,
  placement: PlacementType,
  // eslint-disable-next-line react/no-unused-prop-types
  position: { left: number, top: number },
|};

class Tip extends Component<Props> {
  render() {
    const {
      children, immediatelyHide, immediatelyShow, placement, position,
    } = this.props;

    // NOTE: `props.in` is NOT public API
    const transitionIn: boolean = (this.props: any).in;

    return (
      <Slide
        component={Tooltip}
        immediatelyHide={immediatelyHide}
        immediatelyShow={immediatelyShow}
        in={transitionIn}
        placement={placement}
        style={position}
      >
        {children}
      </Slide>
    );
  }
}

export default withRenderTarget({
  target: 'tooltip',
  wrapWithTransitionGroup: true,
}, Tip);
