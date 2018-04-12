// @flow

import React, { type Node } from 'react';
import { keyframes } from 'emotion';
import { ThemeProvider } from 'emotion-theming';
import { Transition } from 'react-transition-group';
import { colors, gridSize } from '@atlaskit/theme';

import {
  animationDuration,
  animationDurationMs,
  animationTimingFunction,
} from '../../common';
import { light, withTheme } from '../../theme';

const animationFade = transitionState => ({
  animationName: (() => {
    if (transitionState === 'entering')
      return keyframes`from { opacity: 0; } to { opacity: 1; }`;
    if (transitionState === 'exiting')
      return keyframes`from { opacity: 1; } to { opacity: 0; }`;
    return 'none';
  })(),
  animationDuration,
  animationFillMode: 'forwards',
  animationTimingFunction,
});

/**
 * Component tree structure
 * - Wrapper
 *   - RootNav
 *   - ContainerNav
 *     - ContainerOverlay
 *   - InnerShadow
 */

/**
 * Wrapper
 */
type WrapperProps = { shouldBlockInteraction: boolean };

export const Wrapper = ({ shouldBlockInteraction, ...props }: WrapperProps) => (
  <div
    css={{
      height: '100%',
      overflowX: 'hidden',
      overflowY: 'hidden',
      position: 'relative',

      // Block interaction during resize
      pointerEvents: shouldBlockInteraction ? 'none' : null,
      userSelect: shouldBlockInteraction ? 'none' : null,
    }}
    {...props}
  />
);

/**
 * RootNav
 */
const RootNavPrimitive = withTheme({ mode: light, context: 'root' })(
  ({ children, theme = { mode: light } }) => (
    <div css={theme.mode.productNav().root}>{children}</div>
  ),
);

type RootNavProps = { children: Node };

export const RootNav = (props: RootNavProps) => (
  <ThemeProvider
    theme={oldTheme => ({ mode: light, ...oldTheme, context: 'root' })}
  >
    <RootNavPrimitive {...props} />
  </ThemeProvider>
);

/**
 * ContainerNav
 */
const ContainerNavPrimitive = withTheme({ mode: light, context: 'container' })(
  ({ children, isPeeking, theme }) => (
    <div
      css={{
        ...theme.mode.productNav().container,
        boxShadow: 'none',
        transitionProperty: 'boxShadow, transform',
        transitionDuration: animationDuration,
        transitionTimingFunction: animationTimingFunction,
        ...(isPeeking
          ? {
              boxShadow: `-${gridSize() * 2.5}px ${gridSize() *
                2.5}px ${gridSize() *
                4}px -${gridSize()}px rgba(23, 43, 77, 0.4)`,
              transform: `translateX(calc(100% - ${gridSize() * 4}px))`,
            }
          : null),
      }}
    >
      {children}
    </div>
  ),
);

type ContainerNavProps = {
  children: Node,
  isPeeking: boolean,
};

export const ContainerNav = (props: ContainerNavProps) => (
  <ThemeProvider
    theme={oldTheme => ({ mode: light, ...oldTheme, context: 'container' })}
  >
    <ContainerNavPrimitive {...props} />
  </ThemeProvider>
);

/**
 * ContainerOverlay
 */
type ContainerOverlayProps = { isVisible: boolean, onClick?: Event => void };

export const ContainerOverlay = ({
  isVisible,
  onClick,
}: ContainerOverlayProps) => (
  <Transition
    in={isVisible}
    mountOnEnter
    timeout={animationDurationMs}
    unmountOnExit
  >
    {state => {
      const styles = {
        ...animationFade(state),
        backgroundColor: colors.N70A,
        cursor: state === 'entered' ? 'pointer' : 'default',
        height: '100%',
        left: 0,
        pointerEvents: state === 'entered' ? 'auto' : 'none',
        position: 'absolute',
        top: 0,
        transitionProperty: 'background, opacity',
        width: '100%',
        zIndex: 5,
      };
      return <div css={styles} onClick={onClick} role="presentation" />;
    }}
  </Transition>
);

/**
 * InnerShadow
 */
type InnerShadowProps = { isVisible: boolean };

export const InnerShadow = ({ isVisible }: InnerShadowProps) => (
  <Transition
    in={isVisible}
    mountOnEnter
    timeout={animationDurationMs}
    unmountOnExit
  >
    {state => {
      const styles = {
        ...animationFade(state),
        background: `linear-gradient(
          to left,
          rgba(0, 0, 0, 0.15) 0%,
          rgba(0, 0, 0, 0) 100%
        )`,
        height: '100%',
        pointerEvents: 'none',
        position: 'absolute',
        right: 0,
        top: 0,
        width: `${gridSize() * 2.5}px`,
      };
      return <div css={styles} />;
    }}
  </Transition>
);
