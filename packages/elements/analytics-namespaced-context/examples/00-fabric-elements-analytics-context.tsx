import * as React from 'react';
import { mount } from 'enzyme';
import { AnalyticsListener } from '@atlaskit/analytics-next';
import { FabricChannel } from '@atlaskit/analytics-listeners';
import { createDummyComponentWithAnalytics } from '../examples/helpers';
import { FabricElementsAnalyticsContext } from '../src';

const myOnClickHandler = () => {};

const listenerHandler = (event, context) => {
  console.log('listenerHandler, event: ', event, ' context: ', context);
};

const ElementsComponentWithAnalytics = createDummyComponentWithAnalytics(
  FabricChannel.elements,
);

export default function Example() {
  return (
    <AnalyticsListener
      onEvent={listenerHandler}
      channel={FabricChannel.elements}
    >
      <div>
        <FabricElementsAnalyticsContext data={{ greeting: 'hello' }}>
          <ElementsComponentWithAnalytics onClick={myOnClickHandler} />
        </FabricElementsAnalyticsContext>
      </div>
    </AnalyticsListener>
  );
}
