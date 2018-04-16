// @flow

import React, { PureComponent, Fragment } from 'react';

import {
  ContainerNav,
  ContainerOverlay,
  InnerShadow,
  RootNav,
} from './primitives';
import type { ProductNavProps } from './types';

export default class ProductNav extends PureComponent<ProductNavProps> {
  render() {
    const {
      container: Container,
      isPeeking,
      onOverlayClick,
      root: Root,
    } = this.props;

    return (
      <Fragment>
        {isPeeking || !!Container ? (
          <RootNav>
            <Root />
          </RootNav>
        ) : null}
        <ContainerNav isPeeking={isPeeking}>
          <Container />
          <ContainerOverlay isVisible={isPeeking} onClick={onOverlayClick} />
        </ContainerNav>
        <InnerShadow isVisible={isPeeking} />
      </Fragment>
    );
  }
}
