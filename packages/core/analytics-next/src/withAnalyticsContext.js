// @flow

import React, {
  Component,
  type ComponentType,
  type ElementConfig,
} from 'react';

import AnalyticsContext from './AnalyticsContext';
import type { ObjectType } from './types';

type WithAnalyticsContextProps = {
  analyticsContext?: ObjectType,
};

export default function withAnalyticsContext<
  Props: {},
  PropsWithAnalyticsContext: Props & WithAnalyticsContextProps,
  C: ComponentType<Props>,
>(
  defaultData?: ObjectType = {},
): (
  WrappedComponent: C,
) => ComponentType<ElementConfig<C> & PropsWithAnalyticsContext> {
  return WrappedComponent =>
    class WithAnalyticsContext extends Component<PropsWithAnalyticsContext> {
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
