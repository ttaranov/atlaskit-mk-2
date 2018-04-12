// @flow

import React, { Component } from 'react';

import {
  ContainerNav,
  ContainerOverlay,
  InnerShadow,
  Wrapper,
  RootNav,
} from './primitives';
import type { ProductNavProps } from './types';

export default class ProductNav extends Component<ProductNavProps> {
  render() {
    const {
      container: Container,
      isPeeking,
      isResizing,
      onOverlayClick,
      root: Root,
    } = this.props;

    return (
      <Wrapper shouldBlockInteraction={isResizing}>
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
      </Wrapper>
    );
  }
}
