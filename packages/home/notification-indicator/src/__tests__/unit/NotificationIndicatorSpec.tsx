import * as React from 'react';
import { mount } from 'enzyme';
import * as sinon from 'sinon';

import Badge from '@atlaskit/badge';
import {
  NotificationLogClient,
  NotificationCountResponse,
} from '@atlaskit/notification-log-client';

import { NotificationIndicator } from '../..';

class MockNotificationLogClient extends NotificationLogClient {
  private response?: Promise<NotificationCountResponse>;

  constructor() {
    super('', '');
  }

  public async countUnseenNotifications() {
    return (
      this.response ||
      Promise.resolve({
        count: 5,
      })
    );
  }

  public setResponse(response: Promise<NotificationCountResponse>) {
    this.response = response;
  }
}

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

  function triggerVisibilityChange() {
    const visibilityChange = document.createEvent('HTMLEvents');
    visibilityChange.initEvent('visibilitychange', true, true);
    document.body.dispatchEvent(visibilityChange);
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

  it('Should not refresh when skip=true on call to onCountUpdating', async () => {
    const onCountUpdating = event => ({ skip: true });
    const onCountUpdated = sinon.spy();
    await renderNotificationIndicator(returnCount(1), {
      onCountUpdating,
      onCountUpdated,
    });
    expect(onCountUpdated.called).toEqual(false);
  });

  it('Should override count when countOverride is set on call to onCountUpdating', async () => {
    const onCountUpdating = event => ({ countOverride: 3 });
    const onCountUpdated = sinon.spy();
    const wrapper = await renderNotificationIndicator(returnError(), {
      onCountUpdating,
      onCountUpdated,
    });
    expect(onCountUpdated.called).toEqual(true);
    expect(wrapper.state('count')).toEqual(3);
  });

  it('Should call onCountUpdated on new count', async () => {
    const onCountUpdated = sinon.spy();
    await renderNotificationIndicator(returnCount(1), { onCountUpdated });
    expect(onCountUpdated.called).toEqual(true);
  });

  it('Should call onCountUpdated after refresh returns 0', async () => {
    const onCountUpdated = sinon.spy();
    await renderNotificationIndicator(returnCount(0), { onCountUpdated });
    expect(onCountUpdated.called).toEqual(true);
  });

  it('Should call onCountUpdated once after multiple 0 counts', async () => {
    const onCountUpdated = sinon.spy();
    await renderNotificationIndicator(returnCount(0), {
      refreshRate: 1,
      onCountUpdated,
    });
    await timeout(5);
    expect(onCountUpdated.callCount).toEqual(1);
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

  it('Should update refresh interval when refreshRate prop changes', async () => {
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

    // Ensure the original setInterval has been removed
    notificationLogClient.setResponse(returnCount(3));
    wrapper.setProps({ refreshRate: 100 });
    await timeout(5); // Wait
    expect(onCountUpdated.callCount).toEqual(2);

    // Ensure the new setInterval has been applied
    wrapper.setProps({ refreshRate: 1 });
    expect(onCountUpdated.callCount).toEqual(2);
    await timeout(5); // Wait for the next tick to complete
    expect(onCountUpdated.callCount).toEqual(3);
  });

  it('Should not refresh on visibilitychange if refreshOnVisibilityChange=false', async () => {
    const onCountUpdated = sinon.spy();
    const wrapper = await renderNotificationIndicator(returnCount(1), {
      refreshRate: 99999,
      refreshOnVisibilityChange: false,
      onCountUpdated,
    });

    expect(wrapper.state('count')).toEqual(1);

    notificationLogClient.setResponse(returnCount(5));
    triggerVisibilityChange();
    await timeout(0);
    wrapper.update();

    // no change
    expect(wrapper.state('count')).toEqual(1);
  });

  it('Should refresh on visibilitychange if document is visible for refreshOnVisibilityChange=true', async () => {
    const onCountUpdated = sinon.spy();
    const wrapper = await renderNotificationIndicator(returnCount(1), {
      refreshRate: 99999,
      onCountUpdated,
    });

    expect(wrapper.state('count')).toEqual(1);

    notificationLogClient.setResponse(returnCount(5));
    triggerVisibilityChange();
    await timeout(0);
    wrapper.update();

    expect(wrapper.state('count')).toEqual(5);
  });

  it('Should not refresh on visibilitychange when skipping too many eager fetches on tab change', async () => {
    const onCountUpdating = event => {
      if (event.visibilityChangesSinceTimer > 1) {
        return { skip: true };
      }
      return {};
    };
    const onCountUpdated = sinon.spy();
    const wrapper = await renderNotificationIndicator(returnCount(1), {
      refreshRate: 2,
      onCountUpdating,
      onCountUpdated,
    });
    expect(wrapper.state('count')).toEqual(1);

    // initial visibilitychange
    notificationLogClient.setResponse(returnCount(5));
    triggerVisibilityChange();
    await timeout(0);
    wrapper.update();
    expect(wrapper.state('count')).toEqual(5);

    // ignore next visibilitychange until timer cycles
    notificationLogClient.setResponse(returnCount(6));
    triggerVisibilityChange();
    wrapper.update();
    expect(wrapper.state('count')).toEqual(5);

    // timer has cycled, update on visibilitychange
    notificationLogClient.setResponse(returnCount(6));
    triggerVisibilityChange();
    await timeout(5);
    wrapper.update();
    expect(wrapper.state('count')).toEqual(6);
  });
});
