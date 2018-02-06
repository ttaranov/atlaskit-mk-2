// @flow

import { Children, Component, type Node } from 'react';
import PropTypes from 'prop-types';
import { UIAnalyticsEvent } from './';

type Props = {
  children?: Node,
  channel?: string,
  onEvent: (event: UIAnalyticsEvent, channel?: string) => void,
};

const ContextTypes = {
  getAnalyticsEventHandlers: PropTypes.func,
};

export default class AnalyticsListener extends Component<Props, void> {
  static contextTypes = ContextTypes;
  static childContextTypes = ContextTypes;

  getChildContext = () => ({
    getAnalyticsEventHandlers: this.getAnalyticsEventHandlers,
  });

  getAnalyticsEventHandlers = () => {
    const { channel, onEvent } = this.props;
    const { getAnalyticsEventHandlers } = this.context;
    const parentEventHandlers =
      (typeof getAnalyticsEventHandlers === 'function' &&
        getAnalyticsEventHandlers()) ||
      [];

    const handlerIsAlreadyRegistered = parentEventHandlers.filter(
      ({ channel: eventChannel, handler }) =>
        channel === eventChannel && onEvent === handler,
    ).length;

    if (handlerIsAlreadyRegistered && channel !== '*') {
      return parentEventHandlers;
    }
    return [{ channel, handler: onEvent }, ...parentEventHandlers];
  };

  render() {
    return Children.only(this.props.children);
  }
}
