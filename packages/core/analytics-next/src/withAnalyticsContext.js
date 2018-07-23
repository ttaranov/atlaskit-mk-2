// @flow

import React, { type ComponentType, type ElementConfig } from 'react';

import AnalyticsContext from './AnalyticsContext';

type WithAnalyticsContextProps = {
  analyticsContext?: {},
};

export default function withAnalyticsContext<
  Props: {},
  InnerComponent: ComponentType<Props>,
  ExternalProps: ElementConfig<InnerComponent> & WithAnalyticsContextProps,
>(
  defaultData: {} = {},
): (WrappedComponent: InnerComponent) => ComponentType<ExternalProps> {
  return WrappedComponent => {
    // $FlowFixMe - flow 0.67 doesn't know about forwardRef
    const WithAnalyticsContext = React.forwardRef(
      (props: ExternalProps, ref) => {
        const { analyticsContext = {}, ...others } = props;
        const data = { ...defaultData, ...analyticsContext };
        return (
          <AnalyticsContext data={data}>
            <WrappedComponent {...others} ref={ref} />
          </AnalyticsContext>
        );
      },
    );

    WithAnalyticsContext.displayName = `WithAnalyticsContext(${WrappedComponent.displayName ||
      WrappedComponent.name})`;

    return WithAnalyticsContext;
  };
}
