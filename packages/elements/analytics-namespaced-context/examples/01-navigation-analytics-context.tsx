import * as React from 'react';
import { AnalyticsListener } from '@atlaskit/analytics-next';
import { FabricChannel } from '@atlaskit/analytics-listeners';
import { createDummyComponentWithAnalytics } from '../examples/helpers';
import { NavigationAnalyticsContext } from '../src';

const myOnClickHandler = () => {};

const listenerHandler = (event, context) => {
  console.log('listenerHandler, event: ', event, ' context: ', context);
};

const ElementsComponentWithAnalytics = createDummyComponentWithAnalytics(
  FabricChannel.navigation,
);

export default function Example() {
  return (
    <AnalyticsListener
      onEvent={listenerHandler}
      channel={FabricChannel.navigation}
    >
      <div>
        <NavigationAnalyticsContext data={{ greeting: 'hello' }}>
          <ElementsComponentWithAnalytics onClick={myOnClickHandler} />
        </NavigationAnalyticsContext>
      </div>
    </AnalyticsListener>
  );
}
