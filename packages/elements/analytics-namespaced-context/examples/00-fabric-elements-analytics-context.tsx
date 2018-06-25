import * as React from 'react';
import { mount } from 'enzyme';
import { AnalyticsListener } from '@atlaskit/analytics-next';
import {
  DummyComponentWithAnalytics,
  ELEMENTS_CHANNEL,
} from '../examples/helpers';
import { FabricElementsAnalyticsContext } from '../src/AnalyticsContextWithNamespace';

const myOnClickHandler = () => {};

const listenerHandler = (event, context) => {
  console.log('listenerHandler, event: ', event, ' context: ', context);
};

export default function Example() {
  return (
    <AnalyticsListener onEvent={listenerHandler} channel={ELEMENTS_CHANNEL}>
      <div>
        <FabricElementsAnalyticsContext data={{ greeting: 'hello' }}>
          <DummyComponentWithAnalytics onClick={myOnClickHandler} />
        </FabricElementsAnalyticsContext>
      </div>
    </AnalyticsListener>
  );
}
