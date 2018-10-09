// @flow
import React, {
  PureComponent,
  createContext,
  type ElementType,
  type Node,
} from 'react';
import { Manager } from '@atlaskit/popper';
import { Provider, Subscribe } from 'unstated';
import ScrollLock from 'react-scrolllock';

import SpotlightRegistry from './SpotlightRegistry';
import { Fade } from './Animation';
import Blanket from '../styled/Blanket';

type Props = {
  /** Boolean prop for toggling blanket transparency  */
  blanketIsTinted?: boolean,
  /* Typically the app, or a section of the app */
  children: Node,
  /* Until we can use Fragment */
  component: ElementType,
};

// NOTE: Instantiate a global registry, as this component will likely be
// re-rendered by its parent tree
const registry = new SpotlightRegistry();

const { Consumer: TargetConsumer, Provider: TargetProvider } = createContext();
const {
  Consumer: SpotlightConsumer,
  Provider: SpotlightProvider,
} = createContext();

export { TargetConsumer };
export { SpotlightConsumer };

export default class SpotlightManager extends PureComponent<Props> {
  spotlights = {};
  static defaultProps = {
    blanketIsTinted: true,
    component: 'div',
  };

  targetRef = (name: string) => (element: HTMLElement | void) => {
    if (element) {
      this.spotlights = {
        ...this.spotlights,
        [name]: element,
      };
    } else {
      delete this.spotlights[name];
    }
  };

  getTargetElement = (name: string) => this.spotlights[name];

  render() {
    const { blanketIsTinted, children, component: Tag } = this.props;

    return (
      <SpotlightProvider value={this.getTargetElement}>
        <TargetProvider value={this.targetRef}>{children}</TargetProvider>
      </SpotlightProvider>
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
