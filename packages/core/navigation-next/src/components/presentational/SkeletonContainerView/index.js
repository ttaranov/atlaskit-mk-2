// @flow

import React, { Component } from 'react';
import { gridSize as gridSizeFn } from '@atlaskit/theme';

import Section from '../Section';
import SkeletonContainerHeader from '../SkeletonContainerHeader';
import SkeletonItem from '../SkeletonItem';

import {
  ProductNavigationTheme,
  ContainerNavigationTheme,
} from '../ContentNavigation/primitives';

const gridSize = gridSizeFn();

export type SkeletonContainerViewProps = {
  type?: 'product' | 'container',
};

export default class SkeletonContainerView extends Component<
  SkeletonContainerViewProps,
> {
  static type = 'product';

  render() {
    const { type } = this.props;

    if (!type) {
      return null;
    }

    const Wrapper =
      type === 'product' ? ProductNavigationTheme : ContainerNavigationTheme;

    return (
      <Wrapper>
        <Section>
          {({ css }) => (
            <div
              css={{
                ...css,
                paddingTop: gridSize * 2.5,
                paddingBottom: gridSize * 2.5,
              }}
            >
              <SkeletonContainerHeader hasBefore />
            </div>
          )}
        </Section>
        <Section>
          {({ className }) => (
            <div className={className}>
              <SkeletonItem hasBefore />
              <SkeletonItem hasBefore />
              <SkeletonItem hasBefore />
              <SkeletonItem hasBefore />
              <SkeletonItem hasBefore />
            </div>
          )}
        </Section>
      </Wrapper>
    );
  }
}
