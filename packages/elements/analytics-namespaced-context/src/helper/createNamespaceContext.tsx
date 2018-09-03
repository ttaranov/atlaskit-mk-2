import * as React from 'react';
import { StatelessComponent, ReactNode } from 'react';
import { AnalyticsContext } from '@atlaskit/analytics-next';

export type Props = {
  children?: ReactNode;
  data: {};
};

const createNamespaceContext = (
  namespace: string,
  displayName = 'NamespacedContext',
): StatelessComponent<Props> => {
  const Component: StatelessComponent<Props> = (props: Props) => {
    const newData = {
      [namespace]: props.data,
    };
    return (
      <AnalyticsContext data={newData}>
        {React.Children.only(props.children)}
      </AnalyticsContext>
    );
  };
  Component.displayName = displayName;
  return Component;
};

export default createNamespaceContext;
