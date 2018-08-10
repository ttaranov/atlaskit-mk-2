import { md, code } from '@atlaskit/docs';

export default md`
  # Fabric aggregated listeners for analytics-next API

  The main purpose of this component is to provide a high level abstraction of all Fabric listeners used with analytics-next API so
  the Products can only import this component instead of having multiple nested listeners in their code.

  The following listeners are currently implemented:

  * Fabric elements
  * Atlaskit (core)
  * Navigation

  Atlaskit (core) events may result in multiple events being fired for the same action if you have instrumented AK components with your own analytics. In this case we recommend temporarily excluding the atlaskit listener via the 'excludedChannels' prop until we have a fix for this on the backend.

  ## Installation

${code`
  npm install @atlaskit/analytics-listeners
  # or
  yarn add @atlaskit/analytics-listeners
`}

  ## Using the component

  Example firing an analytics-next event:

${code`
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
      createEvent(event).fire('fabricElements');
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
`}
`;
