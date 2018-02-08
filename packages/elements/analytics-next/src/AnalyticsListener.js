// @flow

import { Children, Component, type Node } from 'react';
import PropTypes from 'prop-types';
import { UIAnalyticsEvent } from './';
import type { UIAnalyticsEventHandlerSignature } from './types';

type Props = {
  children?: Node,
  channel?: string,
  onEvent: (event: UIAnalyticsEvent, channel?: string) => void,
};

const ContextTypes = {
  getAtlaskitAnalyticsEventHandlers: PropTypes.func,
};

export default class AnalyticsListener extends Component<Props, void> {
  static contextTypes = ContextTypes;
  static childContextTypes = ContextTypes;

  getChildContext = () => ({
    getAtlaskitAnalyticsEventHandlers: this.getAnalyticsEventHandlers,
  });

  getAnalyticsEventHandlers = () => {
    const { channel, onEvent } = this.props;
    const { getAtlaskitAnalyticsEventHandlers } = this.context;
    const parentEventHandlers =
      (typeof getAtlaskitAnalyticsEventHandlers === 'function' &&
        getAtlaskitAnalyticsEventHandlers()) ||
      [];
    const handler: UIAnalyticsEventHandlerSignature = (event, eventChannel) => {
      if (channel === '*' || channel === eventChannel) {
        onEvent(event, eventChannel);
      }
    };
    return [handler, ...parentEventHandlers];
  };

  render() {
    return Children.only(this.props.children);
  }
}
