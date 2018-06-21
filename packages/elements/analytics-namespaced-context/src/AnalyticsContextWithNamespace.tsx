import * as React from 'react';
import { ReactNode } from 'react';
import { AnalyticsContext } from '@atlaskit/analytics-next';

export const ELEMENTS_CONTEXT = 'fabricElementsCtx';

export type Props = {
  children?: ReactNode;
  data: {};
};

const createNamespaceContext = (namespace: string) => {
  return (props: Props) => {
    const newData = {
      [namespace]: props.data,
    };
    return (
      <AnalyticsContext data={newData}>
        {React.Children.only(props.children)}
      </AnalyticsContext>
    );
  };
};

export const FabricElementsAnalyticsContext = createNamespaceContext(
  ELEMENTS_CONTEXT,
);
