// @flow

import React, { Component, type ComponentType } from 'react';

import AnalyticsContext from './AnalyticsContext';
import type { ObjectType } from './types';

export default function withAnalyticsContext<ProvidedProps: ObjectType>(
  defaultData?: ObjectType = {},
): (
  WrappedComponent: ComponentType<ProvidedProps>,
) => ComponentType<ProvidedProps> {
  return (WrappedComponent: ComponentType<ProvidedProps>) =>
    class WithAnalyticsContext extends Component<ProvidedProps> {
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
