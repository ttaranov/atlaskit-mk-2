// @flow
import React, { PureComponent, type ElementType, type Node } from 'react';
import { Provider, Subscribe } from 'unstated';
import { ScrollLock } from '@atlaskit/layer-manager';

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

export default class SpotlightManager extends PureComponent<Props> {
  static defaultProps = {
    blanketIsTinted: true,
    component: 'div',
  };

  render() {
    const { children, component: Tag } = this.props;

    return (
      <Provider>
        <Subscribe to={[SpotlightRegistry]}>
          {spotlightRegistry => {
            const dialogIsVisible = spotlightRegistry.hasMounted();
            return (
              <Tag>
                {children}
                <Fade
                  in={dialogIsVisible}
                  component={Blanket}
                  isTinted={this.props.blanketIsTinted}
                />
                {dialogIsVisible && <ScrollLock />}
              </Tag>
            );
          }}
        </Subscribe>
      </Provider>
    );
  }
}

export function withSpotlightState(WrappedComponent: any) {
  return function ComponentWithSpotlightState(props: any) {
    return (
      <Subscribe to={[SpotlightRegistry]}>
        {spotlightRegistry => (
          <WrappedComponent {...props} spotlightRegistry={spotlightRegistry} />
        )}
      </Subscribe>
    );
  };
}
