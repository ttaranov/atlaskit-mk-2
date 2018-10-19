// @flow

import React, { Component, Fragment } from 'react';
import { Transition } from 'react-transition-group';
import { NavigationAnalyticsContext } from '@atlaskit/analytics-namespaced-context';

import { transitionDurationMs } from '../../../../common/constants';
import {
  ContainerNavigation,
  InnerShadow,
  ProductNavigation,
} from './primitives';
import type { ContentNavigationProps } from './types';

export default class ContentNavigation extends Component<
  ContentNavigationProps,
> {
  render() {
    const {
      container: Container,
      isPeekHinting,
      isPeeking,
      isVisible,
      product: Product,
    } = this.props;

    return (
      <Fragment>
        <ProductNavigation>
          {isVisible ? (
            <NavigationAnalyticsContext
              data={{ attributes: { navigationLayer: 'product' } }}
            >
              <Product />
            </NavigationAnalyticsContext>
          ) : null}
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
                  {isVisible && Container ? <Container /> : null}
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
