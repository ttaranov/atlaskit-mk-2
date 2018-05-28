import * as React from 'react';

import { AnalyticsWebClient } from './types';
import FabricElementsListener from './FabricElementsListener';
import AtlaskitListener from './atlaskit/AtlaskitListener';

export type Props = {
  /** Children! */
  children?: React.ReactNode;
  client: AnalyticsWebClient;
};

const FabricAnalyticsListeners = (props: Props) => (
  <AtlaskitListener client={props.client}>
    <FabricElementsListener client={props.client}>
      {React.Children.only(props.children)}
    </FabricElementsListener>
  </AtlaskitListener>
);

export default FabricAnalyticsListeners;
