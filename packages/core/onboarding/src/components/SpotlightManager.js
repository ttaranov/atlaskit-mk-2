// @flow
import React, {
  PureComponent,
  createContext,
  type ElementType,
  type Node,
} from 'react';
import Portal from '@atlaskit/portal';
import { layers } from '@atlaskit/theme';

import { Fade } from './Animation';
import Blanket from '../styled/Blanket';

const noop = () => {};

const { Consumer: TargetConsumer, Provider: TargetProvider } = createContext(
  noop,
);
const {
  Consumer: SpotlightStateConsumer,
  Provider: SpotlightStateProvider,
} = createContext({ opened: noop, closed: noop, targets: {} });

export { TargetConsumer };

export { SpotlightStateConsumer as SpotlightConsumer };

type Props = {
  /** Boolean prop for toggling blanket transparency  */
  blanketIsTinted?: boolean,
  /* Typically the app, or a section of the app */
  children: Node,
  /* Until we can use Fragment */
  component: ElementType,
};

/* eslint-disable react/no-multi-comp */
export default class SpotlightManager extends PureComponent<
  Props,
  {
    spotlightCount: number,
    targets: { [string]: HTMLElement },
  },
> {
  static defaultProps = {
    blanketIsTinted: true,
    component: 'div',
  };

  state = {
    spotlightCount: 0,
    targets: {},
  };

  targetRef = (name: string) => (element: HTMLElement | void) => {
    this.setState(state => ({
      targets: {
        ...state.targets,
        [name]: element || undefined,
      },
    }));
  };

  spotlightOpen = () => {
    this.setState(state => ({ spotlightCount: state.spotlightCount + 1 }));
  };

  spotlightClose = () => {
    this.setState(state => ({ spotlightCount: state.spotlightCount - 1 }));
  };

  render() {
    const { blanketIsTinted, children, component: Tag } = this.props;
    return (
      <SpotlightStateProvider
        value={{
          opened: this.spotlightOpen,
          closed: this.spotlightClose,
          targets: this.state.targets,
        }}
      >
        <TargetProvider value={this.targetRef}>
          <React.Fragment>
            <Fade in={this.state.spotlightCount > 0}>
              {animationStyles => (
                <Portal zIndex={layers.spotlight()}>
                  <Blanket style={animationStyles} isTinted={blanketIsTinted} />
                </Portal>
              )}
            </Fade>
            {children}
          </React.Fragment>
        </TargetProvider>
      </SpotlightStateProvider>
    );
  }
}
