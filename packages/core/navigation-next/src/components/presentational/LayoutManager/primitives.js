// @flow

import React, { type ElementRef } from 'react';
import { layers } from '@atlaskit/theme';
import { applyDisabledProperties } from '../../../common/helpers';

export const LayoutContainer = (props: {}) => (
  <div
    css={{
      display: 'flex',
      flexDirection: 'row',
      height: '100vh',
    }}
    {...props}
  />
);

export const NavigationContainer = ({ innerRef, ...props }: *) => (
  <div
    ref={innerRef}
    css={{
      bottom: 0,
      display: 'flex',
      flexDirection: 'row',
      left: 0,
      position: 'fixed',
      top: 0,
      zIndex: layers.navigation(),
    }}
    {...props}
  />
);

// Resizable Elements can be disabled

export type Resizable = {
  innerRef?: ElementRef<*>,
  disableInteraction: boolean,
};

// Content navigation

export const ContentNavigationWrapper = ({
  innerRef,
  disableInteraction,
  ...props
}: Resizable) => (
  <div
    ref={innerRef}
    css={{
      height: '100%',
      position: 'relative',
      ...applyDisabledProperties(disableInteraction),
    }}
    {...props}
  />
);
export const ContainerNavigationMask = ({
  disableInteraction,
  ...props
}: {
  disableInteraction?: boolean,
  [string]: any,
}) => (
  <div
    css={{
      display: 'flex',
      flexDirection: 'row',
      overflow: 'hidden',
      height: '100%',
      ...applyDisabledProperties(!!disableInteraction),
    }}
    {...props}
  />
);
