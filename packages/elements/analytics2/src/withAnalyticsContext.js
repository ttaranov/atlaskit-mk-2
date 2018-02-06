// @flow

import React, { Component, type ComponentType } from 'react';

import AnalyticsContext from './AnalyticsContext';
import type { ObjectType } from './types';

export default function withAnalyticsNamespace(defaultData?: ObjectType = {}) {
  return (WrappedComponent: ComponentType<*>) =>
    class WithAnalyticsNamespace extends Component<*> {
      static defaultProps = {
        analyticsContext: defaultData,
      };

      render() {
        const { analyticsContext, ...props } = this.props;
        return (
          <AnalyticsContext data={analyticsContext}>
            <WrappedComponent {...props} />
          </AnalyticsContext>
        );
      }
    };
}
