// @flow

import React, { type Node } from 'react';
import { keyframes } from 'emotion';
import { ThemeProvider } from 'emotion-theming';
import { Transition } from 'react-transition-group';
import { colors } from '@atlaskit/theme';

import {
  transitionDuration,
  transitionDurationMs,
  transitionTimingFunction,
} from '../../common/constants';
import { Shadow } from '../../common/primitives';
import { light, withTheme } from '../../theme';

const animationFade = state => {
  const defaultStyle = {
    opacity: 0,
    transitionDuration,
    transitionProperty: 'opacity',
    transitionTimingFunction,
  };
  const transitionStyles = {
    entering: { opacity: 0 },
    entered: { opacity: 1 },
  };
  return { ...defaultStyle, ...transitionStyles[state] };
};

/**
 * Component tree structure
 *  - RootNav
 *  - ContainerNav
 *    - ContainerOverlay
 *  - InnerShadow
 */

const ScrollProvider = (props: any) => (
  <div
    css={{
      boxSizing: 'border-box',
      height: '100%',
      overflowX: 'hidden',
      overflowY: 'auto',
      width: '100%',
    }}
    {...props}
  />
);

/**
 * RootNav
 */
const RootNavPrimitive = withTheme({ mode: light, context: 'root' })(
  ({ children, theme = { mode: light } }) => (
    <div css={theme.mode.productNav().root}>
      <ScrollProvider>{children}</ScrollProvider>
    </div>
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

const slideIn = keyframes`
  from { transform: translateX(100%); }
  to { transform: translateX(0); }
`;

// const slideOut = keyframes`
//   from { transform: translateX(0); }
//   to { transform: translateX(100%); }
// `;

// const slideOutFromPeek = keyframes`
//   from { transform: translateX(calc(100% - 32px)); }
//   to { transform: translateX(100%); }
// `;

/**
 * ContainerNav
 */
const ContainerNavPrimitive = withTheme({ mode: light, context: 'container' })(
  ({ children, isEntering, isExiting, isHinting, isPeeking, theme }) => {
    let animationName;
    if (isEntering) animationName = slideIn;

    let transform = null;
    if (isHinting) transform = 'translateX(16px)';
    if (isPeeking) transform = 'translateX(calc(100% - 32px))';
    if (isExiting) transform = 'translateX(100%)';

    return (
      <div
        css={{
          ...theme.mode.productNav().container,
          animationName,
          animationDuration: transitionDuration,
          animationFillMode: 'forwards',
          animationTimingFunction: transitionTimingFunction,
          transitionProperty: 'boxShadow, transform',
          transitionDuration,
          transitionTimingFunction,
          transform,
        }}
      >
        <Shadow isBold={isPeeking} isOverDarkBg />
        <ScrollProvider>{children}</ScrollProvider>
      </div>
    );
  },
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
  ...props
}: ContainerOverlayProps) => (
  <div
    css={{
      backgroundColor: colors.N70A,
      cursor: isVisible ? 'pointer' : 'default',
      height: '100%',
      left: 0,
      opacity: isVisible ? 1 : 0,
      pointerEvents: isVisible ? 'all' : 'none',
      position: 'absolute',
      top: 0,
      transitionDuration,
      transitionProperty: 'opacity',
      transitionTimingFunction,
      width: '100%',
      zIndex: 5,
    }}
    onClick={onClick}
    role="presentation"
    {...props}
  />
);

/**
 * InnerShadow
 */
type InnerShadowProps = { isVisible: boolean };

export const InnerShadow = ({ isVisible }: InnerShadowProps) => (
  <Transition
    appear
    in={isVisible}
    mountOnEnter
    timeout={transitionDurationMs}
    unmountOnExit
  >
    {state => {
      const styles = {
        ...animationFade(state),
        left: 'auto',
        right: 0,
      };
      return <Shadow isBold style={styles} />;
    }}
  </Transition>
);
