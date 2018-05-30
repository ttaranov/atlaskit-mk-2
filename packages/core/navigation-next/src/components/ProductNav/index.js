// @flow

import React, { PureComponent, Fragment } from 'react';
import interpolate, { clamp } from 'interpolate-range';

import { PRODUCT_NAV_WIDTH } from '../../common/constants';
import {
  ContainerNav,
  ContainerOverlay,
  InnerShadow,
  RootNav,
} from './primitives';
import type { ProductNavProps } from './types';

function interpolateBlanketOpacity({ floor, ceil, val }) {
  const lerp = interpolate({
    inputRange: [floor, ceil],
    outputRange: [0, 0.5],
    fn: (f, c, v) => clamp(f, c, v * 3),
  });

  return lerp(val);
}

export default class ProductNav extends PureComponent<ProductNavProps> {
  render() {
    const {
      container: Container,
      isDragging,
      isHinting,
      isPeeking,
      onOverlayClick,
      transitionState,
      root: Root,
      width,
    } = this.props;

    const opacity = interpolateBlanketOpacity({
      floor: PRODUCT_NAV_WIDTH,
      ceil: 0,
      val: width,
    });
    const overlayStyle = isDragging ? { opacity } : null;
    const overlayIsVisible = isPeeking || transitionState === 'exiting';

    return (
      <Fragment>
        <RootNav>
          <Root />
        </RootNav>
        {Container && (
          <ContainerNav isHinting={isHinting} isPeeking={isPeeking}>
            <Container />
            <ContainerOverlay
              isVisible={overlayIsVisible}
              onClick={onOverlayClick}
              style={overlayStyle}
            />
          </ContainerNav>
        )}
        <InnerShadow isVisible={isPeeking} />
      </Fragment>
    );
  }
}
