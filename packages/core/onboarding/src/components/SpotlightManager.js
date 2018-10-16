// @flow
import React, {
  PureComponent,
  createContext,
  type ElementType,
  type Node,
} from 'react';
import Portal from '@atlaskit/portal';
import { Provider, Subscribe } from 'unstated';
import ScrollLock from 'react-scrolllock';

import SpotlightRegistry from './SpotlightRegistry';
import { Fade } from './Animation';
import Blanket from '../styled/Blanket';

// NOTE: Instantiate a global registry, as this component will likely be
// re-rendered by its parent tree
const registry = new SpotlightRegistry();

const noop = () => {};

const { Consumer: TargetConsumer, Provider: TargetProvider } = createContext();
const {
  Consumer: SpotlightStateConsumer,
  Provider: SpotlightStateProvider,
} = createContext({ opened: noop, closed: noop, getTargetElement: noop });

export { TargetConsumer };

export class SpotlightConsumer extends React.Component<{
  name: string,
  children: ((string) => HTMLElement) => Node,
}> {
  opened;
  closed;
  componentDidMount() {
    this.opened(this.props.name);
  }
  componentWillUnmount() {
    this.closed(this.props.name);
  }
  render() {
    return (
      <SpotlightStateConsumer>
        {({ opened, closed, getTargetElement }) => {
          this.opened = opened;
          this.closed = closed;
          return this.props.children(getTargetElement);
        }}
      </SpotlightStateConsumer>
    );
  }
}

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
  { spotlightCount: number },
> {
  static defaultProps = {
    blanketIsTinted: true,
    component: 'div',
  };

  state = {
    spotlightCount: 0,
  };

  targets: { [string]: HTMLElement } = {};

  targetRef = (name: string) => (element: HTMLElement | void) => {
    if (element) {
      this.targets = {
        ...this.targets,
        [name]: element,
      };
    } else {
      delete this.targets[name];
    }
  };

  spotlightOpen = () => {
    this.setState(state => ({ spotlightCount: state.spotlightCount + 1 }));
  };

  spotlightClose = () => {
    this.setState(state => ({ spotlightCount: state.spotlightCount - 1 }));
  };

  getTargetElement = (name: string) => this.targets[name];

  stateProviderValues = {
    opened: this.spotlightOpen,
    closed: this.spotlightClose,
    getTargetElement: this.getTargetElement,
  };

  render() {
    const { blanketIsTinted, children, component: Tag } = this.props;

    return (
      <SpotlightStateProvider value={this.stateProviderValues}>
        <TargetProvider value={this.targetRef}>
          <React.Fragment>
            <Fade in={this.state.spotlightCount > 0}>
              {animationStyles => (
                <Blanket style={animationStyles} isTinted={blanketIsTinted} />
              )}
            </Fade>
            {children}
          </React.Fragment>
        </TargetProvider>
      </SpotlightStateProvider>
    );
  }
}

export const withSpotlightState = (WrappedComponent: any) => (props: any) => (
  <Subscribe to={[SpotlightRegistry]}>
    {spotlightRegistry => (
      <WrappedComponent {...props} spotlightRegistry={spotlightRegistry} />
    )}
  </Subscribe>
);
