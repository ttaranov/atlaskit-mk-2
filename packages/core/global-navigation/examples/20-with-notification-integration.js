// @flow

import React, { Component } from 'react';
import EmojiAtlassianIcon from '@atlaskit/icon/glyph/emoji/atlassian';
import { LayoutManager, NavigationProvider } from '@atlaskit/navigation-next';
import { NotificationLogClient } from '@atlaskit/notification-log-client';

import GlobalNavigation from '../src';

const fabricNotificationLogUrl = '/gateway/api/notification-log/';
const cloudId = 'DUMMY-158c8204-ff3b-47c2-adbb-a0906ccc722b';

const count = 8;

class MockNotificationLogClient extends NotificationLogClient {
  countUnseenNotifications = () => Promise.resolve({ count });
}

// TODO: make onClicks targets show up on page instead of console.logs
class Global extends Component<*, *> {
  notificationClient: any;

  constructor() {
    super();
    this.notificationClient = new MockNotificationLogClient(
      fabricNotificationLogUrl,
      cloudId,
    );
  }

  render() {
    return (
      <GlobalNavigation
        productIcon={EmojiAtlassianIcon}
        productHref="#"
        fabricNotificationLogUrl={fabricNotificationLogUrl}
        cloudId={cloudId}
        notificationLogProvider={this.notificationClient}
      />
    );
  }
}

export default () => (
  <NavigationProvider>
    <LayoutManager
      globalNavigation={Global}
      productNavigation={() => null}
      containerNavigation={() => null}
    >
      <div css={{ padding: '32px 40px' }}>Page content</div>
    </LayoutManager>
  </NavigationProvider>
);
