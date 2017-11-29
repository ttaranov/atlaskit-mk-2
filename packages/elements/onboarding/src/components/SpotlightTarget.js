// @flow
import PropTypes from 'prop-types';
import { Children, Component } from 'react';
import { findDOMNode } from 'react-dom';

import type { ElementType } from '../types';
import SpotlightRegistry from './SpotlightRegistry';

type Props = {
  /** a single child */
  children: ElementType,
  /** the name to reference from Spotlight */
  name: string,
};

const errorMessage =
  '`SpotlightTarget` requires `SpotlightManager` as an ancestor.';

export default class SpotlightTarget extends Component<Props> {
  static contextTypes = {
    spotlightRegistry: PropTypes.instanceOf(SpotlightRegistry).isRequired,
  };

  componentDidMount() {
    const { name } = this.props;
    const { spotlightRegistry } = this.context;

    if (!spotlightRegistry) {
      throw Error(errorMessage);
    } else {
      spotlightRegistry.add(name, findDOMNode(this)); // eslint-disable-line
    }
  }
  componentWillUnmount() {
    const { name } = this.props;
    const { spotlightRegistry } = this.context;

    if (!spotlightRegistry) {
      throw Error(errorMessage);
    } else {
      spotlightRegistry.remove(name);
    }
  }
  render() {
    return Children.only(this.props.children);
  }
}
