// @flow

import React, { Component, type ComponentType } from 'react';

import {
  ContainerNav,
  ContainerOverlay,
  InnerShadow,
  Wrapper,
  RootNav,
} from './primitives';

type ProductNavProps = {
  container: ComponentType<{}>,
  isPeeking: boolean,
  isResizing: boolean,
  onOverlayClick?: Event => void,
  root: ComponentType<{}>,
};

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
