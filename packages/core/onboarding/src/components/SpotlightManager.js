// @flow
import React, { PureComponent, type ElementType, type Node } from 'react';
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

export default class SpotlightManager extends PureComponent<Props> {
  static defaultProps = {
    blanketIsTinted: true,
    component: 'div',
  };

  render() {
    const { blanketIsTinted, children, component: Tag } = this.props;

    return (
      <Provider inject={[registry]}>
        <Subscribe to={[SpotlightRegistry]}>
          {spotlightRegistry => {
            const dialogIsVisible = spotlightRegistry.hasMounted();
            return (
              <Tag>
                {children}
                <Fade in={dialogIsVisible}>
                  {animationStyles => (
                    <Blanket
                      style={animationStyles}
                      isTinted={blanketIsTinted}
                    />
                  )}
                </Fade>
                {dialogIsVisible && <ScrollLock />}
              </Tag>
            );
          }}
        </Subscribe>
      </Provider>
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
