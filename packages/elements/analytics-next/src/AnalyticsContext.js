// @flow

import { Children, Component, type Node } from 'react';
import PropTypes from 'prop-types';

import type { ObjectType } from './types';

const ContextTypes = {
  getAtlaskitAnalyticsContext: PropTypes.func,
};

type Props = {
  data: ObjectType,
  children: Node,
};

export default class AnalyticsContext extends Component<Props> {
  static contextTypes = ContextTypes;

  static childContextTypes = ContextTypes;

  getChildContext = () => ({
    getAtlaskitAnalyticsContext: this.getAnalyticsContext,
  });

  getAnalyticsContext = () => {
    const { data } = this.props;
    const { getAtlaskitAnalyticsContext } = this.context;
    const ancestorData =
      (typeof getAtlaskitAnalyticsContext === 'function' &&
        getAtlaskitAnalyticsContext()) ||
      [];
    return [...ancestorData, data];
  };

  render() {
    return Children.only(this.props.children);
  }
}
