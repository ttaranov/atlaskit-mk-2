// @flow
/* eslint-disable react/sort-comp */
import React, { Component, type Element } from 'react';
import PropTypes from 'prop-types';

/*
Listens to public and private events and delegates to an analytics
stack in a different React root.
*/

type Props = {
  /** A single element, either Component or DOM node */
  children?: Element<any>,
  delegateAnalyticsEvent?: (
    eventName: string,
    eventData: Object,
    isPrivate?: boolean,
  ) => void,
};

const ContextTypes = {
  onAnalyticsEvent: PropTypes.func,
};

class AnalyticsDelegate extends Component<Props, {}> {
  static contextTypes = ContextTypes;

  static childContextTypes = ContextTypes;

  getChildContext() {
    return {
      onAnalyticsEvent: this.onAnalyticsEvent,
    };
  }

  onAnalyticsEvent = (name: string, data: Object, isPrivate: boolean) => {
    const { delegateAnalyticsEvent } = this.props;

    // send a clean data object so it can't be mutated between listeners
    const eventData = { ...data };
    if (delegateAnalyticsEvent) {
      delegateAnalyticsEvent(name, eventData, isPrivate);
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

export default AnalyticsDelegate;
