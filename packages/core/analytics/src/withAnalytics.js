// @flow
import React, { Component, type ComponentType } from 'react';
import PropTypes from 'prop-types';

type EventMap = {
  [eventName: string]: string | Function,
};

type FireAnalyticsEvent = (eventName: string, eventData?: Object) => void;

type EventMapOrFunction =
  | EventMap
  | ((fireAnalyticsEvent: FireAnalyticsEvent) => EventMap);

type AnalyticsProps = {
  analyticsId?: string,
  analyticsData?: Object,
  innerRef?: Function,
};

/*
The withAnalytics HOC wraps a component and provides the `fireAnalyticsEvent`
and `firePrivateAnalyticsEvent` methods to it as props. It contains the logic
for how to fire events, including handling the analyticsId and analyticsData
props. The `map` argument may be an object or a function that returns an object.
The properties of the `map` object/result can be strings (the name of the event
that will be fired) or functions (which are responsible for firing the event).
You can specify a default `analyticsId` and `analyticsData` with the `defaultProps`
param. Please be aware that specifying a default `analyticsId` will cause public
events to always fire for your component unless it has been set to a falsy by
the component consumer.
*/
const withAnalytics = (
  WrappedComponent: ComponentType<*>,
  map: EventMapOrFunction = {},
  defaultProps: AnalyticsProps = {},
  withDelegation?: boolean,
) =>
  class WithAnalytics extends Component<AnalyticsProps, {}> {
    props: AnalyticsProps;
    static displayName = `WithAnalytics(${WrappedComponent.displayName ||
      WrappedComponent.name})`;

    static contextTypes = {
      onAnalyticsEvent: PropTypes.func,
      getParentAnalyticsData: PropTypes.func,
    };

    static defaultProps = {
      analyticsId: defaultProps.analyticsId,
      analyticsData: defaultProps.analyticsData,
    };

    evaluatedMap = {};

    componentWillMount() {
      this.evaluatedMap =
        typeof map === 'function' ? map(this.fireAnalyticsEvent) : map;
    }

    delegateAnalyticsEvent = (
      analyticsId: string,
      data: Object,
      isPrivate: boolean,
    ) => {
      const { onAnalyticsEvent } = this.context;
      if (!onAnalyticsEvent) return;
      onAnalyticsEvent(analyticsId, data, isPrivate);
    };

    fireAnalyticsEvent = (name: string, data?: Object) => {
      const { analyticsData, analyticsId } = this.props;
      const { onAnalyticsEvent } = this.context;
      if (!analyticsId || !onAnalyticsEvent) return;
      const eventData = { ...analyticsData, ...data };
      onAnalyticsEvent(`${analyticsId}.${name}`, eventData, false);
    };

    privateAnalyticsEvent = (name: string, data?: Object) => {
      const { onAnalyticsEvent } = this.context;
      if (!onAnalyticsEvent) return;
      onAnalyticsEvent(`${name}`, data, true);
    };

    getParentAnalyticsData = (name: string) => {
      const { getParentAnalyticsData } = this.context;
      let parentData = {};
      if (
        typeof getParentAnalyticsData === 'function' &&
        this.props.analyticsId
      ) {
        const { analyticsId } = this.props;
        parentData = getParentAnalyticsData(`${analyticsId}.${name}`, false);
      }
      return parentData;
    };

    render() {
      /* eslint-disable no-unused-vars */
      const { analyticsId, analyticsData, ...componentProps } = this.props;
      /* eslint-enable no-unused-vars */
      Object.keys(this.evaluatedMap).forEach(prop => {
        const handler = this.evaluatedMap[prop]; // may be eventName or a function
        const originalProp = componentProps[prop];
        componentProps[prop] = (...args) => {
          if (typeof handler === 'function') {
            handler(...args);
          } else {
            this.fireAnalyticsEvent(handler);
          }
          if (typeof originalProp === 'function') originalProp(...args);
        };
      });

      return (
        <WrappedComponent
          fireAnalyticsEvent={this.fireAnalyticsEvent}
          firePrivateAnalyticsEvent={this.privateAnalyticsEvent}
          getParentAnalyticsData={this.getParentAnalyticsData}
          delegateAnalyticsEvent={
            withDelegation ? this.delegateAnalyticsEvent : undefined
          }
          analyticsId={analyticsId}
          ref={this.props.innerRef}
          {...componentProps}
        />
      );
    }
  };

export default withAnalytics;
