import * as React from 'react';
import { mount } from 'enzyme';
import {
  DummyComponentWithAnalytics,
  ELEMENTS_CHANNEL,
} from '../../examples/helpers';
import { AnalyticsListener } from '@atlaskit/analytics-next';
import { FabricElementsAnalyticsContext } from '../AnalyticsContextWithNamespace';
import { GasPayload } from '@atlaskit/analytics-gas-types';

export type ListenerFunction = (
  event: { payload: GasPayload; context: Array<{}> },
  channel: string,
) => void;

describe('<FabricElementsAnalyticsContext />', () => {
  it('should fire event with Fabric Elements contextual data', () => {
    const compOnClick = jest.fn();
    const listenerHandler = jest.fn();

    const component = mount(
      <AnalyticsListener onEvent={listenerHandler} channel={ELEMENTS_CHANNEL}>
        <FabricElementsAnalyticsContext data={{ greeting: 'hello' }}>
          <DummyComponentWithAnalytics onClick={compOnClick} />
        </FabricElementsAnalyticsContext>
      </AnalyticsListener>,
    );

    const analyticsListener = component.find(AnalyticsListener);
    expect(analyticsListener.props()).toHaveProperty(
      'channel',
      ELEMENTS_CHANNEL,
    );

    const dummy = analyticsListener.find('#dummy');
    dummy.simulate('click');

    expect(listenerHandler).toBeCalledWith(
      expect.objectContaining({
        context: [{ fabricElementsCtx: { greeting: 'hello' } }],
        payload: {
          action: 'someAction',
          actionSubject: 'someComponent',
          attributes: {
            componentName: 'foo',
            foo: 'bar',
            packageName: '@atlaskit/foo',
            packageVersion: '1.0.0',
          },
          eventType: 'ui',
          source: 'unknown',
        },
      }),
      ELEMENTS_CHANNEL,
    );
  });
});
