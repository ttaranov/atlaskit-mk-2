import { md, code } from '@atlaskit/docs';

export default md`
  # Fabric Elements analytics context

  The main purpose of this component is to provide a namespace for Fabric Elements contextual data related to @atlaskit/analytics-next framework.
  Rather than AnalyticsContext from @atlaskit/analytics-next, please use FabricElementsAnalyticsContext.

  
  ## Installation

${code`
  npm install @atlaskit/analytics-namespaced-context
  # or
  yarn add @atlaskit/analytics-namespaced-context
`}

  ## Using the component

  Example firing an analytics-next event:

${code`
  import * as React from 'react';
  import { withAnalyticsEvents, AnalyticsListener } from '@atlaskit/analytics-next';
  import { GasPayload } from '@atlaskit/analytics-gas-types';
  import { FabricElementsAnalyticsContext } from '@atlaskit/analytics-namespaced-context';
  import { FabricChannel } from '@atlaskit/analytics-listeners';
  
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
      createEvent(event).fire(FabricChannel.elements);
    },
  })(DummyComponent);

  const listenerHandler = (event, context) => {
    console.log('event: ', event, ' context: ', context);
  };

  // Pass the analyticsWebClient instance created by the Product
  ReactDOM.render(
    <div>      
      <AnalyticsListener onEvent={listenerHandler} channel={FabricChannel.elements}>
        <div>
          <FabricElementsAnalyticsContext data={{ greeting: 'hello' }}>
            <DummyComponentWithAnalytics onClick={myOnClickHandler} />
          </FabricElementsAnalyticsContext>
        </div>
      </AnalyticsListener>
    </div>,
    container,
  );
`}
`;
