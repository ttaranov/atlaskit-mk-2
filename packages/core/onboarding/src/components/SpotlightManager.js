// @flow
import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';
import { ScrollLock } from '@atlaskit/layer-manager';

import SpotlightRegistry from './SpotlightRegistry';
import { Fade } from './Animation';
import Blanket from '../styled/Blanket';

import type { ChildrenType, ComponentType } from '../types';

type Props = {
  children: ChildrenType,
  component: ComponentType,
  /** Boolean prop for toggling blanket transparency  */
  blanketIsTinted?: boolean,
};
type State = {
  mounted: number,
};

export default class SpotlightManager extends PureComponent<Props, State> {
  spotlightRegistry: SpotlightRegistry = new SpotlightRegistry();
  static childContextTypes = {
    spotlightRegistry: PropTypes.instanceOf(SpotlightRegistry).isRequired,
  };
  static defaultProps = {
    component: 'div',
    blanketIsTinted: true,
  };

  /* eslint-disable react/sort-comp */
  props: Props;
  state: State = { mounted: 0 };
  /* eslint-enable react/sort-comp */

  getChildContext() {
    return {
      spotlightRegistry: this.spotlightRegistry,
    };
  }

  componentWillMount() {
    this.spotlightRegistry.addChangeListener('mount', this.handleMount);
    this.spotlightRegistry.addChangeListener('unmount', this.handleUnmount);
  }
  componentWillUnmount() {
    this.spotlightRegistry.removeChangeListener('mount', this.handleMount);
    this.spotlightRegistry.removeChangeListener('unmount', this.handleUnmount);
  }

  handleMount = () => this.setState(state => ({ mounted: state.mounted + 1 }));
  handleUnmount = () =>
    this.setState(state => ({ mounted: state.mounted - 1 }));

  render() {
    const { children, component: Tag } = this.props;
    const { mounted } = this.state;
    const dialogIsVisible = Boolean(mounted);

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
  }
}
