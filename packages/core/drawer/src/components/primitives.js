// @flow

import React, { Component } from 'react';
import { colors, layers } from '@atlaskit/theme';
import ArrowLeft from '@atlaskit/icon/glyph/arrow-left';

import { Slide } from './transitions';
import type { DrawerProps, DrawerWrapperProps } from './types';

// Misc.
// ------------------------------

const widths = {
  full: '100vw',
  narrow: 45 * 8,
  wide: 75 * 8,
};

// Wrapper
// ------------------------------

const Wrapper = ({ width = 'narrow', ...props }: DrawerWrapperProps) => {
  return (
    <div
      css={{
        backgroundColor: colors.N0,
        display: 'flex',
        height: '100vh',
        left: 0,
        overflow: 'hidden',
        position: 'fixed',
        top: 0,
        width: widths[width],
        zIndex: layers.blanket() + 1,
      }}
      {...props}
    />
  );
};

// Content
// ------------------------------

const Content = props => <div css={{ flex: 1, paddingTop: 24 }} {...props} />;

// Sidebar / Icons etc.
// ------------------------------

const Sidebar = props => {
  return (
    <div
      css={{
        alignItems: 'center',
        boxSizing: 'border-box',
        color: colors.N500,
        display: 'flex',
        flexShrink: 0,
        flexDirection: 'column',
        height: '100vh',
        paddingBottom: 16,
        paddingTop: 24,
        width: 64,
      }}
      {...props}
    />
  );
};

type IconWrapperProps = { onClick?: Event => void };
const IconWrapper = (props: IconWrapperProps) => (
  <button
    css={{
      alignItems: 'center',
      background: 0,
      border: 0,
      borderRadius: '50%',
      color: 'inherit',
      cursor: props.onClick ? 'pointer' : null,
      display: 'flex',
      fontSize: 'inherit',
      height: 40,
      justifyContent: 'center',
      lineHeight: 1,
      marginBottom: 16,
      padding: 0,
      width: 40,

      '&:hover': {
        backgroundColor: props.onClick ? colors.N30A : null,
      },
      '&:active': {
        backgroundColor: props.onClick ? colors.B50 : null,
        outline: 0,
      },
    }}
    {...props}
  />
);

export default class DrawerPrimitive extends Component<DrawerProps> {
  render() {
    const { children, icon: Icon, onClose, ...props } = this.props;

    return (
      <Slide component={Wrapper} {...props}>
        <Sidebar>
          <IconWrapper onClick={onClose}>
            {Icon ? <Icon size="large" /> : <ArrowLeft />}
          </IconWrapper>
        </Sidebar>
        <Content>{children}</Content>
      </Slide>
    );
  }
}
