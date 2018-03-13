// @flow

import React, { Component, type ComponentType } from 'react';

import AnalyticsContext from './AnalyticsContext';
import type { ObjectType } from './types';

type WithAnalyticsContextProps = ObjectType & {
  analyticsContext?: ObjectType,
};

export default function withAnalyticsContext(
  defaultData?: ObjectType = {},
): (
  WrappedComponent: ComponentType<ObjectType>,
) => ComponentType<WithAnalyticsContextProps> {
  return (WrappedComponent: ComponentType<ObjectType>) =>
    class WithAnalyticsContext extends Component<WithAnalyticsContextProps> {
      static displayName = `WithAnalyticsContext(${WrappedComponent.displayName ||
        WrappedComponent.name})`;

      static defaultProps = {
        analyticsContext: {},
      };

      render() {
        const { analyticsContext, ...props } = this.props;
        const data = { ...defaultData, ...analyticsContext };
        return (
          <AnalyticsContext data={data}>
            <WrappedComponent {...props} />
          </AnalyticsContext>
        );
      }
    };
}
