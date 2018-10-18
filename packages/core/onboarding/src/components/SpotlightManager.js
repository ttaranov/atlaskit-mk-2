// @flow
import React, {
  PureComponent,
  createContext,
  type ElementType,
  type Node,
} from 'react';
import memoizeOne from 'memoize-one';
import Portal from '@atlaskit/portal';
import { layers } from '@atlaskit/theme';

import { Fade } from './Animation';
import Blanket from '../styled/Blanket';

const noop = () => {};

const { Consumer: TargetConsumer, Provider: TargetProvider } = createContext();
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
  /* Replaces the wrapping fragment with component **Deprecated** */
  component?: ElementType,
};

const Container = ({
  component: Wrapper,
  children,
}: {
  component: ElementType,
  children: Node,
}) => <Wrapper>{children}</Wrapper>;

export default class SpotlightManager extends PureComponent<
  Props,
  {
    spotlightCount: number,
    targets: { [string]: HTMLElement },
  },
> {
  static defaultProps = {
    blanketIsTinted: true,
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

  getStateProviderValue = memoizeOne(targets => ({
    opened: this.spotlightOpen,
    closed: this.spotlightClose,
    targets,
  }));

  render() {
    const { blanketIsTinted, children, component: Tag } = this.props;
    return (
      <SpotlightStateProvider
        value={this.getStateProviderValue(this.state.targets)}
      >
        <TargetProvider value={this.targetRef}>
          <Container component={Tag || React.Fragment}>
            <Fade in={this.state.spotlightCount > 0}>
              {animationStyles => (
                <Portal zIndex={layers.spotlight()}>
                  <Blanket style={animationStyles} isTinted={blanketIsTinted} />
                </Portal>
              )}
            </Fade>
            {children}
          </Container>
        </TargetProvider>
      </SpotlightStateProvider>
    );
  }
}
