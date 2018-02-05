import * as React from 'react';
import { mount } from 'enzyme';
import * as sinon from 'sinon';

import Badge from '@atlaskit/badge';
import { NotificationCountResponse } from '@atlaskit/notification-log-client';
import { MockNotificationLogClient } from '@atlaskit/notification-log-client/dist/es5/support';

import { NotificationIndicator } from '../src';

describe('NotificationIndicator', () => {
  let notificationLogClient;

  function returnCount(count: number): Promise<NotificationCountResponse> {
    return Promise.resolve({ count });
  }

  function returnError(): Promise<NotificationCountResponse> {
    return Promise.reject(new Error());
  }

  async function renderNotificationIndicator(
    response: Promise<NotificationCountResponse>,
    props: Object = {},
  ) {
    notificationLogClient.setResponse(response);
    const clientPromise = Promise.resolve(notificationLogClient);

    const wrapper = mount(
      <NotificationIndicator
        notificationLogProvider={clientPromise}
        refreshOnHidden={true}
        {...props}
      />,
    );

    try {
      await clientPromise;
    } catch (e) {}

    try {
      await response;
    } catch (e) {}

    return wrapper;
  }

  function timeout(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
  }

  beforeEach(() => {
    notificationLogClient = new MockNotificationLogClient();
  });

  it('Should pass props to badge', async () => {
    const wrapper = await renderNotificationIndicator(returnCount(5), {
      max: 10,
      appearance: 'primary',
    });
    wrapper.update();
    const badge = wrapper.find(Badge);

    expect(badge.prop('value')).toEqual(5);
    expect(badge.prop('max')).toEqual(10);
    expect(badge.prop('appearance')).toEqual('primary');
  });

  it('Should not render indicator when there are no new notifications', async () => {
    const wrapper = await renderNotificationIndicator(returnCount(0));
    expect(wrapper.find(Badge).length).toEqual(0);
  });

  it('Should not render indicator when there is an error', async () => {
    const wrapper = await renderNotificationIndicator(returnError());
    expect(wrapper.find(Badge).length).toEqual(0);
  });

  it('Should call onCountUpdated on new count', async () => {
    const onCountUpdated = sinon.spy();
    await renderNotificationIndicator(returnCount(1), { onCountUpdated });
    expect(onCountUpdated.called).toEqual(true);
  });

  it('Should auto refresh when specified', async () => {
    const onCountUpdated = sinon.spy();
    const wrapper = await renderNotificationIndicator(returnCount(1), {
      refreshRate: 1,
      onCountUpdated,
    });

    expect(wrapper.state('intervalId')).not.toEqual(null);
    expect(wrapper.state('count')).toEqual(1);

    notificationLogClient.setResponse(returnCount(2));
    await timeout(5); // Wait for the next tick to complete

    wrapper.update();
    expect(wrapper.state('count')).toEqual(2);

    wrapper.unmount();
    await timeout(5); // Wait for the next tick to complete

    // Ensure setInterval has been cleared
    expect(onCountUpdated.callCount).toEqual(2);
  });
});
