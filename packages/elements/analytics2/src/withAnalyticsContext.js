// @flow

import React, { Component, type ComponentType } from 'react';

import AnalyticsContext from './AnalyticsContext';
import type { ObjectType } from './types';

//TODO: fix typing here. Should specify return type and analyticsContext prop
export default function<ProvidedProps: ObjectType>(
  defaultData?: ObjectType = {},
) {
  return (WrappedComponent: ComponentType<ProvidedProps>) =>
    class extends Component<ProvidedProps> {
      static defaultProps = {
        // TODO: Should we merge with default data rather than completely replacing?
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
