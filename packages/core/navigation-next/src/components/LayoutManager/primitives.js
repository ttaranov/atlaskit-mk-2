// @flow

import React, { type ElementRef } from 'react';

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

export const NavContainer = (props: {}) => (
  <div
    css={{
      bottom: 0,
      display: 'flex',
      flexDirection: 'row',
      left: 0,
      position: 'fixed',
      top: 0,
    }}
    {...props}
  />
);

// Resizable Elements can be disabled

export type Resizable = { innerRef?: ElementRef<*>, isDisabled: boolean };
export function blockInteraction(isDisabled: boolean) {
  return isDisabled
    ? {
        pointerEvents: 'none',
        userSelect: 'none',
      }
    : null;
}

// Product Nav

export const ProductNavWrapper = ({
  innerRef,
  isDisabled,
  ...props
}: Resizable) => (
  <div
    ref={innerRef}
    css={{
      height: '100%',
      overflowX: 'hidden',
      overflowY: 'hidden',
      position: 'relative',
      ...blockInteraction(isDisabled),
    }}
    {...props}
  />
);

// Page

type PageProps = Resizable & { offset: number };
export const PageWrapper = ({
  innerRef,
  isDisabled,
  offset,
  ...props
}: PageProps) => (
  <div
    ref={innerRef}
    css={{
      flex: 1,
      marginLeft: offset,
      ...blockInteraction(isDisabled),
    }}
    {...props}
  />
);
