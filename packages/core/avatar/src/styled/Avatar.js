// @flow

import React from 'react';
import type { Node } from 'react';
import styled from 'styled-components';
import { Theme } from '@atlaskit/theme';
import theme from '../theme';
import { getInnerStyles } from './utils';

export default (props: { children: Node, stackIndex: ?number }) => (
  <Theme state={{ ...props, includeBorderWidth: true }} values={theme}>
    {({ dimensions }) => (
      <div
        style={{
          display: 'inline-block',
          position: 'relative',
          outline: 0,
          zIndex: props.stackIndex,
          ...dimensions,
        }}
      >
        {props.children}
      </div>
    )}
  </Theme>
);

export const Inner = styled.div`
  ${getInnerStyles};
`;

export const PresenceWrapper = (props: { children: Node }) => (
  <Theme state={props} values={theme}>
    {({ presence }) => (
      <span
        style={{
          pointerEvents: 'none',
          position: 'absolute',
          ...presence,
        }}
      >
        {props.children}
      </span>
    )}
  </Theme>
);

export const StatusWrapper = (props: { children: Node }) => (
  <Theme state={props} values={theme}>
    {({ status }) => (
      <span
        style={{
          position: 'absolute',
          ...status,
        }}
      >
        {props.children}
      </span>
    )}
  </Theme>
);
