// @flow
/* eslint-disable react/sort-comp */
import React, { Component, type Element } from 'react';
import PropTypes from 'prop-types';

import matchEvent from './matchEvent';

/*
The Listener component is responsible for calling its `onEvent` handler when a
child component fires an analytics event, and passing the event up the hierarchy
*/

type Props = {
  /** A single element, either Component or DOM node */
  children?: Element<any>,
  /** Function called when an event has been triggered within this
   listener. */
  onEvent: (eventName: string, eventData: Object) => any,
  /** String, regex, or function filter to limit what events call
  `onEvent` based on event name. String filters use exact matching
  unless they end with a '.', in which case a partial match on the beginning
  of the event name will be used. */
  match?: string | ((name: string) => boolean) | RegExp,
  /** Sets wether to call `onEvent` for private or public events. */
  matchPrivate?: boolean,
};

const ContextTypes = {
  onAnalyticsEvent: PropTypes.func,
};

class AnalyticsListener extends Component<Props, {}> {
  static defaultProps = {
    match: '*',
    matchPrivate: false,
  };

  static contextTypes = ContextTypes;

  static childContextTypes = ContextTypes;

  getChildContext() {
    return {
      onAnalyticsEvent: this.onAnalyticsEvent,
    };
  }

  onAnalyticsEvent = (name: string, data: Object, isPrivate: boolean) => {
    // Call this component's onEvent method if it's a match
    const { onEvent, match, matchPrivate } = this.props;
    if (
      matchPrivate === isPrivate &&
      matchEvent(match, name) &&
      typeof onEvent === 'function'
    ) {
      // send a clean data object so it can't be mutated between listeners
      const eventData = { ...data };
      onEvent(name, eventData);
    }

    // Pass the event up the hierarchy
    const { onAnalyticsEvent } = this.context;
    if (typeof onAnalyticsEvent === 'function') {
      onAnalyticsEvent(name, data, isPrivate);
    }
  };

  render() {
    const { children } = this.props; // eslint-disable-line react/prop-types
    return React.Children.only(children);
  }
}

export default AnalyticsListener;
