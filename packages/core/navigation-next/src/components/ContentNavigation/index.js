// @flow

import React, { Component, Fragment } from 'react';
import interpolate, { clamp } from 'interpolate-range';
import { Transition } from 'react-transition-group';
import { NavigationAnalyticsContext } from '@atlaskit/analytics-namespaced-context';

import {
  CONTENT_NAV_WIDTH,
  transitionDurationMs,
} from '../../common/constants';
import {
  ContainerNavigation,
  ContainerOverlay,
  InnerShadow,
  ProductNavigation,
} from './primitives';
import type { ContentNavigationProps } from './types';

function interpolateBlanketOpacity({ floor, ceil, val }) {
  const lerp = interpolate({
    inputRange: [floor, ceil],
    outputRange: [0, 0.5],
    fn: (f, c, v) => clamp(f, c, v * 3),
  });

  return lerp(val);
}

export default class ContentNavigation extends Component<
  ContentNavigationProps,
> {
  render() {
    const {
      container: Container,
      isDragging,
      isPeekHinting,
      isPeeking,
      onOverlayClick,
      transitionState,
      product: Product,
      width,
    } = this.props;

    const opacity = interpolateBlanketOpacity({
      floor: CONTENT_NAV_WIDTH,
      ceil: 0,
      val: width,
    });
    const overlayStyle = isDragging ? { opacity } : null;
    const overlayIsVisible = isPeeking || transitionState === 'exiting';

    return (
      <Fragment>
        <ProductNavigation>
          <NavigationAnalyticsContext
            data={{ attributes: { navigationLayer: 'product' } }}
          >
            <Product />
          </NavigationAnalyticsContext>
        </ProductNavigation>
        <Transition
          in={!!Container}
          timeout={transitionDurationMs}
          mountOnEnter
          unmountOnExit
        >
          {state => (
            <ContainerNavigation
              isEntering={state === 'entering'}
              isExiting={state === 'exiting'}
              isPeekHinting={isPeekHinting}
              isPeeking={isPeeking}
            >
              <NavigationAnalyticsContext
                data={{ attributes: { navigationLayer: 'container' } }}
              >
                <Fragment>
                  {Container && <Container />}
                  <ContainerOverlay
                    isVisible={overlayIsVisible}
                    onClick={onOverlayClick}
                    style={overlayStyle}
                  />
                </Fragment>
              </NavigationAnalyticsContext>
            </ContainerNavigation>
          )}
        </Transition>
        <InnerShadow isVisible={isPeeking} />
      </Fragment>
    );
  }
}
