// @flow

import React from 'react';
import styled from 'styled-components';
import { Theme, colors } from '@atlaskit/theme';

const StyledBadge = styled.div`
  ${props => `
    background-color: ${props.backgroundColor};
    color: ${props.textColor};
  `} border-radius: 2em;
  display: inline-block;
  font-size: 12px;
  font-weight: normal;
  line-height: 1;
  min-width: 1px;
  padding: 0.16666666666667em 0.5em;
  text-align: center;
`;

const appearances = {
  default: {
    default: {
      backgroundColor: colors.N30,
      textColor: colors.N800,
    },
    dark: {
      backgroundColor: colors.DN70,
      textColor: colors.DN900,
    },
  },
  added: {
    default: {
      backgroundColor: colors.G50,
      textColor: colors.G500,
    },
    dark: {
      backgroundColor: colors.G50,
      textColor: colors.G500,
    },
  },
  important: {
    default: {
      backgroundColor: colors.R300,
      textColor: colors.N0,
    },
    dark: {
      backgroundColor: colors.R300,
      textColor: colors.N0,
    },
  },
  primary: {
    default: {
      backgroundColor: colors.B400,
      textColor: colors.N0,
    },
    dark: {
      backgroundColor: colors.B100,
      textColor: colors.DN0,
    },
  },
  primaryInverted: {
    default: {
      backgroundColor: colors.N0,
      textColor: colors.B500,
    },
    dark: {
      backgroundColor: colors.DN400,
      textColor: colors.DN0,
    },
  },
  removed: {
    default: {
      backgroundColor: colors.R50,
      textColor: colors.R500,
    },
    dark: {
      backgroundColor: colors.R50,
      textColor: colors.R500,
    },
  },
};

type Props = {
  backgroundColor?: string,
  textColor?: string,
};

export default {
  default: (props: Props) => (
    <Theme themes={appearances.default}>
      {theme => <StyledBadge {...theme} {...props} />}
    </Theme>
  ),
  added: (props: Props) => (
    <Theme themes={appearances.added}>
      {theme => <StyledBadge {...theme} {...props} />}
    </Theme>
  ),
  important: (props: Props) => (
    <Theme themes={appearances.important}>
      {theme => <StyledBadge {...theme} {...props} />}
    </Theme>
  ),
  primary: (props: Props) => (
    <Theme themes={appearances.primary}>
      {theme => <StyledBadge {...theme} {...props} />}
    </Theme>
  ),
  primaryInverted: (props: Props) => (
    <Theme themes={appearances.primaryInverted}>
      {theme => <StyledBadge {...theme} {...props} />}
    </Theme>
  ),
  removed: (props: Props) => (
    <Theme themes={appearances.removed}>
      {theme => <StyledBadge {...theme} {...props} />}
    </Theme>
  ),
};
