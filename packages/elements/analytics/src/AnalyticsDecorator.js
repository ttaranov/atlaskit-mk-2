// @flow
/* eslint-disable react/sort-comp */
import React, { Component, type Element } from 'react';
import PropTypes from 'prop-types';

import matchEvent from './matchEvent';

/* The Decorator component extends analytics event data for any events fired by
its descendents, then passes the event up the hierarchy */

type Props = {
  /** A single element, either Component or DOM node */
  children?: Element<any>,
  /** Key/values used to extend event data. */
  data?: Object,
  /** Function called to get the key/values used to extend event data.
   Occurs after event data has been extended with `data`. */
  getData?: (name: string, decoratedData: Object) => Object,
  /** String, regex, or function filter to limit what events are extended
  based on event name. String filters use exact matching unless they end
  with a '.', in which case a partial match on the beginning of the event
  name will be used.
  */
  match?: string | ((name: string) => boolean) | RegExp,
  /** Sets wether to extended private or public events. */
  matchPrivate?: boolean,
};

const ContextTypes = {
  onAnalyticsEvent: PropTypes.func,
  getParentAnalyticsData: PropTypes.func,
};

class AnalyticsDecorator extends Component<Props, {}> {
  static defaultProps = {
    match: '*',
    matchPrivate: false,
  };

  static contextTypes = ContextTypes;

  static childContextTypes = ContextTypes;

  getChildContext() {
    return {
      onAnalyticsEvent: this.onAnalyticsEvent,
      getParentAnalyticsData: this.getParentAnalyticsData,
    };
  }

  getDecoratedAnalyticsData = (
    name: string,
    srcData: Object,
    isPrivate: boolean,
  ) => {
    // Decorate the event data if this decorator matches the event name
    const { data, getData, match, matchPrivate } = this.props;
    const decoratedData = { ...srcData };
    if (matchPrivate === isPrivate && matchEvent(match, name)) {
      if (typeof data === 'object') {
        Object.assign(decoratedData, data);
      }
      if (typeof getData === 'function') {
        Object.assign(decoratedData, getData(name, decoratedData));
      }
    }
    return decoratedData;
  };

  onAnalyticsEvent = (name: string, srcData: Object, isPrivate: boolean) => {
    // Check there is a listener to pass the event to, otherwise there's no need
    // to do any of this work
    const { onAnalyticsEvent } = this.context;
    if (typeof onAnalyticsEvent !== 'function') return;
    const decoratedData = this.getDecoratedAnalyticsData(
      name,
      srcData,
      isPrivate,
    );
    // Pass the decorated event data to the next listener up the hierarchy
    onAnalyticsEvent(name, decoratedData, isPrivate);
  };

  getParentAnalyticsData = (name: string, isPrivate: boolean) => {
    const parentData = this.getDecoratedAnalyticsData(name, {}, isPrivate);
    // Get any analytics data from any decorators up the hierarchy
    const { getParentAnalyticsData } = this.context;
    if (typeof getParentAnalyticsData === 'function') {
      Object.assign(parentData, getParentAnalyticsData(name, isPrivate));
    }
    return parentData;
  };

  render() {
    const { children } = this.props; // eslint-disable-line react/prop-types
    return React.Children.only(children);
  }
}

export default AnalyticsDecorator;
