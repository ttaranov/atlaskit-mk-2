import { md } from '@atlaskit/docs';

export default md`
  # Fabric aggregated listeners for analytics-next API

  The main purpose of this component is to provide a high level abstraction of all Fabric listeners used with analytics-next API so
  the Products can only import this component instead of having multiple nested listeners in their code.

  ## Installation

  ~~~js
  npm install @atlaskit/analitics-listeners
  # or
  yarn add  @atlaskit/analitics-listeners
  ~~~

  ## Using the component

  Example firing an analytics-next event:

  ~~~js
  import * as React from 'react';
  import { withAnalyticsEvents } from '@atlaskit/analytics-next';
  import AtlaskitAnalyticsListener from '@atlaskit/analytics-listeners';

  import { GasPayload } from '@atlaskit/analytics-gas-types';

  export type Props = {
    onClick: e => void,
  };

  export const DummyComponent: React.StatelessComponent<Props> = (
    props: Props,
  ) => (
    <div id="dummy" onClick={props.onClick}>
      Test
    </div>
  );
  DummyComponent.displayName = 'DummyComponent';

  export const DummyComponentWithAnalytics = withAnalyticsEvents({
    onClick: (createEvent, props) => {
      const event: GasPayload = {
        action: 'someAction',
        actionSubject: 'someComponent',
        eventType: 'ui',
        source: 'unknown',
      };
      createEvent(event).fire('fabric-elements');
    },
  })(DummyComponent);

  // Pass the analyticsWebClient instance created by the Product
  ReactDOM.render(
    <div>
      <FabricAnalyticsListeners client={analyticsWebClient}>
        <DummyComponentWithAnalytics onClick={myOnClickHandler} />
      </FabricAnalyticsListeners>
    </div>,
    container,
  );
  ~~~
`;
