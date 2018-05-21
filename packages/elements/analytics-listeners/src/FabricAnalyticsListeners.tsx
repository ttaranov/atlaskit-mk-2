import * as React from 'react';

import { AnalyticsWebClient } from './types';
import FabricElementsListener from './FabricElementsListener';

export type Props = {
  /** Children! */
  children?: React.ReactNode;
  client: AnalyticsWebClient;
};

const FabricAnalyticsListeners = (props: Props) => (
  <FabricElementsListener client={props.client}>
    {React.Children.only(props.children)}
  </FabricElementsListener>
);

export default FabricAnalyticsListeners;
